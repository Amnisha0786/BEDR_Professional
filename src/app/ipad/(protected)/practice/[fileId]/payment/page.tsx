'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { getErrorMessage } from '@/lib/utils';
import { TGetUnpaidFileData } from '@/models/types/ipad';
import Payments from '@/components/ipad-components/payments';
import { viewPatientFile } from '@/app/api/completed-files';


const Payment = () => {
  const [fileDetails, setFileDetails] = useState<TGetUnpaidFileData | null>(
    null,
  );
  const params = useParams();
  const { t } = useTranslation();

  const viewFileDetails = useCallback(async () => {
    try {
      if (!params?.fileId) {
        return;
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
    }
  }, [params]);

  useEffect(() => {
    viewFileDetails();
  }, []);

  return fileDetails?.id && <Payments fileData={fileDetails} />;
};

export default Payment;
