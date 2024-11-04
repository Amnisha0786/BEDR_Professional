/* eslint-disable @next/next/no-img-element */
'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';

import useUserProfile from '@/hooks/useUserProfile';
import { getImageUrl } from '@/lib/common/getImageUrl';
import { TCurrentTab } from '@/models/types/file-in-progress';
import Loader from '@/components/custom-loader';
import { Skeleton } from '@/components/ui/skeleton';
import DicomView from '@/components/dicom-preview';
import { getDicomFileToken } from '@/app/api/file-in-progress';
import { getErrorMessage } from '@/lib/utils';
import Controls from '@/components/common-layout/controls';
import FilePreview from '@/components/file-preview';

const PdfViewer = dynamic(() => import('@/components/pdf-viewer'));

type TProps = {
  currentTab?: TCurrentTab;
};

type TSetUrl = {
  url?: string;
  videoUrl?: string;
};

const FilesPreview = ({ currentTab }: TProps) => {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<TSetUrl>({
    url: undefined,
    videoUrl: undefined,
  });
  const [openFilePreview, setOpenFilePreview] = useState(false);
  const [previewingDicom, setPreviewingDicom] = useState(false);

  const user = useUserProfile();
  const { t } = useTranslation();

  useEffect(() => {
    try {
      setLoading(true);
      if (
        user?.s3BucketUrl &&
        (currentTab?.itemValue || currentTab?.multiselect)
      ) {
        const generatedUrlObj = {
          url: getImageUrl(user?.s3BucketUrl, currentTab?.itemValue),
          videoUrl: currentTab?.multiselect
            ? getImageUrl(user?.s3BucketUrl, currentTab?.multiselect)
            : undefined,
        };
        setFileUrl(generatedUrlObj);
      }
    } finally {
      setLoading(false);
    }
  }, [user, currentTab]);

  console.log(fileUrl , "url")

  const generateDicomFileToken = useCallback(
    async (dicomKey: string) => {
      const newWindow = window.open('', '_blank');
      if (!dicomKey) {
        return;
      }
      setPreviewingDicom(true);
      try {
        const response = await getDicomFileToken({ dicomFileKey: dicomKey });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        const dicomToken = response?.data?.data?.dicomFileToken;
        if (newWindow) {
          newWindow.location.href = `${user?.dicomViewerDomain}?token=${dicomToken}`;
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setPreviewingDicom(false);
      }
    },
    [user, currentTab],
  );

  const renderPdfFiles = () => {
    if (
      currentTab?.keyname !== 'dicomFile' &&
      currentTab?.keyname !== 'discDicomFile' &&
      currentTab?.itemValue
    ) {
      return (
          <TransformWrapper>
            <div onClick={() => setOpenFilePreview(true)} className='w-full !cursor-grab'>
              <TransformComponent
                wrapperClass='!w-full flex justify-center min-h-[200px]'
                contentClass='!block min-h-[200px]'
              >
                <PdfViewer fileUrl={fileUrl?.url || ''} />
              </TransformComponent>
            </div>
            <Controls />
          </TransformWrapper>
      );
    }
    return <></>;
  };

  const renderDicomViewer = () => {
    if (
      (currentTab?.keyname === 'dicomFile' ||
        currentTab?.keyname === 'discDicomFile') &&
      currentTab?.itemValue
    ) {
      return (
        <DicomView
          onSuccess={() => generateDicomFileToken(currentTab?.itemValue)}
          loading={previewingDicom}
        />
      );
    }
    return <></>;
  };

  const renderFiles = () => {
    if (fileUrl?.url?.includes('.pdf') || fileUrl?.url?.includes('.PDF')) {
      return renderPdfFiles();
    } else if (
      fileUrl?.url?.includes('.dcm') ||
      fileUrl?.url?.includes('.DCM')
    ) {
      return renderDicomViewer();
    } else {
      return (
        fileUrl?.url && (
          <TransformWrapper disabled>
            <div className='w-full !cursor-pointer'>
              <TransformComponent
                wrapperClass='!w-full flex justify-center'
                contentClass='!block'
              >
                <Suspense
                  fallback={<Skeleton className='rounded-2 h-full !w-full' />}
                >
                  <div onClick={() => setOpenFilePreview(true)}>
                    <img
                      src={fileUrl?.url}
                      alt={t('translation.eyeImage')}
                      className='!h-full !w-full'
                    />
                  </div>
                </Suspense>
              </TransformComponent>
            </div>
            <Controls />
          </TransformWrapper>
        )
      );
    }
  };

  if (loading) {
    return <Loader size={30} />;
  }

  return (
    <div className='mt-5 flex min-h-[200px] w-full flex-col gap-5'>
      {renderFiles()}
      {fileUrl?.videoUrl && (
        <TransformWrapper>
          <div className='w-full !cursor-grab'>
            <TransformComponent>
              <Suspense
                fallback={<Skeleton className='rounded-2 h-full !w-full' />}
              >
                <video
                  controls
                  className='!w-full bg-black'
                  aria-label='Video player'
                  onClick={(e) => e.preventDefault()}
                >
                  <source src={fileUrl?.videoUrl} type='video/mp4' />
                </video>
              </Suspense>
            </TransformComponent>
          </div>
          <Controls />
        </TransformWrapper>
      )}
      {fileUrl?.url && (
        <FilePreview
          url={fileUrl?.url}
          openFilePreview={openFilePreview}
          setOpenFilePreview={setOpenFilePreview}
          isModalWide={true}
        />
      )}
    </div>
  );
};

export default FilesPreview;
