'use client';

import React, { useState } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';

import { Card } from '../ui/card';
import { getErrorMessage } from '@/lib/utils';
import { TypographyP } from '../ui/typography/p';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Password } from '../ui/password-input';
import { Button } from '../ui/button';
import PasswordInstructions from '../custom-components/password-instructions';
import { changeUserPassword } from '@/app/api/settings';
import { TChangePassword } from '@/models/types/settings';
import { changePasswordFormSchema } from '@/models/validations/settings';

const SettingsChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const form = useForm<TChangePassword>({
    resolver: yupResolver(changePasswordFormSchema),
    defaultValues: {
      password: '',
      currentPassword: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
  });

  const { t } = useTranslation();
  const { errors } = form.formState;

  const onSubmit = async (values: TChangePassword) => {
    try {
      setLoading(true);
      const response = await changeUserPassword(values);
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      form.reset();
      toast.success(t('translation.passwordChangesSuccess'));
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      if (error?.response?.status === 400) {
        setPasswordErrorMessage(errorMessage);
      } else {
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      }
    } finally {
      setLoading(false);
    }
  };

  const hideError = (name: FieldPath<TChangePassword>) => {
    form.clearErrors(name), setPasswordErrorMessage('');
  };

  const handleChangeValue = (name: FieldPath<TChangePassword>, value: string) =>
    form.setValue(name, value);
  return (
    <Card className='min-h-[855px] p-5'>
      <div className='min-h-[500px] w-full flex-col md:max-w-[580px]'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <TypographyP
                noBottom
                classname='text-[14px] !text-darkGray font-semibold'
              >
                {t('translation.changePassword')}
              </TypographyP>
              <TypographyP primary size={16} classname='mb-5 font-normal'>
                {t('translation.passwordDescription')}
              </TypographyP>
              <div className='mb-4 max-w-[352px]'>
                <FormField
                  control={form.control}
                  name='currentPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Password
                          type='password'
                          label={t('translation.currentPassword')}
                          error={errors?.currentPassword}
                          {...field}
                          onChange={(e) => {
                            handleChangeValue(
                              'currentPassword',
                              e.target.value,
                            );
                            hideError('currentPassword');
                          }}
                        />
                      </FormControl>
                      {passwordErrorMessage ? (
                        <p
                          className={
                            'mb-[16px] mt-[4px] min-h-[21px] text-[14px] font-normal leading-normal text-error'
                          }
                        >
                          {passwordErrorMessage}
                        </p>
                      ) : (
                        <FormMessage className='mb-1.5 mt-0.5 !min-h-[21px]' />
                      )}
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
                          label={t('translation.enterNewPassword')}
                          error={errors?.password}
                          {...field}
                          onChange={(e) => {
                            handleChangeValue('password', e.target.value);
                            hideError('password');
                          }}
                        />
                      </FormControl>
                      <FormMessage className='mb-1.5 mt-0.5 !min-h-[21px]' />
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
                      <FormMessage className='mb-1.5 mt-0.5 !min-h-[21px]' />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <PasswordInstructions hideHeading={true} />
            <Button
              type='submit'
              className='mb-[25px] w-[352px] rounded-[6px] !py-6 px-[10px] text-[16px] font-semibold text-white max-ms:w-full'
              loading={loading}
            >
              {t('translation.changePassword')}
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default SettingsChangePassword;
