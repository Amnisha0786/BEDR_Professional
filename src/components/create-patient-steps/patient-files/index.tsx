import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  getPendingFiles,
  openPendingFiles,
} from '@/app/api/create-patient-request';
import PatientDetailCard from '@/components/custom-components/patient-detail-card';
import { TypographyP } from '@/components/ui/typography/p';
import useOptometristPractice from '@/hooks/useOptometristPractice';
import {
  TIpadPatientListDetails,
  TRegisterNewPatientForm,
} from '@/models/types/create-patient-forms';
import { getErrorMessage } from '@/lib/utils';
import Loader from '@/components/custom-loader';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';
import NoDataFound from '@/components/custom-components/custom-no-data-found';
import useSocket from '@/hooks/useSocket';

type TProps = {
  onSuccess: () => void;
};

const PatientFiles = ({ onSuccess = () => [] }: TProps) => {
  const [patientList, setPatientList] = useState<TIpadPatientListDetails[]>([]);
  const [loading, setLoading] = useState<string>('');
  const [fetchingFiles, setFetchingFiles] = useState(false);

  const { t } = useTranslation();
  const optometristPractice = useOptometristPractice();
  const socket = useSocket();

  const fetchPendingFiles = useCallback(
    async (hideLoading = false) => {
      if (!hideLoading) {
        setFetchingFiles(true);
      }
      try {
        if (!optometristPractice?.practiceId) {
          return;
        }
        const response = await getPendingFiles({
          practiceId: optometristPractice?.practiceId,
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        setPatientList(response?.data?.data);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setFetchingFiles(false);
      }
    },
    [optometristPractice],
  );

  useEffect(() => {
    fetchPendingFiles();
  }, [fetchPendingFiles]);

  const handleSelectPatientClick = useCallback(
    async (patient: TRegisterNewPatientForm) => {
      setLoading(patient?.id || '');
      try {
        if (!optometristPractice?.practiceId || !patient) {
          return;
        }
        const response = await openPendingFiles({
          practiceId: optometristPractice?.practiceId,
          patientFileId: patient?.id || '',
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        setPatientList(response?.data?.data);
        onSuccess();
        fetchPendingFiles();
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading('');
      }
    },
    [onSuccess],
  );

  useEffect(() => {
    const socketEventApis = () => {
      fetchPendingFiles(true);
    };
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.FILE_SUBMITTED_FROM_PRACTICE, socketEventApis);
      return () => {
        socket.off(SOCKET_EVENTS.FILE_SUBMITTED_FROM_PRACTICE, socketEventApis);
      };
    }
  }, [socket, fetchPendingFiles]);

  if (fetchingFiles) {
    return <Loader />;
  }

  return (
    <div className='mt-8'>
      <div className='mb-5 grid grid-cols-3 gap-4 max-nm:grid-cols-2 max-ms:grid-cols-1'>
        {patientList && patientList?.length > 0 ? (
          patientList?.map((patient, index) => (
            <PatientDetailCard
              patient={patient}
              key={index}
              handleSelectPatientClick={handleSelectPatientClick}
              loading={loading}
            />
          ))
        ) : (
          <TypographyP noBottom center classname='w-full col-span-3'>
            <NoDataFound
              heading={t('translation.noFileAwaiting')}
              title={t('translation.toCreateFileFromIpad')}
              hideButton
            />
          </TypographyP>
        )}
      </div>
    </div>
  );
};

export default PatientFiles;
