'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

import { DialogContent } from '../ui/dialog';
import useUserProfile from '@/hooks/useUserProfile';
import { getImageUrl } from '@/lib/common/getImageUrl';

const PdfViewer = dynamic(() => import('../pdf-viewer'));

type TProps = {
  fileKey?: string;
  isInsurance?: boolean;
  fullUrl?: string;
  isSettingPage?: boolean;
};

const PdfModalPreview = ({
  fileKey = '',
  isInsurance = false,
  fullUrl = '',
}: TProps) => {
  const user = useUserProfile();
  const fileUrl = useMemo(
    () =>
      getImageUrl(
        user?.s3BucketUrl,
        isInsurance ? user?.insuranceCertificate : fileKey,
      ),
    [user, fileKey],
  );

  return (
    <DialogContent
      className='h-[80%] max-w-[80%] overflow-y-auto overflow-x-hidden rounded-[4px]'
      draggable
    >
      <PdfViewer fileUrl={(fullUrl ? fullUrl : fileUrl) || ''} />
    </DialogContent>
  );
};

export default PdfModalPreview;
