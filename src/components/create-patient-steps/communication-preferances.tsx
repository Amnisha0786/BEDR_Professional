'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';

import { Card, CardContent } from '../ui/card';
import FlexBox from '../ui/flexbox';
import Icon from '../custom-components/custom-icon';
import { TypographyH2 } from '../ui/typography/h2';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { TypographyP } from '../ui/typography/p';
import StepperFooter from './common-stepper-footer';
import {
  CustomRadioGroup,
  CustomRadioGroupItem,
} from '../custom-components/custom-radio';
import { Input } from '../ui/input';
import { TCommunicationPreferencesForm } from '@/models/types/create-patient-forms';
import {
  COMMUNICATION_PREFERENCES,
  NOTIFICATION_MEDIUM,
  RECEIVING_DIAGNOSIS_MEDIUM,
  STEPPER,
} from '@/enums/create-patient';
import { addCommunicationForm } from '@/app/api/create-patient-request';
import { getErrorMessage } from '@/lib/utils';
import { FILE_IN_PROGRESS_STEPS } from '@/enums/file-in-progress';
import { communicationPreferencesFormSchema } from '@/models/validations/create-patient-forms';

type Tprops = {
  currentStep: string;
  setCurrentStep: Dispatch<SetStateAction<string>>;
  completedSteps: string[];
  setCompletedSteps?: Dispatch<SetStateAction<string[]>>;
  communicationPreferences?: TCommunicationPreferencesForm;
  setCommunicationPreferences?: Dispatch<
    SetStateAction<TCommunicationPreferencesForm | undefined>
  >;
  fileId?: string;
  viewOnly?: boolean;
  goToSubmit?: boolean;
  goToReferral?: boolean;
};

const defaultValues = {
  receivingDiagnosisMedium: '',
  name: '',
  email: '',
};

const Communicationpreferances = ({
  currentStep,
  setCurrentStep,
  completedSteps,
  setCompletedSteps,
  communicationPreferences,
  setCommunicationPreferences,
  fileId,
  viewOnly = false,
  goToSubmit = false,
  goToReferral = false,
}: Tprops) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<TCommunicationPreferencesForm>({
    resolver: yupResolver(communicationPreferencesFormSchema),
    defaultValues: communicationPreferences
      ? communicationPreferences
      : defaultValues,
    mode: 'onSubmit',
  });
  const { errors } = form.formState;

  const inited = useRef(false);

  useEffect(() => {
    if (communicationPreferences && !inited.current) {
      form.reset({ ...communicationPreferences });
      inited.current = true;
    }
  }, [communicationPreferences]);

  const onSubmit = useCallback(
    async (values: TCommunicationPreferencesForm) => {
      if (viewOnly) {
        if (goToReferral) {
          setCurrentStep(FILE_IN_PROGRESS_STEPS.REFERRAL_FORM);
          return;
        }
        setCurrentStep(FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT);
        return;
      }
      const obj: TCommunicationPreferencesForm = {
        notificationMedium: values?.notificationMedium,
        receivingDiagnosisMedium: values?.receivingDiagnosisMedium,
      };
      if (values?.name) {
        obj['name'] = values?.name;
      }
      if (values?.email) {
        obj['email'] = values?.email?.toLowerCase();
      }
      if (fileId) {
        obj['patientFileId'] = fileId;
      }
      try {
        setLoading(true);

        if (!fileId) {
          return;
        }
        const response = await addCommunicationForm(obj);
        if (response?.data?.status !== 200) {
          toast.error(response?.data?.message || 'Something went wrong!');
          return;
        }
        const preference = {
          ...values,
          id: fileId,
        };
        setCommunicationPreferences?.(preference);
        setCompletedSteps?.([...completedSteps, currentStep]);

        if (!completedSteps?.includes(STEPPER.REFERRAL_FORM)) {
          setCurrentStep(STEPPER.REFERRAL_FORM);
        } else {
          setCurrentStep(STEPPER.SUBMIT_FILE);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || 'Something went wrong!');
      } finally {
        setLoading(false);
      }
    },
    [fileId, goToSubmit, viewOnly],
  );

  const handleStateChange = (
    value: string,
    keyname: FieldPath<TCommunicationPreferencesForm>,
  ) => {
    if (communicationPreferences) {
      setCommunicationPreferences?.({
        ...communicationPreferences,
        [keyname]: value,
      });
    } else {
      const defaultValue: any = { ...defaultValues };
      setCommunicationPreferences?.({
        ...defaultValue,
        [keyname]: value,
      });
    }
  };

  const handleBackButtonClick = () => {
    setCurrentStep(STEPPER.LEFT_EYE_IMAGES);
  };

  const hideError = (name: FieldPath<TCommunicationPreferencesForm>) =>
    form.clearErrors(name);

  const handleChangeValue = (
    name: FieldPath<TCommunicationPreferencesForm>,
    value: string,
  ) => form.setValue(name, value);

  return (
    <Card className='min-h-[200px] justify-start bg-white px-5 pb-5 pt-[30px] md:px-[40px] md:pb-[40px]'>
      <FlexBox classname='!flex'>
        <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
          <Icon
            name='communication-preferances'
            width={18}
            height={18}
            className='m-auto'
          />
        </div>
        <TypographyH2 size={18}>Communication Preferences</TypographyH2>
      </FlexBox>
      <CardContent className='mt-[16px] !w-full p-0'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <TypographyP size={17} classname='!text-darkGray mt-3'>
                Patient wishes to be notified that the report is ready by:
              </TypographyP>
              <FlexBox classname='flex flex-wrap mt-2'>
                <FormField
                  control={form.control}
                  name='notificationMedium'
                  render={({ field }) => (
                    <FormItem className='w-full !flex-none'>
                      <FormControl>
                        <CustomRadioGroup
                          onValueChange={(val) => {
                            field.onChange(val);
                            handleStateChange(val, 'notificationMedium');
                          }}
                          defaultValue={field.value}
                          className='flex w-full flex-wrap gap-[16px]'
                        >
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={NOTIFICATION_MEDIUM.email}
                                checked={
                                  field.value === NOTIFICATION_MEDIUM.email
                                }
                                label={COMMUNICATION_PREFERENCES.MAIL}
                                disabled={viewOnly}
                                disableCursorAllowed
                              />
                            </FormControl>
                          </FormItem>
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={NOTIFICATION_MEDIUM.text_message}
                                checked={
                                  field.value ===
                                  NOTIFICATION_MEDIUM.text_message
                                }
                                label={COMMUNICATION_PREFERENCES.TEXT}
                                disabled={viewOnly}
                                disableCursorAllowed
                              />
                            </FormControl>
                          </FormItem>
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={
                                  NOTIFICATION_MEDIUM.email_and_text_message
                                }
                                checked={
                                  field.value ===
                                  NOTIFICATION_MEDIUM.email_and_text_message
                                }
                                label={COMMUNICATION_PREFERENCES.MAIL_TEXT}
                                disabled={viewOnly}
                                disableCursorAllowed
                              />
                            </FormControl>
                          </FormItem>
                        </CustomRadioGroup>
                      </FormControl>
                      <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                    </FormItem>
                  )}
                />
              </FlexBox>

              <TypographyP size={17} classname='!text-darkGray mt-1'>
                Patient wishes to receive the diagnosis report by:
              </TypographyP>
              <FlexBox classname='flex flex-wrap mt-2'>
                <FormField
                  control={form.control}
                  name='receivingDiagnosisMedium'
                  render={({ field }) => (
                    <FormItem className='w-full !flex-none'>
                      <FormControl>
                        <CustomRadioGroup
                          onValueChange={(val) => {
                            field.onChange(val);
                            handleStateChange(val, 'receivingDiagnosisMedium');
                          }}
                          defaultValue={field.value}
                          className='flex w-full flex-wrap gap-[16px]'
                        >
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={RECEIVING_DIAGNOSIS_MEDIUM.email}
                                checked={
                                  field.value ===
                                  RECEIVING_DIAGNOSIS_MEDIUM.email
                                }
                                label={COMMUNICATION_PREFERENCES.MAIL}
                                disabled={viewOnly}
                                disableCursorAllowed
                              />
                            </FormControl>
                          </FormItem>
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={RECEIVING_DIAGNOSIS_MEDIUM.app}
                                checked={
                                  field.value === RECEIVING_DIAGNOSIS_MEDIUM.app
                                }
                                label={COMMUNICATION_PREFERENCES.IN_THE_APP}
                                disabled={viewOnly}
                                disableCursorAllowed
                              />
                            </FormControl>
                          </FormItem>
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={RECEIVING_DIAGNOSIS_MEDIUM.email_and_app}
                                checked={
                                  field.value ===
                                  RECEIVING_DIAGNOSIS_MEDIUM.email_and_app
                                }
                                label={COMMUNICATION_PREFERENCES.BOTH}
                                disabled={viewOnly}
                                disableCursorAllowed
                              />
                            </FormControl>
                          </FormItem>
                        </CustomRadioGroup>
                      </FormControl>
                      <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                    </FormItem>
                  )}
                />
              </FlexBox>

              <TypographyP size={17} classname='!text-darkGray mt-1'>
                Patient has consented to the diagnosis report being copied to:
              </TypographyP>
              <FlexBox classname='flex flex-col md:w-[353px] nm:w-[353px]'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          label='Name'
                          {...field}
                          error={errors?.name}
                          onChange={(e) => {
                            handleChangeValue('name', e.target.value);
                            hideError('name');
                          }}
                          onBlur={(e) =>
                            handleStateChange(e.target.value, 'name')
                          }
                          disabled={viewOnly}
                        />
                      </FormControl>
                      <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='text'
                          label='Email address'
                          {...field}
                          error={errors?.email}
                          onChange={(e) => {
                            handleChangeValue('email', e.target.value);
                            hideError('email');
                          }}
                          onBlur={(e) =>
                            handleStateChange(e.target.value, 'email')
                          }
                          disabled={viewOnly}
                        />
                      </FormControl>
                      <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                    </FormItem>
                  )}
                />
              </FlexBox>
            </div>

            <StepperFooter
              onClickBack={handleBackButtonClick}
              typeOfNext='submit'
              nextButtonText={viewOnly ? 'Next' : 'Save Preferences'}
              loading={loading}
              nextButtonWidth='200'
              hideBack={viewOnly}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Communicationpreferances;
