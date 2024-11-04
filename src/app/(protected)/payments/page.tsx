'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import dayjs from 'dayjs';
import { ColumnDef } from '@tanstack/react-table';

import {
  getAllPayments,
  getBankDetails,
  setBankDetails,
} from '@/app/api/doctor-reader-payments';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import { Button } from '@/components/ui/button';
import Loader from '@/components/custom-loader';
import FlexBox from '@/components/ui/flexbox';
import { getErrorMessage } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { TBankDetails, TPaymentsList } from '@/models/types/payments';
import SharedTable from '@/components/common-layout/shared-table';
import PaymentDetail from '@/components/payment-detail/payment-detail';
import useAccessToken from '@/hooks/useAccessToken';

const DEFAULT_OFFSET = 20;
const DEFAULT_PAGE = 1;

const Payments = () => {
  const [loading, setLoading] = useState(false);
  const [addingDetails, setAddingDetails] = useState(false);
  const [bankInfo, setBankInfo] = useState<TBankDetails>();
  const [pageCount, setPageCount] = useState<number>(DEFAULT_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const [payments, setPayments] = useState<TPaymentsList>();
  const [paymentsList, setPaymentsList] = useState<TPaymentsList[]>([]);
  const [fetchingPayments, setFetchingPayments] = useState(false);
  const [showPaymentDetail, setShowPaymentDetail] = useState<string>('');
  const userAccessToken = useAccessToken();

  const { t } = useTranslation();
  const router = useRouter();

  const userRole = useMemo(() => {
    if (userAccessToken?.role) {
      return userAccessToken?.role;
    }
  }, [userAccessToken?.role]);

  const fetchAllPayments = useCallback(async () => {
    try {
      setFetchingPayments(true);
      const response = await getAllPayments({
        page: DEFAULT_PAGE,
        offset: DEFAULT_OFFSET,
      });
      if (response?.status !== 200) {
        toast.error(t('translation.somethingWentWrong'));
        return;
      }
      if (response?.data?.data?.payments?.length < DEFAULT_OFFSET) {
        setHideLoadMore(true);
      } else {
        setHideLoadMore(false);
      }
      setPayments(response.data?.data);
      setPaymentsList(response.data?.data?.payments);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setFetchingPayments(false);
      setPageCount(DEFAULT_PAGE);
    }
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
      fetchAllPayments();
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

  const addBankDetails = useCallback(async () => {
    setAddingDetails(true);
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
      setAddingDetails(false);
    }
  }, []);

  const onClickViewDetail = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>, data: string) => {
      e.preventDefault();
      setShowPaymentDetail(dayjs(data).format('YYYY-MM-DD'));
    },
    [],
  );

  const handleLoadMore = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      count: number,
    ) => {
      e.preventDefault();
      try {
        setLoadingMore(true);
        const response = await getAllPayments({
          offset: DEFAULT_OFFSET,
          page: count,
        });
        if (response?.status !== 200) {
          toast.error(t('translation.somethingWentWrong'));
          return;
        }
        setPageCount(count);
        if (response?.data?.data?.payments) {
          setPaymentsList((prev) => [...prev, ...response.data.data.payments]);
          if (response?.data?.data?.payments?.length < DEFAULT_OFFSET) {
            setHideLoadMore(true);
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
        setHideLoadMore(true);
      } finally {
        setLoadingMore(false);
      }
    },
    [],
  );

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'createdAt',
      header:
        userRole === 'practice'
          ? t('translation.date')
          : t('translation.monthLabel'),
      cell: ({ row }) => (
        <div className=' w-[150px] truncate'>
          {row.getValue('createdAt')
            ? dayjs(row.getValue('createdAt')).format('D MMM, YYYY')
            : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: t('translation.amount'),
      cell: ({ row }) => (
        <div className='w-[150px] truncate capitalize'>
          £{row.getValue('amount') || 0}
        </div>
      ),
    },
    {
      accessorKey: 'destinationId',
      header: t('translation.accountID'),
      cell: ({ row }) => (
        <div className='w-[150px] truncate capitalize'>
          ****{row.getValue('destinationId')}
        </div>
      ),
    },
    {
      accessorKey: 'viewDetail',
      header: 'Action',
      cell: ({ row }) => (
        <div
          className='w-[100px] cursor-pointer text-primary underline'
          onClick={(e) => {
            onClickViewDetail(e, row?.original?.createdAt);
          }}
        >
          {t('translation.viewDetail')}
        </div>
      ),
    },
  ];

  const goToBankDetails = () => router.push('/payments/bank-details');

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{t('translation.paymentsHead')}</title>
      </Head>
      <div className='px-5 py-[30px] max-ms:px-[16px]'>
        {showPaymentDetail ? (
          <PaymentDetail
            setShowPaymentDetail={setShowPaymentDetail}
            showPaymentDetail={showPaymentDetail}
            userRole={userRole}
          />
        ) : (
          <>
            {!bankInfo?.bankDetails ? (
              <Card className='p-[30px]'>
                <TypographyH2 size={20} classname='max-ms:mb-2'>
                  {t('translation.getStartedWithBEDR')}
                </TypographyH2>
                <FlexBox
                  flex
                  justify='between'
                  centerItems
                  classname='max-nm:flex-col max-nm:gap-4'
                >
                  <TypographyP
                    noBottom
                    primary
                    size={16}
                    classname='font-normal'
                  >
                    {t('translation.paymentsSubheading')}
                  </TypographyP>
                  <Button
                    className='min-w-[200px] px-9 text-[16px] nm:ml-2'
                    onClick={addBankDetails}
                    loading={addingDetails}
                    center
                  >
                    {t('translation.setBankDetails')}
                  </Button>
                </FlexBox>
              </Card>
            ) : (
              <>
                <Card className='w-full p-3'>
                  <FlexBox flex justify='between' centerItems>
                    <FlexBox classname='flex'>
                      <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                        <Image
                          src='assets/payments-small.svg'
                          alt={t('translation.payments')}
                          width={18}
                          height={14}
                          className='m-auto'
                        />
                      </div>
                      <TypographyH2 size={18} classname='!font-medium'>
                        {t('translation.payments')}
                      </TypographyH2>
                    </FlexBox>
                    <Button
                      className='min-w-[200px] bg-transparent text-[16px] nm:ml-2'
                      variant={'outline'}
                      onClick={goToBankDetails}
                      center
                    >
                      {t('translation.bankAccountDetails')}
                    </Button>
                  </FlexBox>
                </Card>
                <Card className='mt-5 p-5'>
                  <FlexBox flex justify='between' centerItems>
                    <FlexBox classname='flex'>
                      <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                        <Image
                          src='assets/pending-payments.svg'
                          alt={t('translation.payments')}
                          width={18}
                          height={14}
                          className='m-auto'
                        />
                      </div>
                      <TypographyH2 size={18} classname='!font-medium'>
                        {userRole === 'practice'
                          ? t('translation.nextMonthPayment')
                          : t('translation.pendingPayment')}
                      </TypographyH2>
                    </FlexBox>
                    <TypographyP
                      noBottom
                      classname='px-8 py-[10px] border border-primary text-primary bg-lightPrimary rounded-[4px]'
                    >
                      £{payments?.balance || 0}
                    </TypographyP>
                  </FlexBox>
                </Card>
                <Card className='mt-[30px] p-5'>
                  <FlexBox classname='flex mb-8'>
                    <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                      <Image
                        src='assets/pending-payments.svg'
                        alt={t('translation.payments')}
                        width={18}
                        height={14}
                        className='m-auto'
                      />
                    </div>
                    <TypographyH2 size={18} classname='!font-medium'>
                      {t('translation.totalPayments')}
                      <span className='ms-1 text-primary'>
                        £{payments?.totalPaymentAmount || 0}
                      </span>
                    </TypographyH2>
                  </FlexBox>
                  <SharedTable
                    data={paymentsList || []}
                    columns={columns}
                    loading={fetchingPayments}
                  />
                  {!hideLoadMore && paymentsList?.length > 0 && (
                    <FlexBox
                      flex
                      centerItems
                      centerContent
                      classname='mt-[40px]'
                    >
                      <Button
                        variant={'outline'}
                        className='min-h-[40px] min-w-[114px] text-[16px]'
                        onClick={(e) => {
                          handleLoadMore(e, pageCount + DEFAULT_PAGE);
                        }}
                        loading={loadingMore}
                        center
                      >
                        {t('translation.loadMore')}
                      </Button>
                    </FlexBox>
                  )}
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Payments;
