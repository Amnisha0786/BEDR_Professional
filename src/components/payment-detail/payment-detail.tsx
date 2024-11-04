import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import Image from 'next/image';
import { toast } from 'sonner';

import SharedTable from '@/components/common-layout/shared-table';
import { Card } from '../ui/card';
import FlexBox from '../ui/flexbox';
import { TypographyH2 } from '../ui/typography/h2';
import { Button } from '../ui/button';
import { getMonthlyPayments } from '@/app/api/doctor-reader-payments';
import { getErrorMessage } from '@/lib/utils';
import { TPaymentDetail } from '@/models/types/payments';

const DEFAULT_OFFSET = 15;
const DEFAULT_PAGE = 1;

type IProp = {
  setShowPaymentDetail: Dispatch<SetStateAction<string>>;
  showPaymentDetail: string;
  userRole?: string;
};

const PaymentDetail = ({
  setShowPaymentDetail,
  showPaymentDetail,
  userRole,
}: IProp) => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<TPaymentDetail>();
  const [fetchingPayments, setFetchingPayments] = useState(false);

  const fetchMonthlyPayments = useCallback(async () => {
    try {
      setFetchingPayments(true);
      const response = await getMonthlyPayments({
        month: showPaymentDetail,
        page: DEFAULT_PAGE,
        offset: DEFAULT_OFFSET,
      });
      if (response?.status !== 200) {
        toast.error('Something went wrong!');
        return;
      }
      setPayments(response.data?.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Something went wrong!');
    } finally {
      setFetchingPayments(false);
    }
  }, [showPaymentDetail]);

  useEffect(() => {
    if (showPaymentDetail) {
      fetchMonthlyPayments();
    }
  }, [fetchMonthlyPayments, showPaymentDetail]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'createdAt',
      header: t('translation.date'),
      cell: ({ row }) => (
        <div className=' w-[100px] truncate'>
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
        <div className='w-[100px] truncate capitalize'>
          £{row.getValue('amount') || 0}
        </div>
      ),
    },
    {
      accessorKey: 'transferId',
      header: t('translation.transacationID'),
      cell: ({ row }) => (
        <div className='w-[150px] capitalize'>{row.getValue('transferId')}</div>
      ),
    },
  ];

  if (userRole === 'practice') {
    columns.splice(1, 0, {
      accessorKey: 'patientFirstName',
      header: t('translation.patientName'),
      cell: ({ row }) => (
        <div className='w-[100px] truncate capitalize'>
          {`${row.original?.patientFirstName || ''} ${row.original?.patientLastName || ''}`}
        </div>
      ),
    });
    columns?.push({
      accessorKey: 'amount',
      header: t('translation.optometrist'),
      cell: ({ row }) => (
        <div className='w-[100px] truncate capitalize'>
          {`${row.original?.optometristFirstName || ''} ${row.original?.optometristLastName || ''}`}
        </div>
      ),
    });
  }

  return (
    <div>
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
            className=' bg-transparent text-[16px] nm:ml-2'
            variant={'outline'}
            onClick={() => setShowPaymentDetail('')}
            center
          >
            {t('translation.back')}
          </Button>
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
            <span className='text-primary'> £{payments?.totalPayment}</span>
          </TypographyH2>
        </FlexBox>
        <SharedTable
          data={payments?.payments || []}
          columns={columns}
          loading={fetchingPayments}
        />
      </Card>
    </div>
  );
};

export default PaymentDetail;
