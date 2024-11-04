'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';
import { toast } from 'sonner';
import dayjs from 'dayjs';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import TypographyList from '@/components/ui/typography/list';
import Loader from '@/components/custom-loader';
import { getErrorMessage } from '@/lib/utils';
import { getOptometristDashboardData } from '@/app/api/availability';
import { TOptometristDashboard } from '@/models/types/optometrist-dashboard';
import { DATE_FORMAT } from '@/lib/common/dob-validation';
import { TAvailableConsultants } from '@/models/types/todays-clinics';
import { getPerformanceData } from '@/app/api/performance-data';
import { PERFORMANCE_DATA_FOR } from '@/enums/performance-data';
import { TPerformanceData } from '@/models/types/performance-data';
import useOptometristPractice from '@/hooks/useOptometristPractice';

const TODAY = dayjs().format(DATE_FORMAT);

const Availability = () => {
  const [dashboardData, setDashboardData] = useState<TOptometristDashboard>();
  const [performanceData, setPerformanceData] =
    useState<TPerformanceData | null>(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();
  const practice = useOptometristPractice();
  const router = useRouter();

  const fetchDasboardData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOptometristDashboardData();

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setDashboardData(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDasboardData();
  }, [fetchDasboardData]);

  const fetchPerformanceData = useCallback(async () => {
    if (!practice?.practiceId) {
      return;
    }
    setLoading(true);
    try {
      const response = await getPerformanceData({
        performanceDataFor:
          PERFORMANCE_DATA_FOR?.YESTERDAY as PERFORMANCE_DATA_FOR,
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
  }, [practice]);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  const filteredTeam = useMemo(() => {
    const todaysData: TAvailableConsultants[] = [];
    const tommorrowsData: TAvailableConsultants[] = [];
    dashboardData?.availableConsultants?.map((item) => {
      if (item?.date === TODAY) {
        todaysData?.push(item);
      } else {
        tommorrowsData?.push(item);
      }
    });

    return { todaysData, tommorrowsData };
  }, [dashboardData]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{t('translation.availabilityHead')}</title>
      </Head>
      <div className='px-[30px] py-[30px] md:px-[43px]'>
        <Card className='mb-5 w-full p-3 md:w-[744px]'>
          <FlexBox classname='flex' centerItems>
            <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='assets/availablity.svg'
                alt='availability'
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyH2 size={18}>
              {t('translation.availability')}
            </TypographyH2>
          </FlexBox>
        </Card>
        <div className='my-5 flex  flex-wrap gap-5'>
          <Card className='min-h-[255px] w-full  md:w-[362px]'>
            <CardHeader>
              <CardTitle className='text-center text-[17px] leading-7'>
                {t('translation.medicalRetinaClinic')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-center text-[45px] font-semibold text-primary'>
                £120
              </div>
            </CardContent>
            <CardFooter className='flex flex-col text-center'>
              {t('translation.nextDayDiagnosis')}
            </CardFooter>
          </Card>
          <Card className='min-h-[155px] w-full  md:w-[362px]'>
            <CardHeader>
              <CardTitle className='text-center text-[17px] leading-7'>
                {t('translation.filesWereDiagnosed', {
                  filesDiagnosed: performanceData?.filesDiagnosed,
                  files:
                    performanceData?.filesDiagnosed &&
                    performanceData?.filesDiagnosed > 1
                      ? 'files'
                      : 'file',
                })}
              </CardTitle>
            </CardHeader>
            <CardFooter className='mb-2 justify-end'>
              <Button
                variant='outline'
                className='m-auto'
                onClick={() => router.push('/availability/performance-data')}
              >
                {t('translation.performanceData')}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <FlexBox classname='flex-wrap justify-start gap-5'>
          <Accordion
            type='single'
            collapsible
            className='mb-[20px] self-start rounded-[10px] bg-white px-5 shadow-md md:mb-0 md:w-[362px]'
          >
            <AccordionItem value='item-1'>
              <AccordionTrigger className='!text-darkGray'>
                {t('translation.todaysTeamConsultants', {
                  total: filteredTeam?.todaysData?.length || 0,
                })}
              </AccordionTrigger>
              <AccordionContent className='h-[400px] overflow-y-auto'>
                <TypographyList
                  lists={filteredTeam?.todaysData || []}
                  hideIcon={true}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion
            type='single'
            collapsible
            className='self-start rounded-[10px] bg-white px-5 shadow-md md:w-[362px]'
          >
            <AccordionItem value='item-2'>
              <AccordionTrigger className='!text-darkGray'>
                {t('translation.tomorrowsTeamConsultants', {
                  total: filteredTeam?.tommorrowsData?.length || 0,
                })}
              </AccordionTrigger>
              <AccordionContent className='h-[400px] overflow-y-auto'>
                <TypographyList
                  lists={filteredTeam?.tommorrowsData || []}
                  hideIcon={true}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </FlexBox>
      </div>
    </>
  );
};

export default Availability;
