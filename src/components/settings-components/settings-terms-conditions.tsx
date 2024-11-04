import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import { Card } from '../ui/card';
import useUserProfile from '@/hooks/useUserProfile';
import { getTermsConditions } from '@/app/api/settings';
import { getErrorMessage } from '@/lib/utils';
import Loader from '../custom-loader';
import { TTermsAndConditions } from '@/models/types/settings';

const PdfViewer = dynamic(() => import('../pdf-viewer'));

const SettingsTermsConditions = () => {
  const [loading, setLoading] = useState(true);
  const [termsConditions, setTermsConditions] = useState<TTermsAndConditions>();

  const { t } = useTranslation();
  const user = useUserProfile();

  const fetchTermsConditions = useCallback(async () => {
    if (!user?.role) {
      return;
    }
    setLoading(true);
    try {
      const response = await getTermsConditions({ role: user?.role });
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setTermsConditions(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTermsConditions();
  }, [fetchTermsConditions]);

  if (loading) {
    return;
  }

  return (
    <Card className='p-5'>
      <div className='m-auto min-h-[500px] w-full flex-col md:max-w-[710px]'>
        <PdfViewer
          fileUrl={termsConditions?.fileKey || ''}
          isSettingsTerms={true}
        />
      </div>
    </Card>
  );
};

export default SettingsTermsConditions;
