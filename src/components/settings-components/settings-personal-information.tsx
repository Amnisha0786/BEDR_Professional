'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldError, FieldPath, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as RPNInput from 'react-phone-number-input';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import Link from 'next/link';
import { Route } from 'next';

import FlexBox from '../ui/flexbox';
import { Card } from '../ui/card';
import { TPersonalInformationForm } from '@/models/types/settings';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TypographyH2 } from '../ui/typography/h2';
import { TypographyP } from '../ui/typography/p';
import { personalInformationSettingsSchema } from '@/models/validations/settings';
import useUserProfile from '@/hooks/useUserProfile';
import { PhoneInput } from '../ui/phone-input';
import { LOGINS } from '@/enums/auth';
import { DATE_FORMAT } from '@/lib/common/dob-validation';
import Icon from '../custom-components/custom-icon';
import { cn, getErrorMessage } from '@/lib/utils';
import { editUserProfile } from '@/app/api/settings';
import { getEditProfilePayload } from '../auth-components/edit-profile-payload';
import { openUploadDialog } from '@/lib/common/openUploadDialog';
import { uploadFile } from '@/app/api/create-patient-request';
import { getImageUrl } from '@/lib/common/getImageUrl';
import { useAppDispatch } from '@/lib/hooks';
import { UserData, userProfile } from '@/lib/userProfile/userProfileSlice';
import { Dialog } from '../ui/dialog';
import PdfModalPreview from '../pdf-modal-preview';
import { FileInput } from '../custom-components/custom-file-input';
import { Textarea } from '../ui/textarea';
import { SUB_SPECIALISM, SUB_SPECIALITIES } from '@/enums/settings';
import { CustomCheckbox } from '../custom-components/custom-checkbox';
import { ReferralFormTextarea } from '../custom-components/custom-referral-form-textarea';
import { salutationOptions } from '@/lib/constants/data';
import { SelectDropDown } from '../ui/select';

const defaultValues = {
  mobileNumber: '',
  email: '',
  callingCode: '+44',
  role: LOGINS.OPTOMETRIST,
};

const SettingsPersonalInformation = () => {
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const user = useUserProfile();
  const { t } = useTranslation();

  const form = useForm<TPersonalInformationForm>({
    resolver: yupResolver(personalInformationSettingsSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const { errors } = form.formState;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        mobileNumber: `${user?.callingCode}${user?.mobileNumber}` || '',
        email: user?.email || user?.contactPersonEmail || '',
        dateOfBirth: user?.dateOfBirth
          ? dayjs(user?.dateOfBirth).format(DATE_FORMAT)
          : '',
        postCode: user?.postCode || '',
        gocNumber: user?.gocNumber || '',
        gmcNumber: user?.gmcNumber || '',
        callingCode: user?.callingCode,
        role: user?.role,
        icoNumber: user?.icoNumber || '',
        contactPerson: user.contactPerson,
        practiceAddress: user?.practiceAddress || '',
        practiceName: user?.practiceName || '',
        profilePicture: user?.profilePicture || '',
        insuranceCertificate: user?.insuranceCertificate || null,
        salutation: user?.salutation || '',
        insuranceRenewalDate: user?.insuranceRenewalDate
          ? dayjs(user?.insuranceRenewalDate).format(DATE_FORMAT)
          : '',
        hospitalName: user?.hospitalName || '',
        description: user?.description || '',
        subSpecialties: user?.subSpecialties?.length
          ? user?.subSpecialties?.filter((item) =>
            Object.values(SUB_SPECIALISM)?.includes(item as SUB_SPECIALISM),
          )
          : [],
        otherSubSpeciality:
          user?.subSpecialties &&
          user?.subSpecialties?.filter(
            (item) =>
              !Object.values(SUB_SPECIALISM)?.includes(item as SUB_SPECIALISM),
          )?.[0],
      });
    }
  }, [user]);

  const handleFileUpload = useCallback(async (file: File | null) => {
    if (!file) {
      return;
    }
    try {
      setUploading(true);
      const response = await uploadFile(file as File);
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
      } else {
        const responseData = response?.data?.data?.original;
        return responseData;
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setUploading(false);
    }
  }, []);

  const onSubmit = useCallback(
    async (values: TPersonalInformationForm) => {
      try {
        if (!user || !isEditable) {
          return;
        }

        setLoading(true);

        if (
          values?.insuranceCertificate &&
          typeof values?.insuranceCertificate !== 'string'
        ) {
          const response = await handleFileUpload(
            values?.insuranceCertificate || null,
          );
          if (!response?.key) {
            return;
          }
          values.insuranceCertificate = response?.key;
        }

        if (
          values?.profilePicture &&
          typeof values?.profilePicture !== 'string'
        ) {
          const response = await handleFileUpload(
            values?.profilePicture || null,
          );
          if (!response?.key) {
            return;
          }
          values.profilePicture = response?.key;
        }

        if (values?.mobileNumber) {
          values.mobileNumber = values?.mobileNumber?.split(
            values?.callingCode,
          )?.[1];
        }

        const payload = getEditProfilePayload(user?.role, values);

        if (!payload) {
          toast.error(t('translation.somethingWentWrong'));
          return;
        }

        const response = await editUserProfile(payload);

        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        dispatch(
          userProfile({
            data: { ...user, ...(payload as UserData) },
            message: response?.data?.message,
            status: response?.data?.status,
          }),
        );
        setIsEditable(false);
        toast.success(t('translation.profileEditSuccessfully'));
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },
    [isEditable, handleFileUpload],
  );

  const hideError = useCallback(
    (name: FieldPath<TPersonalInformationForm>) => form.clearErrors(name),
    [],
  );

  const handleChangeValue = useCallback(
    (name: FieldPath<TPersonalInformationForm>, value: string | File | null) =>
      form.setValue(name, value),
    [],
  );

  const handleProfileChange = async () => {
    const files = await openUploadDialog('.jpg,.png,.jpeg');
    handleChangeValue('profilePicture', files?.[0]);
  };

  const getProfileUrl = useMemo(() => {
    const profile = form?.watch('profilePicture');
    if (profile && typeof profile !== 'string') {
      return URL.createObjectURL(form.watch('profilePicture') as any);
    }
    return (
      getImageUrl(user?.s3BucketUrl, form?.watch('profilePicture')) ||
      '/assets/default-user.svg'
    );
  }, [user, form?.watch('profilePicture')]);

  const getPracticeDetails = () => {
    return (
      <>
        <FlexBox
          flex
          justify='between'
          classname='w-full md:flex-row gap-[30px]'
        >
          <div className='flex-1'>
            <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-2.5'>
              {t('translation.icoNumber')}
            </TypographyP>

            <FormField
              control={form.control}
              name='icoNumber'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      label={t('translation.enterIcoNumber')}
                      error={errors?.icoNumber}
                      disabled={!isEditable}
                      {...field}
                      onChange={(e) => {
                        handleChangeValue('icoNumber', e.target.value);
                        hideError('icoNumber');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FlexBox
            flex
            centerContent
            classname={`flex-1 flex-col items-center ${user?.gmcNumber || user?.gocNumber ? 'md:items-end' : 'md:items-center'} md:mb-0 mb-5`}
          >
            &apos;{' '}
            <div className='h-[100px] w-[100px] rounded-full'>
              <img
                src={getProfileUrl}
                alt={t('translation.profilePic')}
                className='h-full w-full overflow-hidden rounded-full object-center'
              />
            </div>
            {isEditable && (
              <FlexBox
                flex
                classname='mt-[11px] cursor-pointer'
                onClick={handleProfileChange}
              >
                <Icon
                  name='solid-edit'
                  height={16}
                  width={16}
                  className='mr-[1px]'
                />

                <TypographyP noBottom classname='!text-darkGray' size={12}>
                  {t('translation.changeImage')}
                </TypographyP>
              </FlexBox>
            )}
          </FlexBox>
        </FlexBox>
        <TypographyH2 size={20}>
          {t('translation.practiceInformation')}
        </TypographyH2>
        <TypographyP size={16} classname='!mb-0 mt-2 font-normal'>
          {t('translation.practiceDescription')}
        </TypographyP>
        <div className='pt-7'>
          <FlexBox classname='gap-[30px]'>
            <FormField
              control={form.control}
              name='practiceName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      label={t('translation.practiceName')}
                      {...field}
                      error={errors?.practiceName}
                      disabled={!isEditable}
                      onChange={(e) => {
                        handleChangeValue('practiceName', e.target.value);
                        hideError('practiceName');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='contactPerson'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      label={t('translation.contactPerson')}
                      {...field}
                      error={errors?.contactPerson}
                      disabled={!isEditable}
                      onChange={(e) => {
                        handleChangeValue('contactPerson', e.target.value);
                        hideError('contactPerson');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FlexBox>

          <FlexBox classname='gap-[30px]'>
            <FormField
              control={form.control}
              name='practiceAddress'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      label={t('translation.practiceAddress')}
                      disabled={!isEditable}
                      {...field}
                      error={errors?.practiceAddress}
                      onChange={(e) => {
                        handleChangeValue('practiceAddress', e.target.value);
                        hideError('practiceAddress');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
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
                      label={t('translation.practiceEmailAddress')}
                      disabled
                      {...field}
                      error={errors?.email}
                      onChange={(e) => {
                        handleChangeValue('email', e.target.value);
                        hideError('email');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FlexBox>

          <FlexBox classname='gap-[30px]'>
            <div className='md:w-1/2'>
              <FormField
                control={form.control}
                name='mobileNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PhoneInput
                        label={t('translation.landline')}
                        onFocus={() => setIsFocus(true)}
                        onBlurCapture={() => setIsFocus(false)}
                        isFocus={isFocus}
                        error={errors?.mobileNumber}
                        disabled={!isEditable}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='md:w-1/2'></div>
          </FlexBox>
        </div>
      </>
    );
  };

  const onDeleteInsuranceCertificate = () => {
    handleChangeValue('insuranceCertificate', '');
  };

  const renderDoctorUpperFields = () => {
    return (
      <>
        <FlexBox classname='gap-[30px] mt-8'>
          <div className='flex-1'>
            <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-2.5'>
              {t('translation.gmcNumber')}
            </TypographyP>

            <FormField
              control={form.control}
              name='gmcNumber'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      label={t('translation.enterGmcNumber')}
                      error={errors?.gmcNumber}
                      disabled={!isEditable}
                      {...field}
                      onChange={(e) => {
                        handleChangeValue('gmcNumber', e.target.value);
                        hideError('gmcNumber');
                      }}
                    />
                  </FormControl>
                  <FormMessage className='mb-0' />
                </FormItem>
              )}
            />
          </div>

          <div className='flex-1'>
            <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-2.5'>
              {t('translation.icoNumber')}
            </TypographyP>

            <FormField
              control={form.control}
              name='icoNumber'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      label={t('translation.enterIcoNumber')}
                      error={errors?.icoNumber}
                      disabled={!isEditable}
                      {...field}
                      onChange={(e) => {
                        handleChangeValue('icoNumber', e.target.value);
                        hideError('icoNumber');
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FlexBox>
        <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-2.5'>
          {t('translation.addInsuranceCertificate')}
        </TypographyP>
        <FlexBox classname='gap-[30px] mb-1'>
          {isEditable ? (
            <FormField
              control={form.control}
              name='insuranceCertificate'
              render={({ field }) => {
                return (
                  <FormItem className='!flex-none md:w-[48%]'>
                    <FormControl>
                      <FileInput
                        fieldValue={field?.value}
                        accept='.pdf'
                        label={t('translation.addInsuranceCertificateLabel')}
                        error={errors?.insuranceCertificate as FieldError}
                        id='insuranceCertificate'
                        onChangeInput={(file) => {
                          if (file) {
                            handleChangeValue('insuranceCertificate', file);
                            hideError('insuranceCertificate');
                          }
                        }}
                        onDelete={onDeleteInsuranceCertificate}
                        hidecross
                      />
                    </FormControl>
                    <FormMessage
                      fieldError={
                        errors?.insuranceCertificate?.message as string
                      }
                    />
                  </FormItem>
                );
              }}
            />
          ) : (
            <FlexBox
              flex
              centerContent
              centerItems
              classname='cursor-pointer rounded-[6px] border text-[18px] flex-1 mb-[42px] min-h-[55px]'
              onClick={() => setOpen(true)}
            >
              <Icon name='link-icon' color='transparent' />
              <TypographyP
                center
                noBottom
                size={16}
                classname='!font-normal text-primary truncate'
              >
                {t('translation.viewCertificate')}
              </TypographyP>
            </FlexBox>
          )}
          <FormField
            control={form.control}
            name='insuranceRenewalDate'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='date'
                    label={t('translation.insuranceRenewalDate')}
                    error={errors?.insuranceRenewalDate}
                    {...field}
                    onChange={(e) => {
                      handleChangeValue('insuranceRenewalDate', e.target.value);
                      hideError('insuranceRenewalDate');
                    }}
                    onClick={(e) => e.preventDefault()}
                    onKeyUp={() => hideError('insuranceRenewalDate')}
                    disabled={!isEditable}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FlexBox>
      </>
    );
  };

  const renderDoctorsFields = () => {
    return (
      <>
        {!isEditable && (user?.subSpecialties || [])?.length > 0 && (
          <div className='mb-8'>
            <TypographyP size={16} classname='!text-darkGray'>
              {t('translation.yourSubspecialties')}
            </TypographyP>
            <FlexBox flex centerItems classname='flex-wrap gap-3'>
              {user?.subSpecialties?.map((speciality, index) => {
                const userSpeciality =
                  SUB_SPECIALITIES?.find((item) => item?.value === speciality)
                    ?.label ||
                  speciality ||
                  '';
                return (
                  <FlexBox flex centerItems classname='flex-wrap' key={index}>
                    <CustomCheckbox
                      value={userSpeciality}
                      checked={true}
                      label={userSpeciality}
                      disabled
                      disableCursorAllowed
                    />
                  </FlexBox>
                );
              })}
            </FlexBox>
          </div>
        )}
        {isEditable && (
          <div>
            <TypographyP size={16} classname='!text-darkGray'>
              {t('translation.selectSpecialism')}
            </TypographyP>
            <FlexBox classname='flex flex-col flex-wrap mt-2'>
              <FlexBox flex classname='gap-[16px] w-full flex-wrap'>
                {SUB_SPECIALITIES?.map((item, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={'subSpecialties'}
                    render={({ field }) => (
                      <FormItem className='max-w-full !flex-none'>
                        <FormControl className='!flex-none'>
                          <CustomCheckbox
                            {...field}
                            value={item?.value}
                            checked={field?.value?.includes(item?.value)}
                            onCheckedChange={() => {
                              let newValue = field.value
                                ? [...(field.value || '')]
                                : [];

                              if (newValue?.includes(item.value)) {
                                newValue = newValue?.filter(
                                  (val) => val !== item.value,
                                );
                              } else {
                                newValue.push(item.value);
                              }
                              form.setValue('subSpecialties', newValue);

                              hideError('subSpecialties');
                            }}
                            label={item?.label}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name='otherSubSpeciality'
                  render={({ field }) => (
                    <FormItem className='!flex-none max-ms:w-full'>
                      <FormControl>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomCheckbox
                              {...field}
                              checked={!!field?.value}
                              label={
                                <div className='flex max-ms:w-full'>
                                  <ReferralFormTextarea
                                    className='h-[25px] resize-none max-ms:w-full md:min-w-[390px] md:max-w-[390px]'
                                    placeholder={t('translation.other')}
                                    checked={!!field.value}
                                    containerClass={`${form?.watch('otherSubSpeciality') ? '!border-transparent' : ''} !px-0 !mx-0`}
                                    value={form?.watch('otherSubSpeciality')}
                                    onChange={(e) => {
                                      form.setValue(
                                        'otherSubSpeciality',
                                        e.target.value,
                                      );

                                      const otherOpthalmicValues =
                                        form.watch('subSpecialties') || [];

                                      form.setValue('subSpecialties', [
                                        ...otherOpthalmicValues,
                                      ]);
                                      form.setValue(
                                        'otherSubSpeciality',
                                        e.target.value,
                                      );
                                      hideError('subSpecialties');
                                    }}
                                  />
                                </div>
                              }
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FlexBox>
              <FormMessage
                fieldError={errors?.otherSubSpeciality?.message || ''}
              />
            </FlexBox>
          </div>
        )}

        {!isEditable && user?.description && (
          <div className='mb-8'>
            <TypographyP size={16} classname='!text-darkGray'>
              {t('translation.yourPersonalStatement')}
            </TypographyP>
            <div className='min-h-[100px] overflow-auto rounded-[6px] bg-lightPrimary py-1'>
              <TypographyP
                size={16}
                classname='!text-primary font-normal ml-2 w-full'
              >
                {user?.description || ''}
              </TypographyP>
            </div>
          </div>
        )}
        {isEditable && (
          <div>
            <TypographyP size={16} classname='!text-darkGray'>
              {t('translation.personalStatement')}
            </TypographyP>
            <FlexBox classname='gap-[30px] mb-8'>
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder={t('translation.description')}
                        className='resize-none'
                        containerClass={
                          'border-[1.7px] border-lightGray focus-within:!border-primary rounded-[6px]'
                        }
                        maxLength={500}
                        count={field?.value?.length}
                        showCount
                        disabled={!isEditable}
                        onChange={(e) => {
                          handleChangeValue('description', e.target.value);
                          hideError('description');
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FlexBox>
          </div>
        )}
      </>
    );
  };

  const emailUrl = useMemo(() => {
    const userName = `${user?.firstName || ''} ${user?.lastName || ''}`;
    const recipient = 'support@bookaneyedoctor.co.uk';
    const subject = 'Change my email';
    const bodyOfEmail = `Dear Bedr Ltd%0D%0A%0D%0APlease change my email address from ${user?.email} to %0D%0A%0D%0AKind regards ${userName}`;
    return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${bodyOfEmail}`;
  }, [user]);

  return (
    <Card className='min-h-[855px] px-[19px] py-[30px]'>
      <div className='min-h-[500px] w-full flex-col md:max-w-[710px]'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            {user?.role === LOGINS.PRACTICE ? (
              getPracticeDetails()
            ) : (
              <>
                <FlexBox
                  flex
                  justify='between'
                  classname='w-full md:flex-row flex-col-reverse'
                >
                  {user?.gocNumber && (
                    <div className='flex-1'>
                      <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-2.5'>
                        {t('translation.gocNumber')}
                      </TypographyP>

                      <FormField
                        control={form.control}
                        name='gocNumber'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type='text'
                                label={t('translation.enterGocNumber')}
                                error={errors?.gocNumber}
                                disabled={!isEditable}
                                {...field}
                                onChange={(e) => {
                                  handleChangeValue(
                                    'gocNumber',
                                    e.target.value,
                                  );
                                  hideError('gocNumber');
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FlexBox
                    flex
                    centerContent
                    classname={`flex-1 flex-col items-center ${user?.gocNumber ? 'md:items-end' : 'md:items-center'} md:mb-0 mb-5`}
                  >
                    <div className='h-[100px] w-[100px] rounded-full'>
                      <img
                        src={getProfileUrl}
                        alt={t('translation.profilePic')}
                        className='h-full w-full overflow-hidden rounded-full object-center'
                      />
                    </div>
                    {isEditable && (
                      <FlexBox
                        flex
                        classname='mt-[11px] cursor-pointer'
                        onClick={handleProfileChange}
                      >
                        <Icon
                          name='solid-edit'
                          height={16}
                          width={16}
                          className='mr-[1px]'
                        />
                        <TypographyP
                          noBottom
                          classname='!text-darkGray'
                          size={12}
                        >
                          {t('translation.changeImage')}
                        </TypographyP>
                      </FlexBox>
                    )}
                  </FlexBox>
                </FlexBox>

                {user?.role === LOGINS.DOCTOR && renderDoctorUpperFields()}

                <TypographyH2 size={20}>
                  {t('translation.personalDetailsLabel')}
                </TypographyH2>
                <TypographyP size={16} classname='!mb-0 mt-2 font-normal'>
                  {t('translation.profileDescription')}
                </TypographyP>
                <div className='pt-7'>
                  {user?.role === LOGINS.DOCTOR &&
                    <FlexBox classname='gap-[30px]'>
                      <FormField
                        control={form.control}
                        name='salutation'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SelectDropDown
                                label={t('translation.salutation')}
                                options={salutationOptions}
                                error={errors?.salutation}
                                onChangeValue={field.onChange}
                                defaultValue={user?.salutation}
                                {...field}
                                disabled={!isEditable}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className='flex-1 md:block hidden'></div>
                    </FlexBox>
                  }
                  <FlexBox classname='gap-[30px]'>
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
                              disabled={!isEditable}
                              onChange={(e) => {
                                handleChangeValue('firstName', e.target.value);
                                hideError('firstName');
                              }}
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
                              disabled={!isEditable}
                              onChange={(e) => {
                                handleChangeValue('lastName', e.target.value);
                                hideError('lastName');
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FlexBox>
                  <FlexBox classname='gap-[30px]'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type='text'
                              label={t('translation.emailAddress')}
                              disabled
                              {...field}
                              error={errors?.email}
                              onChange={(e) => {
                                handleChangeValue('email', e.target.value);
                                hideError('email');
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <TypographyP noBottom primary classname='flex-1 mb-10'>
                      {t('translation.ifYouNeedToChangeEmail')}{' '}
                      <Link
                        className='w-full'
                        target='_blank'
                        href={emailUrl as Route}
                      >
                        <span className='cursor-pointer font-normal underline'>
                          {t('translation.contactUs')}
                        </span>
                        .
                      </Link>
                    </TypographyP>
                  </FlexBox>

                  <FlexBox classname='gap-[30px]'>
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
                              disabled={!isEditable}
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
                              disabled={!isEditable}
                              onChange={(e) => {
                                handleChangeValue('postCode', e.target.value);
                                hideError('postCode');
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FlexBox>
                  <FlexBox
                    classname={cn(`gap-[30px]`, {
                      'md:w-1/2':
                        user?.role !== LOGINS?.DOCTOR || !user?.hospitalName,
                    })}
                  >
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
                              disabled={!isEditable}
                              onChange={(e) => {
                                handleChangeValue(
                                  'dateOfBirth',
                                  e.target.value,
                                );
                                hideError('dateOfBirth');
                              }}
                              onKeyUp={() => hideError('dateOfBirth')}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {user?.role === LOGINS?.DOCTOR &&
                      (user?.hospitalName || isEditable) && (
                        <FormField
                          control={form.control}
                          name='hospitalName'
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type='text'
                                  label={t('translation.yourHospital')}
                                  {...field}
                                  error={errors?.hospitalName}
                                  disabled={!isEditable}
                                  onChange={(e) => {
                                    handleChangeValue(
                                      'hospitalName',
                                      e.target.value,
                                    );
                                    hideError('hospitalName');
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                  </FlexBox>

                  {user?.role === LOGINS?.DOCTOR && renderDoctorsFields()}
                </div>
              </>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
              <PdfModalPreview isInsurance />
            </Dialog>

            <FlexBox classname='gap-[30px]'>
              {isEditable ? (
                <Button
                  variant={'outline'}
                  type='submit'
                  className='mr-auto w-full flex-1 !py-[14px] text-[16px] font-semibold nm:!w-[200px] md:!px-0'
                  loading={loading || uploading}
                >
                  {t('translation.saveChanges')}
                </Button>
              ) : (
                <TypographyP
                  noBottom
                  center
                  classname='mr-auto w-full rounded-[4px] flex-1 border hover:bg-primary hover:text-white py-[5px] text-primary text-[16px] font-semibold nm:!w-[200px] md:!px-0'
                  onClick={() => setIsEditable(true)}
                >
                  {t('translation.edit')}
                </TypographyP>
              )}
              <div className='flex-1'></div>
            </FlexBox>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default SettingsPersonalInformation;
