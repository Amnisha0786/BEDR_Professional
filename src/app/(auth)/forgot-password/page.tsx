'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { forgotPassword } from '@/app/api/auth';
import { Loginas } from '@/lib/constants/data';
import { Button } from '@/components/ui/button';
import { DividerWithOr } from '@/components/ui/divider-or';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectDropDown } from '@/components/ui/select';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import { LOGINS } from '@/enums/auth';
import { getErrorMessage } from '@/lib/utils';
import { TForgotPasswordForm } from '@/models/types/auth';
import { forgotPasswordFormSchema } from '@/models/validations/auth';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const form = useForm<TForgotPasswordForm>({
    resolver: yupResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
      role: LOGINS?.OPTOMETRIST,
    },
    mode: 'onSubmit',
  });
  const { errors } = form.formState;

  const onSubmit = async (values: TForgotPasswordForm) => {
    try {
      setLoading(true);
      const response = await forgotPassword(values);
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
      } else {
        toast.success(response?.data?.data);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>{t('translation.forgotPasswordHead')}</title>
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
        <div className='container mx-auto max-w-[460px] p-[19px] md:my-32 md:mt-24 md:p-[30px]'>
          <div className='m-auto max-w-[662px]'>
            <TypographyH2 center>
              {t('translation.forgotPasswordWithoutQuestion')}
            </TypographyH2>
            <TypographyP center classname='mt-[10px]'>
              {t('translation.forgotPasswordSubTitle')}
            </TypographyP>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='py-5'>
                  <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <SelectDropDown
                            {...field}
                            label={t('translation.resetAs')}
                            options={Loginas}
                            placeholder='Reset as'
                            defaultValue={LOGINS.OPTOMETRIST}
                            onChangeValue={field.onChange}
                            error={errors?.role}
                          />
                        </FormControl>
                        <FormMessage className='mb-1.5 mt-0.5 min-h-[7px]' />
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
                            error={errors?.email}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='mb-0 mt-0.5 min-h-[21px]' />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type='submit'
                  className='mb-[21px] w-full px-[10px] py-6 text-white'
                  loading={loading}
                >
                  {t('translation.sendMail')}
                </Button>
                <DividerWithOr />
                <TypographyP
                  center
                  size={16}
                  classname='mt-[25px] text-darkGray'
                >
                  {t('translation.backTo')}{' '}
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

export default ForgotPassword;
