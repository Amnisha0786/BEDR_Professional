'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import Loader from '@/components/custom-loader';
import PatientFileInfo from '@/components/ipad-components/patient-file-info';
import { getErrorMessage } from '@/lib/utils';
import { TGetUnpaidFileData } from '@/models/types/ipad';
import PatientConsent from '@/components/ipad-components/patient-consent';
import UploadMedia from '@/components/ipad-components/upload-media';
import { viewPatientFile } from '@/app/api/completed-files';
import { useAppDispatch } from '@/lib/hooks';
import { userUrl } from '@/lib/userPageUrl/userPageUrlSlice';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';
import useSocket from '@/hooks/useSocket';

const UnPaidFilesViewData = () => {
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [fileDetails, setFileDetails] = useState<TGetUnpaidFileData | null>(
    null,
  );
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const socket = useSocket();

  useEffect(() => {
    if (window) {
      dispatch(userUrl(window.location.href));
    }
  }, []);

  const viewFileDetails = useCallback(
    async (hideLoading = false) => {
      try {
        if (!params?.fileId) {
          return;
        }
        if (!hideLoading) {
          setLoading(true);
        }
        const response = await viewPatientFile({
          patientFileId: params?.fileId as string,
        });
        if (response?.status !== 200) {
          t('translation.somethingWentWrong');
          return;
        }
        setFileDetails(response?.data?.data);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },
    [params],
  );

  useEffect(() => {
    viewFileDetails();
  }, [selectedSection]);

  const renderStep = useCallback(() => {
    switch (selectedSection) {
      case 'patient-consent':
        return (
          <PatientConsent
            setSelectedSection={setSelectedSection}
            fileData={fileDetails}
          />
        );
      case 'upload-media':
        return (
          <UploadMedia
            setSelectedSection={setSelectedSection}
            fileData={fileDetails}
          />
        );
      default:
        return (
          <PatientFileInfo
            fileData={fileDetails}
            setSelectedSection={setSelectedSection}
          />
        );
    }
  }, [selectedSection, fileDetails]);

  useEffect(() => {
    const socketEventApis = () => {
      viewFileDetails(true);
    };
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.PAYMENT_SUCCEED_WEBHOOK, socketEventApis);
      return () => {
        socket.off(SOCKET_EVENTS.FILE_SUBMITTED_FROM_PRACTICE, socketEventApis);
      };
    }
  }, [socket, viewFileDetails]);

  if (loading) {
    return <Loader size={30} />;
  }

  return <div className='p-[30px]'>{fileDetails && renderStep()}</div>;
};

export default UnPaidFilesViewData;
