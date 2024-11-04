'use client';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FieldError } from 'react-hook-form';
import { LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';
import Webcam from 'react-webcam';
import { useTranslation } from 'react-i18next';

import Icon from './custom-icon';
import { TypographyP } from '../ui/typography/p';
import { deleteUploadedFile } from '@/app/api/create-patient-request';
import { getErrorMessage } from '@/lib/utils';
import useUserProfile from '@/hooks/useUserProfile';
import { getImageUrl } from '@/lib/common/getImageUrl';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import CustomAlertBox from './custom-alert-box';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { WebcamCapture } from '../ipad-components/image-capture';
import { Button } from '../ui/button';
import FilePreview from '../file-preview';
import DicomView from '../dicom-preview';
import { getDicomFileToken } from '@/app/api/file-in-progress';
import PdfModalPreview from '../pdf-modal-preview';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  label?: string;
  error?: FieldError;
  onchange: (file: File | null) => unknown;
  fieldValue?: string;
  showName?: boolean;
  loading?: boolean;
  onSuccess?: (value?: string) => void;
  isIpadView?: boolean;
  isIpadDicomFile?: boolean;
}

type TImageObject = {
  imageUrl?: string;
  name?: string;
  key?: string;
};

const CustomUpload = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id = 'id',
      onchange,
      fieldValue,
      accept = 'image/png, image/jpg, image/jpeg, application/pdf',
      isIpadView,
      isIpadDicomFile,
      showName = false,
      loading = false,
      onSuccess,
      ...props
    },
    ref,
  ) => {
    const webcamRef = useRef<Webcam>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<TImageObject | undefined>();
    const [imageSrc, setImageSrc] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [openCamera, setOpenCamera] = useState(false);
    const [openFileUploadOptions, setOpenFileUploadOptions] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [openFilePreview, setOpenFilePreview] = useState(false);
    const [editing, setEditing] = useState(false);
    const [previewingDicom, setPreviewingDicom] = useState(false);
    const [openPdfViewer, setOpenPdfViewer] = useState(false);
    const [pdfToView, setPdfToView] = useState('');

    const user = useUserProfile();
    const [cameraPermissionError, setCameraPermissionError] =
      useState<string>('');
    const [cameraPermissionSuccess, setCameraPermissionSuccess] =
      useState<string>('');
    const { t } = useTranslation();

    useEffect(() => {
      if (user?.s3BucketUrl && fieldValue?.length) {
        const url = getImageUrl(user?.s3BucketUrl, fieldValue);
        if (
          fieldValue?.includes('.dcm') ||
          fieldValue?.includes('.DCM') ||
          fieldValue?.includes('.pdf') ||
          fieldValue?.includes('.PDF')
        ) {
          const splittedValue = fieldValue?.split('-') || 'file';
          setImage({ name: splittedValue[1] });
        } else {
          if (url) {
            setImage({ imageUrl: url });
          }
        }
      }
    }, [user, fieldValue]);

    const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (e?.target?.files?.length && fieldValue && isEdit) {
        setEditing(true);
        onDeletFile(e, fieldValue, false);
      }

      if (e.target.files) {
        const file: File = e.target.files[0];
        if (file) {
          try {
            const fileUrl = URL.createObjectURL(file);
            const response: any = await onchange?.(file);
            if (response) {
              onSuccess?.(response?.key as string);
              if (showName) {
                setImage({
                  name: file?.name || response?.name,
                  key: response?.key as string,
                });
              } else {
                setImage({
                  imageUrl: fileUrl,
                  key: response?.key as string,
                });
              }
            }
          } finally {
            setIsEdit(false);
            setEditing(false);
          }
        }
      }
    };

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
          if (inputRef.current) {
            inputRef.current.value = '';
          }

          setImage(undefined);
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

    const handleImageCapture = () => {
      setOpenCamera(true);
    };

    const convertUrlToFile = async (blobUrl: string) => {
      if (!blobUrl) {
        return;
      }
      const imageBlob = await fetch(blobUrl).then((r) => r.blob());
      const imageFile = new File([imageBlob], 'captured-image.png', {
        type: 'image/png',
      });
      if (imageFile) {
        try {
          const imageUrl = URL.createObjectURL(imageFile);
          const response: any = await onchange?.(imageFile);
          if (response) {
            onSuccess?.(response?.key as string);
            if (showName) {
              setImage({
                name: imageFile?.name || response?.name,
                key: response?.key as string,
              });
            } else {
              setImage({
                imageUrl: imageUrl,
                key: response?.key as string,
              });
            }
            setOpenFileUploadOptions(false);
            setOpenCamera(false);
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          toast.error(errorMessage || t('translation.somethingWentWrong'));
        } finally {
          setIsEdit(false);
          setEditing(false);
        }
      }
    };

    useEffect(() => {
      if (imageSrc) {
        convertUrlToFile(imageSrc);
      }
    }, [imageSrc]);

    const capture = useCallback(() => {
      const imageClicked = webcamRef.current?.getScreenshot();
      if (imageClicked) {
        setImageSrc(imageClicked);
      }
    }, [webcamRef]);

    const handleClose = () => {
      setImageSrc('');
      setOpenCamera(false);
      setOpenFileUploadOptions(false);
      if (webcamRef.current) {
        const stream = webcamRef.current.video?.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };

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
      [user],
    );

    return (
      <>
        <div className='flex items-center justify-end gap-5 max-ms:justify-start '>
          {image?.imageUrl && !showName && (
            <div
              onClick={() => setOpenFilePreview(true)}
              className='h-[54px] max-w-20 cursor-pointer rounded-[4px]'
            >
              <img
                src={image?.imageUrl}
                alt='img'
                className='!h-full !w-full rounded-[4px] object-cover'
              />
            </div>
          )}
          {fieldValue &&
            (fieldValue?.includes('.pdf') || fieldValue?.includes('.PDF')) && (
              <div className='self-end'>
                <TypographyP
                  size={12}
                  classname='max-w-48 max-ms:max-w-52 break-words bg-lightPrimary p-2 px-3 rounded-[4px] text-primary hover:underline truncate cursor-pointer'
                  onClick={() => {
                    setPdfToView(fieldValue);
                    setOpenPdfViewer(true);
                  }}
                >
                  {image?.name}
                </TypographyP>
              </div>
            )}

          {showName && fieldValue && (
            <div className='self-end'>
              <DicomView
                onSuccess={() => generateDicomFileToken(fieldValue)}
                loading={previewingDicom}
              >
                <TypographyP
                  size={12}
                  classname='max-w-48 max-ms:max-w-52 break-words bg-lightPrimary p-2 px-3 rounded-[4px] text-primary hover:underline truncate cursor-pointer'
                >
                  {image?.name}
                </TypographyP>
              </DicomView>
            </div>
          )}
          <div className='flex flex-1 items-center gap-3 md:gap-[14px]'>
            {editing || loading ? (
              <div
                className={`${image?.imageUrl || image?.name ? 'cursor-pointer rounded-full bg-backgroundGray p-[10px]' : 'flex min-h-[32px] min-w-[75px] !cursor-pointer items-center justify-center rounded-[4px] border border-primary !py-1 px-2 text-center text-[16px] font-medium text-primary nm:min-h-[45px] nm:min-w-[156px] nm:px-12 w-full nm:py-[10px] md:min-h-[45px] md:min-w-[156px] md:!py-[10px] md:px-12'}`}
              >
                <LoaderIcon size={15} className='animate-spin text-primary' />
              </div>
            ) : (
              <label
                onClick={() => {
                  isIpadView ? setOpenFileUploadOptions(true) : null;
                }}
                htmlFor={isIpadView ? '' : id}
                className={`${image?.imageUrl || image?.name ? 'cursor-pointer rounded-full bg-backgroundGray p-[10px]' : `flex min-h-[32px] w-full min-w-[75px] !cursor-pointer items-center justify-center rounded-[4px] border border-primary !py-1 px-2 text-center text-[16px] font-medium text-primary nm:min-h-[45px] nm:min-w-[156px] nm:px-12 nm:py-[10px] md:min-h-[45px] md:min-w-[156px] md:!py-[10px] md:px-12 ${isIpadView || isIpadDicomFile ? '!min-w-[156px]' : ''}`} hover:bg-lightPrimary`}
              >
                {image?.imageUrl || image?.name ? (
                  <div onClick={() => setIsEdit(true)}>
                    <Icon
                      name='edit'
                      height={16}
                      width={16}
                      className='m-auto cursor-pointer'
                    />
                  </div>
                ) : (
                  t('translation.upload')
                )}
              </label>
            )}
            <input
              accept={accept}
              type='file'
              {...props}
              onChange={onChangeFile}
              ref={ref || inputRef}
              id={id}
              className='hidden'
            />
            {(image?.imageUrl || image?.name) && (
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger className='!outline-none'>
                  <div className='cursor-pointer rounded-full bg-backgroundGray p-[10px] hover:bg-lightPrimary'>
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
                  handleConfirm={(e) => onDeletFile(e, fieldValue)}
                  title={t('translation.youWantToDeleteThisFile')}
                  className='w-[464px] p-[40px]'
                />
              </AlertDialog>
            )}
          </div>
        </div>
        <Dialog open={openFileUploadOptions} onOpenChange={handleClose}>
          <DialogContent
            oulinedCross={true}
            className='outline-none max-md:max-w-[80%]'
          >
            <DialogHeader className='outline-none'>
              <DialogTitle className='mt-0 text-center text-[14px] font-normal text-gray'>
                {!openCamera && t('translation.chooseAnOption')}
              </DialogTitle>
              {openCamera ? (
                <div className='!mt-8'>
                  {cameraPermissionError ? (
                    <TypographyP classname='font-medium text-center'>
                      {t('translation.pleaseAllowCamera')}
                    </TypographyP>
                  ) : (
                    <>
                      <WebcamCapture
                        webcamRef={webcamRef}
                        setCameraPermissionError={setCameraPermissionError}
                        setCameraPermissionSuccess={setCameraPermissionSuccess}
                        cameraPermissionSuccess={cameraPermissionSuccess}
                        capture={capture}
                        editing={editing}
                        loading={loading}
                      />
                      {!cameraPermissionSuccess && (
                        <TypographyP classname='font-medium text-center'>
                          {t('translation.checkingForCameraPermissions')}
                        </TypographyP>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <>
                  <label
                    htmlFor={id}
                    onClick={() => setOpenFileUploadOptions(false)}
                    className={`${'flex  !min-h-[45px] min-w-[75px] !cursor-pointer items-center justify-center rounded-[4px] border border-primary !py-1 px-2 text-center text-[16px] font-medium  text-primary  nm:min-w-[156px]  md:min-w-[156px] '}`}
                  >
                    {t('translation.chooseFromGallery')}
                  </label>
                  <Button
                    variant={'outlineWithoutHover'}
                    onClick={handleImageCapture}
                    type='button'
                    className='!mt-3 !min-h-[45px]  !px-2 !py-1 text-[16px] outline-none'
                  >
                    {t('translation.takePhoto')}
                  </Button>
                </>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
        {image?.imageUrl && (
          <FilePreview
            url={image?.imageUrl}
            openFilePreview={openFilePreview}
            setOpenFilePreview={setOpenFilePreview}
          />
        )}
        <Dialog open={openPdfViewer} onOpenChange={setOpenPdfViewer}>
          <PdfModalPreview fileKey={pdfToView} />
        </Dialog>
      </>
    );
  },
);

CustomUpload.displayName = 'CustomUpload';

export { CustomUpload };
