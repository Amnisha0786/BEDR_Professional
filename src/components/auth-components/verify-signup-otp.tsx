'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldPath, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { toast } from 'sonner';
import { Route } from 'next';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { DividerWithOr } from '../ui/divider-or';
import { TypographyH4 } from '../ui/typography/h4';
import { TypographyP } from '../ui/typography/p';
import { TSignupForm, TVerifyOtpFrom } from '@/models/types/auth';
import { verifyOtpFormSchema } from '@/models/validations/auth';
import { registerNewUser } from '@/app/api/auth';
import { getErrorMessage, goToDefaultRoutes } from '@/lib/utils';
import { setValuesInCookies } from '@/lib/common/manage-cookies';
import { useAppDispatch } from '@/lib/hooks';
import { setAccessToken } from '@/lib/userAuthentication/userAuthenticationSlice';
import { DEVICE_TYPE } from '@/lib/constants/shared';
import { LOGINS } from '@/enums/auth';
import PendingApprovalModal from './pending-approval-modal';
import { Dialog } from '../ui/dialog';

interface IProps {
  setStep: Dispatch<SetStateAction<'' | 'verify_otp'>>;
  formData?: TSignupForm;
}

const VerifySignupOtp = ({ setStep, formData }: IProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const form = useForm<TVerifyOtpFrom>({
    resolver: yupResolver(verifyOtpFormSchema),
    defaultValues: {
      email: formData?.email || formData?.contactPersonEmail,
    },
    mode: 'onSubmit',
  });
  const { errors } = form.formState;

  useEffect(() => {
    if (formData?.otp) {
      form?.setValue('oneTimePassword', formData?.otp);
    }
  }, [formData]);

  const onSubmit = useCallback(
    async (values: TVerifyOtpFrom) => {
      try {
        setLoading(true);
        if (!formData) {
          return;
        }
        const response = await registerNewUser({
          ...formData,
          otp: values?.oneTimePassword,
          email: formData?.email || '',
          otpType: 'sign_up',
          deviceType: DEVICE_TYPE,
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        const responseData = response?.data?.data;
        const { accessToken, publicKey, refreshToken, privateKey } =
          responseData;

        if (
          responseData?.role === LOGINS.DOCTOR ||
          responseData?.role === LOGINS.READER ||
          responseData?.role === LOGINS.PRACTICE
        ) {
          setOpen(true);
          return;
        }

        if (accessToken || publicKey || privateKey) {
          setValuesInCookies('accessToken', accessToken);
          setValuesInCookies('publicKey', publicKey);
          setValuesInCookies('privateKey', privateKey);
          setValuesInCookies('role', formData?.role);
          dispatch(
            setAccessToken({
              accessToken,
              role: formData?.role,
              publicKey,
              privateKey,
              refreshToken,
            }),
          );
        }
        if (refreshToken) {
          setValuesInCookies('refreshToken', refreshToken);
        }
        const getRoute = goToDefaultRoutes(formData?.role || '');
        router.push(getRoute as Route);
        toast.success(t('translation.registrationSuccessfull'));
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },
    [formData],
  );

  const hideError = useCallback(
    (name: FieldPath<TVerifyOtpFrom>) => form.clearErrors(name),
    [],
  );

  const handleChangeValue = useCallback(
    (name: FieldPath<TVerifyOtpFrom>, value: string) =>
      form.setValue(name, value),
    [],
  );

  const handleConfirm = () => router.push('/login');

  return (
    <div className='m-auto max-w-[430px]'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='py-7'>
            <TypographyP classname='mb-[15px] text-[14px] !text-darkGray font-semibold'>
              {t('translation.verifyOtp')}
            </TypographyP>
            <TypographyP size={16}>
              ({t('translation.sentToEmail')})
            </TypographyP>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled
                      type='text'
                      label={t('translation.emailAddress')}
                      error={errors?.email}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='mb-1.5 mt-0.5 min-h-[7px]' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='oneTimePassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='text'
                      label={t('translation.enterOneTimePassword')}
                      error={errors?.oneTimePassword}
                      {...field}
                      onChange={(e) => {
                        handleChangeValue('oneTimePassword', e.target.value);
                        hideError('oneTimePassword');
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
            className='mb-[21px] w-full px-[10px] py-6 text-white'
            loading={loading}
          >
            {t('translation.verify')}
          </Button>
          <Link href={'/signup'}>
            <TypographyP
              center
              classname='underline text-sm font-light text-primary mb-[21px]'
              onClick={() => setStep('')}
            >
              {t('translation.backToSignup')}
            </TypographyP>
          </Link>
          <DividerWithOr />
          <div className='mt-[30px] text-center'>
            <TypographyH4 size={16}>
              {t('translation.alreadyHaveAccount')}{' '}
              <Link
                href='/login'
                className='text-[18px]  font-semibold text-primary underline'
              >
                {t('translation.loginNow')}{' '}
              </Link>
            </TypographyH4>
          </div>
        </form>
      </Form>
      <Dialog open={open} onOpenChange={setOpen}>
        <PendingApprovalModal
          handleConfirm={handleConfirm}
          role={formData?.role}
        />
      </Dialog>
    </div>
  );
};

export default VerifySignupOtp;
