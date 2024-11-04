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
import { Password } from '@/components/ui/password-input';
import { LOGINS } from '@/enums/auth';
import { TLoginForm } from '@/models/types/auth';
import {
  loginFormSchema,
  optometristLoginSchema,
} from '@/models/validations/auth';
import { verifyOTP } from '@/app/api/auth';
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
      role: LOGINS.PRACTICE,
      deviceType: DEVICE_TYPE,
    },
    mode: 'onSubmit',
  });
  const { errors } = form.formState;

  const onSubmit = useCallback(
    async (values: TLoginForm) => {
      try {
        setLoading(true);
        const response = await verifyOTP({
          email: values.email?.toLowerCase(),
          role: LOGINS.PRACTICE,
          otpType: 'log_in',
          password: values.password,
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
      <div className='relative bg-gradient-radial bg-cover bg-center bg-no-repeat'>
        <div className='w-full bg-primary-bg bg-contain bg-center bg-no-repeat'>
          <div className='w-100 flex h-[100vh] min-h-screen flex-col items-center justify-center p-3'>
            <div className='flex flex-col items-center gap-8'>
              <div className='flex justify-center'>
                <div className='flex flex-col items-center'>
                  <Image
                    src={'/assets/logo.svg'}
                    alt={t('translation.logoAlt')}
                    width={200}
                    height={200}
                    className='m-auto md:m-0'
                  />
                  <TypographyP classname='text-white mt-[15px] md:text-left text-center leading-8 text-[24px] xs:text-[20px]'>
                    {t('translation.authTitle')}
                  </TypographyP>
                </div>
              </div>
              <div className='min-h-[30rem] min-w-[600px] rounded-md bg-white p-[30px]'>
                {step === 'verify_otp' ? (
                  <VerifyLoginOtp
                    setStep={setStep}
                    formData={formData}
                    optometristPractices={optometristPractices}
                    isIpadLogin={true}
                  />
                ) : (
                  <>
                    <TypographyH2 classname='text-center max-ms:leading-8'>
                      {t('translation.welcomeToBookAnEyeDoctor')}
                    </TypographyH2>
                    <TypographyP classname='mt-[10px] text-center max-ms:leading-8'>
                      {t('translation.loginAsPractice')}
                    </TypographyP>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='py-7'>
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
                        </div>
                        <Button
                          type='submit'
                          className='mb-[15px] w-full px-[10px] py-6 text-white'
                          loading={loading}
                        >
                          {t('translation.logIn')}
                        </Button>
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
