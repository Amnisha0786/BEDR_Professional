'use client';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '../ui/button';
import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import { Card } from '../ui/card';
import Icon from '../custom-components/custom-icon';
import { TGetUnpaidFileData, TSubmitFile } from '@/models/types/ipad';
import { submitFile } from '@/app/api/ipad-unpaid-files';
import { getErrorMessage } from '@/lib/utils';
import { IPAD_HOMEPAGE } from '@/lib/constants/shared';
import { REQUEST_FILE_STATUS } from '@/enums/create-patient';

type TProp = {
  fileData: TGetUnpaidFileData | null;
  setSelectedSection?: Dispatch<SetStateAction<string>>;
};

const PatientFileInfo = ({
  fileData = null,
  setSelectedSection = () => {},
}: TProp) => {
  const router = useRouter();
  const { t } = useTranslation();
  const disableConsentTab = fileData?.consentForm?.id;
  const disablePaymentTab = fileData?.payments?.id;

  const [loading, setLoading] = useState<boolean>(false);

  const submitData = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      try {
        setLoading(true);
        const response = await submitFile({
          patientFileId: fileData?.id,
          fileStatus: REQUEST_FILE_STATUS.SUBMITTED_BY_IPAD,
        } as TSubmitFile);
        if (response?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        toast.success(t('translation.fileSubmittedSuccessfully'));
        router.push(IPAD_HOMEPAGE);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <div>
      <Card className='mb-[49px] w-full  p-3'>
        <FlexBox flex classname=' justify-between'>
          <FlexBox flex classname='items-center gap-4'>
            <div className='flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='/assets/create-patient.svg'
                alt='create-patient'
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyP primary noBottom>
              {t('translation.completePatientInputs')}
            </TypographyP>
          </FlexBox>
          <Button
            onClick={() => router?.push(IPAD_HOMEPAGE)}
            variant={'outlineWithoutHover'}
            className='!bg-backgroundGray px-[37.35px] py-[6.5px] text-[18px]'
          >
            {t('translation.back')}
          </Button>
        </FlexBox>
      </Card>
      <Card className='mx-[30px] mb-[40px] border px-[25px] py-[20px]'>
        <FlexBox flex classname='nm:gap-8 max-nm:flex-col'>
          <FlexBox flex classname='gap-1 nm:w-[58%]'>
            <TypographyP classname='font-normal text-[12px] max-nm:w-[50%]'>
              {t('translation.idNumber')}:
            </TypographyP>{' '}
            <TypographyP
              primary
              classname='font-semibold text-[12px] max-nm:w-[50%] capitalize'
            >
              {fileData?.idNumber}
            </TypographyP>
          </FlexBox>{' '}
        </FlexBox>
        <FlexBox flex classname='nm:gap-8 max-nm:flex-col'>
          {' '}
          <FlexBox flex classname='gap-1 nm:w-[58%]'>
            <TypographyP classname='font-normal text-[12px] max-nm:w-[50%]'>
              {t('translation.patientName')}:
            </TypographyP>{' '}
            <TypographyP
              primary
              classname='font-semibold text-[12px] max-nm:w-[50%] capitalize'
            >
              {' '}
              {`${fileData?.patient?.firstName || ''} ${fileData?.patient?.lastName || ''}`}{' '}
            </TypographyP>
          </FlexBox>{' '}
          <FlexBox flex classname='gap-1'>
            <TypographyP classname='font-normal text-[12px] max-nm:w-[50%]'>
              {t('translation.patientEmail')}:
            </TypographyP>{' '}
            <TypographyP
              primary
              classname='font-semibold text-[12px] max-nm:w-[50%] w-[95px] truncate'
            >
              {' '}
              {fileData?.patient?.email || ''}{' '}
            </TypographyP>
          </FlexBox>{' '}
        </FlexBox>
        <FlexBox flex classname='nm:gap-8 max-nm:flex-col'>
          {' '}
          <FlexBox flex classname='gap-1  nm:w-[58%]'>
            <TypographyP classname='font-normal text-[12px] max-nm:w-[50%]'>
              {t('translation.mobileNumber')}:
            </TypographyP>{' '}
            <TypographyP
              primary
              classname='font-semibold text-[12px] max-nm:w-[50%]'
            >
              {`${fileData?.patient?.callingCode || ''} ${fileData?.patient?.mobileNumber || ''}`}
            </TypographyP>
          </FlexBox>{' '}
          <FlexBox flex classname='gap-1 '>
            <TypographyP classname='font-normal text-[12px] max-nm:w-[50%]'>
              {t('translation.dob')}:
            </TypographyP>{' '}
            <TypographyP
              primary
              classname='font-semibold text-[12px] max-nm:w-[50%]'
            >
              {' '}
              {fileData?.patient?.dateOfBirth
                ? dayjs(fileData?.patient?.dateOfBirth)?.format('DD/MM/YYYY')
                : ''}
            </TypographyP>
          </FlexBox>{' '}
        </FlexBox>
        <FlexBox flex classname='nm:gap-8 max-nm:flex-col'>
          {' '}
          <FlexBox flex classname='gap-1  nm:w-[58%]'>
            <TypographyP classname='font-normal text-[12px] max-nm:w-[50%]'>
              {' '}
              {t('translation.postcode')}:
            </TypographyP>{' '}
            <TypographyP
              primary
              classname='font-semibold text-[12px] max-nm:w-[50%]'
            >
              {' '}
              {fileData?.patient?.postCode || ''}{' '}
            </TypographyP>
          </FlexBox>{' '}
          <FlexBox flex classname='gap-1 '>
            <TypographyP classname='font-normal text-[12px] max-nm:w-[50%]'>
              {t('translation.sex')}:
            </TypographyP>{' '}
            <TypographyP
              primary
              classname='font-semibold text-[12px] max-nm:w-[50%] capitalize'
            >
              {' '}
              {fileData?.patient?.sex || ''}{' '}
            </TypographyP>
          </FlexBox>{' '}
        </FlexBox>
      </Card>
      <FlexBox flex classname='mx-[160px] flex-col gap-[40px] '>
        <Card
          onClick={() => setSelectedSection('patient-consent')}
          className={`relative min-h-[179px] cursor-pointer items-center ${disableConsentTab ? 'bg-blue-100' : ''} justify-center border`}
        >
          {disableConsentTab && (
            <Icon
              name={'solid-tick'}
              className='absolute right-3 top-3'
              width={18}
              height={18}
            />
          )}
          <div className='text-center'>
            <span className='mb-5 flex justify-center'>
              <Image
                src={'/assets/doctor-profiles.svg'}
                width={28}
                height={28}
                alt='patient-consent'
              />
            </span>
            <TypographyP classname='text-primary'>
              {' '}
              {t('translation.patientConsent')}
            </TypographyP>
            <TypographyP classname='text-primary'>
              {t('translation.mandatory')}
            </TypographyP>
          </div>
        </Card>
        <Card
          onClick={() =>
            !disablePaymentTab
              ? router.push(`/ipad/practice/${fileData?.id}/payment`)
              : null
          }
          className={`relative min-h-[179px] cursor-pointer items-center ${disablePaymentTab ? 'cursor-not-allowed bg-blue-100' : ''} justify-center border`}
        >
          {' '}
          {disablePaymentTab && (
            <Icon
              name={'solid-tick'}
              className='absolute right-3 top-3'
              width={18}
              height={18}
            />
          )}
          <div className='text-center'>
            <span className='mb-5 flex justify-center'>
              <Image
                src={'/assets/payment.svg'}
                width={28}
                height={28}
                alt='patient-consent'
              />
            </span>
            <TypographyP classname='text-primary'>
              {t('translation.payment')}
            </TypographyP>
            <TypographyP classname='text-primary'>
              {t('translation.mandatory')}
            </TypographyP>
          </div>
        </Card>
        <Card
          onClick={() => setSelectedSection('upload-media')}
          className={`relative min-h-[179px] cursor-pointer items-center ${fileData?.leftEyeImages || fileData?.rightEyeImages ? 'bg-blue-100' : ''} justify-center border`}
        >
          {(fileData?.leftEyeImages || fileData?.rightEyeImages) && (
            <Icon
              name={'solid-tick'}
              className='absolute right-3 top-3'
              width={18}
              height={18}
            />
          )}
          <div className='text-center'>
            <span className='mb-5 flex justify-center'>
              <Image
                src={'/assets/upload-media.svg'}
                width={28}
                height={28}
                alt='media'
              />
            </span>
            <TypographyP classname='text-primary'>
              {t('translation.uploadMedia')}
            </TypographyP>
            <TypographyP classname='text-primary'>
              {t('translation.optional')}
            </TypographyP>
          </div>
        </Card>
      </FlexBox>
      <FlexBox flex classname='items-center justify-end -mt-10'>
        <Button
          disabled={
            loading || !fileData?.consentForm?.id || !fileData?.payments?.id
          }
          loading={loading}
          onClick={submitData}
          className='min-w-[146.5px] text-white'
          center
        >
          {t('translation.submit')}
        </Button>
      </FlexBox>
    </div>
  );
};

export default PatientFileInfo;
