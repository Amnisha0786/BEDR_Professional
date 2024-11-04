'use client';

import React, { useCallback, useEffect, useState } from 'react';
import * as RPNInput from 'react-phone-number-input';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldError, FieldPath, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TypographyP } from '@/components/ui/typography/p';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { DividerWithOr } from '@/components/ui/divider-or';
import { TypographyH4 } from '@/components/ui/typography/h4';
import FlexBox from '@/components/ui/flexbox';
import { SelectDropDown } from '@/components/ui/select';
import { LOGINS } from '@/enums/auth';
import { Loginas, salutationOptions } from '@/lib/constants/data';
import { Checkbox } from '@/components/ui/checkbox';
import VerifySignupOtp from '@/components/auth-components/verify-signup-otp';
import { Password } from '@/components/ui/password-input';
import { TSignupForm } from '@/models/types/auth';
import { signupFormSchema } from '@/models/validations/auth';
import { verifyOTP } from '@/app/api/auth';
import { getErrorMessage } from '@/lib/utils';
import { PhoneInput } from '@/components/ui/phone-input';
import PasswordInstructions from '@/components/custom-components/password-instructions';
import { getSignupPayload } from '@/components/auth-components/signup-form-payload';
import { DEVICE_TYPE } from '@/lib/constants/shared';
import { FileInput } from '@/components/custom-components/custom-file-input';
import { getPrivacyPolicy, getTermsConditions } from '@/app/api/settings';
import { TTermsAndConditions } from '@/models/types/settings';
import { Dialog } from '@/components/ui/dialog';
import PdfModalPreview from '@/components/pdf-modal-preview';

const Signup = () => {
  const [step, setStep] = useState<'' | 'verify_otp'>('');
  const [formData, setFormData] = useState<TSignupForm>();
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [termsConditions, setTermsConditions] = useState<TTermsAndConditions>();
  const [privacyPolicy, setPrivacyPolicy] = useState<TTermsAndConditions>();
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);

  const { t } = useTranslation();

  const form = useForm<TSignupForm>({
    resolver: yupResolver(signupFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      role: LOGINS.OPTOMETRIST,
      mobileNumber: '',
      password: '',
      termsAndConditions: false,
      callingCode: '+44',
      deviceType: DEVICE_TYPE,
    },
  });

  const { errors } = form.formState;

  const onSubmit = useCallback(async (values: TSignupForm) => {
    try {
      setLoading(true);
      const payload = getSignupPayload(values?.role, values);
      if (!payload) {
        toast.error(t('translation.somethingWentWrong'));
        return;
      }
      const response = await verifyOTP(
        {
          ...payload,
          mobileNumber: values?.mobileNumber?.split(values?.callingCode)?.[1],
          deviceType: DEVICE_TYPE,
        },
        true,
      );
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
      } else {
        setFormData({
          ...payload,
          mobileNumber: values?.mobileNumber?.split(values?.callingCode)?.[1],
          deviceType: DEVICE_TYPE,
          otp: response?.data?.data?.otp,
        });

        setStep('verify_otp');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, []);

  const hideError = useCallback(
    (name: FieldPath<TSignupForm>) => form.clearErrors(name),
    [],
  );

  const handleChangeValue = useCallback(
    (
      name: FieldPath<TSignupForm>,
      value: string | boolean | File | undefined | null,
    ) => {
      form.setValue(name, value);
    },
    [],
  );

  const formReset = (value?: string) => {
    form.reset(
      {
        role: value,
        mobileNumber: '',
        postCode: '',
        password: '',
        contactPersonEmail: '',
        confirmPassword: '',
        email: '',
        termsAndConditions: false,
        callingCode: '+44',
        deviceType: DEVICE_TYPE,
        gmcNumber: '',
        gocNumber: '',
        contactPerson: '',
        practiceAddress: '',
        practiceName: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        insuranceCertificate: null,
        insuranceRenewalDate: '',
        salutation: '',
      },
      {
        keepValues: false,
        keepTouched: false,
        keepDirtyValues: false,
      },
    );
  };

  const practiceSignupForm = () => {
    return (
      <>
        <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-1'>
          {t('translation.icoNumber')}
        </TypographyP>
        <FlexBox classname='gap-[30px]'>
          <div className='md:w-1/2'>
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
                      {...field}
                      onChange={(e) => {
                        handleChangeValue('icoNumber', e.target.value);
                        hideError('icoNumber');
                      }}
                    />
                  </FormControl>
                  <FormMessage className='mb-0  min-h-[21px]' />
                </FormItem>
              )}
            />
          </div>
          <div className='md:w-1/2'></div>
        </FlexBox>

        <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-1 '>
          {t('translation.practiceInformation')}
        </TypographyP>

        <FlexBox classname={`gap-[30px] mt-[30px]`}>
          <FormField
            control={form.control}
            name='practiceName'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='text'
                    label={t('translation.practiceName')}
                    error={errors?.practiceName}
                    {...field}
                    onChange={(e) => {
                      handleChangeValue('practiceName', e.target.value);
                      hideError('practiceName');
                    }}
                  />
                </FormControl>
                <FormMessage className='mb-[12px] min-h-[21px]' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='contactPersonEmail'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='text'
                    label={t('translation.practiceEmailAddress')}
                    error={errors?.contactPersonEmail}
                    {...field}
                    onChange={(e) => {
                      handleChangeValue('contactPersonEmail', e.target.value);
                      hideError('contactPersonEmail');
                    }}
                  />
                </FormControl>
                <FormMessage className='mb-[12px] min-h-[21px]' />
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
                    error={errors?.practiceAddress}
                    {...field}
                    onChange={(e) => {
                      handleChangeValue('practiceAddress', e.target.value);
                      hideError('practiceAddress');
                    }}
                  />
                </FormControl>
                <FormMessage className='mb-[12px] min-h-[21px]' />
              </FormItem>
            )}
          />
        </FlexBox>

        <FlexBox classname='gap-[30px]'>
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
                <FormMessage className='mb-[12px] min-h-[21px]' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Password
                    type='password'
                    label={t('translation.password')}
                    error={errors?.password}
                    {...field}
                    onChange={(e) => {
                      handleChangeValue('password', e.target.value);
                      hideError('password');
                    }}
                  />
                </FormControl>
                <FormMessage className='mb-[12px] min-h-[21px]' />
              </FormItem>
            )}
          />
        </FlexBox>
        <FlexBox classname='gap-[30px]'>
          <FormField
            control={form.control}
            name='contactPerson'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type='text'
                    label={t('translation.contactPerson')}
                    error={errors?.contactPerson}
                    {...field}
                    onChange={(e) => {
                      handleChangeValue('contactPerson', e.target.value);
                      hideError('contactPerson');
                    }}
                  />
                </FormControl>
                <FormMessage className='mb-[12px] min-h-[21px]' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Password
                    type='password'
                    label={t('translation.consfirmPassword')}
                    error={errors?.confirmPassword}
                    {...field}
                    onChange={(e) => {
                      handleChangeValue('confirmPassword', e.target.value);
                      hideError('confirmPassword');
                    }}
                  />
                </FormControl>
                <FormMessage className='mb-[12px] min-h-[21px]' />
              </FormItem>
            )}
          />
        </FlexBox>
      </>
    );
  };

  const onDeleteInsuranceCertificate = () => {
    handleChangeValue('insuranceCertificate', null);
  };

  const fetchTermsConditions = useCallback(async () => {
    if (!form?.watch('role')) {
      return;
    }
    try {
      const response = await getTermsConditions({ role: form?.watch('role') });
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setTermsConditions(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    }
  }, [form?.watch('role')]);

  useEffect(() => {
    fetchTermsConditions();
  }, [fetchTermsConditions]);

  const fetchPrivacyPolicy = useCallback(async () => {
    if (!form?.watch('role')) {
      return;
    }
    try {
      const response = await getPrivacyPolicy({ role: form?.watch('role') });
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setPrivacyPolicy(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    }
  }, [form?.watch('role')]);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, [fetchPrivacyPolicy]);

  const renderDoctorUpperFields = () => {
    return (
      <>
        <FlexBox classname='gap-[30px]'>
          <div className='flex-1'>
            <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-1 '>
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
                      {...field}
                      onChange={(e) => {
                        handleChangeValue('gmcNumber', e.target.value);
                        hideError('gmcNumber');
                      }}
                    />
                  </FormControl>
                  <FormMessage className='mb-[12px] min-h-[21px]' />
                </FormItem>
              )}
            />
          </div>
          <div className='flex-1'>
            <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-1 '>
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
                      {...field}
                      onChange={(e) => {
                        handleChangeValue('icoNumber', e.target.value);
                        hideError('icoNumber');
                      }}
                    />
                  </FormControl>
                  <FormMessage className='mb-[12px] min-h-[21px]' />
                </FormItem>
              )}
            />
          </div>
        </FlexBox>

        <FlexBox classname='gap-[30px]'>
          <div className='flex-1'>
            <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-1 '>
              {t('translation.addInsuranceCertificate')}
            </TypographyP>
            <FlexBox classname='gap-[30px]'>
              <FormField
                control={form.control}
                name='insuranceCertificate'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileInput
                        fieldValue={field?.value}
                        accept='.pdf'
                        label={t('translation.addInsuranceCertificateLabel')}
                        error={errors?.insuranceCertificate as FieldError}
                        id='insuranceCertificate'
                        onChangeInput={(file) => {
                          handleChangeValue(
                            'insuranceCertificate',
                            file || null,
                          );
                          hideError('insuranceCertificate');
                        }}
                        onDelete={onDeleteInsuranceCertificate}
                      />
                    </FormControl>
                    <FormMessage
                      className='mb-[12px] min-h-[21px]'
                      fieldError={
                        errors?.insuranceCertificate?.message as string
                      }
                    />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='insuranceRenewalDate'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <Input
                      type='date'
                      label={t('translation.insuranceRenewalDate')}
                      error={errors?.insuranceRenewalDate}
                      {...field}
                      onChange={(e) => {
                        handleChangeValue(
                          'insuranceRenewalDate',
                          e.target.value,
                        );
                        hideError('insuranceRenewalDate');
                      }}
                      onClick={(e) => e.preventDefault()}
                      onKeyUp={() => hideError('insuranceRenewalDate')}
                    />
                    <FormMessage className='mb-[12px] min-h-[21px]' />
                  </FormItem>
                )}
              />
            </FlexBox>
          </div>
        </FlexBox>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>{t('translation.signupHead')}</title>
      </Head>
      <div className='bg-white p-5'>
        <div className='md:absolute md:top-5'>
          <Image
            src={'/assets/logo-blue.svg'}
            alt={t('translation.logo')}
            width={190}
            height={156}
            className='m-auto max-ms:h-[95.6px] md:m-0'
          />
        </div>
        <div className='container mx-auto max-w-[700px] p-[19px] md:my-32 md:mt-24 md:p-[30px]'>
          <div className='m-auto max-w-[662px]'>
            <TypographyH2 center classname='block max-ms:hidden'>
              {t('translation.welcomeToBookAnEyeDoctor')}
            </TypographyH2>
            <TypographyP center classname='mb-2 mt-[10px]'>
              {step === 'verify_otp'
                ? t('translation.pleaseCheckYourEmail')
                : t('translation.signupTitle')}
            </TypographyP>
            {step === '' ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  noValidate
                  autoComplete='off'
                >
                  <div className='pt-[1.2rem]'>
                    <FlexBox classname={`gap-[30px] md:w-1/2 m-auto`}>
                      <FormField
                        control={form.control}
                        name='role'
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SelectDropDown
                                label={t('translation.signupAs')}
                                options={Loginas}
                                placeholder={t('translation.signupAs')}
                                error={errors?.role}
                                defaultValue={form?.watch('role')}
                                {...field}
                                onChangeValue={(val) => {
                                  handleChangeValue(
                                    'role',
                                    val || LOGINS.OPTOMETRIST,
                                  );
                                  formReset(val);
                                }}
                              />
                            </FormControl>
                            <FormMessage className='mb-[0px] mt-0' />
                          </FormItem>
                        )}
                      />
                    </FlexBox>
                    {form?.watch('role') === LOGINS.PRACTICE ? (
                      practiceSignupForm()
                    ) : (
                      <>
                        {form?.watch('role') !== LOGINS.READER && (
                          <>
                            {form?.watch('role') === LOGINS.OPTOMETRIST ? (
                              <>
                                <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-1'>
                                  {t('translation.gocNumber')}
                                </TypographyP>
                                <FlexBox classname='gap-[30px]'>
                                  <div className='md:w-1/2'>
                                    <FormField
                                      control={form.control}
                                      name='gocNumber'
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <Input
                                              type='text'
                                              label={t(
                                                'translation.enterGocNumber',
                                              )}
                                              error={errors?.gocNumber}
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
                                          <FormMessage className='mb-0  min-h-[21px]' />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  <div className='md:w-[48%]'></div>
                                </FlexBox>
                              </>
                            ) : (
                              renderDoctorUpperFields()
                            )}
                            <TypographyP classname='!text-darkGray text-left font-semibold text-[20px] mt-1 '>
                              {t('translation.personalInformation')}
                            </TypographyP>
                          </>
                        )}

                        {form?.watch('role') === LOGINS.DOCTOR && (
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
                                      defaultValue={form?.watch('salutation')}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className='flex-1 md:block hidden'></div>
                          </FlexBox>
                        )}

                        <FlexBox
                          classname={`gap-[30px] ${form?.watch('role') === LOGINS.READER && 'mt-[30px]'}`}
                        >
                          <FormField
                            control={form.control}
                            name='firstName'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type='text'
                                    label={t('translation.firstName')}
                                    error={errors?.firstName}
                                    {...field}
                                    onChange={(e) => {
                                      handleChangeValue(
                                        'firstName',
                                        e.target.value,
                                      );
                                      hideError('firstName');
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className='mb-[12px] min-h-[21px]' />
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
                                    error={errors?.lastName}
                                    {...field}
                                    onChange={(e) => {
                                      handleChangeValue(
                                        'lastName',
                                        e.target.value,
                                      );
                                      hideError('lastName');
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className='mb-[12px] min-h-[21px]' />
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
                                    error={errors?.email}
                                    {...field}
                                    onChange={(e) => {
                                      handleChangeValue(
                                        'email',
                                        e.target.value,
                                      );
                                      hideError('email');
                                    }}
                                    autoComplete='off'
                                  />
                                </FormControl>
                                <FormMessage className='mb-[12px] min-h-[21px]' />
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
                                    onCountryChange={(
                                      value: RPNInput.Country,
                                    ) => {
                                      if (value) {
                                        form.setValue(
                                          'callingCode',
                                          `+${RPNInput.getCountryCallingCode(value)}`,
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className='mb-[12px] min-h-[21px]' />
                              </FormItem>
                            )}
                          />
                        </FlexBox>
                        <FlexBox classname='gap-[30px]'>
                          <FormField
                            control={form.control}
                            name='dateOfBirth'
                            render={({ field }) => (
                              <FormItem className='flex flex-col'>
                                <Input
                                  type='date'
                                  label={t('translation.dob')}
                                  error={errors?.dateOfBirth}
                                  {...field}
                                  onChange={(e) => {
                                    handleChangeValue(
                                      'dateOfBirth',
                                      e.target.value,
                                    );
                                    hideError('dateOfBirth');
                                  }}
                                  onClick={(e) => e.preventDefault()}
                                  onKeyUp={() => hideError('dateOfBirth')}
                                />
                                <FormMessage className='mb-[12px] min-h-[21px]' />
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
                                    error={errors?.postCode}
                                    autoComplete='off'
                                    {...field}
                                    onChange={(e) => {
                                      handleChangeValue(
                                        'postCode',
                                        e.target.value,
                                      );
                                      hideError('postCode');
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className='mb-[12px] min-h-[21px]' />
                              </FormItem>
                            )}
                          />
                        </FlexBox>
                        <FlexBox classname='gap-[30px]'>
                          <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Password
                                    type='password'
                                    label={t('translation.password')}
                                    error={errors?.password}
                                    {...field}
                                    onChange={(e) => {
                                      handleChangeValue(
                                        'password',
                                        e.target.value,
                                      );
                                      hideError('password');
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className='mb-[12px] min-h-[21px]' />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='confirmPassword'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Password
                                    type='password'
                                    label={t('translation.consfirmPassword')}
                                    error={errors?.confirmPassword}
                                    {...field}
                                    onChange={(e) => {
                                      handleChangeValue(
                                        'confirmPassword',
                                        e.target.value,
                                      );
                                      hideError('confirmPassword');
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className='mb-[12px] min-h-[21px]' />
                              </FormItem>
                            )}
                          />
                        </FlexBox>
                      </>
                    )}
                    <PasswordInstructions />
                  </div>
                  <FlexBox classname='!items-start flex'>
                    <FormField
                      control={form.control}
                      name='termsAndConditions'
                      render={({ field }) => (
                        <FormItem>
                          <div className='flex items-start'>
                            <FormControl>
                              <Checkbox
                                className='mr-2'
                                checked={field.value}
                                onCheckedChange={(checked) => {
                                  handleChangeValue(
                                    'termsAndConditions',
                                    checked,
                                  );
                                  hideError('termsAndConditions');
                                }}
                              />
                            </FormControl>
                            <span className='-mt-[3px] text-left text-[14px] !font-light text-gray'>
                              {t('translation.termsAndCondition')}
                              <span
                                className='ml-1 cursor-pointer underline'
                                onClick={() => setOpenTerms(true)}
                              >
                                {t('translation.termsOfUse')}
                              </span>{' '}
                              {t('translation.and')}{' '}
                              <span
                                className='cursor-pointer underline'
                                onClick={() => setOpenPrivacyPolicy(true)}
                              >
                                {t('translation.privacyPolicy')}
                              </span>
                            </span>
                            <Dialog
                              open={openTerms}
                              onOpenChange={setOpenTerms}
                            >
                              <PdfModalPreview
                                fullUrl={termsConditions?.fileKey}
                              />
                            </Dialog>
                            <Dialog
                              open={openPrivacyPolicy}
                              onOpenChange={setOpenPrivacyPolicy}
                            >
                              <PdfModalPreview
                                fullUrl={privacyPolicy?.fileKey}
                              />
                            </Dialog>
                          </div>
                          <FormMessage className='mb-[12px] !min-h-[22px]' />
                        </FormItem>
                      )}
                    />
                  </FlexBox>

                  <FlexBox classname='justify-center flex'>
                    <Button
                      type='submit'
                      className='mb-5 mt-1.5 w-1/2 px-[10px] py-6 text-white'
                      loading={loading}
                    >
                      {t('translation.signUp')}
                    </Button>
                  </FlexBox>
                  <DividerWithOr size='w-[25%]' />
                  <div className='mt-[30px] text-center'>
                    <TypographyH4 size={16}>
                      {t('translation.alreadyHaveAccount')}{' '}
                      <Link
                        href='/login'
                        className='text-[18px] font-semibold text-primary underline'
                      >
                        {t('translation.loginNow')}{' '}
                      </Link>
                    </TypographyH4>
                  </div>
                </form>
              </Form>
            ) : (
              <VerifySignupOtp setStep={setStep} formData={formData} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
