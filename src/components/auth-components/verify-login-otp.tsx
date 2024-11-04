'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldPath, useForm } from 'react-hook-form';
import Link from 'next/link';
import { Route } from 'next';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TypographyP } from '../ui/typography/p';
import { TLoginForm, TVerifyOtpFrom } from '@/models/types/auth';
import { verifyOtpFormSchema } from '@/models/validations/auth';
import { TypographyH2 } from '../ui/typography/h2';
import { loginUser } from '@/app/api/auth';
import { setValuesInCookies } from '@/lib/common/manage-cookies';
import { useAppDispatch } from '@/lib/hooks';
import { getErrorMessage, goToDefaultRoutes } from '@/lib/utils';
import { userAccessTokenIpad } from '@/lib/userAuthentication/userIpadAuthenticationSlice';
import { setAccessToken } from '@/lib/userAuthentication/userAuthenticationSlice';
import { LOGINS } from '@/enums/auth';
import { setAcceptedClinicRules } from '@/lib/clinicRules/clinicRulesSlice';

type TPracticesOptions = {
  label: string;
  value: string;
};
interface IProps {
  setStep: Dispatch<SetStateAction<'' | 'verify_otp'>>;
  formData: TLoginForm | undefined;
  optometristPractices?: TPracticesOptions[] | null;
  isIpadLogin?: boolean;
}

const VerifyLoginOtp = ({
  setStep,
  formData,
  optometristPractices,
  isIpadLogin = false,
}: IProps) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const form = useForm<TVerifyOtpFrom>({
    resolver: yupResolver(verifyOtpFormSchema),
    defaultValues: {
      email: formData ? formData?.email : '',
    },
    mode: 'onSubmit',
  });

  const pathname = usePathname();

  useEffect(() => {
    if (formData?.otp) {
      form?.setValue('oneTimePassword', formData?.otp);
    }
  }, [formData]);

  const { errors } = form.formState;

  const onSubmit = useCallback(
    async (values: TVerifyOtpFrom) => {
      setLoading(true);
      if (!formData) {
        return;
      }
      try {
        const response = await loginUser({
          ...formData,
          email: formData?.email?.toLowerCase(),
          otp: values?.oneTimePassword,
          otpType: 'log_in',
        });

        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
        } else {
          const responseData = response?.data?.data;
          const { accessToken, publicKey, refreshToken, privateKey } =
            responseData;

          if (accessToken || publicKey || privateKey || refreshToken) {
            setValuesInCookies(
              `${isIpadLogin ? `ipadAccessToken` : 'accessToken'}`,
              accessToken,
            );
            setValuesInCookies(
              `${isIpadLogin ? `ipadPublicKey` : `publicKey`}`,
              publicKey,
            );
            setValuesInCookies(
              `${isIpadLogin ? `ipadPrivateKey` : `privateKey`}`,
              privateKey,
            );
            {
              !isIpadLogin && setValuesInCookies(`role`, formData?.role);
            }

            dispatch(
              isIpadLogin
                ? userAccessTokenIpad({
                    accessToken,
                    role: formData?.role,
                    publicKey,
                    privateKey,
                    refreshToken,
                  })
                : setAccessToken({
                    accessToken,
                    role: formData?.role,
                    publicKey,
                    privateKey,
                    refreshToken,
                  }),
            );
          }
          if (refreshToken) {
            setValuesInCookies(
              `${isIpadLogin ? `ipadRefreshToken` : `refreshToken`}`,
              refreshToken,
            );
          }
          if (
            optometristPractices &&
            optometristPractices?.length > 0 &&
            formData?.practiceId
          ) {
            setValuesInCookies('practiceId', formData?.practiceId);
            setValuesInCookies(
              'practiceName',
              optometristPractices?.find(
                (item) => item?.value === formData?.practiceId,
              )?.label || '',
            );
          }
          if (
            formData?.role === LOGINS.DOCTOR ||
            formData?.role === LOGINS.READER
          ) {
            dispatch(
              setAcceptedClinicRules(
                responseData?.clinicTermsAndConditions || 0,
              ),
            );
          }
          const getRoute = goToDefaultRoutes(
            formData?.role || 'doctor',
            pathname,
          );
          router.push(getRoute as Route);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },
    [formData, optometristPractices, isIpadLogin],
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

  return (
    <>
      <TypographyH2>{t('translation.welcomeToBookAnEyeDoctor')}</TypographyH2>
      <TypographyP classname='mt-[10px]'>
        {t('translation.pleaseCheckYourEmail')}
      </TypographyP>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className='py-7'>
            <FormField
              control={form.control}
              name='email'
              render={() => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled
                      type='text'
                      label={t('translation.emailAddress')}
                      value={formData?.email}
                      error={errors?.email}
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
          <Link href={isIpadLogin ? '/ipad/login' : '/login'}>
            <TypographyP
              center
              classname='underline text-sm font-light text-primary mb-[21px]'
              onClick={() => setStep('')}
            >
              {t('translation.backToLogin')}
            </TypographyP>
          </Link>
        </form>
      </Form>
    </>
  );
};

export default VerifyLoginOtp;
