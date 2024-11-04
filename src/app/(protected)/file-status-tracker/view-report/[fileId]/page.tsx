'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { toast } from 'sonner';

import { TGetInProgressFileDetails } from '@/models/types/file-in-progress';
import { viewPatientFile } from '@/app/api/completed-files';
import { getErrorMessage } from '@/lib/utils';
import DiagnosisReport from '@/components/file-in-progress/diagnosis-report';
import Loader from '@/components/custom-loader';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { Button } from '@/components/ui/button';
import { REFERRED_FILES } from '@/enums/file-status-tracker';
import ReferralConfirmed from '@/components/referral-confirmed';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import CustomDialogBox from '@/components/custom-components/custom-dialog-box';
import { confirmPatientReferral } from '@/app/api/file-status-tracker';
import { Card } from '@/components/ui/card';
import { ACTION_TO_BE_TAKEN } from '@/enums/file-in-progress';

const ViewReport = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileUpdated, setFileUpdated] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [patientFileDetails, setPatientFileDetails] =
    useState<TGetInProgressFileDetails>();

  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (window !== undefined && patientFileDetails?.diagnosisForm?.diagnosisFormHtmlForOptometrist) {
      const element = document.getElementById('focusedDiv');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [patientFileDetails])

  const viewPatientFileDetails = useCallback(async () => {
    try {
      if (!params?.fileId) {
        return;
      }
      setLoading(true);
      const response = await viewPatientFile({
        patientFileId: params?.fileId as string,
      });
      if (response?.status !== 200) {
        toast.error(t('translation.somethingWentWrong'), { className: '!p-5' });
        return;
      }
      setPatientFileDetails(response?.data?.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'), {
        className: '!p-5',
      });
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    viewPatientFileDetails();
  }, [viewPatientFileDetails]);

  const confirmReferred = useCallback(async () => {
    setConfirming(true);
    try {
      if (!params?.fileId) {
        toast.error(t('translation.fileIdMissing'), { className: '!p-5' });
        return;
      }
      const response = await confirmPatientReferral({
        patientFileId: params.fileId as string,
      });
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
          {
            className: '!p-5',
          },
        );
        return;
      }
      setFileUpdated(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'), {
        className: '!p-5',
      });
    } finally {
      setConfirming(false);
    }
  }, [params]);

  const fileStatusText = useMemo(() => {
    const patientFullName = `${patientFileDetails?.patient?.firstName || ''} ${patientFileDetails?.patient?.lastName || ''}`;
    let text = '';
    if (
      patientFileDetails?.diagnosisForm?.actionToBeTakenForLeftEye ===
      ACTION_TO_BE_TAKEN.URGENT_REFERRAL ||
      patientFileDetails?.diagnosisForm?.actionToBeTakenForRightEye ===
      ACTION_TO_BE_TAKEN.URGENT_REFERRAL
    ) {
      text = t('translation.urgentReferralDescription', {
        patientName: patientFullName,
      });
    } else {
      text = t('translation.aNonUrgentReferralDescription', {
        patientName: patientFullName,
      });
    }
    return text;
  }, [patientFileDetails]);

  const referredButton = () => {
    return !patientFileDetails?.patientReferred &&
      patientFileDetails?.diagnosisForm?.diagnosisFormHtmlForOptometrist &&
      (REFERRED_FILES.includes(
        patientFileDetails?.diagnosisForm
          ?.actionToBeTakenForLeftEye as ACTION_TO_BE_TAKEN,
      ) ||
        REFERRED_FILES.includes(
          patientFileDetails?.diagnosisForm
            ?.actionToBeTakenForRightEye as ACTION_TO_BE_TAKEN,
        )) ? (
      <div className='ml-auto mt-4'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className='!outline-none'>
            <Button className='ml-auto h-full min-w-[300px] text-wrap text-[16px] !text-white'>
              {t('translation.confirmReferred')}
            </Button>
          </DialogTrigger>
          <CustomDialogBox
            loading={confirming}
            setOpen={setOpen}
            handleConfirm={confirmReferred}
            title={fileStatusText}
            confirmButtonText={t('translation.confirm')}
            hideCancelButton
            heading={t('translation.confirmModalTitle')}
            maxWidth={500}
            subModal={false}
          />
        </Dialog>
      </div>
    ) : (
      <></>
    );
  };

  if (loading) {
    return <Loader size={30} />;
  }

  return (
    <div className='!m-5 md:!mx-10 md:!my-[30px]'>
      {fileUpdated ? (
        <ReferralConfirmed
          title={t('translation.fileHasBeenUpdated')}
          buttonText={t('translation.closeFile')}
          buttonLink='/file-status-tracker'
        />
      ) : (
        <>
          <Card className='mb-5 w-full p-3'>
            <FlexBox flex classname='items-end justify-between'>
              <FlexBox flex>
                <div id='focusedDiv' className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                  <Image
                    src='../../assets/referral.svg'
                    alt={t('translation.report')}
                    width={18}
                    height={14}
                    className='m-auto'
                  />
                </div>
                <TypographyH2 size={18}>
                  {t('translation.diagnosisReport')}
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
          <DiagnosisReport
            diagnosisReportHtml={
              patientFileDetails?.diagnosisForm?.diagnosisFormHtmlForOptometrist
            }
            viewOnly={true}
            showButton={referredButton()}
          />
        </>
      )}
    </div>
  );
};

export default ViewReport;
