'use client';

import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Card, CardContent } from '../ui/card';
import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import { cn, getErrorMessage } from '@/lib/utils';
import { completeFile } from '@/app/api/file-in-progress';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import CustomDialogBox from '../custom-components/custom-dialog-box';
import NoDataFound from '../custom-components/custom-no-data-found';
import useAccessToken from '@/hooks/useAccessToken';
import { LOGINS } from '@/enums/auth';
import { FILE_STATUS } from '@/enums/todays-clinics';

type TProps = {
  fileId?: string;
  diagnosisReportHtml?: string;
  readerConfidence?: boolean | undefined;
  viewOnly?: boolean;
  showButton?: React.ReactNode;
  fileStatus?: string;
  removeShadow?: boolean;
};

const DiagnosisReport = ({
  fileId,
  diagnosisReportHtml,
  readerConfidence,
  viewOnly = false,
  showButton,
  fileStatus,
  removeShadow,
}: TProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openSubModal, setOpenSubModal] = useState(false);

  const router = useRouter();

  const handleDone = useCallback(() => {
    router.push('/todays-clinics');
    setOpen(false);
    setOpenSubModal(false);
  }, []);

  const userAccessToken = useAccessToken();

  const handleReportSubmission = useCallback(async () => {
    setLoading(true);
    setOpenSubModal(false);
    try {
      if (!fileId || !diagnosisReportHtml) {
        toast.error('File id is missing!', { className: '!p-5' });
        return;
      }
      const response = await completeFile({
        patientFileId: fileId,
        diagnosisFormHtml: diagnosisReportHtml,
      });
      if (response?.data?.status !== 200) {
        toast.error(response?.data?.message || 'Something went wrong!', {
          className: '!p-5',
        });
      } else {
        setOpenSubModal(true);
        setOpen(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Something went wrong!', {
        className: '!p-5',
      });
    } finally {
      setLoading(false);
    }
  }, [fileId, diagnosisReportHtml]);

  return (
    <Card
      className={cn(
        'min-h-[300px] justify-start bg-white pb-[40px] pt-[30px] max-ms:px-[10px] ms:px-[40px]',
        {
          'p-0 shadow-none max-ms:p-0 ms:p-0': removeShadow,
        },
      )}
    >
      {userAccessToken?.role === LOGINS.DOCTOR &&
        fileStatus === FILE_STATUS.IN_REVIEW_BY_DOCTOR &&
        readerConfidence !== undefined &&
        readerConfidence !== null && (
          <FlexBox flex centerContent>
            <TypographyP noBottom size={14} primary classname='!font-bold'>
              {readerConfidence
                ? 'Reader is confident about this diagnosis report.'
                : 'Reader is not confident about this diagnosis report.'}
            </TypographyP>
          </FlexBox>
        )}
      <CardContent
        className={cn('mt-[25px] w-full !p-0', { 'shadow-none': removeShadow })}
      >
        {diagnosisReportHtml ? (
          <div
            className='a-link-color'
            dangerouslySetInnerHTML={{ __html: diagnosisReportHtml }}
          />
        ) : (
          <NoDataFound
            title='There is no diagnosis report to preview.'
            hideButton={true}
          />
        )}
      </CardContent>
      {diagnosisReportHtml && !viewOnly && (
        <>
          <div className='ml-auto mt-4'>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className='!outline-none'>
                <Button
                  className='ml-auto w-[300px] text-[16px] !text-white'
                  center
                >
                  Save changes and post reports
                </Button>
              </DialogTrigger>
              <CustomDialogBox
                loading={loading}
                setOpen={setOpen}
                handleConfirm={handleReportSubmission}
                title={
                  userAccessToken?.role === LOGINS.READER
                    ? 'Reports will be posted on the platform for approval by an ophthalmologist.'
                    : 'Reports will be posted on the platform and the optometrist and patient will receive notifications that they’re ready to read.'
                }
                confirmButtonText='Confirm'
                hideCancelButton
                heading='Post Report?'
              />
            </Dialog>
          </div>
          <Dialog open={openSubModal} onOpenChange={setOpenSubModal}>
            {!loading && !open && (
              <CustomDialogBox
                loading={loading}
                setOpen={setOpenSubModal}
                handleConfirm={handleDone}
                title=''
                icon='solid-tick'
                confirmButtonText='Done'
                hideCancelButton
                heading='Reports have been posted.'
                hiddencross={true}
              />
            )}
          </Dialog>
        </>
      )}

      {showButton}
    </Card>
  );
};

export default DiagnosisReport;
