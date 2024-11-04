'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import Loader from '@/components/custom-loader';
import { getErrorMessage } from '@/lib/utils';
import { getPracticeOverviewData } from '@/app/api/overview';
import { TOverview } from '@/models/types/overview';
import { OVERVIEW_FILE_NAME } from '@/enums/overview';
import useUserProfile from '@/hooks/useUserProfile';
import AddBankAccountCard from '@/components/common-layout/add-bank-account';

const Overview = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardDetails, setDashboardDetails] = useState<TOverview>();

  const { t } = useTranslation();
  const router = useRouter();
  const user = useUserProfile();

  const fetchOverviewDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPracticeOverviewData();

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setDashboardDetails(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverviewDetails();
  }, [fetchOverviewDetails]);

  const boxColorRed = '!text-error border-error bg-lightError';
  const boxColorGreen = '!text-green border-green bg-lightGreen';

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{t('translation.overviewHead')}</title>
      </Head>
      <div className='px-[30px] py-[30px] md:px-[56px]'>
        {!user?.stripeAccountLinked && <AddBankAccountCard />}
        <Card className='w-full p-3'>
          <FlexBox classname='flex'>
            <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='assets/overview-small.svg'
                alt={t('translation.overview')}
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyH2 size={18}>{t('translation.overview')}</TypographyH2>
          </FlexBox>
        </Card>
        <div className='my-[30px] grid grid-cols-small-one justify-start gap-[15px] max-xxl:grid-cols-small-three max-nm:grid-cols-small-one md:gap-[30px] xxl:grid-cols-small-four'>
          <Card className='min-h-[255px] justify-center'>
            <CardContent className='mx-auto mb-0 !py-0 pt-6 text-center text-[17px] leading-7'>
              <TypographyP noBottom size={17} center classname='font-semibold'>
                {t('translation.unreadReports')}
              </TypographyP>
              <TypographyP
                noBottom
                size={22}
                classname={`px-3 py-2 mt-6 max-w-[60px] font-semibold mx-auto border rounded-[4px] ${+(dashboardDetails?.unreadDiagnosisReports || 0) > 0 ? boxColorRed : boxColorGreen}`}
              >
                {dashboardDetails?.unreadDiagnosisReports || 0}
              </TypographyP>
            </CardContent>
            <CardFooter className='mb-2 mt-[30px] justify-center !py-0'>
              <Button
                variant='outline'
                className='w-[180px] !py-2 text-[16px]'
                loading={false}
                center
                onClick={() =>
                  router.push(
                    `/overview/view/${OVERVIEW_FILE_NAME.UNREAD_ACTION}`,
                  )
                }
              >
                {t('translation.view')}
              </Button>
            </CardFooter>
          </Card>

          <Card className='min-h-[255px] justify-center'>
            <CardContent className='mx-auto mb-0 !py-0 pt-6 text-center text-[17px] leading-7'>
              <TypographyP noBottom size={17} center classname='font-semibold'>
                {t('translation.urgentReferralsAction')}
              </TypographyP>
              <TypographyP
                noBottom
                size={22}
                classname={`px-3 py-2 mt-6 max-w-[60px] font-semibold mx-auto border rounded-[4px] ${+(dashboardDetails?.urgentReferralsRequiringAction || 0) > 0 ? boxColorRed : boxColorGreen}`}
              >
                {dashboardDetails?.urgentReferralsRequiringAction || 0}
              </TypographyP>
            </CardContent>
            <CardFooter className='mb-2 mt-[30px] justify-center !py-0'>
              <Button
                variant='outline'
                className='w-[180px] !py-2 text-[16px]'
                loading={false}
                center
                onClick={() =>
                  router.push(
                    `/overview/view/${OVERVIEW_FILE_NAME.URGENT_ACTION}`,
                  )
                }
              >
                {t('translation.view')}
              </Button>
            </CardFooter>
          </Card>

          <Card className='min-h-[255px] justify-center'>
            <CardContent className='mx-auto mb-0 !py-0 pt-6 text-center text-[17px] leading-7'>
              <TypographyP noBottom size={17} center classname='font-semibold'>
                {t('translation.nonUrgentAction')}
              </TypographyP>
              <TypographyP
                noBottom
                size={22}
                classname={`px-3 py-2 mt-6 max-w-[60px] font-semibold mx-auto border rounded-[4px] ${+(dashboardDetails?.nonUrgentReferralsRequiringAction || 0) > 0 ? boxColorRed : boxColorGreen}`}
              >
                {dashboardDetails?.nonUrgentReferralsRequiringAction || 0}
              </TypographyP>
            </CardContent>
            <CardFooter className='mb-2 mt-[30px] justify-center !py-0'>
              <Button
                variant='outline'
                className='w-[180px] !py-2 text-[16px]'
                loading={false}
                center
                onClick={() =>
                  router.push(
                    `/overview/view/${OVERVIEW_FILE_NAME.NON_URGENT_ACTION}`,
                  )
                }
              >
                {t('translation.view')}
              </Button>
            </CardFooter>
          </Card>

          <Card className='min-h-[255px] justify-center'>
            <CardContent className='mx-auto mb-0 !px-5 !py-0 text-center text-[17px] leading-7'>
              <TypographyP noBottom size={17} center classname='font-semibold'>
                {t('translation.filesForResubmission')}
              </TypographyP>
              <TypographyP
                noBottom
                size={22}
                classname={`px-3 py-2 mt-6 max-w-[60px] font-semibold mx-auto border rounded-[4px] ${+(dashboardDetails?.filesRequiringResubmission || 0) > 0 ? boxColorRed : boxColorGreen}`}
              >
                {dashboardDetails?.filesRequiringResubmission || 0}
              </TypographyP>
            </CardContent>
            <CardFooter className='mb-2 mt-[30px] justify-center !py-0'>
              <Button
                variant='outline'
                className='w-[180px] !py-2 text-[16px]'
                loading={false}
                center
                onClick={() =>
                  router.push(
                    `/overview/view/${OVERVIEW_FILE_NAME.FILE_RESUBMISSION}`,
                  )
                }
              >
                {t('translation.view')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Overview;
