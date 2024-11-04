'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder-2';
import { LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import Icon from './custom-icon';
import useUserProfile from '@/hooks/useUserProfile';
import { getImageUrl } from '@/lib/common/getImageUrl';
import { deleteUploadedFile } from '@/app/api/create-patient-request';
import { getErrorMessage } from '@/lib/utils';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import CustomAlertBox from './custom-alert-box';
import { DropdownMenu } from '../ui/dropdown-menu';
import { openUploadDialog } from '@/lib/common/openUploadDialog';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '../ui/dialog';
import { Button } from '../ui/button';
import VideoRecorder from '../ipad-components/video-recorder';
import VideoPreview from '../video-preview';

enum RecorderStatus {
  Idle = 'idle',
  Acquiring_Media = 'acquiring_media',
  recording = 'recording',
  stopped = 'stopped',
}

type Iprops = {
  onchange: (file: File | null) => unknown;
  value?: string;
  onSuccess?: (value?: string) => void;
  id?: string;
  isIpadView?: boolean;
  setOpenVideoRecoder?: boolean;
};

enum VideoUploads {
  RECORD = 'Record Video',
  GALLERY = 'Upload from  gallery',
}

const RecordScreen = ({ onchange, value, onSuccess, isIpadView }: Iprops) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isIpadOrMobileView = useMemo(() => window.innerWidth < 1024, []); // 1024 is iPad pro width
  const [openFilePreview, setOpenFilePreview] = useState(false);
  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    clearBlobUrl,
    previewStream: previewStream,
  } = useReactMediaRecorder({
    screen: !isIpadOrMobileView,
    audio: false,
    video: isIpadOrMobileView && { facingMode: { exact: 'environment' } },
    blobPropertyBag: {
      type: 'video/mp4',
    },
    mediaRecorderOptions: { mimeType: 'video/mp4' },
  });

  const [videoUrl, setVideoUrl] = useState<string | null | undefined>();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [openVideoRecoder, setOpenVideoRecoder] = useState<boolean>(false);
  const [isCancelRecording, setIsCancelRecording] = useState<boolean>(false);
  const [isSaveRecording, setIsSaveRecording] = useState<boolean>(false);
  const { t } = useTranslation();
  const user = useUserProfile();

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
      videoRef.current.play();
    }
  }, [previewStream]);

  const handleSaveRecording = () => {
    stopRecording();
    videoRef.current?.pause();
    setOpenVideoRecoder(false);
    setIsCancelRecording(false);
    setIsSaveRecording(true);
  };

  const handleStopRecording = () => {
    setIsCancelRecording(false);
    setIsSaveRecording(false);
    stopRecording();
    setOpenVideoRecoder(false);
    videoRef.current?.pause();
  };

  const convertUrlToFile = async (blobUrl: string) => {
    if (!blobUrl || (!isSaveRecording && isIpadOrMobileView)) {
      return;
    }
    setLoading(true);
    const videoBlob = await fetch(blobUrl).then((r) => r.blob());
    const videoFile = new File([videoBlob], 'video.mp4', {
      type: 'video/mp4',
    });
    const videoUrl = URL.createObjectURL(videoFile);
    const response: any = await onchange(videoFile);
    if (response) {
      onSuccess?.(response?.key as string);
      setLoading(false);
      setIsEdit(false);
      setVideoUrl(videoUrl);
    }
  };

  useEffect(() => {
    if (mediaBlobUrl) {
      convertUrlToFile(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  useEffect(() => {
    if (user?.s3BucketUrl && value) {
      const url = getImageUrl(user?.s3BucketUrl, value);
      setVideoUrl(url);
    }
  }, [user, value]);

  const onDeletFile = async (
    e?:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.ChangeEvent<HTMLInputElement>,
    key?: string,
    showMessage = true,
  ) => {
    e?.preventDefault();
    try {
      setDeleting(true);
      if (!key) {
        return;
      }
      const response = await deleteUploadedFile(key);
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
      } else {
        if (showMessage) {
          toast.success(t('translation.fileDeletedSuccessfully'));
          onSuccess?.('');
        }
        clearBlobUrl();
        setVideoUrl(undefined);
        onchange?.(null);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setOpen(false);
      setDeleting(false);
    }
  };

  const onSelect = async (value?: string) => {
    setIsCancelRecording(false);
    if (value === VideoUploads.RECORD && !isIpadOrMobileView) {
      startRecording();
      if (mediaBlobUrl) {
        convertUrlToFile(mediaBlobUrl);
      }
    } else if (value === VideoUploads.RECORD && isIpadOrMobileView) {
      setOpenVideoRecoder(true);
    } else {
      const files = await openUploadDialog('video/mp4');
      if (files?.length) {
        setLoading(true);
        const response: any = await onchange(files?.[0]);
        if (response) {
          onSuccess?.(response?.key as string);
          setLoading(false);
          setIsEdit(false);
          setVideoUrl(response?.key as string);
        }
      }
    }
  };

  return (
    <>
      <div className='flex flex-col'>
        {status !== RecorderStatus.Idle && status !== RecorderStatus.stopped ? (
          <div
            className={`${'flex min-h-[32px] min-w-[75px] !cursor-pointer items-center justify-center rounded-[4px] border border-primary bg-lightPrimary p-4 !py-1 text-center text-[16px] font-medium text-primary nm:min-h-[45px] nm:min-w-[156px] nm:py-[10px] md:min-h-[45px] md:min-w-[156px]'} ${isIpadView ? '!min-w-[156px]' : ''}`}
          >
            {status}
          </div>
        ) : (
          <div className='relative flex items-center justify-end !gap-5 max-ms:justify-start'>
            {videoUrl && !isEdit ? (
              <div className='flex items-center gap-5'>
                <video
                  onClick={() => setOpenFilePreview(true)}
                  src={videoUrl}
                  className='h-[54px] w-20 !rounded-[4px]'
                  controls
                  autoPlay
                  muted
                  loop
                />
                <div className='flex items-center gap-3 md:gap-[14px]'>
                  <div className='!h-[36px] !w-[36px] cursor-pointer rounded-full bg-backgroundGray !p-[0px] hover:bg-lightPrimary'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild className='outline-none'>
                        <div className='flex !h-[36px] !w-[36px] !cursor-pointer items-center justify-center !p-0 text-center text-[16px] font-medium '>
                          {loading ? (
                            <LoaderIcon
                              size={15}
                              className='animate-spin text-primary'
                            />
                          ) : (
                            <Icon
                              name='edit'
                              height={16}
                              width={16}
                              className='m-auto '
                            />
                          )}
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className='w-100 mt-1 min-w-[75px] border-none max-ms:min-w-[130px] nm:min-w-[156px] md:min-w-[156px]'
                        align='center'
                        alignOffset={-100}
                        forceMount
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className='cursor-pointer py-3'
                            onClick={() => onSelect(VideoUploads.GALLERY)}
                          >
                            {t('translation.uploadVideo')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onSelect(VideoUploads.RECORD)}
                            className='cursor-pointer py-3'
                          >
                            {t('translation.recordVideo')}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogTrigger
                      disabled={loading}
                      className='!outline-none'
                    >
                      <div
                        className={`${loading ? 'opacity-50' : ''} cursor-pointer rounded-full bg-backgroundGray p-[10px] hover:bg-lightPrimary`}
                      >
                        <Icon
                          name='delete'
                          height={16}
                          width={16}
                          className='m-auto'
                        />
                      </div>
                    </AlertDialogTrigger>

                    <CustomAlertBox
                      loading={deleting}
                      setOpen={setOpen}
                      handleConfirm={(e) => onDeletFile(e, value)}
                      title={t('translation.youWantToDeleteThisFile')}
                      className='w-[464px] p-[40px]'
                    />
                  </AlertDialog>
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className='outline-none'>
                  <div
                    className={`${'flex min-h-[32px] min-w-[75px] !cursor-pointer items-center justify-center rounded-[4px] border border-primary p-4 !py-1 text-center text-[16px] font-medium text-primary nm:min-h-[45px] nm:min-w-[156px] nm:py-[10px] md:min-h-[45px] md:min-w-[156px]'} ${isIpadView ? '!min-w-[156px]' : ''} hover:bg-lightPrimary`}
                  >
                    {loading ? (
                      <LoaderIcon
                        size={15}
                        className='animate-spin text-primary'
                      />
                    ) : (
                      t('translation.selectVideo')
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-100 mt-1 min-w-[75px] border-none max-ms:min-w-[130px] nm:min-w-[156px] md:min-w-[156px]'
                  align='center'
                  alignOffset={-100}
                  forceMount
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className='cursor-pointer py-3'
                      onClick={() => onSelect(VideoUploads.GALLERY)}
                    >
                      {t('translation.uploadVideo')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onSelect(VideoUploads.RECORD)}
                      className='cursor-pointer py-3'
                    >
                      {t('translation.recordVideo')}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
      <AlertDialog open={isCancelRecording && open} onOpenChange={setOpen}>
        <CustomAlertBox
          loading={false}
          setOpen={setOpen}
          handleConfirm={() => handleStopRecording()}
          title={t('translation.youWantToCancelThisRecording')}
          className='w-[464px] p-[40px]'
        />
      </AlertDialog>
      <Dialog
        open={openVideoRecoder}
        onOpenChange={() => {
          status === 'recording'
            ? (setOpen(true), setIsCancelRecording(true))
            : setOpenVideoRecoder(false);
        }}
      >
        <DialogContent className='max-md:max-w-[80%]'>
          <DialogHeader className='mt-6'>
            <VideoRecorder
              startRecording={startRecording}
              videoRef={videoRef}
              status={status}
              openVideoRecoder={openVideoRecoder}
            />
          </DialogHeader>
          <DialogFooter className='!justify-center'>
            {status === 'recording' && (
              <Button
                onClick={handleSaveRecording}
                type='button'
                className='text-[16px] text-white'
              >
                {t('translation.saveRecoder')}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {videoUrl && (
        <VideoPreview
          videoUrl={videoUrl}
          openFilePreview={openFilePreview}
          setOpenFilePreview={setOpenFilePreview}
        />
      )}
    </>
  );
};

export default RecordScreen;
