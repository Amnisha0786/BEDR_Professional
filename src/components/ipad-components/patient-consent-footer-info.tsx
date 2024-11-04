import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import { TGetUnpaidFileData } from '@/models/types/ipad';

type Tprop = {
  fileData: TGetUnpaidFileData | null;
};

const PatientConsentFooterInfo = ({ fileData }: Tprop) => {
  const { t } = useTranslation();

  const today = useMemo(() => {
    return dayjs(new Date())?.format('DD MMM YYYY');
  }, []);

  return (
    <FlexBox flex classname='justify-between = card w-full'>
      <div>
        <TypographyP noBottom primary size={14} classname='font-normal'>
          {t('translation.signed')}:
        </TypographyP>
        <TypographyP noBottom primary size={16} classname='font-medium capitalize'>
          {' '}
          {`${fileData?.patient?.firstName || ''} ${fileData?.patient?.lastName || ''}`}
        </TypographyP>
      </div>
      <div>
        <TypographyP noBottom primary size={14} classname='font-normal'>
          {t('translation.date')}:
        </TypographyP>
        <TypographyP noBottom primary size={16} classname='font-medium'>
          {today}
        </TypographyP>
      </div>
    </FlexBox>
  );
};

export default PatientConsentFooterInfo;
