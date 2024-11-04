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
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Card, CardContent } from '../ui/card';
import FlexBox from '../ui/flexbox';
import { TypographyH2 } from '../ui/typography/h2';
import Icon from '../custom-components/custom-icon';
import { TypographyP } from '../ui/typography/p';
import {
  CustomRadioGroup,
  CustomRadioGroupItem,
} from '../custom-components/custom-radio';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import StepperFooter from './common-stepper-footer';
import { ReferralFormInput } from '../custom-components/custom-referral-form-input';
import {
  TReferralForm,
  TRegisterNewPatientForm,
} from '@/models/types/create-patient-forms';
import { referralFormSchema } from '@/models/validations/create-patient-forms';
import {
  REFERRAL_FORM,
  STEPPER,
  AFFECTED_EYE,
  MEDICAL_FAMILY_HISTORY,
  PAIN,
  PAST_EYE_HISTORY,
  YES_NO,
  SYMPTOMS_DURATION,
  VISION_AFFECTED,
  VISION_TYPE,
  VISUAL_IMPAIRMENT,
  visionAffectedOptions,
  doAnyOfTheseApply,
  pastEyeHistoryOptions,
  medicalFamilyHistoryOptions,
  lifestyleOptions,
} from '@/enums/create-patient';
import {
  addReferralForm,
  getMedicineList,
} from '@/app/api/create-patient-request';
import { getErrorMessage } from '@/lib/utils';
import { CustomCheckbox } from '../custom-components/custom-checkbox';
import { ReferralFormTextarea } from '../custom-components/custom-referral-form-textarea';
import { getAge } from '@/lib/common/getAge';
import { ethnicityOptions, genderOptions } from '@/lib/constants/data';

type Tprops = {
  currentStep: string;
  setCurrentStep: Dispatch<SetStateAction<string>>;
  completedSteps: string[];
  setCompletedSteps: Dispatch<SetStateAction<string[]>>;
  referralFormData: TReferralForm | undefined;
  setReferralFormData: Dispatch<SetStateAction<TReferralForm | undefined>>;
  fileId?: string;
  isRegisterNewPatient?: TRegisterNewPatientForm;
};

const defaultValues = {
  visionScaleType: VISION_TYPE.snellen,
  whichEyeIsAffected: '',
  pain: '',
  redness: '',
  remarks: '',
};

const ReferralForm = ({
  currentStep,
  setCurrentStep,
  completedSteps,
  setCompletedSteps,
  referralFormData,
  setReferralFormData,
  fileId,
  isRegisterNewPatient,
}: Tprops) => {
  const [loading, setLoading] = useState(false);
  const [medicineData, setMedicineData] = useState<string[]>(['']);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const form = useForm<TReferralForm>({
    resolver: yupResolver(referralFormSchema),
    defaultValues: referralFormData ? referralFormData : defaultValues,
    shouldFocusError: false,
    mode: 'onSubmit',
  });

  const { errors } = form.formState;
  const inited = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (referralFormData && !inited.current) {
      form.reset({ ...referralFormData });
      inited.current = true;
    }
  }, [referralFormData]);

  const fetchMedicinesData = useCallback(async () => {
    try {
      const response = await getMedicineList();
      setMedicineData(response.data?.data?.medicines);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    }
  }, []);

  useEffect(() => {
    fetchMedicinesData();
  }, [fetchMedicinesData]);

  const onSubmit = useCallback(
    async (values: TReferralForm) => {
      try {
        setLoading(true);
        if (!fileId) {
          return;
        }
        const referralFormPayload = {
          patientFileId: fileId,
          rightEyeVision: values?.rightEyeVision,
          leftEyeVision: values?.leftEyeVision,
          visionScaleType: values?.visionScaleType,
          affectedVision: values?.affectedVision,
          affectedEye: values?.affectedEye,
          durationOfSymptoms:
            (values?.durationOfSymptoms === REFERRAL_FORM.Between_3and52
              ? values.durationBetween_3To_52Weeks?.toString()
              : values?.durationOfSymptoms) || '',
          rightEyeIntraocularPressure: values.intraocularPressure.rightEye,
          leftEyeIntraocularPressure: values.intraocularPressure.leftEye,
          visualImpairment: values?.visualImpairment,
          pain: values?.pain,
          redness: values.redness,
          pastEyeHistory:
            values.pastEyeHistory && values?.otherPastEyeHistory
              ? [...values.pastEyeHistory, values?.otherPastEyeHistory]
              : values?.pastEyeHistory,
          treatment:
            (values?.currentTreatmentForEyes === YES_NO.yes
              ? values.whatTreatment
              : values?.currentTreatmentForEyes) || '',
          medicalHistory:
            values.medicalHistory && values?.otherMedicalHistory
              ? [...values.medicalHistory, values?.otherMedicalHistory]
              : values?.medicalHistory,
          familyHistory:
            values.familyHistory && values?.otherFamilyHistory
              ? [...values.familyHistory, values?.otherFamilyHistory]
              : values.familyHistory,
          lifestyle: values?.lifestyle,
          allergy: values?.allergy || '',
          remarks: values?.remarks,
          isCorrectedVision: values?.isCorrectedVision ? true : false,
        };
        const response = await addReferralForm(referralFormPayload);
        if (response?.data?.status !== 200) {
          toast.error(response?.data?.message || 'Something went wrong!');
        } else {
          setReferralFormData({ ...values, id: response?.data?.data?.id });
          setCurrentStep(STEPPER.RIGHT_EYE_IMAGES);
          setCompletedSteps([...completedSteps, currentStep]);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || 'Something went wrong!');
      } finally {
        setLoading(false);
      }
    },
    [fileId],
  );

  const hideError = (name: FieldPath<TReferralForm>) => form.clearErrors(name);

  const handleChangeValue = (name: FieldPath<TReferralForm>, value: string) =>
    form.setValue(name, value);

  const handleStateChange = (value: any, keyname: FieldPath<TReferralForm>) => {
    if (referralFormData) {
      setReferralFormData((prev) => {
        if (prev) {
          return {
            ...prev,
            [keyname]: value || '',
          };
        }
      });
    } else {
      const defaultValue: any = { ...defaultValues };
      setReferralFormData({
        ...defaultValue,
        [keyname]: value || '',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.clearErrors('whatTreatment');
    const value = e.target.value;
    form.setValue('whatTreatment', value);

    if (value) {
      const filteredSuggestions = medicineData.filter((medicine) =>
        medicine.toLowerCase().includes(value.toLowerCase()),
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (medicine: string) => {
    form.setValue('whatTreatment', medicine);
    setSuggestions([]);
  };

  const onInvalidInput = () => {
    toast.error('Please fill all mandatory fields.');
  };

  const isVisionAffected = useMemo(() => {
    const affectedVision = form?.getValues('affectedVision');
    return !affectedVision?.includes(VISION_AFFECTED.no);
  }, [form?.getValues('affectedVision')]);

  return (
    <Card className='min-h-[200px] justify-start bg-white pb-[40px] pt-[30px] max-ms:px-[10px] ms:px-[40px]'>
      <FlexBox classname='flex'>
        <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
          <Icon name='referral' width={16} height={17} className='m-auto' />
        </div>
        <TypographyH2 size={18}>
          Referral Form:{' '}
          {isRegisterNewPatient &&
            `${isRegisterNewPatient?.dateOfBirth ? getAge(isRegisterNewPatient?.dateOfBirth) : 0} year old ${genderOptions?.find((item) => item.value === isRegisterNewPatient?.sex)?.label} (${ethnicityOptions?.find((item) => item?.value === isRegisterNewPatient?.ethnicity)?.label})`}
        </TypographyH2>
      </FlexBox>
      <CardContent className='mt-[25px] w-full !p-0'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalidInput)}>
            <TypographyP size={17} classname='!text-darkGray'>
              1. Vision
            </TypographyP>
            <FlexBox classname='flex w-full flex-wrap  mt-2 border-b border-b-lightGray'>
              <div className='flex flex-col flex-wrap items-center  nm:flex-row nm:gap-[16px] md:flex-row md:gap-[16px]'>
                <FormField
                  control={form.control}
                  name='rightEyeVision'
                  render={({ field }) => (
                    <FormItem className='!flex-none'>
                      <FormControl>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <ReferralFormInput
                              containerClass='flex max-w-72 min-w-[265px] rounded-[4px] bg-backgroundGray py-[6px] pl-6 pr-4'
                              className='peer max-w-[120px]'
                              leftLabel={'Right eye:'}
                              defaultVal={
                                form?.watch('visionScaleType') ===
                                  VISION_TYPE.log_mar
                                  ? ''
                                  : '6/'
                              }
                              {...field}
                              onChange={(e) => {
                                handleChangeValue(
                                  'rightEyeVision',
                                  e.target.value,
                                );
                                hideError('rightEyeVision');
                              }}
                              onBlur={(e) =>
                                handleStateChange(
                                  e.target.value,
                                  'rightEyeVision',
                                )
                              }
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                      <FormMessage
                        className={` mb-1 mt-0.5 ms:min-h-[21px] ${errors?.rightEyeVision ? 'max-ms:min-h-[21px]' : 'max-ms:!min-h-[10px]'}`}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='leftEyeVision'
                  render={({ field }) => (
                    <FormItem className='!flex-none'>
                      <FormControl>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <ReferralFormInput
                              containerClass='flex max-w-72 min-w-[265px] rounded-[4px] bg-backgroundGray py-[6px] px-6'
                              className='max-w-[120px]'
                              leftLabel={'Left eye:'}
                              defaultVal={
                                form?.watch('visionScaleType') ===
                                  VISION_TYPE.log_mar
                                  ? ''
                                  : '6/'
                              }
                              {...field}
                              onChange={(e) => {
                                handleChangeValue(
                                  'leftEyeVision',
                                  e.target.value,
                                );
                                hideError('leftEyeVision');
                              }}
                              onBlur={(e) =>
                                handleStateChange(
                                  e.target.value,
                                  'leftEyeVision',
                                )
                              }
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                      <FormMessage
                        className={` mb-1 mt-0.5 ms:min-h-[21px] ${errors?.leftEyeVision ? 'max-ms:min-h-[21px]' : 'max-ms:!min-h-[10px]'}`}
                      />
                    </FormItem>
                  )}
                />
              </div>
              <FlexBox flex classname='gap-[16px] flex-wrap'>
                <FormField
                  control={form.control}
                  name='visionScaleType'
                  render={({ field }) => (
                    <FormItem className='!flex-none'>
                      <FormControl>
                        <CustomRadioGroup
                          {...field}
                          onValueChange={(val) => {
                            field.onChange(val);
                            handleChangeValue('leftEyeVision', '');
                            handleChangeValue('rightEyeVision', '');
                            handleStateChange(val, 'visionScaleType');
                            handleStateChange('', 'rightEyeVision');
                            handleStateChange('', 'leftEyeVision');
                          }}
                          className='flex flex-wrap gap-[16px]'
                          defaultValue={VISION_TYPE.snellen}
                        >
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={VISION_TYPE.log_mar}
                                checked={field.value === VISION_TYPE.log_mar}
                                label={REFERRAL_FORM.LogMAR}
                              />
                            </FormControl>
                          </FormItem>
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={VISION_TYPE.snellen}
                                checked={field.value === VISION_TYPE.snellen}
                                label={REFERRAL_FORM.Snellen}
                              />
                            </FormControl>
                          </FormItem>
                        </CustomRadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='isCorrectedVision'
                  render={({ field }) => (
                    <FormItem className='!flex-none'>
                      <FormControl>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomCheckbox
                              {...field}
                              checked={field?.value ? true : false}
                              onCheckedChange={(value) => {
                                if (value) {
                                  form.setValue(
                                    'isCorrectedVision',
                                    VISION_TYPE.corrected_vision,
                                  );
                                  handleStateChange(
                                    VISION_TYPE.corrected_vision,
                                    'isCorrectedVision',
                                  );
                                } else {
                                  handleStateChange(
                                    undefined,
                                    'isCorrectedVision',
                                  );
                                  form.setValue('isCorrectedVision', undefined);
                                }

                                hideError('isCorrectedVision');
                              }}
                              label={REFERRAL_FORM.Corrected_Vision}
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                      <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                    </FormItem>
                  )}
                />
              </FlexBox>
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              2. Is the vision affected?
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
              <FlexBox flex classname='gap-[16px] flex-wrap'>
                {visionAffectedOptions?.map((item, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={'affectedVision'}
                    render={({ field }) => {
                      return (
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomCheckbox
                              {...field}
                              value={item?.value}
                              checked={field?.value?.includes(item.value)}
                              onCheckedChange={() => {
                                let newValue = [...(field.value || '')];

                                if (newValue?.includes(item.value)) {
                                  newValue = newValue?.filter(
                                    (val) => val !== item.value,
                                  );
                                } else {
                                  if (
                                    item.value === VISION_AFFECTED.no ||
                                    item.value === VISION_AFFECTED.total_loss
                                  ) {
                                    newValue = [item.value];
                                  } else {
                                    newValue = newValue?.filter(
                                      (val) =>
                                        val !== VISION_AFFECTED.no &&
                                        val !== VISION_AFFECTED.total_loss,
                                    );
                                    newValue.push(item.value);
                                  }
                                }
                                handleStateChange(newValue, 'affectedVision');
                                form.setValue('affectedVision', newValue);
                                hideError('affectedVision');
                                form.setValue('affectedEye', '');
                                form.setValue('durationOfSymptoms', '');
                                handleChangeValue(
                                  'durationBetween_3To_52Weeks',
                                  '',
                                );
                              }}
                              label={item?.label}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </FlexBox>
              <FormMessage
                className='mb-1 mt-0.5 min-h-[21px]'
                fieldError={errors?.affectedVision?.message || ''}
              />
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              3. Which eye is affected?
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
              <FormField
                control={form.control}
                name='affectedEye'
                render={({ field }) => (
                  <FormItem className='w-full !flex-none'>
                    <FormControl>
                      <CustomRadioGroup
                        onValueChange={(val) => {
                          handleStateChange(val, 'affectedEye');
                          field.onChange(val);
                        }}
                        defaultValue={field.value}
                        className='flex w-full flex-wrap gap-[16px]'
                      >
                        {isVisionAffected ? (
                          <>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={AFFECTED_EYE.RIGHT}
                                  checked={field.value === AFFECTED_EYE.RIGHT}
                                  label={REFERRAL_FORM.Right_eye}
                                  onClick={() => {
                                    handleStateChange(
                                      AFFECTED_EYE.RIGHT,
                                      'affectedEye',
                                    );
                                    handleChangeValue(
                                      'affectedEye',
                                      AFFECTED_EYE.RIGHT,
                                    );
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={AFFECTED_EYE.LEFT}
                                  checked={field.value === AFFECTED_EYE.LEFT}
                                  label={REFERRAL_FORM.Left_eye}
                                  onClick={() => {
                                    handleStateChange(
                                      AFFECTED_EYE.LEFT,
                                      'affectedEye',
                                    );
                                    handleChangeValue(
                                      'affectedEye',
                                      AFFECTED_EYE.LEFT,
                                    );
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={AFFECTED_EYE.BOTH_EYES}
                                  checked={
                                    field.value === AFFECTED_EYE.BOTH_EYES
                                  }
                                  label={REFERRAL_FORM.Both_eyes}
                                  onClick={() => {
                                    handleStateChange(
                                      AFFECTED_EYE.BOTH_EYES,
                                      'affectedEye',
                                    );
                                    handleChangeValue(
                                      'affectedEye',
                                      AFFECTED_EYE.BOTH_EYES,
                                    );
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          </>
                        ) : (
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={AFFECTED_EYE.NA}
                                checked={field.value === AFFECTED_EYE.NA}
                                label={REFERRAL_FORM.NA}
                                onClick={() =>
                                  form?.setValue('affectedEye', AFFECTED_EYE.NA)
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      </CustomRadioGroup>
                    </FormControl>
                    <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                  </FormItem>
                )}
              />
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              4. Duration of symptoms?
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
              <FormField
                control={form.control}
                name='durationOfSymptoms'
                render={({ field }) => (
                  <FormItem className='w-full !flex-none'>
                    <FormControl>
                      <CustomRadioGroup
                        onValueChange={(value) => {
                          handleStateChange(value, 'durationOfSymptoms');
                          handleStateChange('', 'durationBetween_3To_52Weeks');
                          handleChangeValue('durationOfSymptoms', value);
                          handleChangeValue('durationBetween_3To_52Weeks', '');
                          hideError('durationOfSymptoms');
                          hideError('durationBetween_3To_52Weeks');
                        }}
                        className='flex w-full flex-wrap gap-[16px]'
                      >
                        {isVisionAffected ? (
                          <>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={SYMPTOMS_DURATION.under_one_week}
                                  checked={
                                    field.value ===
                                    SYMPTOMS_DURATION.under_one_week
                                  }
                                  label={REFERRAL_FORM.Less_than_week}
                                  onClick={() => {
                                    handleStateChange(
                                      SYMPTOMS_DURATION.under_one_week,
                                      'durationOfSymptoms',
                                    );
                                    handleChangeValue(
                                      'durationOfSymptoms',
                                      SYMPTOMS_DURATION.under_one_week,
                                    );
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  onClick={() => {
                                    handleChangeValue(
                                      'durationOfSymptoms',
                                      SYMPTOMS_DURATION.one_to_two_weeks,
                                    );
                                    handleChangeValue(
                                      'durationBetween_3To_52Weeks',
                                      '',
                                    );
                                    handleStateChange(
                                      SYMPTOMS_DURATION.one_to_two_weeks,
                                      'durationOfSymptoms',
                                    );
                                    handleStateChange(
                                      '',
                                      'durationBetween_3To_52Weeks',
                                    );
                                    hideError('durationBetween_3To_52Weeks');
                                  }}
                                  value={SYMPTOMS_DURATION.one_to_two_weeks}
                                  checked={
                                    field.value ===
                                    SYMPTOMS_DURATION.one_to_two_weeks
                                  }
                                  label={REFERRAL_FORM.Weeks}
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={REFERRAL_FORM.Between_3and52}
                                  checked={
                                    field.value === REFERRAL_FORM.Between_3and52
                                  }
                                  label={
                                    <div className='flex'>
                                      {' '}
                                      <span>3-52 weeks:</span>{' '}
                                      <ReferralFormInput
                                        className='max-w-[120px]'
                                        checked={
                                          field.value ===
                                          REFERRAL_FORM.Between_3and52
                                        }
                                        containerClass={`${form?.watch().durationBetween_3To_52Weeks ? '!border-transparent' : ''} pr-8`}
                                        value={
                                          form?.watch()
                                            .durationBetween_3To_52Weeks
                                        }
                                        hideOutline={true}
                                        rightLabel='weeks'
                                        rightLabelClass='pr-2 pl-4'
                                        onChange={(e) => {
                                          handleChangeValue(
                                            'durationBetween_3To_52Weeks',
                                            e.target.value,
                                          );
                                          handleChangeValue(
                                            'durationOfSymptoms',
                                            REFERRAL_FORM.Between_3and52,
                                          );
                                          hideError('durationOfSymptoms');
                                          hideError(
                                            'durationBetween_3To_52Weeks',
                                          );
                                          handleStateChange(
                                            REFERRAL_FORM.Between_3and52,
                                            'durationOfSymptoms',
                                          );
                                        }}
                                        onBlur={(e) => {
                                          handleStateChange(
                                            e.target.value,
                                            'durationBetween_3To_52Weeks',
                                          );
                                        }}
                                      />
                                    </div>
                                  }
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={SYMPTOMS_DURATION.more_than_52_weeks}
                                  checked={
                                    field.value ===
                                    SYMPTOMS_DURATION.more_than_52_weeks
                                  }
                                  label={REFERRAL_FORM.Greater_than_52weeks}
                                  onClick={() => {
                                    handleStateChange(
                                      SYMPTOMS_DURATION.more_than_52_weeks,
                                      'durationOfSymptoms',
                                    );
                                    handleChangeValue(
                                      'durationOfSymptoms',
                                      SYMPTOMS_DURATION.more_than_52_weeks,
                                    );
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          </>
                        ) : (
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={AFFECTED_EYE.NA}
                                checked={field.value === AFFECTED_EYE.NA}
                                label={REFERRAL_FORM.NA}
                                onClick={() =>
                                  form?.setValue(
                                    'durationOfSymptoms',
                                    AFFECTED_EYE.NA,
                                  )
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      </CustomRadioGroup>
                    </FormControl>
                    {errors?.durationBetween_3To_52Weeks?.message ? (
                      <TypographyP
                        size={14}
                        classname='leading-normal !text-error font-normal mb-1 mt-0.5 min-h-[20px]'
                      >
                        {errors?.durationBetween_3To_52Weeks?.message || ''}
                      </TypographyP>
                    ) : (
                      <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                    )}
                  </FormItem>
                )}
              />
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              5. Intraocular pressure
            </TypographyP>
            <FlexBox classname='flex flex-wrap gap-[20px] mt-2 border-b max-ms:w-full border-b-lightGray'>
              <FormField
                control={form.control}
                name='intraocularPressure.rightEye'
                render={({ field }) => (
                  <FormItem className='!flex-none max-ms:w-full'>
                    <FormControl>
                      <FormItem className='!flex-none max-ms:w-full'>
                        <FormControl>
                          <ReferralFormInput
                            containerClass='flex md:w-[372px] rounded-[4px] bg-backgroundGray py-[6px] pl-6 pr-4'
                            className='peer w-[130px] md:w-[210px]'
                            leftLabel={'Right eye:'}
                            rightLabel='mmHg'
                            rightLabelClass='pr-2'
                            {...field}
                            onChange={(e) => {
                              handleChangeValue(
                                'intraocularPressure.rightEye',
                                e.target.value,
                              );

                              hideError('intraocularPressure.rightEye');
                            }}
                            onBlur={(e) =>
                              handleStateChange(
                                e.target.value,
                                'intraocularPressure.rightEye',
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    </FormControl>
                    {errors?.intraocularPressure?.rightEye && (
                      <FormMessage
                        className={`mb-[5px] mt-0.5 ms:min-h-[21px] ${errors?.intraocularPressure?.rightEye ? 'max-ms:min-h-[21px]' : 'max-ms:!min-h-[10px]'}`}
                      />
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='intraocularPressure.leftEye'
                render={({ field }) => (
                  <FormItem className='!flex-none max-ms:w-full'>
                    <FormControl>
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <ReferralFormInput
                            containerClass='flex md:w-[372px] rounded-[4px] bg-backgroundGray py-[6px] pl-6 pr-4'
                            className=' peer w-[130px] md:w-[210px]'
                            leftLabel={'Left eye:'}
                            rightLabel='mmHg'
                            rightLabelClass='pr-2'
                            {...field}
                            onChange={(e) => {
                              handleChangeValue(
                                'intraocularPressure.leftEye',
                                e.target.value,
                              );

                              hideError('intraocularPressure.leftEye');
                            }}
                            onBlur={(e) =>
                              handleStateChange(
                                e.target.value,
                                'intraocularPressure.leftEye',
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    </FormControl>
                    <FormMessage className='mb-1 min-h-[21px]' />
                  </FormItem>
                )}
              />
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              6. Do any of these apply?
            </TypographyP>
            <FlexBox classname='flex flex-col flex-wrap mt-2 border-b border-b-lightGray'>
              <FlexBox flex classname='gap-[16px] flex-wrap'>
                {doAnyOfTheseApply?.map((item, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={'visualImpairment'}
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomCheckbox
                            {...field}
                            value={item?.value}
                            checked={field?.value?.includes(item.value)}
                            onCheckedChange={() => {
                              let newValue = [...(field.value || '')];
                              if (newValue?.includes(item.value)) {
                                newValue = newValue?.filter(
                                  (val) => val !== item.value,
                                );
                              } else {
                                if (item.value === VISUAL_IMPAIRMENT.none) {
                                  newValue = [item.value];
                                } else {
                                  newValue = newValue?.filter(
                                    (val) => val !== VISUAL_IMPAIRMENT.none,
                                  );
                                  newValue.push(item.value);
                                }
                              }

                              form.setValue('visualImpairment', newValue);
                              handleStateChange(newValue, 'visualImpairment');
                              hideError('visualImpairment');
                            }}
                            label={item?.label}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </FlexBox>
              <FormMessage
                className='mb-1 mt-0.5 min-h-[21px]'
                fieldError={errors?.visualImpairment?.message || ''}
              />
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              7. How much pain is there?
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
              <FormField
                control={form.control}
                name='pain'
                render={({ field }) => (
                  <FormItem className='w-full !flex-none'>
                    <FormControl>
                      <CustomRadioGroup
                        onValueChange={(val) => {
                          field.onChange(val);
                          handleStateChange(val, 'pain');
                        }}
                        defaultValue={field.value}
                        className='flex w-full flex-wrap gap-[16px]'
                      >
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={PAIN.none}
                              checked={field.value === PAIN.none}
                              label={REFERRAL_FORM.None}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={PAIN.mild}
                              checked={field.value === PAIN.mild}
                              label={REFERRAL_FORM.Mild}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={PAIN.moderate}
                              checked={field.value === PAIN.moderate}
                              label={REFERRAL_FORM.Moderate}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={PAIN.severe}
                              checked={field.value === PAIN.severe}
                              label={REFERRAL_FORM.Severe}
                            />
                          </FormControl>
                        </FormItem>
                      </CustomRadioGroup>
                    </FormControl>
                    <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                  </FormItem>
                )}
              />
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              8. Is there redness?
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
              <FormField
                control={form.control}
                name='redness'
                render={({ field }) => (
                  <FormItem className='w-full !flex-none'>
                    <FormControl>
                      <CustomRadioGroup
                        onValueChange={(val) => {
                          field.onChange(val);
                          handleStateChange(val, 'redness');
                        }}
                        defaultValue={field.value}
                        className='flex w-full flex-wrap gap-[16px]'
                      >
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={YES_NO.yes}
                              checked={field.value === YES_NO.yes}
                              label={REFERRAL_FORM.Yes}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={YES_NO.no}
                              checked={field.value === YES_NO.no}
                              label={REFERRAL_FORM.No}
                            />
                          </FormControl>
                        </FormItem>
                      </CustomRadioGroup>
                    </FormControl>
                    <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                  </FormItem>
                )}
              />
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              9. Past eye history
            </TypographyP>
            <FlexBox classname='flex flex-col flex-wrap mt-2 border-b border-b-lightGray'>
              <FlexBox flex classname='gap-[16px] w-full flex-wrap'>
                {pastEyeHistoryOptions?.map((item, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={'pastEyeHistory'}
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl className='!flex-none'>
                          <CustomCheckbox
                            {...field}
                            value={item?.value}
                            checked={field?.value?.includes(item?.value)}
                            onCheckedChange={() => {
                              let newValue = field.value
                                ? [...(field.value || '')]
                                : [];
                              if (newValue?.includes(item.value)) {
                                newValue = newValue?.filter(
                                  (val) => val !== item.value,
                                );
                              } else {
                                if (item.value === PAST_EYE_HISTORY.none) {
                                  newValue = [item.value];
                                  handleStateChange('', 'otherPastEyeHistory');
                                  form.setValue('otherPastEyeHistory', '');
                                } else {
                                  newValue = newValue?.filter(
                                    (val) => val !== PAST_EYE_HISTORY.none,
                                  );

                                  newValue.push(item.value);
                                }
                              }
                              form.setValue('pastEyeHistory', newValue);
                              handleStateChange(newValue, 'pastEyeHistory');
                              hideError('pastEyeHistory');
                            }}
                            label={item?.label}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name='otherPastEyeHistory'
                  render={({ field }) => (
                    <FormItem className='!flex-none max-ms:w-full'>
                      <FormControl>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomCheckbox
                              {...field}
                              checked={field?.value ? true : false}
                              label={
                                <div className='flex max-ms:w-full'>
                                  <ReferralFormTextarea
                                    className='resize-none max-ms:w-full md:min-w-[390px] md:max-w-[390px]'
                                    rows={2}
                                    placeholder='Other'
                                    checked={field.value ? true : false}
                                    containerClass={`${form?.watch().otherPastEyeHistory ? '!border-transparent' : ''} !px-0 !mx-0`}
                                    value={form?.watch().otherPastEyeHistory}
                                    onChange={(e) => {
                                      form.setValue(
                                        'otherPastEyeHistory',
                                        e.target.value,
                                      );

                                      const pastEyeValues =
                                        form.watch('pastEyeHistory') || [];
                                      if (
                                        pastEyeValues?.includes(
                                          PAST_EYE_HISTORY.none,
                                        )
                                      ) {
                                        form.setValue('pastEyeHistory', []);
                                      } else {
                                        form.setValue('pastEyeHistory', [
                                          ...pastEyeValues,
                                        ]);
                                      }
                                      form.clearErrors('pastEyeHistory');
                                    }}
                                    onBlur={(e) =>
                                      handleStateChange(
                                        e.target.value,
                                        'otherPastEyeHistory',
                                      )
                                    }
                                  />
                                </div>
                              }
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FlexBox>
              <FormMessage
                className='mb-1 mt-0.5 min-h-[21px]'
                fieldError={errors?.pastEyeHistory?.message || ''}
              />
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              10. Under current treatment for eyes?
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray relative'>
              <FormField
                control={form.control}
                name='currentTreatmentForEyes'
                render={({ field }) => (
                  <FormItem className='w-full !flex-none'>
                    <FormControl>
                      <CustomRadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('whatTreatment', '');
                          handleStateChange(value, 'currentTreatmentForEyes');
                        }}
                        className='flex w-full flex-wrap gap-[16px]'
                      >
                        <FormItem className=' !flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={YES_NO.yes}
                              checked={field.value === YES_NO.yes}
                              label={REFERRAL_FORM.Yes}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={YES_NO.no}
                              checked={field.value === YES_NO.no}
                              label={REFERRAL_FORM.No}
                            />
                          </FormControl>
                        </FormItem>
                      </CustomRadioGroup>
                    </FormControl>
                    <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                  </FormItem>
                )}
              />
              {form?.watch()?.currentTreatmentForEyes === YES_NO.yes && (
                <>
                  <FormField
                    control={form.control}
                    name='whatTreatment'
                    render={({ field }) => (
                      <FormItem className='!flex-none max-ms:w-full'>
                        <FormControl>
                          <FormItem className='!flex-none max-ms:w-full'>
                            <FormControl>
                              <ReferralFormTextarea
                                className='resize-none  max-md:w-full md:min-w-[390px] md:max-w-[390px]'
                                rows={2}
                                {...field}
                                onChange={handleInputChange}
                                onBlur={(e) => {
                                  handleStateChange(
                                    e.target.value,
                                    'whatTreatment',
                                  );
                                }}
                                placeholder='What treatment?'
                                containerClass='flex min-w-[220px] rounded-[4px] bg-backgroundGray py-[6px] px-6'
                              />
                            </FormControl>
                          </FormItem>
                        </FormControl>
                        <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                      </FormItem>
                    )}
                  />
                  {suggestions.length > 0 && (
                    <ul className='absolute left-0 right-0 top-20  z-40 mt-[2.90rem] max-h-full min-w-[220px] max-w-[440px] overflow-auto rounded border border bg-white text-darkGray shadow-lg max-ms:w-full'>
                      {suggestions.map((medicine) => (
                        <li
                          key={medicine}
                          className='cursor-pointer p-2 hover:bg-lightPrimary'
                          onClick={() => handleSuggestionClick(medicine)}
                        >
                          {medicine}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              11. Medical History?
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
              <FlexBox flex classname='gap-[16px] flex-wrap'>
                {medicalFamilyHistoryOptions?.map((item, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={'medicalHistory'}
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomCheckbox
                            {...field}
                            value={item?.value}
                            checked={field?.value?.includes(item.value)}
                            onCheckedChange={() => {
                              let newValue = field.value
                                ? [...(field.value || '')]
                                : [];

                              if (newValue?.includes(item.value)) {
                                newValue = newValue?.filter(
                                  (val) => val !== item.value,
                                );
                              } else {
                                if (item.value === MEDICAL_FAMILY_HISTORY.n_a) {
                                  newValue = [item.value];
                                  form.setValue('otherMedicalHistory', '');
                                  handleStateChange('', 'otherMedicalHistory');
                                } else {
                                  newValue = newValue?.filter(
                                    (val) => val !== MEDICAL_FAMILY_HISTORY.n_a,
                                  );
                                  newValue.push(item.value);
                                }
                              }

                              form.setValue('medicalHistory', newValue);
                              handleStateChange(newValue, 'medicalHistory');
                              hideError('medicalHistory');
                            }}
                            label={item?.label}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name='otherMedicalHistory'
                  render={({ field }) => (
                    <FormItem className='!flex-none max-ms:w-full'>
                      <FormControl>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomCheckbox
                              {...field}
                              checked={field?.value ? true : false}
                              label={
                                <div className='flex'>
                                  <ReferralFormTextarea
                                    className='resize-none max-md:w-full md:min-w-[390px] md:max-w-[390px]'
                                    rows={2}
                                    placeholder='Other'
                                    checked={field.value ? true : false}
                                    containerClass={`${form?.watch().otherMedicalHistory ? '!border-transparent' : ''}`}
                                    value={form?.watch().otherMedicalHistory}
                                    onChange={(e) => {
                                      form.setValue(
                                        'otherMedicalHistory',
                                        e.target.value,
                                      );
                                      const medicalHistoryValues =
                                        form.watch('medicalHistory') || [];
                                      if (
                                        medicalHistoryValues?.includes(
                                          MEDICAL_FAMILY_HISTORY.n_a,
                                        )
                                      ) {
                                        form.setValue('medicalHistory', []);
                                      } else {
                                        form.setValue('medicalHistory', [
                                          ...medicalHistoryValues,
                                        ]);
                                      }
                                      form.clearErrors('medicalHistory');
                                    }}
                                    onBlur={(e) =>
                                      handleStateChange(
                                        e.target.value,
                                        'otherMedicalHistory',
                                      )
                                    }
                                  />
                                </div>
                              }
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FlexBox>
              <FormMessage
                className='mb-1 mt-0.5 min-h-[21px]'
                fieldError={errors?.medicalHistory?.message || ''}
              />
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              12. Family history{' '}
              <span className='font-normal'>(optional) </span>
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
              <FlexBox flex classname='gap-[16px] flex-wrap'>
                {medicalFamilyHistoryOptions?.map((item, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={'familyHistory'}
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomCheckbox
                            {...field}
                            value={item?.value}
                            checked={field?.value?.includes(item.value)}
                            onCheckedChange={() => {
                              let newValue = field.value
                                ? [...(field.value || '')]
                                : [];

                              if (newValue?.includes(item.value)) {
                                newValue = newValue?.filter(
                                  (val) => val !== item.value,
                                );
                              } else {
                                if (item.value === MEDICAL_FAMILY_HISTORY.n_a) {
                                  newValue = [item.value];
                                  handleStateChange('', 'otherFamilyHistory');
                                  form.setValue('otherFamilyHistory', '');
                                } else {
                                  newValue = newValue?.filter(
                                    (val) => val !== MEDICAL_FAMILY_HISTORY.n_a,
                                  );
                                  newValue.push(item.value);
                                }
                              }
                              form.setValue('familyHistory', newValue);
                              handleStateChange(newValue, 'familyHistory');
                              hideError('familyHistory');
                            }}
                            label={item?.label}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name='otherFamilyHistory'
                  render={({ field }) => (
                    <FormItem className='!flex-none max-ms:w-full'>
                      <FormControl>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomCheckbox
                              {...field}
                              checked={field?.value ? true : false}
                              label={
                                <div className='flex'>
                                  <ReferralFormTextarea
                                    className='resize-none  max-md:w-full md:min-w-[390px] md:max-w-[390px]'
                                    rows={2}
                                    placeholder='Other'
                                    checked={field.value ? true : false}
                                    containerClass={`${form?.watch().otherFamilyHistory ? '!border-transparent' : ''}`}
                                    value={form?.watch().otherFamilyHistory}
                                    onBlur={(e) =>
                                      handleStateChange(
                                        e.target.value,
                                        'otherFamilyHistory',
                                      )
                                    }
                                    onChange={(e) => {
                                      form.setValue(
                                        'otherFamilyHistory',
                                        e.target.value,
                                      );
                                      const familyHistoryValues =
                                        form.watch('familyHistory') || [];
                                      if (
                                        familyHistoryValues?.includes(
                                          MEDICAL_FAMILY_HISTORY.n_a,
                                        )
                                      ) {
                                        form.setValue('familyHistory', []);
                                      } else {
                                        form.setValue('familyHistory', [
                                          ...familyHistoryValues,
                                        ]);
                                      }
                                      form.clearErrors('familyHistory');
                                    }}
                                  />
                                </div>
                              }
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FlexBox>
              <FormMessage
                className='mb-1 mt-0.5 min-h-[21px]'
                fieldError={errors?.familyHistory?.message || ''}
              />
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              13. Lifestyle/allergies{' '}
              <span className='font-normal'>(optional) </span>
            </TypographyP>
            <FlexBox classname='flex flex-col flex-wrap mt-2 border-b border-b-lightGray'>
              <FlexBox flex classname='gap-[16px] flex-wrap'>
                {lifestyleOptions?.map((item, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={'lifestyle'}
                    render={({ field }) => (
                      <FormItem className='!flex-none'>
                        <FormControl>
                          <CustomCheckbox
                            {...field}
                            value={item?.value}
                            checked={field?.value?.includes(item.value)}
                            onCheckedChange={() => {
                              let newValue = field?.value
                                ? [...(field.value || '')]
                                : [];
                              if (item.value) {
                                if (newValue?.includes(item.value)) {
                                  newValue = newValue?.filter(
                                    (val) => val !== item.value,
                                  );
                                } else {
                                  newValue?.push(item.value);
                                }
                              }
                              form.setValue('lifestyle', newValue);
                              handleStateChange(newValue, 'lifestyle');
                              hideError('lifestyle');
                            }}
                            label={item?.label}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </FlexBox>
              <FlexBox flex classname='mt-[16px]  mb-[24px] flex-wrap'>
                <FormField
                  control={form.control}
                  name='allergy'
                  render={({ field }) => (
                    <FormItem className='!flex-none'>
                      <FormControl>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <ReferralFormInput
                              containerClass='flex min-w-[220px] rounded-[4px] bg-backgroundGray py-[6px] px-6'
                              className='max-w-[100px]'
                              leftLabel={'Allergies:'}
                              rightLabelClass='pr-6'
                              {...field}
                              onBlur={(e) =>
                                handleStateChange(e.target.value, 'allergy')
                              }
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FlexBox>
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              14. Comments <span className='font-normal'>(optional)</span>: What
              do you think it might be? What are your concerns about this
              patient?{' '}
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2'>
              <FormField
                control={form.control}
                name='remarks'
                render={({ field }) => (
                  <FormItem className='w-full !flex-none'>
                    <FormControl>
                      <Textarea
                        rows={3}
                        maxLength={500}
                        className='max-h-[136px] resize-none space-y-8 rounded-none border-none placeholder:font-normal focus:outline-none md:max-w-[717px]'
                        containerClass='px-[1px] pt-[1px]'
                        placeholder='Type here...'
                        showCount
                        count={field?.value?.length}
                        {...field}
                        onBlur={(e) =>
                          handleStateChange(e.target.value, 'remarks')
                        }
                      />
                    </FormControl>
                    <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                  </FormItem>
                )}
              />
            </FlexBox>
            <StepperFooter
              typeOfNext='submit'
              hideBack
              outlinedNext
              loading={loading}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReferralForm;
