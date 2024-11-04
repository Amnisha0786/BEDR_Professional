'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { viewPatientFile } from '@/app/api/completed-files';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import Loader from '@/components/custom-loader';
import { getErrorMessage } from '@/lib/utils';
import { TGetInProgressFileDetails } from '@/models/types/file-in-progress';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import NoDataFound from '@/components/custom-components/custom-no-data-found';

const ViewReport = () => {
  const [loading, setLoading] = useState(false);
  const [patientFileDetails, setPatientFileDetails] =
    useState<TGetInProgressFileDetails>();

  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();

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
        toast.error(t('translation.somethingWentWrong'));
        return;
      }
      setPatientFileDetails(response?.data?.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    viewPatientFileDetails();
  }, [viewPatientFileDetails]);

  if (loading) {
    return <Loader size={30} />;
  }

  return (
    <div className='px-[30px] py-[30px] md:px-[56px]'>
      <Card className='w-full p-3'>
        <FlexBox flex centerItems classname='justify-between'>
          <FlexBox classname='flex'>
            <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='../../../assets/overview-small.svg'
                alt={t('translation.overview')}
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyH2 size={18} classname='capitalize'>
              {t('translation.patientFile')}
            </TypographyH2>
          </FlexBox>
          <Button
            variant='outline'
            onClick={() => router.back()}
            className='bg-transparent text-[14px]'
          >
            {t('translation.back')}
          </Button>
        </FlexBox>
      </Card>
      <Card className='mt-[25px] min-h-[500px] w-full !p-5'>
        {patientFileDetails?.diagnosisForm?.diagnosisFormHtmlForOptometrist ? (
          <div
            className='a-link-color'
            dangerouslySetInnerHTML={{
              __html:
                patientFileDetails?.diagnosisForm
                  ?.diagnosisFormHtmlForOptometrist,
            }}
          />
        ) : (
          <NoDataFound heading={t('translation.noTasks')} title='' hideButton />
        )}
      </Card>
    </div>
  );
};

export default ViewReport;
