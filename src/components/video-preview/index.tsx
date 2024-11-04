import React from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface IProps {
  openFilePreview: boolean;
  setOpenFilePreview: (value: boolean) => void;
  videoUrl: string;
}

const VideoPreview = ({
  openFilePreview,
  setOpenFilePreview,
  videoUrl,
}: IProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={openFilePreview} onOpenChange={setOpenFilePreview}>
      <DialogContent className='max-ms:max-w-[90%] sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{t('translation.preview')}</DialogTitle>
        </DialogHeader>
        <video
          src={videoUrl}
          className='h-full max-h-[75vh] w-full !rounded-[4px]'
          controls
          autoPlay
          muted
        />
      </DialogContent>
    </Dialog>
  );
};
export default VideoPreview;
