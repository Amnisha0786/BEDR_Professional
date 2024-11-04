'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { getPerformanceData } from '@/app/api/performance-data';
import { getErrorMessage } from '@/lib/utils';
import Loader from '@/components/custom-loader';
import useOptometristPractice from '@/hooks/useOptometristPractice';
import {
  PERFORMANCE_DATA_FOR,
  PERFORMANCE_TABS,
} from '@/enums/performance-data';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TypographyP } from '@/components/ui/typography/p';
import DataPreview from '@/components/performance-data/data-preview';
import { TPerformanceData } from '@/models/types/performance-data';
import { IOptions } from '@/models/types/shared';

const PerformanceData = () => {
  const { t } = useTranslation();
  const practice = useOptometristPractice();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] =
    useState<TPerformanceData | null>(null);
  const [currentTab, setCurrentTab] = useState<IOptions>({
    label: t('translation.yesterdayLabel'),
    value: PERFORMANCE_DATA_FOR.YESTERDAY,
  });

  const fetchPerformanceData = useCallback(async () => {
    if (!practice?.practiceId || !currentTab?.value) {
      return;
    }
    setLoading(true);
    try {
      const response = await getPerformanceData({
        performanceDataFor: currentTab?.value as PERFORMANCE_DATA_FOR,
        practiceId: practice?.practiceId,
      });

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setPerformanceData(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, [practice, currentTab]);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  const handleSelectTab = (item: IOptions) => {
    setCurrentTab(item);
  };

  return (
    <>
      <Head>
        <title>{t('translation.performanceDataHead')}</title>
      </Head>
      <div className='px-4 py-[30px] md:px-[43px]'>
      <Card className='w-full p-3'>
        <FlexBox flex classname='items-end justify-between pb-1'>
          <FlexBox flex>
            <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='../assets/todays-files.svg'
                alt={t('translation.files')}
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyH2 size={18}>
              {t('translation.performanceData')}
            </TypographyH2>
          </FlexBox>
          <Button
            variant={'outline'}
            className='bg-transparent'
            onClick={() => router.back()}
          >
            {t('translation.back')}
          </Button>
        </FlexBox>
        </Card>
        <Card className='min-h-[200px] justify-start bg-transparent py-5 shadow-none max-ms:px-[10px] ms:px-5'>
          <CardContent className='w-full !p-0'>
            <FlexBox
              flex
              classname='overflow-x-auto scroll-smooth gap-5 w-full'
            >
              {PERFORMANCE_TABS?.map((item, index) => (
                <TypographyP
                  key={index}
                  primary
                  noBottom
                  size={16}
                  classname={`cursor-pointer   !font-bold py-1.5 flex-none hover:!border-b ${currentTab?.value === item?.value && 'border-b text-primary'}`}
                  onClick={() => handleSelectTab(item)}
                >
                  {item?.label || ''}
                </TypographyP>
              ))}
            </FlexBox>
            {loading ? (
              <Loader className='!items-start pt-20'  size={30} />
            ) : (
              <DataPreview
                currentTab={currentTab}
                performanceData={performanceData}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PerformanceData;
