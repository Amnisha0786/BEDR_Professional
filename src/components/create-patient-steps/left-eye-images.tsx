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
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldPath, useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

import { Card, CardContent } from '../ui/card';
import FlexBox from '../ui/flexbox';
import Icon from '../custom-components/custom-icon';
import { TypographyH2 } from '../ui/typography/h2';
import StepperFooter from './common-stepper-footer';
import { TypographyP } from '../ui/typography/p';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { CustomUpload } from '../custom-components/custom-upload';
import { TLeftEyeImagesForm } from '@/models/types/create-patient-forms';
import { leftEyeImagesFormSchema } from '@/models/validations/create-patient-forms';
import { AFFECTED_EYE, STEPPER } from '@/enums/create-patient';
import { getErrorMessage } from '@/lib/utils';
import { addEyeImages, uploadFile } from '@/app/api/create-patient-request';
import { Button } from '../ui/button';

const RecordScreen = dynamic(
  () => import('../custom-components/custom-screen-recorder'),
  {
    ssr: false,
  },
);

type Tprops = {
  currentStep: string;
  setCurrentStep: Dispatch<SetStateAction<string>>;
  completedSteps: string[];
  setCompletedSteps?: Dispatch<SetStateAction<string[]>>;
  leftEyeImagesFormData: TLeftEyeImagesForm | undefined;
  setLeftEyeImagesFormData: Dispatch<
    SetStateAction<TLeftEyeImagesForm | undefined>
  >;
  fileId?: string;
  isIpadView?: boolean;
  setSelectedSection?: Dispatch<SetStateAction<string>>;
  goToPatientList?: boolean;
};

const defaultValues = {
  fundusImage: '',
  octVideo: '',
  thicknessMap: '',
  opticDiscImage: '',
  visualFieldTest: '',
  dicomFile: '',
  discOctVideo: '',
  discThicknessProfile: '',
  discDicomFile: '',
  addAnotherImage: '',
};

const LeftEyeImages = ({
  currentStep,
  setCurrentStep,
  completedSteps,
  leftEyeImagesFormData,
  setLeftEyeImagesFormData,
  setCompletedSteps,
  fileId,
  isIpadView,
  setSelectedSection,
  goToPatientList = false,
}: Tprops) => {
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    fundusImage: false,
    thicknessMap: false,
    intraocularPressure: false,
    opticDiscImage: false,
    visualFieldTest: false,
    dicomFile: false,
    octVideo: false,
    discOctVideo: false,
    discThicknessProfile: false,
    discDicomFile: false,
    addAnotherImage: false,
  });

  const { t } = useTranslation();
  const router = useRouter();

  const handleBackButtonClick = () => {
    setCurrentStep(STEPPER.RIGHT_EYE_IMAGES);
  };

  const form = useForm<TLeftEyeImagesForm>({
    resolver: yupResolver(leftEyeImagesFormSchema),
    defaultValues: leftEyeImagesFormData
      ? leftEyeImagesFormData
      : defaultValues,
    mode: 'onSubmit',
  });

  const inited = useRef(false);

  const isLoading = useMemo(() => {
    return (
      loading ||
      loadingStates?.fundusImage ||
      loadingStates?.thicknessMap ||
      loadingStates?.intraocularPressure ||
      loadingStates?.opticDiscImage ||
      loadingStates?.visualFieldTest ||
      loadingStates?.octVideo ||
      loadingStates?.dicomFile ||
      loadingStates?.discOctVideo ||
      loadingStates?.discThicknessProfile ||
      loadingStates?.discDicomFile ||
      loadingStates?.addAnotherImage
    );
  }, [loading, loadingStates]);

  useEffect(() => {
    if (leftEyeImagesFormData && !inited.current) {
      form.reset({ ...leftEyeImagesFormData });
      inited.current = true;
    }
  }, [leftEyeImagesFormData]);

  const onSubmit = useCallback(
    async (values: TLeftEyeImagesForm) => {
      delete values?.intraocularPressure;
      try {
        setLoading(true);
        if (!fileId) {
          return;
        }

        if (values?.id) {
          delete values?.id;
        }
        const response = await addEyeImages({
          patientFileId: fileId,
          eye: AFFECTED_EYE.LEFT,
          ...values,
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
        } else {
          setLeftEyeImagesFormData({ id: fileId, ...values });
          if (isIpadView) {
            setSelectedSection?.('');
          }
          if (!isIpadView) {
            setCurrentStep(STEPPER.COMMUNICATION_PREFERANCES);
            setCompletedSteps?.([...completedSteps, currentStep]);
          }
          if (goToPatientList) {
            router?.push('/ipad/practice/patients-list');
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },
    [fileId, isIpadView, goToPatientList],
  );
  const onSuccess = async (
    keyName: FieldPath<TLeftEyeImagesForm>,
    newKey?: string,
  ) => {
    if (completedSteps?.includes(STEPPER.LEFT_EYE_IMAGES)) {
      try {
        if (!fileId) {
          return;
        }
        await addEyeImages({
          patientFileId: fileId,
          eye: AFFECTED_EYE.LEFT,
          [keyName]: newKey || '',
        });
        handleStateChange(newKey || '', keyName);
        form.setValue(keyName, newKey || '');
      } catch {
        toast.error(t('translation.somethingWentWrong'));
      }
    }
  };

  const handleFileUpload = useCallback(
    async (keyName: FieldPath<TLeftEyeImagesForm>, file: File | null) => {
      form.clearErrors(keyName);
      if (file) {
        try {
          setLoadingStates((prev) => ({
            ...prev,
            [keyName]: true,
          }));
          const response = await uploadFile(file as File);
          if (response?.data?.status !== 200) {
            toast.error(
              response?.data?.message || t('translation.somethingWentWrong'),
            );
          } else {
            const responseData = response?.data?.data?.original;
            form.setValue(keyName, responseData?.key);
            handleStateChange(responseData?.key, keyName);
            if (keyName === 'dicomFile') {
              return {
                name: responseData?.originalname,
                key: responseData?.key,
              };
            } else {
              return {
                key: responseData?.key,
              };
            }
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          toast.error(errorMessage || t('translation.somethingWentWrong'));
        } finally {
          setLoadingStates((prev) => ({
            ...prev,
            [keyName]: false,
          }));
        }
      } else {
        form.setValue(keyName, undefined);
        handleStateChange('', keyName);
      }
    },
    [],
  );

  const handleStateChange = (
    value: string,
    keyname: FieldPath<TLeftEyeImagesForm>,
  ) => {
    setLeftEyeImagesFormData({
      ...form.watch(),
      [keyname]: value || '',
    });
  };

  return (
    <>
      <Card className='min-h-[200px] justify-start bg-white px-5 pb-5 pt-[30px] md:px-[40px] md:pb-[40px]'>
        <FlexBox
          classname={`!flex ${!isIpadView && 'sb:justify-start '}  justify-start`}
        >
          <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
            <Icon
              name='left-eye-images'
              width={19}
              height={14}
              className='m-auto'
            />
          </div>
          <TypographyH2 size={18}>
            {' '}
            {t('translation.leftEyeImages')}
          </TypographyH2>
        </FlexBox>
        <CardContent
          className={`mt-[16px] !w-full ${!isIpadView && 'block nm:flex  sb:block'} p-0`}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div
                className={`py-7 max-md:w-[550px] max-nm:w-full max-nm:max-w-[550px] ${!isIpadView && 'nm:max-w-[550px] sb:max-w-full md:max-w-[500px]'}`}
              >
                <TypographyP primary size={16} classname='font-semibold mb-5'>
                  {t('translation.forAllPatients')}
                </TypographyP>
                <FlexBox classname='flex max-ms:flex-col max-ms:justify-center max-ms:items-start justify-between items-center'>
                  <TypographyP size={16} classname='font-medium mb-8'>
                    {t('translation.addFundusImage')}
                  </TypographyP>
                  <FormField
                    control={form.control}
                    name='fundusImage'
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomUpload
                            fieldValue={field?.value}
                            onchange={(file) =>
                              handleFileUpload('fundusImage', file)
                            }
                            isIpadView={isIpadView}
                            id='fundusImage'
                            loading={loadingStates['fundusImage']}
                            onSuccess={(newKey) =>
                              onSuccess('fundusImage', newKey)
                            }
                          />
                        </FormControl>
                        <FormMessage className='mb-0.5 mt-0.5 min-h-[25px] text-right max-md:w-[130px]' />
                      </FormItem>
                    )}
                  />
                </FlexBox>
                <FlexBox classname='flex max-ms:flex-col max-ms:justify-center max-ms:items-start items-center justify-between mt-1'>
                  <TypographyP size={16} classname='mb-8 font-medium'>
                    {t('translation.addOctVideo')}
                  </TypographyP>
                  <FormField
                    control={form.control}
                    name='octVideo'
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <RecordScreen
                            isIpadView={isIpadView}
                            {...field}
                            value={field.value}
                            onchange={(file) =>
                              handleFileUpload('octVideo', file)
                            }
                            onSuccess={(newKey) =>
                              onSuccess('octVideo', newKey)
                            }
                          />
                        </FormControl>
                        <FormMessage className='mb-0.5 mt-0.5 min-h-[25px] text-right max-md:w-[130px]' />
                      </FormItem>
                    )}
                  />
                </FlexBox>
                <FlexBox classname='flex max-ms:flex-col max-ms:justify-center max-ms:items-start justify-between mt-1 items-center'>
                  <TypographyP size={16} classname='mb-8 font-medium'>
                    {t('translation.addThicknessMap')}
                  </TypographyP>
                  <FormField
                    control={form.control}
                    name='thicknessMap'
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomUpload
                            fieldValue={field?.value}
                            onchange={(file) =>
                              handleFileUpload('thicknessMap', file)
                            }
                            isIpadView={isIpadView}
                            id='thicknessMap'
                            loading={loadingStates['thicknessMap']}
                            onSuccess={(newKey) =>
                              onSuccess('thicknessMap', newKey)
                            }
                          />
                        </FormControl>
                        <FormMessage className='mb-0.5 mt-0.5 min-h-[25px] text-right max-md:w-[130px]' />
                      </FormItem>
                    )}
                  />
                </FlexBox>
                <FlexBox classname='flex max-ms:flex-col max-ms:justify-center max-ms:items-start justify-between mt-1 items-center'>
                  <TypographyP size={16} classname='mb-8 font-medium'>
                    {t('translation.addDicomFile')}
                  </TypographyP>
                  <FormField
                    control={form.control}
                    name='dicomFile'
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomUpload
                            fieldValue={field?.value}
                            onchange={(file) =>
                              handleFileUpload('dicomFile', file)
                            }
                            id='dicomFile'
                            accept='*/dicom,.dcm, image/dcm, */dcm, .dicom'
                            showName={true}
                            loading={loadingStates['dicomFile']}
                            isIpadDicomFile={isIpadView}
                            onSuccess={(newKey) =>
                              onSuccess('dicomFile', newKey)
                            }
                          />
                        </FormControl>
                        <FormMessage className='mb-0.5 mt-0.5 min-h-[25px] text-right max-md:w-[130px]' />
                      </FormItem>
                    )}
                  />
                </FlexBox>

                <TypographyP
                  primary
                  size={16}
                  classname='font-semibold mt-5 mb-5 md:w-1/2'
                >
                  {t('translation.additionalImagesForGlaucoma')}
                </TypographyP>

                <FlexBox classname='flex max-ms:flex-col max-ms:justify-center max-ms:items-start justify-between mt-1 items-center'>
                  <TypographyP size={16} classname='mb-8 font-medium'>
                    {t('translation.addOpticDisc')}
                  </TypographyP>
                  <FormField
                    control={form.control}
                    name='discOctVideo'
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <RecordScreen
                            isIpadView={isIpadView}
                            {...field}
                            value={field.value}
                            onchange={(file) =>
                              handleFileUpload('discOctVideo', file)
                            }
                            onSuccess={(newKey) =>
                              onSuccess('discOctVideo', newKey)
                            }
                          />
                        </FormControl>
                        <FormMessage className='mb-0.5 mt-0.5 min-h-[25px] text-right max-md:w-[130px]' />
                      </FormItem>
                    )}
                  />
                </FlexBox>
                <FlexBox classname='flex max-ms:flex-col max-ms:justify-center max-ms:items-start justify-between mt-1 items-center'>
                  <TypographyP
                    size={16}
                    classname='mb-8 font-medium md:max-w-[295px]'
                  >
                    {t('translation.addThicknessProfile')}
                  </TypographyP>
                  <FormField
                    control={form.control}
                    name='discThicknessProfile'
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomUpload
                            fieldValue={field?.value}
                            onchange={(file) =>
                              handleFileUpload('discThicknessProfile', file)
                            }
                            isIpadView={isIpadView}
                            id='discThicknessProfile'
                            loading={loadingStates['discThicknessProfile']}
                            onSuccess={(newKey) =>
                              onSuccess('discThicknessProfile', newKey)
                            }
                          />
                        </FormControl>
                        <FormMessage className='mb-0.5 mt-0.5 min-h-[25px] text-right max-md:w-[130px]' />
                      </FormItem>
                    )}
                  />
                </FlexBox>
                <FlexBox classname='flex max-ms:flex-col max-ms:justify-center max-ms:items-start justify-between mt-1 items-center'>
                  <TypographyP size={16} classname='mb-8 font-medium'>
                    {t('translation.addDicomFileDisc')}
                  </TypographyP>
                  <FormField
                    control={form.control}
                    name='discDicomFile'
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomUpload
                            fieldValue={field?.value}
                            onchange={(file) =>
                              handleFileUpload('discDicomFile', file)
                            }
                            id='discDicomFile'
                            accept='*/dicom,.dcm, image/dcm, */dcm, .dicom'
                            showName={true}
                            loading={loadingStates['discDicomFile']}
                            isIpadDicomFile={isIpadView}
                            onSuccess={(newKey) =>
                              onSuccess('discDicomFile', newKey)
                            }
                          />
                        </FormControl>
                        <FormMessage className='mb-0.5 mt-0.5 min-h-[25px] text-right max-md:w-[130px]' />
                      </FormItem>
                    )}
                  />
                </FlexBox>
                <FlexBox classname='flex max-ms:flex-col max-ms:justify-center max-ms:items-start justify-between mt-1 items-center'>
                  <TypographyP size={16} classname='mb-8 font-medium'>
                    {t('translation.addVisualFieldTest')}
                  </TypographyP>
                  <FormField
                    control={form.control}
                    name='visualFieldTest'
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomUpload
                            fieldValue={field?.value}
                            onchange={(file) =>
                              handleFileUpload('visualFieldTest', file)
                            }
                            isIpadView={isIpadView}
                            id='visualFieldTest'
                            loading={loadingStates['visualFieldTest']}
                            onSuccess={(newKey) =>
                              onSuccess('visualFieldTest', newKey)
                            }
                          />
                        </FormControl>
                        <FormMessage className='mb-0.5 mt-0.5 min-h-[25px] text-right max-md:w-[130px]' />
                      </FormItem>
                    )}
                  />
                </FlexBox>

                <TypographyP
                  primary
                  size={16}
                  classname='font-semibold mt-5 mb-5 md:w-1/2'
                >
                  {t('translation.anyOtherImages')}
                </TypographyP>
                <FlexBox classname='flex max-ms:flex-col max-ms:justify-center max-ms:items-start justify-between mt-1 items-center'>
                  <TypographyP size={16} classname='mb-8 font-medium'>
                    {t('translation.addOtherImage')}
                  </TypographyP>
                  <FormField
                    control={form.control}
                    name='addAnotherImage'
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomUpload
                            fieldValue={field?.value}
                            onchange={(file) =>
                              handleFileUpload('addAnotherImage', file)
                            }
                            isIpadView={isIpadView}
                            id='addAnotherImage'
                            loading={loadingStates['addAnotherImage']}
                            onSuccess={(newKey) =>
                              onSuccess('addAnotherImage', newKey)
                            }
                          />
                        </FormControl>
                        <FormMessage className='mb-0.5 mt-0.5 min-h-[25px] text-right max-md:w-[130px]' />
                      </FormItem>
                    )}
                  />
                </FlexBox>
              </div>
              {isIpadView ? (
                <FlexBox flex classname='justify-center'>
                  <Button
                    type='submit'
                    loading={isLoading}
                    disabled={isLoading}
                    className='min-w-[200px] px-[65px] py-[8.5px] text-[18px] font-medium text-white'
                    center
                  >
                    {t('translation.done')}
                  </Button>
                </FlexBox>
              ) : (
                <StepperFooter
                  typeOfNext='submit'
                  onClickBack={handleBackButtonClick}
                  loading={isLoading}
                  nextButtonWidth='200'
                />
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default LeftEyeImages;
