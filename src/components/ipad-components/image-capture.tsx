import React, { Dispatch, SetStateAction } from 'react';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';

import { Button } from '../ui/button';

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'environment',
};
type IProp = {
  webcamRef: React.RefObject<Webcam>;
  setCameraPermissionError: Dispatch<SetStateAction<string>>;
  setCameraPermissionSuccess: Dispatch<SetStateAction<string>>;
  cameraPermissionSuccess: string;
  capture: () => void;
  editing: boolean;
  loading: boolean;
};

export const WebcamCapture = ({
  webcamRef,
  setCameraPermissionError,
  setCameraPermissionSuccess,
  cameraPermissionSuccess,
  capture,
  editing,
  loading,
}: IProp) => {
  const { t } = useTranslation();

  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        className={`${!cameraPermissionSuccess && 'hidden !h-[30px]'}`}
        onUserMediaError={() => {
          setCameraPermissionError(t('translation.allowCameraAccess'));
          setCameraPermissionSuccess('');
        }}
        onUserMedia={() => {
          setCameraPermissionError('');
          setCameraPermissionSuccess(
            t('translation.checkingCameraPermissions'),
          );
        }}
        screenshotFormat='image/jpeg'
        width={1280}
        videoConstraints={videoConstraints}
      />
      {cameraPermissionSuccess && (
        <div className='flex justify-center'>
          <Button
            onClick={capture}
            type='button'
            className='mt-5 min-w-[154px] text-[16px] text-white outline-none '
            loading={editing || loading}
          >
            {t('translation.captureImage')}
          </Button>
        </div>
      )}
    </>
  );
};
