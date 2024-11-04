'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  deleteBankAccount,
  getBankDetails,
  setBankDetails,
} from '@/app/api/doctor-reader-payments';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import { getErrorMessage } from '@/lib/utils';
import { TBankDetails } from '@/models/types/payments';
import CustomAlertBox from '@/components/custom-components/custom-alert-box';
import { AlertDialog } from '@/components/ui/alert-dialog';

const BankAccountDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bankInfo, setBankInfo] = useState<TBankDetails>();
  const [open, setOpen] = useState(false);

  const form = useForm<any>({
    defaultValues: {},
    mode: 'onSubmit',
  });
  const { errors } = form.formState;

  const addBankDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await setBankDetails();
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      router?.push(responseData?.redirectUrl);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, []);

  const onProceed = useCallback(async () => {
    try {
      setLoading(true);
      const response = await deleteBankAccount();
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      addBankDetails();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = useCallback(async () => {
    setOpen(true);
  }, []);

  const fetchBankDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getBankDetails();
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setBankInfo(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBankDetails();
  }, [fetchBankDetails]);

  const goToPayments = () => router.push('/payments');

  return (
    <div className='px-5 py-[30px] max-ms:px-[16px]'>
      <Card className='min-h-[700px] p-5'>
        <FlexBox flex classname='flex-row-reverse'>
          <Button
            variant={'outline'}
            className='ml-auto text-[16px]'
            onClick={goToPayments}
          >
            {t('translation.back')}
          </Button>
          <div className='max-w-[800px]'>
            <TypographyH2 size={20}>
              {t('translation.bankAccountDetails')}
            </TypographyH2>
            <TypographyP noBottom classname='text-[16px] font-normal mt-[10px]'>
              {t('translation.bankAccountDescription')}
            </TypographyP>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='mt-[35px]'
              >
                <FlexBox classname='flex flex-col md:w-[353px] nm:w-[353px]'>
                  <FormField
                    control={form.control}
                    name='accountNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type='text'
                            label={t('translation.accountNumberLabel')}
                            {...field}
                            value={
                              bankInfo?.bankDetails?.lastFourDigits
                                ? `****${bankInfo?.bankDetails?.lastFourDigits}`
                                : ''
                            }
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='sortCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type='text'
                            label={t('translation.sortCodeLabel')}
                            {...field}
                            value={bankInfo?.bankDetails?.sortCode || ''}
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    loading={loading}
                    disabled={loading}
                    className='mt-4 !py-6 text-[16px]'
                  >
                    {t('translation.change')}
                  </Button>
                </FlexBox>
              </form>
            </Form>
          </div>
        </FlexBox>
      </Card>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <CustomAlertBox
          loading={false}
          setOpen={setOpen}
          handleConfirm={() => {
            onProceed();
          }}
          title={t('translation.youWantToDeleteThisAccount')}
          className='w-[464px] p-[40px]'
          confirmButtonText='Proceed'
        />
      </AlertDialog>
    </div>
  );
};

export default BankAccountDetails;
