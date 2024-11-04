'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { FieldPath, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { TResetPasswordForm } from '@/models/types/auth';
import { resetPasswordFormSchema } from '@/models/validations/auth';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import { Password } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { DividerWithOr } from '@/components/ui/divider-or';
import { resetPassword } from '@/app/api/auth';
import { getErrorMessage } from '@/lib/utils';
import PasswordInstructions from '@/components/custom-components/password-instructions';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const form = useForm<TResetPasswordForm>({
    resolver: yupResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onSubmit',
  });

  const param = useSearchParams();
  const { errors } = form.formState;

  const onSubmit = async (values: TResetPasswordForm) => {
    try {
      setLoading(true);
      if (param.get('token')) {
        const response = await resetPassword({
          token: param.get('token') || '',
          password: values?.password,
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
        } else {
          toast.success('Password reset successful.');
          router.push('/login');
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  const hideError = (name: FieldPath<TResetPasswordForm>) =>
    form.clearErrors(name);

  const handleChangeValue = (
    name: FieldPath<TResetPasswordForm>,
    value: string,
  ) => form.setValue(name, value);

  return (
    <>
      <Head>
        <title>{t('translation.resetPasswordHead')}</title>
      </Head>
      <div className='bg-white p-5'>
        <div className='md:absolute md:top-5'>
          <Image
            src={'/assets/logo-blue.svg'}
            alt={t('translation.logoAlt')}
            width={190}
            height={156}
            className='m-auto md:m-0'
          />
        </div>
        <div className='container mx-auto max-w-[480px] p-[19px] md:my-32 md:mt-24 md:p-[30px]'>
          <div className='m-auto max-w-[662px]'>
            <TypographyH2 center>
              {t('translation.welcomeToBookAnEyeDoctor')}
            </TypographyH2>
            <TypographyP center classname='mb-2 mt-[10px]'>
              {t('translation.resetPasswordSubTitle')}
            </TypographyP>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='py-7'>
                  <TypographyP classname='mb-[15px] text-[14px] !text-darkGray font-semibold'>
                    {t('translation.resetYourPassword')}
                  </TypographyP>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Password
                            type='password'
                            label={t('translation.enterNewPassword')}
                            error={errors?.password}
                            {...field}
                            onChange={(e) => {
                              handleChangeValue('password', e.target.value);
                              hideError('password');
                            }}
                          />
                        </FormControl>
                        <FormMessage className='mb-1.5 mt-0.5 min-h-[7px]' />
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
                            label={t('translation.confirmNewPassword')}
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
                        <FormMessage className='mb-1.5 mt-0.5 min-h-[7px]' />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type='submit'
                  className='mb-[25px] w-full px-[10px] py-6 text-white'
                  loading={loading}
                >
                  {t('translation.save')}
                </Button>
                <PasswordInstructions />
                <DividerWithOr />
                <TypographyP
                  center
                  size={16}
                  classname='mt-[25px] text-darkGray'
                >
                  {t('translation.alreadyHaveAccount')}{' '}
                  <Link
                    href='/login'
                    className='text-[18px] font-semibold text-primary underline'
                  >
                    {t('translation.loginNow')}{' '}
                  </Link>
                </TypographyP>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
