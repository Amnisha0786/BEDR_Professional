'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FieldPath, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as RPNInput from 'react-phone-number-input';

import { TypographyP } from '@/components/ui/typography/p';
import FlexBox from '@/components/ui/flexbox';
import { Card } from '@/components/ui/card';
import Icon from '@/components/custom-components/custom-icon';
import { TypographyH2 } from '@/components/ui/typography/h2';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TRegisterNewPatientForm } from '@/models/types/create-patient-forms';
import { registerNewPatient } from '@/models/validations/create-patient-forms';
import { selectPatient } from '@/app/api/create-patient-request';
import { getMobileNumber } from '@/lib/common/mobile-validation';
import { getErrorMessage } from '@/lib/utils';
import { PhoneInput } from '@/components/ui/phone-input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import CustomEthnicityDialog from '@/components/custom-components/custom-ethnicity-dialog';
import { ETHNICITY, GENDER } from '@/enums/auth';
import { SelectDropDown } from '@/components/ui/select';
import { ethnicityOptions } from '@/lib/constants/data';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import StepperFooter from '@/components/create-patient-steps/common-stepper-footer';
import { IPAD_HOMEPAGE } from '@/lib/constants/shared';
import CloseFileIpad from '../close-file-ipad';

const defaultValues = {
  firstName: '',
  lastName: '',
  mobileNumber: '',
  email: '',
  dateOfBirth: '',
  postCode: '',
  ethnicity: '',
  sex: GENDER.male,
  callingCode: '+44',
};

type TProps = {
  setShowPersonalDetails: Dispatch<SetStateAction<boolean>>;
  fileId?: string | undefined;
  patientDetails?: TRegisterNewPatientForm | null;
  setFileId: Dispatch<SetStateAction<string | undefined>>;
  onDiscardFileSuccess: () => void;
  setViewOnly: Dispatch<SetStateAction<boolean>>;
  viewOnly: boolean;
  setPatientDetails: Dispatch<
    SetStateAction<TRegisterNewPatientForm | undefined>
  >;
};

const RegisterPatient = ({
  setShowPersonalDetails = () => {},
  fileId = '',
  patientDetails = null,
  setFileId = () => {},
  onDiscardFileSuccess = () => {},
  setViewOnly = () => {},
  viewOnly = false,
  setPatientDetails = () => {},
}: TProps) => {
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();

  const form = useForm<TRegisterNewPatientForm>({
    resolver: yupResolver(registerNewPatient),
    defaultValues,
  });

  const { errors } = form.formState;

  useEffect(() => {
    if (patientDetails) {
      form.reset({
        ...patientDetails,
        callingCode: patientDetails?.callingCode || '+44',
        mobileNumber: patientDetails?.mobileNumber?.includes(
          patientDetails?.callingCode,
        )
          ? patientDetails?.mobileNumber
          : `${patientDetails?.callingCode}${patientDetails?.mobileNumber}`,
      });
    }
  }, [patientDetails]);

  const onSubmit = useCallback(
    async (values: TRegisterNewPatientForm) => {
      setLoading(true);
      if (fileId) {
        router.push(`${IPAD_HOMEPAGE}/${fileId}`);
        return;
      }
      try {
        const phoneNumber = getMobileNumber(
          values.mobileNumber,
          values?.callingCode,
        );
        values.mobileNumber = phoneNumber;
        values.email = values.email?.toLowerCase();

        const response = await selectPatient({
          ...values,
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
        }
        setFileId(response?.data?.data?.id);
        setViewOnly(true);
        router.push(`${IPAD_HOMEPAGE}/${response?.data?.data?.id || ''}`);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },
    [fileId],
  );

  const hideError = (name: FieldPath<TRegisterNewPatientForm>) =>
    form.clearErrors(name);

  const handleChangeValue = (
    name: FieldPath<TRegisterNewPatientForm>,
    value: string,
  ) => form.setValue(name, value);

  return (
    <div className='p-[30px]'>
      <Card className='mb-5 w-full p-3'>
        <FlexBox flex centerItems classname='justify-between'>
          <FlexBox flex classname='items-center gap-4'>
            <div className='flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src={'/assets/register-new-patient.svg'}
                alt={t('translation.registerNewPatientCamelCase')}
                width={18}
                height={18}
                className='m-auto '
              />
            </div>
            <TypographyP primary noBottom>
              {t('translation.registerNewPatientCamelCase')}
            </TypographyP>
          </FlexBox>
          {fileId && (
            <CloseFileIpad
              fileId={fileId}
              onDiscardFileSuccess={onDiscardFileSuccess}
            />
          )}
        </FlexBox>
      </Card>
      <Card className='min-h-[200px] justify-start bg-white pb-[40px] pt-[30px] max-ms:px-[10px] ms:px-[40px]'>
        <FlexBox classname='flex'>
          <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
            <Icon name='person' width={16} height={15} className='m-auto' />
          </div>
          <TypographyH2 size={18}>
            {t('translation.personalDetails')}
          </TypographyH2>
        </FlexBox>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            autoComplete='off'
          >
            <div className='pt-7'>
              <FlexBox flex classname='gap-[30px] max-ms:flex-col'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          label={t('translation.firstName')}
                          {...field}
                          error={errors?.firstName}
                          onChange={(e) => {
                            handleChangeValue('firstName', e.target.value);
                            hideError('firstName');
                          }}
                          disabled={viewOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          label={t('translation.lastName')}
                          {...field}
                          error={errors?.lastName}
                          onChange={(e) => {
                            handleChangeValue('lastName', e.target.value);
                            hideError('lastName');
                          }}
                          disabled={viewOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>

              <FlexBox flex classname='gap-[30px] max-ms:flex-col'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          label={t('translation.emailAddress')}
                          {...field}
                          error={errors?.email}
                          onChange={(e) => {
                            handleChangeValue('email', e.target.value);
                            hideError('email');
                          }}
                          disabled={viewOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='mobileNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PhoneInput
                          label={t('translation.mobileNumber')}
                          onFocus={() => setIsFocus(true)}
                          onBlurCapture={() => setIsFocus(false)}
                          isFocus={isFocus}
                          error={errors?.mobileNumber}
                          {...field}
                          value={field?.value as RPNInput.Value}
                          onChange={(value) => {
                            handleChangeValue('mobileNumber', value);
                            hideError('mobileNumber');
                          }}
                          onCountryChange={(value: RPNInput.Country) => {
                            if (value) {
                              form.setValue(
                                'callingCode',
                                `+${RPNInput.getCountryCallingCode(value)}`,
                              );
                            }
                          }}
                          disabled={viewOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>

              <FlexBox flex classname='gap-[30px] max-ms:flex-col'>
                <FormField
                  control={form.control}
                  name='dateOfBirth'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='date'
                          label={t('translation.dob')}
                          {...field}
                          error={errors?.dateOfBirth}
                          onChange={(e) => {
                            handleChangeValue('dateOfBirth', e.target.value);
                            hideError('dateOfBirth');
                          }}
                          onKeyUp={() => hideError('dateOfBirth')}
                          disabled={viewOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='postCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          label={t('translation.postcode')}
                          {...field}
                          error={errors?.postCode}
                          onChange={(e) => {
                            handleChangeValue('postCode', e.target.value);
                            hideError('postCode');
                          }}
                          disabled={viewOnly}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>

              <FlexBox flex classname='gap-[30px] max-ms:flex-col'>
                <FormField
                  control={form.control}
                  name='ethnicity'
                  render={({ field }) => (
                    <FormItem className='w-full !flex-1'>
                      <FormControl>
                        {viewOnly && patientDetails?.ethnicity ? (
                          <Input
                            type='text'
                            label={t('translation.ethnicity')}
                            value={
                              ethnicityOptions?.find(
                                (item) =>
                                  item?.value === patientDetails?.ethnicity,
                              )?.label
                            }
                            disabled
                          />
                        ) : (
                          <SelectDropDown
                            label={t('translation.ethnicity')}
                            options={ethnicityOptions}
                            error={errors?.ethnicity}
                            onChangeValue={field.onChange}
                            className='!font-medium'
                            icon={
                              <Dialog>
                                <DialogTrigger asChild>
                                  <div>
                                    <Icon name='info' width={18} height={15} />
                                  </div>
                                </DialogTrigger>
                                <CustomEthnicityDialog
                                  title={t('translation.ethnicityInfoTitle')}
                                  description={t(
                                    'translation.ethnicityDescription',
                                  )}
                                  moreDescription={t(
                                    'translation.moreDescription',
                                  )}
                                />
                              </Dialog>
                            }
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='sex'
                  render={({ field }) => (
                    <FormItem className='w-full !flex-1 self-center'>
                      <FormControl>
                        <RadioGroup
                          className='flex items-center'
                          onValueChange={field.onChange}
                          disabled={viewOnly}
                        >
                          <Label className='mr-1 text-sm font-semibold text-darkGray'>
                            {t('translation.sex')}
                          </Label>
                          <FormItem className='mr-[20px] flex !flex-none items-center space-x-2'>
                            <FormControl>
                              <RadioGroupItem
                                value='male'
                                id='male'
                                checked={field?.value === 'male'}
                              />
                            </FormControl>
                            <Label htmlFor='male' className='font-normal'>
                              {t('translation.male')}
                            </Label>
                          </FormItem>
                          <FormItem className='flex !flex-none items-center space-x-1'>
                            <FormControl>
                              <RadioGroupItem
                                value='female'
                                id='female'
                                checked={field?.value === 'female'}
                              />
                            </FormControl>
                            <Label htmlFor='female' className='font-normal'>
                              {t('translation.female')}
                            </Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>
            </div>
            <StepperFooter
              onClickBack={() => {
                setShowPersonalDetails(false);
                setPatientDetails(undefined);
                setViewOnly(false);
              }}
              hideBack={fileId ? true : false}
              typeOfNext={'submit'}
              loading={loading}
            />
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPatient;
