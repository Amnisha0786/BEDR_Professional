'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { getErrorMessage } from '@/lib/utils';
import Loader from '@/components/custom-loader';
import { viewPatientFile } from '@/app/api/completed-files';
import UploadMedia from '@/components/ipad-components/upload-media';
import { TGetUnpaidFileData } from '@/models/types/ipad';

const PatientsList = () => {
  const [fileDetails, setFileDetails] = useState<TGetUnpaidFileData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();
  const params = useParams();

  const fetchFileDetails = useCallback(async () => {
    try {
      if (!params?.patientFileId) {
        return;
      }
      const response = await viewPatientFile({
        patientFileId: params?.patientFileId as string,
      });
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      setFileDetails(response?.data?.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, [params?.patientFileId]);

  useEffect(() => {
    fetchFileDetails();
  }, [fetchFileDetails]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='mt-8'>
      <UploadMedia fileData={fileDetails} hideHeaders goToPatientList={true} />
    </div>
  );
};

export default PatientsList;
