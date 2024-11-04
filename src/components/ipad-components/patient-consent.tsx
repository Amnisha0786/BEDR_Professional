import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import PatientConsentContent1 from './consent-to-collect';
import PatientConsentContent2 from './consent-to-share';
import PatientContentContent3 from './consent-to-use';
import { TGetUnpaidFileData, TPatientConsentIpad } from '@/models/types/ipad';
import { Card } from '../ui/card';

type TProp = {
  setSelectedSection?: Dispatch<SetStateAction<string>> | undefined;
  fileData?: TGetUnpaidFileData | null;
};

const PatientConsent = ({ setSelectedSection, fileData = null }: TProp) => {
  const [step, setStep] = useState<number>(0);
  const [formedData, setFormedData] = useState<TPatientConsentIpad>();
  const { t } = useTranslation();

  const renderStepConsent = useCallback(() => {
    switch (step) {
      case 0:
        return (
          <PatientConsentContent1
            setStep={setStep}
            setSelectedSection={setSelectedSection}
            fileData={fileData}
          />
        );
      case 1:
        return (
          <PatientConsentContent2
            setStep={setStep}
            fileData={fileData}
            setFormedData={setFormedData}
            formedData={formedData}
          />
        );
      default:
        return (
          <PatientContentContent3
            setStep={setStep}
            fileData={fileData}
            formedData={formedData}
            setSelectedSection={setSelectedSection}
          />
        );
    }
  }, [step]);

  return (
    <div>
      <Card className='w-full p-3 mb-5'>
        <FlexBox flex classname=' justify-between'>
          <FlexBox flex classname='items-center gap-4'>
            <div className='flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src={'/assets/doctor-profiles.svg'}
                alt='patient-consent'
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyP primary noBottom>
              {t('translation.patientConsentHeading')}
            </TypographyP>
          </FlexBox>
        </FlexBox>
      </Card>
      {renderStepConsent()}
    </div>
  );
};

export default PatientConsent;
