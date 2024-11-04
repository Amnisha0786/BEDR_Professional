'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
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
import { ReferralFormInput } from '../custom-components/custom-referral-form-input';
import { referralFormSchema } from '@/models/validations/create-patient-forms';
import {
  REFERRAL_FORM,
  AFFECTED_EYE,
  PAIN,
  YES_NO,
  SYMPTOMS_DURATION,
  VISION_TYPE,
  visionAffectedOptions,
  doAnyOfTheseApply,
  pastEyeHistoryOptions,
  medicalFamilyHistoryOptions,
  lifestyleOptions,
  VISION_AFFECTED,
} from '@/enums/create-patient';
import { CustomCheckbox } from '../custom-components/custom-checkbox';
import { getAge } from '@/lib/common/getAge';
import StepperFooter from '../create-patient-steps/common-stepper-footer';
import { getReferralFormColorCoding } from './referral-form-color-coding';
import { COLOR_CODING, FILE_IN_PROGRESS_STEPS } from '@/enums/file-in-progress';
import {
  TReferralForm,
  TRegisterNewPatientForm,
} from '@/models/types/create-patient-forms';
import { genderOptions, ethnicityOptions } from '@/lib/constants/data';

type Tprops = {
  setCurrentStep: Dispatch<SetStateAction<string>>;
  referralFormData?: TReferralForm | undefined;
  patientDetails?: TRegisterNewPatientForm;
  noColor?: boolean;
};

const ReferralFormProgress = ({
  setCurrentStep,
  referralFormData,
  patientDetails,
  noColor = false,
}: Tprops) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<TReferralForm>({
    resolver: yupResolver(referralFormSchema),
    defaultValues: referralFormData,
    shouldFocusError: false,
    mode: 'onSubmit',
  });

  const { errors } = form.formState;

  useEffect(() => {
    if (referralFormData) {
      form.reset({ ...referralFormData });
    }
  }, [referralFormData]);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    setCurrentStep(FILE_IN_PROGRESS_STEPS.RIGHT_EYE_IMAGES);
    setLoading(false);
  }, []);

  const onInvalidInput = () => {
    toast.error('Please fill all mandatory fields.');
  };

  const fieldColor = useMemo(() => {
    const colorObj: any = {};
    if (noColor) {
      return;
    }
    if (referralFormData) {
      Object.keys(referralFormData)?.map((key) => {
        colorObj[key] = getReferralFormColorCoding(
          key as keyof TReferralForm,
          referralFormData[key as keyof TReferralForm],
        );
      });
    }
    return colorObj;
  }, [referralFormData]);

  return (
    <Card className='min-h-[200px] justify-start bg-white py-[30px] max-ms:px-[10px] ms:px-5'>
      <FlexBox flex centerItems>
        <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
          <Icon name='referral' width={16} height={17} className='m-auto' />
        </div>
        <TypographyH2 size={18}>
          Referral Form:{' '}
          {patientDetails &&
            `${patientDetails?.dateOfBirth ? getAge(patientDetails?.dateOfBirth) : 0} year old ${genderOptions?.find((item) => item.value === patientDetails?.sex)?.label} (${ethnicityOptions?.find((item) => item?.value === patientDetails?.ethnicity)?.label})`}
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
                              disabled
                              disableCursorAllowed
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                      <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
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
                              disabled
                              disableCursorAllowed
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                      <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
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
                          onValueChange={field.onChange}
                          className='flex flex-wrap gap-[16px]'
                          defaultValue={VISION_TYPE.snellen}
                        >
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={VISION_TYPE.log_mar}
                                checked={field.value === VISION_TYPE.log_mar}
                                label={REFERRAL_FORM.LogMAR}
                                disableCursorAllowed
                                disabled
                              />
                            </FormControl>
                          </FormItem>
                          <FormItem className='!flex-none'>
                            <FormControl>
                              <CustomRadioGroupItem
                                value={VISION_TYPE.snellen}
                                checked={field.value === VISION_TYPE.snellen}
                                label={REFERRAL_FORM.Snellen}
                                disableCursorAllowed
                                disabled
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
                              onCheckedChange={field.onChange}
                              label={REFERRAL_FORM.Corrected_Vision}
                              disableCursorAllowed
                              disabled
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
                              onCheckedChange={field.onChange}
                              label={item?.label}
                              disabled
                              disableCursorAllowed
                              fieldColor={
                                fieldColor?.affectedVision?.[item?.value]
                              }
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex w-full flex-wrap gap-[16px]'
                      >
                        {!form
                          .getValues('affectedVision')
                          ?.includes(VISION_AFFECTED.no) ? (
                          <>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={AFFECTED_EYE.RIGHT}
                                  checked={field.value === AFFECTED_EYE.RIGHT}
                                  label={REFERRAL_FORM.Right_eye}
                                  disabled
                                  disableCursorAllowed
                                  fieldColor={fieldColor?.affectedEye}
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={AFFECTED_EYE.LEFT}
                                  checked={field.value === AFFECTED_EYE.LEFT}
                                  label={REFERRAL_FORM.Left_eye}
                                  disabled
                                  disableCursorAllowed
                                  fieldColor={fieldColor?.affectedEye}
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
                                  disabled
                                  disableCursorAllowed
                                  fieldColor={fieldColor?.affectedEye}
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
                                disabled
                                disableCursorAllowed
                                fieldColor={COLOR_CODING.BLUE}
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
                        onValueChange={field.onChange}
                        className='flex w-full flex-wrap gap-[16px]'
                      >
                        {!form
                          .getValues('affectedVision')
                          ?.includes(VISION_AFFECTED.no) ? (
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
                                  disabled
                                  disableCursorAllowed
                                  fieldColor={fieldColor?.durationOfSymptoms}
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={SYMPTOMS_DURATION.one_to_two_weeks}
                                  checked={
                                    field.value ===
                                    SYMPTOMS_DURATION.one_to_two_weeks
                                  }
                                  label={REFERRAL_FORM.Weeks}
                                  disabled
                                  disableCursorAllowed
                                  fieldColor={fieldColor?.durationOfSymptoms}
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
                                  disabled
                                  disableCursorAllowed
                                  fieldColor={fieldColor?.durationOfSymptoms}
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
                                        rightLabel='weeks'
                                        rightLabelClass='pr-2 pl-4'
                                        disabled
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
                                  disabled
                                  disableCursorAllowed
                                  fieldColor={fieldColor?.durationOfSymptoms}
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
                                disabled
                                disableCursorAllowed
                                fieldColor={COLOR_CODING.BLUE}
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
                            disabled
                            disableCursorAllowed
                            fieldColor={
                              fieldColor?.intraocularPressure?.rightEye
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
                            disabled
                            disableCursorAllowed
                            fieldColor={
                              fieldColor?.intraocularPressure?.leftEye
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
                            label={item?.label}
                            disabled
                            disableCursorAllowed
                            fieldColor={
                              fieldColor?.visualImpairment?.[item?.value]
                            }
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
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex w-full flex-wrap gap-[16px]'
                      >
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={PAIN.none}
                              checked={field.value === PAIN.none}
                              label={REFERRAL_FORM.None}
                              disabled
                              disableCursorAllowed
                              fieldColor={fieldColor?.pain}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={PAIN.mild}
                              checked={field.value === PAIN.mild}
                              label={REFERRAL_FORM.Mild}
                              disabled
                              disableCursorAllowed
                              fieldColor={fieldColor?.pain}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={PAIN.moderate}
                              checked={field.value === PAIN.moderate}
                              label={REFERRAL_FORM.Moderate}
                              disabled
                              disableCursorAllowed
                              fieldColor={fieldColor?.pain}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={PAIN.severe}
                              checked={field.value === PAIN.severe}
                              label={REFERRAL_FORM.Severe}
                              disabled
                              disableCursorAllowed
                              fieldColor={fieldColor?.pain}
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
                              disabled
                              disableCursorAllowed
                              fieldColor={fieldColor?.redness}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={YES_NO.no}
                              checked={field.value === YES_NO.no}
                              label={REFERRAL_FORM.No}
                              disabled
                              disableCursorAllowed
                              fieldColor={fieldColor?.redness}
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
                            label={item?.label}
                            disabled
                            disableCursorAllowed
                            fieldColor={
                              fieldColor?.pastEyeHistory?.[item?.value]
                            }
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
                              label={'Other'}
                              disabled
                              disableCursorAllowed
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
              {referralFormData?.otherPastEyeHistory && (
                <TypographyP
                  size={16}
                  classname='!text-darkGray flex items-center'
                >
                  Notes:
                  <TypographyP size={16} noBottom classname='font-normal ml-1'>
                    {form?.watch().otherPastEyeHistory}
                  </TypographyP>
                </TypographyP>
              )}
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              10. Under current treatment for eyes?
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
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
                        }}
                        className='flex w-full flex-wrap gap-[16px]'
                      >
                        <FormItem className=' !flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={YES_NO.yes}
                              checked={field.value === YES_NO.yes}
                              label={REFERRAL_FORM.Yes}
                              disabled
                              disableCursorAllowed
                              fieldColor={fieldColor?.currentTreatmentForEyes}
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={YES_NO.no}
                              checked={field.value === YES_NO.no}
                              label={REFERRAL_FORM.No}
                              disabled
                              disableCursorAllowed
                              fieldColor={fieldColor?.currentTreatmentForEyes}
                            />
                          </FormControl>
                        </FormItem>
                      </CustomRadioGroup>
                    </FormControl>
                    <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                  </FormItem>
                )}
              />
              <FlexBox flex classname='flex-col'>
                {form?.watch()?.currentTreatmentForEyes === YES_NO.yes && (
                  <FormField
                    control={form.control}
                    name='whatTreatment'
                    render={({ field }) => (
                      <FormItem className='!flex-none max-ms:w-full'>
                        <FormControl>
                          <FormItem className='!flex-none max-ms:w-full'>
                            <FormControl>
                              <CustomCheckbox
                                {...field}
                                checked={field?.value ? true : false}
                                label= {form?.watch().whatTreatment}
                                disabled
                                disableCursorAllowed
                              />
                            </FormControl>
                          </FormItem>
                        </FormControl>
                        <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                      </FormItem>
                    )}
                  />
                )}
              </FlexBox>
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              11. Medical History?
            </TypographyP>
            <FlexBox classname='flex flex-col flex-wrap mt-2 border-b border-b-lightGray'>
              <FlexBox flex classname='gap-[16px] w-full flex-wrap'>
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
                            disabled
                            disableCursorAllowed
                            fieldColor={
                              fieldColor?.medicalHistory?.[item?.value]
                            }
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
                              label={'Other'}
                              disabled
                              disableCursorAllowed
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
              {referralFormData?.otherMedicalHistory && (
                <TypographyP
                  size={16}
                  classname='!text-darkGray !mt-[22px] flex items-center'
                >
                  Notes:
                  <TypographyP size={16} noBottom classname='font-normal ml-1'>
                    {form?.watch().otherMedicalHistory}
                  </TypographyP>
                </TypographyP>
              )}
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              12. Family history{' '}
              <span className='font-normal'>(optional) </span>
            </TypographyP>
            <FlexBox classname='flex flex-col flex-wrap mt-2 border-b border-b-lightGray'>
              <FlexBox flex classname='gap-[16px] w-full flex-wrap'>
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
                            disabled
                            disableCursorAllowed
                            fieldColor={
                              fieldColor?.familyHistory?.[item?.value]
                            }
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
                              label={'Other'}
                              disabled
                              disableCursorAllowed
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
              {referralFormData?.otherFamilyHistory && (
                <TypographyP
                  size={16}
                  classname='!text-darkGray mt-[22px] flex items-center'
                >
                  Notes:
                  <TypographyP size={16} noBottom classname='font-normal ml-1'>
                    {form?.watch().otherFamilyHistory}
                  </TypographyP>
                </TypographyP>
              )}
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
                            disabled
                            disableCursorAllowed
                            fieldColor={fieldColor?.lifestyle?.[item?.value]}
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
                            <CustomCheckbox
                              {...field}
                              value={referralFormData?.allergy}
                              checked={referralFormData?.allergy ? true : false}
                              disabled
                              disableCursorAllowed
                              label={'Allergy'}
                            />
                          </FormControl>
                        </FormItem>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </FlexBox>
              {referralFormData?.allergy && (
                <TypographyP
                  size={16}
                  classname='!text-darkGray flex items-center'
                >
                  Notes:
                  <TypographyP size={16} noBottom classname='font-normal ml-1'>
                    {form?.watch().allergy}
                  </TypographyP>
                </TypographyP>
              )}
            </FlexBox>

            <TypographyP size={17} classname='!text-darkGray mt-5'>
              14. Comments <span className='font-normal'>(optional)</span>: What
              do you think it might be? What are your concerns about this
              patient?{' '}
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2'>
              <TypographyP
                size={16}
                classname='!text-darkGray flex items-center font-normal'
              >
                {form?.watch()?.remarks || '-'}
              </TypographyP>
            </FlexBox>
            <StepperFooter
              typeOfNext='submit'
              hideBack
              outlinedNext={!noColor}
              nextButtonText='Next'
              loading={loading}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReferralFormProgress;
