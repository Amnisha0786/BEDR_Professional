'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { cn } from '@/lib/utils';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

const PdfViewer = dynamic(() => import('@/components/pdf-viewer'));

interface IProps {
  openFilePreview: boolean;
  setOpenFilePreview: (value: boolean) => void;
  url: string;
  isModalWide?: boolean;
}

const FilePreview = ({
  openFilePreview,
  setOpenFilePreview,
  url,
  isModalWide = false,
}: IProps) => {
  const { t } = useTranslation();
  const isPdf = url?.includes('.pdf');

  return (
    <Dialog open={openFilePreview} onOpenChange={setOpenFilePreview}>
      <DialogContent
        className={cn('max-w-[90vw]', {
          'h-[95vh] w-[95vw] p-2': isModalWide,
        })}
      >
        <DialogHeader>
          <DialogTitle>{t('translation.preview')}</DialogTitle>
        </DialogHeader>
        {isPdf ? (
          <div className='p-4'>
            <PdfViewer fileUrl={url || ''} />
          </div>
        ) : (
          <TransformWrapper>
            <div className='w-full !cursor-grab'>
              <TransformComponent
                wrapperClass='!w-full flex justify-center min-h-[200px]'
                contentClass='!block min-h-[200px]'
              >
                <div className='w-full flex justify-center items-center'>
                <img
                  src={url}
                  alt='img'
                  className={cn('max-h-[85vh] rounded-[4px]', {
                    'object-contain': !isModalWide,
                  })}
                />
                </div>
              </TransformComponent>
            </div>
          </TransformWrapper>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FilePreview;
