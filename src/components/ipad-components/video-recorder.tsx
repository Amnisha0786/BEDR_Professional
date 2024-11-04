import { useTranslation } from 'react-i18next';

import { Button } from '../ui/button';

type IProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
  startRecording: () => void;
  status: string;
  openVideoRecoder: boolean;
};

const VideoRecorder = ({
  videoRef,
  startRecording,
  status,
  openVideoRecoder,
}: IProps) => {
  const { t } = useTranslation();

  const handleStartRecording = () => {
    const askCameraPermission = async (): Promise<MediaStream | null> =>
      await navigator.mediaDevices.getUserMedia({ video: true });

    let localstream: MediaStream | null;
    askCameraPermission()
      .then((response) => {
        localstream = response;
      })
      .then(() => {
        localstream?.getTracks().forEach((track) => {
          track.stop();
        });
      })
      .catch((error) => console.log(error));
    startRecording();
  };

  return (
    <div>
      {status !== 'recording' && openVideoRecoder && (
        <div className='flex justify-center'>
          <Button
            className=' mt-3 text-[16px] text-white'
            onClick={handleStartRecording}
            disabled={status === 'recording'}
          >
            {t('translation.startRecording')}
          </Button>
        </div>
      )}
      {status === 'recording' && openVideoRecoder && (
        <video
          className='mt-2 !h-auto !w-full'
          ref={videoRef}
          autoPlay
          muted
        ></video>
      )}
    </div>
  );
};

export default VideoRecorder;
