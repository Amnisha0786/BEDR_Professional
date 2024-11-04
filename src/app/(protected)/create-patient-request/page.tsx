'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { toast } from 'sonner';

import Step from '@/components/custom-components/custom-stepper';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import CloseFile from '@/components/create-patient-steps/close-file';
import {
  getFileInProgress,
} from '@/app/api/create-patient-request';
import { getErrorMessage } from '@/lib/utils';
import { TGetInProgressFileData } from '@/models/types/create-patient-forms';
import useOptometristPractice from '@/hooks/useOptometristPractice';
import PatientFiles from '@/components/create-patient-steps/patient-files';
import Loader from '@/components/custom-loader';
import { Card } from '@/components/ui/card';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';
import useSocket from '@/hooks/useSocket';

const CreatePatientRequest = () => {
  const [fileId, setFileId] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TGetInProgressFileData | undefined>(
    undefined,
  );

  const optometristPractice = useOptometristPractice();
  const socket = useSocket();

  const fetchfileInProgress = useCallback(
    async (hideLoading = false) => {
      if (!hideLoading) {
        setLoading(true);
      }
      try {
        if (!optometristPractice?.practiceId) {
          return;
        }
        const response = await getFileInProgress({
          practiceId: optometristPractice?.practiceId,
        });
        if (response?.data?.status !== 200) {
          toast.error(response?.data?.message || 'Something went wrong!');
        } else {
          setFileId(response?.data?.data?.id);
          setData(response.data?.data);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || 'Something went wrong!');
      } finally {
        setLoading(false);
      }
    },
    [optometristPractice?.practiceId],
  );

  useEffect(() => {
    fetchfileInProgress();
  }, [fetchfileInProgress]);

  useEffect(() => {
    const socketEventApis = () => {
      fetchfileInProgress(true);
    };
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.FILE_SUBMITTED_FROM_PRACTICE, socketEventApis);

      return () => {
        socket.off(SOCKET_EVENTS.FILE_SUBMITTED_FROM_PRACTICE, socketEventApis);
      };
    }
  }, [socket, fetchfileInProgress]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>BEDR | Create Patient Request</title>
      </Head>
      <div className='max-ms: px-[16px]  py-[24px] ms:px-[20px] md:px-[20px]'>
        <Card className='w-full p-3'>
          <FlexBox flex centerItems classname='justify-between'>
            <FlexBox classname='flex'>
              <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                <Image
                  src='assets/create-patient.svg'
                  alt='create-patient'
                  width={18}
                  height={14}
                  className='m-auto'
                />
              </div>
              <TypographyH2 size={18}>Create Patient Request</TypographyH2>
            </FlexBox>
            {fileId && <CloseFile fileId={fileId} />}
          </FlexBox>
        </Card>
        {fileId ? (
          <Step
            fileId={fileId}
            formData={data}
            fetchfileInProgress={fetchfileInProgress}
          />
        ) : (
          <PatientFiles onSuccess={fetchfileInProgress} />
        )}
      </div>
    </>
  );
};

export default CreatePatientRequest;
