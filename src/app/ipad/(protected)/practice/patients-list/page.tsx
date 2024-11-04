'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

import PatientDetailCard from '@/components/custom-components/patient-detail-card';
import { TypographyP } from '@/components/ui/typography/p';
import {
  TIpadPatientListDetails,
  TRegisterNewPatientForm,
} from '@/models/types/create-patient-forms';
import { getErrorMessage } from '@/lib/utils';
import Loader from '@/components/custom-loader';
import NoDataFound from '@/components/custom-components/custom-no-data-found';
import { getPatientsFiles } from '@/app/api/ipad-unpaid-files';
import { Card } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { Button } from '@/components/ui/button';
import { viewPatientFile } from '@/app/api/completed-files';
import { useAppDispatch } from '@/lib/hooks';
import useRefreshStates from '@/hooks/useRefreshStates';
import { setRefreshData } from '@/lib/updateReduxState/updateReduxStateSlice';

const PatientsList = () => {
  const [patientList, setPatientList] = useState<TIpadPatientListDetails[]>([]);
  const [loading, setLoading] = useState<string>('');
  const [fetchingFiles, setFetchingFiles] = useState(true);

  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isRefresh = useRefreshStates();

  const fetchPendingFiles = useCallback(async () => {
    try {
      const response = await getPatientsFiles();
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
      dispatch(setRefreshData({ ...isRefresh, isRefreshPatientFiles: false }));
    }
  }, []);

  useEffect(() => {
    fetchPendingFiles();
  }, [fetchPendingFiles]);

  useEffect(() => {
    if (isRefresh?.isRefreshPatientFiles) {
      fetchPendingFiles();
    }
  }, [isRefresh]);

  const handleSelectPatientClick = useCallback(
    async (patient: TRegisterNewPatientForm) => {
      setLoading(patient?.id || '');
      try {
        if (!patient?.id) {
          return;
        }
        const response = await viewPatientFile({
          patientFileId: patient?.id,
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        router.push(`/ipad/practice/patients-list/${response?.data?.data?.id}`);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading('');
      }
    },
    [],
  );

  if (fetchingFiles) {
    return <Loader />;
  }

  return (
    <div className='mt-8'>
      <Card className='mb-5 w-full p-3'>
        <FlexBox flex justify='between' centerItems>
          <FlexBox flex classname='items-center gap-4'>
            <div className='flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src={'/assets/file.svg'}
                alt={t('translation.files')}
                width={14}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyP primary noBottom>
              {t('translation.patientsList')}
            </TypographyP>
          </FlexBox>
          <Button
            variant={'outline'}
            className={'text-[16px] max-ms:mt-2'}
            onClick={() => router.push('/ipad/practice')}
          >
            {t('translation.back')}
          </Button>
        </FlexBox>
      </Card>
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

export default PatientsList;
