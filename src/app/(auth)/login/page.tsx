'use client';

import React, { useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldPath, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
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
import { Password } from '@/components/ui/password-input';
import { LOGINS } from '@/enums/auth';
import { Loginas } from '@/lib/constants/data';
import { TLoginForm } from '@/models/types/auth';
import {
  loginFormSchema,
  optometristLoginSchema,
} from '@/models/validations/auth';
import { getOptometristPractices, verifyOTP } from '@/app/api/auth';
import { getErrorMessage } from '@/lib/utils';
import VerifyLoginOtp from '@/components/auth-components/verify-login-otp';
import { DEVICE_TYPE } from '@/lib/constants/shared';

type TPracticesOptions = {
  label: string;
  value: string;
};

const Login = () => {
  const [step, setStep] = useState<'' | 'verify_otp'>('');
  const [formData, setFormData] = useState<TLoginForm>();
  const [loading, setLoading] = useState(false);
  const [isUserSelectingStore, setIsUserSelectingStore] = useState(false);
  const [optometristPractices, setOptometristPractices] = useState<
    TPracticesOptions[] | null
  >(null);
  const { t } = useTranslation();
  const form = useForm<TLoginForm>({
    resolver: yupResolver(
      !isUserSelectingStore ? optometristLoginSchema : loginFormSchema,
    ),
    defaultValues: {
      email: '',
      password: '',
      role: LOGINS.OPTOMETRIST,
      deviceType: DEVICE_TYPE,
    },
    mode: 'onSubmit',
  });
  const { errors } = form.formState;

  const onSubmit = useCallback(
    async (values: TLoginForm) => {
      try {
        setLoading(true);
        if (values?.role === LOGINS.OPTOMETRIST && !isUserSelectingStore) {
          const response = await getOptometristPractices({
            email: values.email,
            role: values?.role,
          });
          if (response?.data?.status !== 200) {
            toast.error(
              response?.data?.message || t('translation.somethingWentWrong'),
            );
          } else {
            const practices: TPracticesOptions[] = [];
            response?.data?.data?.map((item) =>
              practices.push({
                label: item?.practiceName,
                value: item?.practiceId,
              }),
            );
            setIsUserSelectingStore(true);
            setOptometristPractices(practices);
          }
        } else {
          const response = await verifyOTP({
            email: values.email?.toLowerCase(),
            role: values.role,
            otpType: 'log_in',
            password: values.password,
            practiceId: values?.practiceId,
            deviceType: DEVICE_TYPE,
          });

          if (response?.data?.status !== 200) {
            toast.error(
              response?.data?.message || t('translation.somethingWentWrong'),
            );
          } else {
            values['otp'] = response?.data?.data?.otp;
            setFormData(values);
            setStep('verify_otp');
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },
    [isUserSelectingStore],
  );

  const hideError = useCallback(
    (name: FieldPath<TLoginForm>) => form.clearErrors(name),
    [],
  );

  const handleChangeValue = useCallback(
    (name: FieldPath<TLoginForm>, value: string) => form.setValue(name, value),
    [],
  );

  return (
    <>
      <Head>
        <title>{t('translation.loginHead')}</title>
      </Head>
      <div className='relative  bg-gradient-radial bg-cover bg-center bg-no-repeat'>
        <div className='w-full bg-primary-bg bg-contain bg-center bg-no-repeat'>
          <div className='border-sm w-100 flex min-h-screen flex-col items-center justify-center p-3 md:p-16'>
            <div className='min-sm:grid-cols-1 grid w-full gap-10 2xl:container nm:mx-auto md:grid-cols-12 md:gap-24'>
              <div className='md:col-span-6'>
                <Image
                  src={'/assets/logo.svg'}
                  alt={t('translation.logoAlt')}
                  width={200}
                  height={200}
                  className='m-auto md:m-0 '
                />
                <TypographyP classname='text-white mt-[15px] md:text-left text-center leading-8 text-[24px] xs:text-[20px]'>
                  {t('translation.authTitle')}
                </TypographyP>
              </div>
              <div className='m-auto min-h-[30rem] max-w-[490px] rounded-md bg-white p-[19px] md:col-span-6 md:p-[30px]'>
                {step === 'verify_otp' ? (
                  <VerifyLoginOtp
                    setStep={setStep}
                    formData={formData}
                    optometristPractices={optometristPractices}
                  />
                ) : (
                  <>
                    <TypographyH2 classname='text-center max-ms:leading-8'>
                      {t('translation.welcomeToBookAnEyeDoctor')}
                    </TypographyH2>
                    <TypographyP classname='mt-[10px] text-center max-ms:leading-8'>
                      {t('translation.authSubTitle')}
                    </TypographyP>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='py-7'>
                          <FormField
                            control={form.control}
                            name='role'
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <SelectDropDown
                                    {...field}
                                    label={t('translation.loginAs')}
                                    options={Loginas}
                                    placeholder='Log in as'
                                    defaultValue={form?.watch('role')}
                                    onChangeValue={field.onChange}
                                    error={errors?.role}
                                  />
                                </FormControl>
                                <FormMessage className='!mt-[2px] mb-0.5 min-h-[21px]' />
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
                                    label={t('translation.emailAddress')}
                                    {...field}
                                    error={errors?.email}
                                    autoComplete='off'
                                    onChange={(e) => {
                                      handleChangeValue(
                                        'email',
                                        e.target.value,
                                      );
                                      setIsUserSelectingStore(false);
                                      hideError('email');
                                    }}
                                  />
                                </FormControl>
                                <FormMessage className='!mt-[2px] mb-0.5 min-h-[21px]' />
                              </FormItem>
                            )}
                          />
                          {form.watch?.('role') === LOGINS.OPTOMETRIST &&
                            isUserSelectingStore &&
                            optometristPractices &&
                            optometristPractices?.length > 0 && (
                              <FormField
                                control={form.control}
                                name='practiceId'
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <SelectDropDown
                                        label={t('translation.selectPractices')}
                                        options={optometristPractices}
                                        placeholder="Select Optometrist's Practice name"
                                        error={errors?.practiceId}
                                        onChangeValue={field.onChange}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage className='!mt-[2px] mb-0.5 min-h-[21px]' />
                                  </FormItem>
                                )}
                              />
                            )}

                          {(form.watch?.('role') !== LOGINS.OPTOMETRIST ||
                            isUserSelectingStore) && (
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
                                  <FormMessage className='!mt-[2px] mb-0.5 min-h-[21px]' />
                                </FormItem>
                              )}
                            />
                          )}
                          <FlexBox classname='flex justify-end'>
                            <Link href={'/forgot-password'}>
                              <TypographyP size={14} classname='cursor-pointer'>
                                {t('translation.forgotPassword')}
                              </TypographyP>
                            </Link>
                          </FlexBox>
                        </div>
                        <Button
                          type='submit'
                          className='mb-[15px] w-full px-[10px] py-6 text-white'
                          loading={loading}
                        >
                          {form.watch?.('role') === LOGINS.OPTOMETRIST &&
                          !isUserSelectingStore
                            ? t('translation.next')
                            : t('translation.logIn')}
                        </Button>
                        <DividerWithOr />
                        <div className='mt-[30px] text-center'>
                          <TypographyH4 size={16}>
                            {t('translation.dontHaveAnAccount')}{' '}
                            <Link
                              href='/signup'
                              className='text-[18px] font-semibold text-primary underline'
                            >
                              {t('translation.registerNow')}{' '}
                            </Link>
                          </TypographyH4>
                        </div>
                      </form>
                    </Form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
