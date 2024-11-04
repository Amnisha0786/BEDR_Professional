'use client';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '../ui/card';
import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import {
  TExpressConsentAllow,
  TGetUnpaidFileData,
  TPatientConsentIpad,
} from '@/models/types/ipad';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '../ui/label';
import SignaturePad from '../custom-components/signature-pad';
import { submitPatientConsent } from '@/app/api/ipad-unpaid-files';
import { getErrorMessage } from '@/lib/utils';
import { uploadFile } from '@/app/api/create-patient-request';
import { Dialog } from '../ui/dialog';
import PdfModalPreview from '../pdf-modal-preview';
import { TTermsAndConditions } from '@/models/types/settings';
import { getPrivacyPolicy, getTermsConditions } from '@/app/api/settings';
import useUserProfile from '@/hooks/useUserProfile';
import { getImageUrl } from '@/lib/common/getImageUrl';

type Tprops = {
  setStep?: Dispatch<SetStateAction<number>>;
  setSelectedSection?: Dispatch<SetStateAction<string>>;
  fileData?: TGetUnpaidFileData | null;
  formedData?: TPatientConsentIpad;
};

const PatientConsentContent3 = ({
  setStep = () => { },
  formedData,
  fileData = null,
  setSelectedSection = () => { },
}: Tprops) => {
  const form = useForm<TExpressConsentAllow>({
    mode: 'onSubmit',
    defaultValues: {
      useAnonymisedDataConsent: false,
      agreeTermsAndConditions: false,
      sendFurtherInformation: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [isSignatureAvailable, setIsSignatureAvailable] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [termsErrorMessage, setTermsErrorMessage] = useState<string>('');
  const [termsConditions, setTermsConditions] = useState<TTermsAndConditions>();
  const [privacyPolicy, setPrivacyPolicy] = useState<TTermsAndConditions>();
  const [openTerms, setOpenTerms] = useState(false);
  const [openPrivacyPolicy, setOpenPrivacyPolicy] = useState(false);
  const [signatureImage, setSignatureImage] = useState('');
  const [isSignatureEdit, setIsSignatureEdit] = useState(false);

  const today = useMemo(() => {
    return dayjs(new Date())?.format('DD MMM YYYY');
  }, []);

  const hideError = useCallback(
    (name: FieldPath<TExpressConsentAllow>) => form.clearErrors(name),
    [],
  );

  const handleChangeValue = useCallback(
    (name: FieldPath<TExpressConsentAllow>, value: boolean) => {
      form.setValue(name, value);
    },
    [],
  );

  const { t } = useTranslation();
  const user = useUserProfile();
  const sigCanvasRef = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    if (fileData?.consentForm) {
      const consentDetails = fileData?.consentForm;
      form?.reset({
        useAnonymisedDataConsent:
          consentDetails?.useAnonymisedDataConsent || false,
        agreeTermsAndConditions:
          consentDetails?.agreeTermsAndConditions || false,
        sendFurtherInformation: consentDetails?.sendFurtherInformation || false,
      });
    }
  }, [fileData]);

  const clear = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      setIsSignatureAvailable(false);
      setErrorMessage('');
    }
  };

  const uploadImage = useCallback(
    async (file: File | null, values: TExpressConsentAllow) => {
      try {
        setLoading(true);
        const response = await uploadFile(file as File);
        if (response?.data?.status !== 200) {
          toast.error(response?.data?.message);
        } else {
          const fileKey = response?.data?.data?.original?.key;
          onSubmitData(fileKey, values);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
        setLoading(false);
      }
    },
    [],
  );

  const saveSignature = useCallback(
    (values: TExpressConsentAllow) => {
      if (sigCanvasRef.current) {
        const canvas = sigCanvasRef.current.getTrimmedCanvas();
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'signature.png', {
              type: 'image/png',
            });
            uploadImage(file, values);
          }
        }, 'image/png');
      } else if (signatureImage) {
        onSubmitData(signatureImage, values);
      }
    },
    [uploadImage, signatureImage, user],
  );

  const onSubmitData = useCallback(
    async (fileKey: string, values: TExpressConsentAllow) => {
      try {
        setLoading(true);
        const response = await submitPatientConsent({
          ...formedData,
          useAnonymisedDataConsent: values?.useAnonymisedDataConsent,
          agreeTermsAndConditions: values?.agreeTermsAndConditions,
          sendFurtherInformation: values?.sendFurtherInformation,
          patientFileId: fileData?.id,
          shareDiagnosisReportConsent: true,
          collectStoreAndTransferConsent: true,
          signature: fileKey,
        } as TPatientConsentIpad);
        if (response?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        setSelectedSection('');
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },
    [formedData],
  );

  const onSubmit = useCallback(
    async (values: TExpressConsentAllow) => {
      setErrorMessage('');
      setTermsErrorMessage('');

      let hasError = false;
      if (!values.agreeTermsAndConditions) {
        setTermsErrorMessage(t('translation.ipadAgreeBooktermsandPrivacy'));
        hasError = true;
      }
      if (!isSignatureAvailable) {
        setErrorMessage(t('translation.signatureRequired'));
        hasError = true;
      }
      if (hasError) {
        return;
      }
      saveSignature(values);
    },
    [isSignatureAvailable, signatureImage, isSignatureEdit, saveSignature],
  );

  const fetchTermsConditions = useCallback(async () => {
    try {
      const response = await getTermsConditions({ role: 'practice' });
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setTermsConditions(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    }
  }, []);

  useEffect(() => {
    fetchTermsConditions();
  }, [fetchTermsConditions]);

  const fetchPrivacyPolicy = useCallback(async () => {
    try {
      const response = await getPrivacyPolicy({ role: 'practice' });
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setPrivacyPolicy(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    }
  }, []);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, [fetchPrivacyPolicy]);

  const handleSpanClick = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    value: string,
  ) => {
    e.preventDefault();
    if (value === 'terms') {
      setOpenTerms(true);
    } else {
      setOpenPrivacyPolicy(true);
    }
  };

  useEffect(() => {
    if (fileData?.consentForm?.signature) {
      setIsSignatureAvailable(true);
      setSignatureImage(fileData?.consentForm?.signature);
    }
  }, [fileData]);

  useEffect(() => {
    if (sigCanvasRef.current) {
      if (loading) {
        sigCanvasRef.current.off();
        return;
      }
      sigCanvasRef.current.on();
    }
  }, [loading]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className=''>
            <CardHeader className=' p-[30px] pb-[20px]'>
              <CardDescription>
                <TypographyP
                  primary
                  noBottom
                  classname='text-[20px] font-semibold'
                >
                  {t('translation.expressConsentToAllowBedrToUse')}
                </TypographyP>
              </CardDescription>
            </CardHeader>
            <CardContent className='px-[30px] pb-[15px]'>
              <TypographyP size={16} primary classname='font-normal flex gap-3'>
                <div>
                  {' '}
                  <FormField
                    control={form.control}
                    name='useAnonymisedDataConsent'
                    render={({ field }) => (
                      <FormItem className='flex'>
                        <FormControl>
                          <Checkbox
                            id='useAnonymisedDataConsent'
                            className='mr-2 mt-[4px] !h-[15px] !w-[15px]'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              handleChangeValue(
                                'useAnonymisedDataConsent',
                                checked as boolean,
                              );
                              hideError('useAnonymisedDataConsent');
                            }}
                          />
                        </FormControl>
                        <div>
                          <Label
                            className='text-[16px] font-normal'
                            htmlFor='useAnonymisedDataConsent'
                          >
                            {t(
                              'translation.expresslyConsentToMyAnonymisedImagesandData',
                              {
                                name: `${fileData?.patient?.firstName || ''} ${fileData?.patient?.lastName || ''}`,
                              },
                            )}
                          </Label>
                          <FormMessage className='mb-[0px] min-h-[21px]' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TypographyP>
              <TypographyP size={16} primary classname='font-normal flex gap-3'>
                <div>
                  {' '}
                  <FormField
                    control={form.control}
                    name='agreeTermsAndConditions'
                    render={({ field }) => (
                      <FormItem className='flex'>
                        <FormControl>
                          <Checkbox
                            id='agreeTermsAndConditions'
                            className='mr-2 mt-[4px] !h-[15px] !w-[15px]'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              handleChangeValue(
                                'agreeTermsAndConditions',
                                checked as boolean,
                              );
                              setTermsErrorMessage('');
                              hideError('agreeTermsAndConditions');
                            }}
                          />
                        </FormControl>
                        <div>
                          <Label
                            className='text-[16px] font-normal'
                            htmlFor='agreeTermsAndConditions'
                          >
                            {t('translation.AgreeToBookAnEyeDoctor')}
                            <span
                              onClick={(e) => handleSpanClick(e, 'terms')}
                              className='me-1 ml-1 cursor-pointer font-medium text-primary underline'
                            >
                              {t('translation.termsOfUse')}
                            </span>{' '}
                            {t('translation.and')}{' '}
                            <span
                              onClick={(e) => handleSpanClick(e, 'privacy')}
                              className='ml-1 cursor-pointer font-medium text-primary underline'
                            >
                              {t('translation.privacyPolicy')}
                            </span>
                          </Label>
                          <TypographyP
                            size={16}
                            primary
                            classname={`font-normal ${!termsErrorMessage && form.watch('agreeTermsAndConditions') && 'invisible'} !text-error min-h-[18px]`}
                          >
                            {termsErrorMessage}
                          </TypographyP>
                        </div>
                      </FormItem>
                    )}
                  />
                  <Dialog open={openTerms} onOpenChange={setOpenTerms}>
                    <PdfModalPreview fullUrl={termsConditions?.fileKey} />
                  </Dialog>
                  <Dialog
                    open={openPrivacyPolicy}
                    onOpenChange={setOpenPrivacyPolicy}
                  >
                    <PdfModalPreview fullUrl={privacyPolicy?.fileKey} />
                  </Dialog>
                </div>
              </TypographyP>
              <TypographyP size={16} primary classname='font-normal flex gap-3'>
                <div>
                  {' '}
                  <FormField
                    control={form.control}
                    name='sendFurtherInformation'
                    render={({ field }) => (
                      <FormItem className='flex'>
                        <FormControl>
                          <Checkbox
                            id='sendFurtherInformation'
                            className='mr-2 mt-[4px] !h-[15px] !w-[15px]'
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              handleChangeValue(
                                'sendFurtherInformation',
                                checked as boolean,
                              );
                              hideError('sendFurtherInformation');
                            }}
                          />
                        </FormControl>
                        <div>
                          <Label
                            className='text-[16px] font-normal'
                            htmlFor='sendFurtherInformation'
                          >
                            {t(
                              'translation.WeWouldLikeToSendYouFurtherInformationAbout',
                            )}
                          </Label>
                          <FormMessage className='mb-[0px] min-h-[21px]' />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </TypographyP>

              <h1 className='mb-2 text-center font-medium text-darkGray'>
                {signatureImage && !isSignatureEdit
                  ? t('translation.yourSignature')
                  : t('translation.signatureHere')}
              </h1>
              {signatureImage && !isSignatureEdit ? (
                <>
                  <FlexBox flex classname='min-h-[200px]'>
                    <img
                      src={getImageUrl(user?.s3BucketUrl, signatureImage) || ''}
                    />
                  </FlexBox>
                  <FlexBox flex classname='justify-end'>
                    <Button
                      variant={'outline'}
                      type='button'
                      className='my-2 text-[16px]'
                      onClick={() => { setIsSignatureEdit(true), setIsSignatureAvailable(false) }}
                    >
                      {t('translation.editSignature')}
                    </Button>
                  </FlexBox>
                </>
              ) : (
                <>
                  <SignaturePad
                    sigCanvasRef={sigCanvasRef}
                    setIsSignatureAvailable={setIsSignatureAvailable}
                  />
                  <FlexBox flex classname='justify-end gap-5'>
                    {isSignatureEdit && (
                      <button
                        type='button'
                        className='mt-2 text-error underline'
                        onClick={() => { setIsSignatureEdit(false), setIsSignatureAvailable(true) }}
                        disabled={loading}
                      >
                        {t('translation.cancel')}
                      </button>
                    )}
                    <button
                      type='button'
                      className='mt-2 text-darkGray underline'
                      onClick={clear}
                      disabled={loading}
                    >
                      {t('translation.clear')}
                    </button>
                  </FlexBox>
                </>
              )}
              <TypographyP
                size={16}
                primary
                classname='font-normal !text-[#de0707]'
              >
                {!isSignatureAvailable && errorMessage}
              </TypographyP>
            </CardContent>
            <CardFooter className='flex-col px-[30px]'>
              <FlexBox flex classname='justify-between card w-full'>
                <div>
                  <TypographyP
                    noBottom
                    primary
                    size={16}
                    classname='font-medium capitalize'
                  >
                    {' '}
                    {`${fileData?.patient?.firstName || ''} ${fileData?.patient?.lastName || ''}`}
                  </TypographyP>
                </div>
                <div>
                  <TypographyP
                    noBottom
                    primary
                    size={14}
                    classname='font-normal '
                  >
                    {t('translation.date')}:{' '}
                    <span className='text-[16px] font-medium'> {today}</span>
                  </TypographyP>
                </div>
              </FlexBox>
              <FlexBox flex classname='gap-5  w-full justify-end mt-[30px]'>
                <Button
                  onClick={() => setStep((prev) => prev - 1)}
                  variant={'outlineWithoutHover'}
                  className='px-[60px]'
                  type='button'
                  disabled={loading}
                >
                  {t('translation.back')}
                </Button>
                <Button
                  type='submit'
                  className='px-[60px] text-white'
                  disabled={loading}
                  loading={loading}
                  center
                >
                  {t('translation.submit')}
                </Button>
              </FlexBox>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};

export default PatientConsentContent3;
