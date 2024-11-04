'use client';

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { IOptions } from '@/models/types/shared';
import { Card, CardContent } from '../ui/card';
import { TypographyH2 } from '../ui/typography/h2';
import { TypographyP } from '../ui/typography/p';
import { TPerformanceData } from '@/models/types/performance-data';
import { PERFORMANCE_DATA_FOR } from '@/enums/performance-data';

type TProps = {
  currentTab?: IOptions;
  performanceData: TPerformanceData | null;
};

const DataPreview = ({ currentTab, performanceData }: TProps) => {
  const { t } = useTranslation();

  const getDynamicText = useMemo(() => {
    let textWithThis = t('translation.yesterday');
    if (currentTab?.value === PERFORMANCE_DATA_FOR.MONTH) {
      textWithThis = t('translation.lastMonth');
    } else if (currentTab?.value === PERFORMANCE_DATA_FOR.YEAR) {
      textWithThis = t('translation.lastYear');
    }
    return { textWithThis };
  }, [currentTab]);

  return (
    <>
      <div className='my-[30px] grid grid-cols-1 justify-start gap-[15px] max-xxl:grid-cols-2 max-nm:grid-cols-1 xxl:grid-cols-3'>
        <Card className='min-h-[255px] '>
          <CardContent className='my-auto space-y-4 pt-6 text-center text-[17px] leading-7'>
            <TypographyH2 classname='!text-[36px] !font-normal'>
              {performanceData?.totalFilesDiagnosed || 0}{' '}
            </TypographyH2>
            <TypographyP primary noBottom size={24} classname='!font-normal'>
              {t('translation.totalFilesDiagnosed')}
            </TypographyP>
          </CardContent>
        </Card>
        <Card className='min-h-[255px] '>
          <CardContent className='my-auto space-y-4 pt-6 text-center text-[17px] leading-7'>
            <TypographyH2 classname='!text-[36px] !font-normal'>
              {performanceData?.filesDiagnosed || 0}{' '}
            </TypographyH2>
            <TypographyP primary noBottom size={24} classname='!font-normal'>
              {t('translation.filesDiagnosedYesterday', {
                day: getDynamicText.textWithThis || '',
              })}
            </TypographyP>
          </CardContent>
        </Card>
        <Card className='min-h-[255px] '>
          <CardContent className='my-auto space-y-4 pt-6 text-center text-[17px] leading-7'>
            <TypographyH2 classname='!text-[36px] !font-normal'>
              {performanceData?.percentageOfFilesDiagnosedByEndOfNextDay || 0}%{' '}
            </TypographyH2>
            <TypographyP primary noBottom size={24} classname='!font-normal'>
              {t('translation.filesDiagnosedByEnd')}
            </TypographyP>
          </CardContent>
        </Card>
      </div>
      <TypographyP classname='!pt-3 !font-bold' noBottom primary>
        {t('translation.outcomes')}
      </TypographyP>
      <div className='my-[30px] grid grid-cols-1 justify-start gap-[15px] max-xxl:grid-cols-2 max-nm:grid-cols-1 xxl:grid-cols-4'>
        <Card className='min-h-[255px] '>
          <CardContent className='my-auto space-y-4 pt-6 text-center text-[17px] leading-7'>
            <TypographyH2 classname='!text-[36px] !font-normal'>
              {performanceData?.percentageOfUrgentReferrals || 0}%{' '}
            </TypographyH2>
            <TypographyP primary noBottom size={24} classname='!font-normal'>
              {t('translation.urgentReferrals')}
            </TypographyP>
          </CardContent>
        </Card>
        <Card className='min-h-[255px] '>
          <CardContent className='my-auto space-y-4 pt-6 text-center text-[17px] leading-7'>
            <TypographyH2 classname='!text-[36px] !font-normal'>
              {performanceData?.percentageOfNonUrgentReferrals || 0}%{' '}
            </TypographyH2>
            <TypographyP primary noBottom size={24} classname='!font-normal'>
              {t('translation.nonUrgentReferrals')}
            </TypographyP>
          </CardContent>
        </Card>
        <Card className='min-h-[255px] '>
          <CardContent className='my-auto space-y-4 pt-6 text-center text-[17px] leading-7'>
            <TypographyH2 classname='!text-[36px] !font-normal'>
              {performanceData?.percentageOfCareDelegatedFiles || 0}%{' '}
            </TypographyH2>
            <TypographyP primary noBottom size={24} classname='!font-normal'>
              {t('translation.careDelegatedToOptometrist')}
            </TypographyP>
          </CardContent>
        </Card>
        <Card className='min-h-[255px] '>
          <CardContent className='my-auto space-y-4 pt-6 text-center text-[17px] leading-7'>
            <TypographyH2 classname='!text-[36px] !font-normal'>
              {performanceData?.percentageOfReassureAndDischargedFiles || 0}%{' '}
            </TypographyH2>
            <TypographyP primary noBottom size={24} classname='!font-normal'>
              {t('translation.discharged')}
            </TypographyP>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DataPreview;
