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
import { AFFECTED_EYE } from '@/enums/create-patient';
import { getErrorMessage } from '@/lib/utils';
import { CustomCheckbox } from '../custom-components/custom-checkbox';
import { ReferralFormTextarea } from '../custom-components/custom-referral-form-textarea';
import StepperFooter from '../create-patient-steps/common-stepper-footer';
import {
  ACTION_TO_BE_TAKEN,
  DIAGNOSIS,
  DIAGNOSIS_OPTIONS,
  DRAFT_DIAGNOSIS_FORM,
  FILE_IN_PROGRESS_STEPS,
  OTHER_OPTHALMIC_CONDITIONS,
  READER_CONFIDENCE,
} from '@/enums/file-in-progress';
import useAccessToken from '@/hooks/useAccessToken';
import { LOGINS } from '@/enums/auth';
import { draftDiagnosisFormSchema } from '@/models/validations/file-in-progress';
import { TDraftDiagnosisForm } from '@/models/types/file-in-progress';
import { addDraftDiagnosisForm } from '@/app/api/file-in-progress';

type Tprops = {
  setCurrentStep: Dispatch<SetStateAction<string>>;
  diagnosisFormData?: TDraftDiagnosisForm;
  setDiagnosisFormData?: Dispatch<
    SetStateAction<TDraftDiagnosisForm | undefined>
  >;
  fileId?: string;
  viewOnly?: boolean;
  setDiagnosisReportHtml?: Dispatch<SetStateAction<string | undefined>>;
};


const DraftDiagnosisForm = ({
  setCurrentStep,
  diagnosisFormData,
  setDiagnosisFormData = () => { },
  fileId,
  viewOnly = false,
  setDiagnosisReportHtml,
}: Tprops) => {
  const userAccessToken = useAccessToken();

  const defaultValues = {
    diagnosisReason: '',
    isReaderConfident: userAccessToken?.role === LOGINS.READER ? 'false' : undefined
  };

  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(true);
  const form = useForm<TDraftDiagnosisForm>({
    resolver: yupResolver(draftDiagnosisFormSchema),
    defaultValues: diagnosisFormData ? diagnosisFormData : defaultValues,
    shouldFocusError: false,
    mode: 'onSubmit',
  });

  const { errors } = form.formState;
  const inited = useRef(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (diagnosisFormData && !inited.current && isReset) {
      form.reset({ ...diagnosisFormData });
      inited.current = true;
    }
  }, [diagnosisFormData, isReset]);

  const onSubmit = useCallback(
    async (values: TDraftDiagnosisForm) => {
      if (viewOnly) {
        setCurrentStep(FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT);
        return;
      }
      if (!fileId) {
        return;
      }
      const draftDiagnosisFormPayload = {
        patientFileId: fileId,
        affectedEye: values?.affectedEye,
        leftEyeDiagnosis: values?.otherLeftEyeDiagnosis
          ? values?.otherLeftEyeDiagnosis
          : values?.leftEyeDiagnosis,
        rightEyeDiagnosis: values?.otherRightEyeDiagnosis
          ? values?.otherRightEyeDiagnosis
          : values?.rightEyeDiagnosis,
        otherOpthalmicConditions:
          values.otherOpthalmicConditions &&
            values?.otherInputOpthalmicConditions
            ? [
              ...values.otherOpthalmicConditions,
              values?.otherInputOpthalmicConditions,
            ]
            : values?.otherOpthalmicConditions,
        diagnosisReason: values?.diagnosisReason,
        actionToBeTakenForLeftEye: values?.actionToBeTakenForLeftEye,
        actionToBeTakenForRightEye: values?.actionToBeTakenForRightEye,
        remarks: values?.remarks,
        isReaderConfident:
          userAccessToken?.role === LOGINS.DOCTOR
            ? undefined
            : values?.isReaderConfident === READER_CONFIDENCE.SURE
              ? true
              : false,
      };
      try {
        setLoading(true);
        const response = await addDraftDiagnosisForm(draftDiagnosisFormPayload);
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
        } else {
          if (setDiagnosisReportHtml) {
            setDiagnosisReportHtml(response?.data?.data?.diagnosisFormHtml);
          }
          setIsReset(false);
          form.reset({ ...(draftDiagnosisFormPayload as TDraftDiagnosisForm) });
          setCurrentStep(FILE_IN_PROGRESS_STEPS.DIAGNOSIS_REPORT);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },

    [fileId, userAccessToken, viewOnly],
  );
  const { affectedEye } = form.watch();

  const hideError = (name: FieldPath<TDraftDiagnosisForm>) =>
    form.clearErrors(name);

  const handleChangeValue = (change: any) => {
    Object.keys(change)?.map((item) => {
      return form.setValue(
        item as FieldPath<TDraftDiagnosisForm>,
        change?.[item] || '',
      );
    });
  };

  const actionToBeTakenForLeftEyeOptions = useMemo(() => {
    const leftEyeDiagnosisValues = form?.getValues(
      'leftEyeDiagnosis',
    ) as DIAGNOSIS;
    const leftEyeDiagnosisOtherValue = form?.getValues(
      'otherLeftEyeDiagnosis',
    ) as DIAGNOSIS;
    let options = null;
    if (
      [DIAGNOSIS.WETAMD, DIAGNOSIS.PROLIFERATIVE].includes(
        leftEyeDiagnosisValues,
      )
    ) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.URGENT_REFERRAL,
          value: ACTION_TO_BE_TAKEN.URGENT_REFERRAL,
        },
      ];
    } else if (
      [
        DIAGNOSIS.DIABETIC_MASCULAR_OEDEMA,
        DIAGNOSIS.NON_PROLIFERATIVE,
      ].includes(leftEyeDiagnosisValues)
    ) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.ROUTINE_REFERRAL,
          value: ACTION_TO_BE_TAKEN.ROUTINE_REFERRAL,
        },
      ];
    } else if (
      [
        DIAGNOSIS.MILD_TO_MODERATE,
        DIAGNOSIS.EARLY_DRYMD,
        DIAGNOSIS.INTERMEDIATE_DRYMD,
        DIAGNOSIS.ADVANCED_DRYMD,
      ].includes(leftEyeDiagnosisValues)
    ) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.CARE,
          value: ACTION_TO_BE_TAKEN.CARE,
        },
      ];
    } else if (
      [DIAGNOSIS.RVO, DIAGNOSIS.GLAUCOMA].includes(leftEyeDiagnosisValues)
    ) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.URGENT_REFERRAL,
          value: ACTION_TO_BE_TAKEN.URGENT_REFERRAL,
        },
        {
          label: DRAFT_DIAGNOSIS_FORM.ROUTINE_REFERRAL,
          value: ACTION_TO_BE_TAKEN.ROUTINE_REFERRAL,
        },
        {
          label: DRAFT_DIAGNOSIS_FORM.CARE,
          value: ACTION_TO_BE_TAKEN.CARE,
        },
      ];
    } else if (
      ['other'].includes(leftEyeDiagnosisValues) ||
      leftEyeDiagnosisOtherValue
    ) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.URGENT_REFERRAL,
          value: ACTION_TO_BE_TAKEN.URGENT_REFERRAL,
        },
        {
          label: DRAFT_DIAGNOSIS_FORM.ROUTINE_REFERRAL,
          value: ACTION_TO_BE_TAKEN.ROUTINE_REFERRAL,
        },
        {
          label: DRAFT_DIAGNOSIS_FORM.CARE,
          value: ACTION_TO_BE_TAKEN.CARE,
        },
        {
          label: DRAFT_DIAGNOSIS_FORM.REASSURE,
          value: ACTION_TO_BE_TAKEN.DISCHARGE,
        },
      ];
    } else if ([DIAGNOSIS.NAD].includes(leftEyeDiagnosisValues)) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.REASSURE,
          value: 'reassure_and_discharge',
        },
      ];
    }
    return options;
  }, [
    form?.getValues('leftEyeDiagnosis'),
    form?.getValues('otherLeftEyeDiagnosis'),
  ]);

  const actionToBeTakenForRightEyeOptions = useMemo(() => {
    const rightEyeDiagnosisValues = form?.getValues(
      'rightEyeDiagnosis',
    ) as DIAGNOSIS;
    const rightEyeDiagnosisOtherValue = form?.getValues(
      'otherRightEyeDiagnosis',
    ) as DIAGNOSIS;
    let options = null;
    if (
      [DIAGNOSIS.WETAMD, DIAGNOSIS.PROLIFERATIVE].includes(
        rightEyeDiagnosisValues,
      )
    ) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.URGENT_REFERRAL,
          value: ACTION_TO_BE_TAKEN.URGENT_REFERRAL,
        },
      ];
    } else if (
      [
        DIAGNOSIS.DIABETIC_MASCULAR_OEDEMA,
        DIAGNOSIS.NON_PROLIFERATIVE,
      ].includes(rightEyeDiagnosisValues)
    ) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.ROUTINE_REFERRAL,
          value: ACTION_TO_BE_TAKEN.ROUTINE_REFERRAL,
        },
      ];
    } else if (
      [
        DIAGNOSIS.MILD_TO_MODERATE,
        DIAGNOSIS.EARLY_DRYMD,
        DIAGNOSIS.INTERMEDIATE_DRYMD,
        DIAGNOSIS.ADVANCED_DRYMD,
      ].includes(rightEyeDiagnosisValues)
    ) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.CARE,
          value: ACTION_TO_BE_TAKEN.CARE,
        },
      ];
    } else if (
      [DIAGNOSIS.RVO, DIAGNOSIS.GLAUCOMA].includes(rightEyeDiagnosisValues)
    ) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.URGENT_REFERRAL,
          value: ACTION_TO_BE_TAKEN.URGENT_REFERRAL,
        },
        {
          label: DRAFT_DIAGNOSIS_FORM.ROUTINE_REFERRAL,
          value: ACTION_TO_BE_TAKEN.ROUTINE_REFERRAL,
        },
        {
          label: DRAFT_DIAGNOSIS_FORM.CARE,
          value: ACTION_TO_BE_TAKEN.CARE,
        },
      ];
    } else if (
      ['other'].includes(rightEyeDiagnosisValues) ||
      rightEyeDiagnosisOtherValue
    ) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.URGENT_REFERRAL,
          value: ACTION_TO_BE_TAKEN.URGENT_REFERRAL,
        },
        {
          label: DRAFT_DIAGNOSIS_FORM.ROUTINE_REFERRAL,
          value: ACTION_TO_BE_TAKEN.ROUTINE_REFERRAL,
        },
        {
          label: DRAFT_DIAGNOSIS_FORM.CARE,
          value: ACTION_TO_BE_TAKEN.CARE,
        },
        {
          label: DRAFT_DIAGNOSIS_FORM.REASSURE,
          value: ACTION_TO_BE_TAKEN.DISCHARGE,
        },
      ];
    } else if ([DIAGNOSIS.NAD].includes(rightEyeDiagnosisValues)) {
      options = [
        {
          label: DRAFT_DIAGNOSIS_FORM.REASSURE,
          value: 'reassure_and_discharge',
        },
      ];
    }
    return options;
  }, [
    form?.getValues('rightEyeDiagnosis'),
    form?.getValues('otherRightEyeDiagnosis'),
  ]);

  const handleStateChange = (change: any, isFieldAlreadySet = false) => {
    if (diagnosisFormData) {
      setDiagnosisFormData?.((prev: any) => {
        if (prev) {
          if (!isFieldAlreadySet) {
            handleChangeValue({
              ...(prev || {}),
              ...change,
            });
          }
          return {
            ...(prev || {}),
            ...change,
          };
        }
      });
    } else {
      const defaultValue: any = { ...defaultValues };
      if (!isFieldAlreadySet) {
        handleChangeValue({
          ...defaultValue,
          ...change,
        });
      }
      setDiagnosisFormData?.({
        ...defaultValue,
        ...change,
      });
    }
  };

  const onInvalidInput = () => {
    toast.error(t('translation.pleaseFillAllMandatoryFields'));
  };

  const leftEyeDiagnosisField = () => {
    return (
      <>
        <FlexBox classname='flex flex-col flex-wrap mt-2 border-b border-b-lightGray'>
          <FlexBox flex classname='gap-[16px] w-full flex-wrap'>
            {DIAGNOSIS_OPTIONS?.map((item, index) => (
              <FormField
                key={index}
                control={form.control}
                name={'leftEyeDiagnosis'}
                render={({ field }) => (
                  <FormItem className='!flex-none'>
                    <FormControl className='!flex-none'>
                      <CustomCheckbox
                        {...field}
                        value={item?.value}
                        checked={
                          form?.watch('leftEyeDiagnosis') === item?.value
                        }
                        onCheckedChange={() => {
                          handleStateChange({
                            otherLeftEyeDiagnosis: '',
                            leftEyeDiagnosis: item?.value || '',
                            actionToBeTakenForLeftEye: '',
                          });
                          form?.setValue(
                            'actionToBeTakenForLeftEye',
                            '' as ACTION_TO_BE_TAKEN,
                          );
                          hideError('leftEyeDiagnosis');
                        }}
                        label={item?.label}
                        disabled={viewOnly}
                        disableCursorAllowed
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name='otherLeftEyeDiagnosis'
              render={({ field }) => (
                <FormItem className='!flex-none max-ms:w-full'>
                  <FormControl>
                    <FormItem className='!flex-none'>
                      <FormControl>
                        <CustomCheckbox
                          {...field}
                          labelClass='w-fit max-ms:w-full '
                          checked={
                            form?.watch().otherLeftEyeDiagnosis ? true : false
                          }
                          label={
                            <div className='flex max-ms:w-full'>
                              <ReferralFormTextarea
                                className='h-[25px] resize-none max-ms:w-full md:min-w-[390px] md:max-w-[390px]'
                                placeholder='Other'
                                checked={
                                  form?.watch().otherLeftEyeDiagnosis
                                    ? true
                                    : false
                                }
                                containerClass={`${form?.watch().otherLeftEyeDiagnosis ? '!border-transparent' : ''} !px-0 !mx-0!`}
                                value={form?.watch().otherLeftEyeDiagnosis}
                                onChange={(e) => {
                                  handleChangeValue({
                                    otherLeftEyeDiagnosis: e.target.value,
                                    leftEyeDiagnosis: 'other',
                                    actionToBeTakenForLeftEye: '',
                                  });
                                  setDiagnosisFormData((prev: any) => ({
                                    ...prev,
                                    actionToBeTakenForLeftEye: undefined,
                                    leftEyeDiagnosis: undefined,
                                  }));
                                  form.getValues('actionToBeTakenForRightEye');
                                  form?.setValue(
                                    'actionToBeTakenForLeftEye',
                                    '' as ACTION_TO_BE_TAKEN,
                                  );
                                  hideError('leftEyeDiagnosis');
                                }}
                                onBlur={(e) => {
                                  handleStateChange(
                                    {
                                      otherLeftEyeDiagnosis: e.target.value,
                                      leftEyeDiagnosis: 'other',
                                    },
                                    true,
                                  );
                                }}
                                disabled={viewOnly}
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
            fieldError={errors?.leftEyeDiagnosis?.message || ''}
          />
        </FlexBox>
      </>
    );
  };

  const rightEyeDiagnosisField = () => {
    return (
      <>
        <FlexBox classname='flex flex-col flex-wrap mt-2 border-b border-b-lightGray'>
          <FlexBox flex classname='gap-[16px] w-full flex-wrap'>
            {DIAGNOSIS_OPTIONS?.map((item, index) => (
              <FormField
                key={index}
                control={form.control}
                name={'rightEyeDiagnosis'}
                render={({ field }) => (
                  <FormItem className='!flex-none'>
                    <FormControl className='!flex-none'>
                      <CustomCheckbox
                        {...field}
                        value={item?.value}
                        checked={
                          form?.watch('rightEyeDiagnosis') === item?.value
                        }
                        onCheckedChange={() => {
                          handleStateChange({
                            otherRightEyeDiagnosis: '',
                            rightEyeDiagnosis: item?.value || '',
                            actionToBeTakenForRightEye: '',
                          });
                          form?.setValue(
                            'actionToBeTakenForRightEye',
                            '' as ACTION_TO_BE_TAKEN,
                          );
                          hideError('rightEyeDiagnosis');
                        }}
                        label={item?.label}
                        disabled={viewOnly}
                        disableCursorAllowed
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
            <FormField
              control={form.control}
              name='otherRightEyeDiagnosis'
              render={({ field }) => (
                <FormItem className='!flex-none max-ms:w-full'>
                  <FormControl>
                    <FormItem className='!flex-none'>
                      <FormControl>
                        <CustomCheckbox
                          {...field}
                          labelClass='w-fit max-ms:w-full'
                          checked={
                            form?.watch().otherRightEyeDiagnosis ? true : false
                          }
                          label={
                            <div className='flex max-ms:w-full'>
                              <ReferralFormTextarea
                                className='h-[25px] resize-none max-ms:w-full md:min-w-[390px] md:max-w-[390px]'
                                placeholder='Other'
                                checked={
                                  form?.watch().otherRightEyeDiagnosis
                                    ? true
                                    : false
                                }
                                containerClass={`${form?.watch().otherRightEyeDiagnosis ? '!border-transparent' : ''} !px-0 !mx-0!`}
                                value={form?.watch().otherRightEyeDiagnosis}
                                onChange={(e) => {
                                  handleChangeValue({
                                    otherRightEyeDiagnosis: e.target.value,
                                    rightEyeDiagnosis: 'other',
                                    actionToBeTakenForRightEye: '',
                                  });
                                  setDiagnosisFormData((prev: any) => ({
                                    ...prev,
                                    actionToBeTakenForRightEye: undefined,
                                    rightEyeDiagnosis: undefined,
                                  }));

                                  form?.setValue(
                                    'actionToBeTakenForRightEye',
                                    '' as ACTION_TO_BE_TAKEN,
                                  );
                                  hideError('rightEyeDiagnosis');
                                }}
                                onBlur={(e) => {
                                  handleStateChange(
                                    {
                                      otherRightEyeDiagnosis: e.target.value,
                                      rightEyeDiagnosis: 'other',
                                    },
                                    true,
                                  );
                                }}
                                disabled={viewOnly}
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
            fieldError={errors?.rightEyeDiagnosis?.message || ''}
          />
        </FlexBox>
      </>
    );
  };

  const showDiagnosis = () => {
    if (form?.watch()?.affectedEye === AFFECTED_EYE.BOTH_EYES) {
      return (
        <>
          <TypographyP size={16} classname='!text-darkGray mt-5'>
            {t('translation.diagnosisLabelA')}
            <span className='ml-[2px] text-[14px] text-darkGray'>
              {t('translation.rightEyeLabel')}
            </span>
          </TypographyP>
          {rightEyeDiagnosisField()}
          <TypographyP size={16} classname='!text-darkGray mt-5'>
            {t('translation.diagnosisLabelB')}
            <span className='ml-[2px] text-[14px] text-darkGray'>
              {t('translation.leftEyeLabel')}
            </span>
          </TypographyP>
          {leftEyeDiagnosisField()}
        </>
      );
    } else if (form?.watch()?.affectedEye === AFFECTED_EYE.RIGHT) {
      return (
        <>
          <TypographyP size={16} classname='!text-darkGray mt-5'>
            {t('translation.diagnosisLabel2')}
          </TypographyP>
          {rightEyeDiagnosisField()}
        </>
      );
    } else {
      return (
        <>
          <TypographyP size={16} classname='!text-darkGray mt-5'>
            {t('translation.diagnosisLabel2')}
          </TypographyP>
          {leftEyeDiagnosisField()}
        </>
      );
    }
  };
  return (
    <Card className='min-h-[200px] justify-start bg-white py-[30px] max-md:overflow-x-auto max-ms:px-[10px] ms:px-5'>
      <FlexBox classname='flex'>
        <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
          <Icon name='referral' width={16} height={17} className='m-auto' />
        </div>
        <TypographyH2 size={18}>
          {t('translation.draftDiagnosisForm')}
        </TypographyH2>
      </FlexBox>
      <CardContent className='mt-[25px] w-full !p-0'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalidInput)}>
            <TypographyP size={16} classname='!text-darkGray'>
              {t('translation.affectedEyeLabel')}
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
                          const updatedValue = {
                            rightEyeDiagnosis: undefined,
                            leftEyeDiagnosis: undefined,
                            otherLeftEyeDiagnosis: '',
                            otherRightEyeDiagnosis: '',
                            actionToBeTakenForRightEye: undefined,
                            actionToBeTakenForLeftEye: undefined,
                            diagnosisFormData: undefined,
                          };
                          handleStateChange({
                            affectedEye: val,
                            ...updatedValue,
                          });
                          handleChangeValue({
                            affectedEye: val,
                            ...updatedValue,
                          });
                          hideError('actionToBeTakenForRightEye');
                          hideError('actionToBeTakenForLeftEye');
                          hideError('affectedEye');
                        }}
                        defaultValue={field.value}
                        className='flex w-full flex-wrap gap-[16px]'
                      >
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={AFFECTED_EYE.RIGHT}
                              checked={field.value === AFFECTED_EYE.RIGHT}
                              label={DRAFT_DIAGNOSIS_FORM.RIGHT_EYE_ONLY}
                              disabled={viewOnly}
                              disableCursorAllowed
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={AFFECTED_EYE.LEFT}
                              checked={field.value === AFFECTED_EYE.LEFT}
                              label={DRAFT_DIAGNOSIS_FORM.LEFT_EYE_ONLY}
                              disabled={viewOnly}
                              disableCursorAllowed
                            />
                          </FormControl>
                        </FormItem>
                        <FormItem className='!flex-none'>
                          <FormControl>
                            <CustomRadioGroupItem
                              value={AFFECTED_EYE.BOTH_EYES}
                              checked={field.value === AFFECTED_EYE.BOTH_EYES}
                              label={DRAFT_DIAGNOSIS_FORM.BOTH_EYES}
                              disabled={viewOnly}
                              disableCursorAllowed
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

            {showDiagnosis()}

            <TypographyP size={16} classname='!text-darkGray mt-5'>
              {t('translation.otherOphthalmicConditions')}
            </TypographyP>
            <FlexBox classname='flex flex-col flex-wrap mt-2 border-b border-b-lightGray'>
              <FlexBox flex classname='gap-[16px] w-full flex-wrap'>
                {OTHER_OPTHALMIC_CONDITIONS?.map((item, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={'otherOpthalmicConditions'}
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
                              if (item.value === DIAGNOSIS.NONE) {
                                newValue = [item.value];
                                handleStateChange({
                                  otherInputOpthalmicConditions: '',
                                });
                              } else {
                                newValue = newValue?.filter(
                                  (val) => val !== DIAGNOSIS.NONE,
                                );
                                newValue.push(item.value);
                              }
                              handleStateChange({
                                otherOpthalmicConditions: newValue,
                              });
                              hideError('otherOpthalmicConditions');
                            }}
                            label={item?.label}
                            disabled={viewOnly}
                            disableCursorAllowed
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name='otherInputOpthalmicConditions'
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
                                    className='h-[25px] resize-none max-ms:w-full md:min-w-[390px] md:max-w-[390px]'
                                    placeholder='Other'
                                    checked={field.value ? true : false}
                                    containerClass={`${form?.watch().otherInputOpthalmicConditions ? '!border-transparent' : ''} !px-0 !mx-0`}
                                    value={
                                      form?.watch()
                                        .otherInputOpthalmicConditions
                                    }
                                    onChange={(e) => {
                                      form.setValue(
                                        'otherInputOpthalmicConditions',
                                        e.target.value,
                                      );
                                      const otherOpthalmicValues =
                                        form.watch(
                                          'otherOpthalmicConditions',
                                        ) || [];
                                      if (
                                        otherOpthalmicValues?.includes(
                                          DIAGNOSIS.NONE,
                                        )
                                      ) {
                                        form.setValue(
                                          'otherOpthalmicConditions',
                                          [],
                                        );
                                        setDiagnosisFormData(
                                          (prev) =>
                                            ({
                                              ...prev,
                                              otherOpthalmicConditions: [],
                                            }) as TDraftDiagnosisForm,
                                        );
                                      } else {
                                        form.setValue(
                                          'otherOpthalmicConditions',
                                          [...otherOpthalmicValues],
                                        );
                                      }
                                      hideError('otherOpthalmicConditions');
                                    }}
                                    onBlur={(e) =>
                                      handleStateChange(
                                        {
                                          otherInputOpthalmicConditions:
                                            e.target.value,
                                        },
                                        true,
                                      )
                                    }
                                    disabled={viewOnly}
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
                fieldError={errors?.otherOpthalmicConditions?.message || ''}
              />
            </FlexBox>

            <TypographyP size={16} classname='!text-darkGray mt-5'>
              {t('translation.reasonsForTheDiagnosis')}
            </TypographyP>
            <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
              <FormField
                control={form.control}
                name='diagnosisReason'
                render={({ field }) => (
                  <FormItem className='w-full !flex-none'>
                    <FormControl>
                      <Textarea
                        rows={3}
                        maxLength={500}
                        className='max-h-[100px] resize-none space-y-8 rounded-[4px] border-none placeholder:font-normal focus:outline-none md:max-w-[717px]'
                        placeholder={
                          viewOnly ? '' : t('translation.typeHerePlaceholder')
                        }
                        showCount={!viewOnly}
                        count={field?.value?.length}
                        {...field}
                        onBlur={(e) =>
                          handleStateChange({ diagnosisReason: e.target.value })
                        }
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                  </FormItem>
                )}
              />
            </FlexBox>
            {(affectedEye === AFFECTED_EYE.RIGHT ||
              affectedEye === AFFECTED_EYE.BOTH_EYES) && (
                <>
                  <TypographyP size={16} classname='!text-darkGray mt-5'>
                    {t(
                      affectedEye === AFFECTED_EYE.BOTH_EYES
                        ? 'translation.actionToBeTakenRight'
                        : 'translation.actionToBeTaken',
                    )}
                  </TypographyP>
                  <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
                    <FormField
                      control={form.control}
                      name='actionToBeTakenForRightEye'
                      render={({ field }) => (
                        <FormItem className='w-full !flex-none'>
                          <FormControl>
                            <CustomRadioGroup
                              onValueChange={(val) => {
                                handleStateChange({
                                  actionToBeTakenForRightEye: val,
                                });
                                field.onChange(val);
                                hideError('actionToBeTakenForRightEye');
                              }}
                              defaultValue={field.value}
                              className='flex w-full flex-wrap gap-[16px]'
                            >
                              {!actionToBeTakenForRightEyeOptions ? (
                                <TypographyP
                                  size={16}
                                  classname='!text-darkGray flex items-center'
                                >
                                  {t('translation.note')}
                                  <TypographyP
                                    size={16}
                                    noBottom
                                    classname='font-normal ml-1'
                                  >
                                    {t(
                                      'translation.actionToBeTakenForLeftEyeOptionsNote',
                                    )}
                                  </TypographyP>
                                </TypographyP>
                              ) : (
                                actionToBeTakenForRightEyeOptions?.map(
                                  (item, index) => (
                                    <FormItem className='!flex-none' key={index}>
                                      <FormControl>
                                        <CustomRadioGroupItem
                                          value={item?.value}
                                          checked={field.value === item?.value}
                                          label={item?.label}
                                          disabled={viewOnly}
                                          disableCursorAllowed
                                          onClick={() => {
                                            handleChangeValue({
                                              actionToBeTakenForRightEye:
                                                item?.value,
                                            });
                                            setDiagnosisFormData((prev: any) => ({
                                              ...prev,
                                              actionToBeTakenForRightEye:
                                                form.getValues(
                                                  'actionToBeTakenForRightEye',
                                                ),
                                            }));
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  ),
                                )
                              )}
                            </CustomRadioGroup>
                          </FormControl>
                          <FormMessage className={`mb-1 ${form.watch('actionToBeTakenForRightEye') && 'invisible'} mt-0.5 min-h-[21px]`} />
                        </FormItem>
                      )}
                    />
                  </FlexBox>
                </>
              )}

            {(form.watch('affectedEye') !== AFFECTED_EYE.RIGHT ||
              affectedEye === AFFECTED_EYE?.BOTH_EYES) && (
                <>
                  <TypographyP size={16} classname='!text-darkGray mt-5'>
                    {t(
                      affectedEye === AFFECTED_EYE.BOTH_EYES
                        ? 'translation.actionToBeTakenLeft'
                        : 'translation.actionToBeTaken',
                    )}
                  </TypographyP>
                  <FlexBox classname='flex flex-wrap mt-2 border-b border-b-lightGray'>
                    <FormField
                      control={form.control}
                      name='actionToBeTakenForLeftEye'
                      render={({ field }) => (
                        <FormItem className='w-full !flex-none'>
                          <FormControl>
                            <CustomRadioGroup
                              onValueChange={(val) => {
                                handleStateChange({
                                  actionToBeTakenForLeftEye: val,
                                });
                                field.onChange(val);
                                hideError('actionToBeTakenForLeftEye');
                              }}
                              defaultValue={field.value}
                              className='flex w-full flex-wrap gap-[16px]'
                            >
                              {!actionToBeTakenForLeftEyeOptions ? (
                                <TypographyP
                                  size={16}
                                  classname='!text-darkGray flex items-center'
                                >
                                  {t('translation.note')}
                                  <TypographyP
                                    size={16}
                                    noBottom
                                    classname='font-normal ml-1'
                                  >
                                    {t(
                                      'translation.actionToBeTakenForLeftEyeOptionsNote',
                                    )}
                                  </TypographyP>
                                </TypographyP>
                              ) : (
                                actionToBeTakenForLeftEyeOptions?.map(
                                  (item, index) => (
                                    <FormItem className='!flex-none' key={index}>
                                      <FormControl>
                                        <CustomRadioGroupItem
                                          value={item?.value}
                                          checked={field.value === item?.value}
                                          label={item?.label}
                                          disabled={viewOnly}
                                          disableCursorAllowed
                                          onClick={() => {
                                            handleChangeValue({
                                              actionToBeTakenForLeftEye:
                                                item?.value,
                                            });
                                            setDiagnosisFormData((prev: any) => ({
                                              ...prev,
                                              actionToBeTakenForLeftEye:
                                                form.getValues(
                                                  'actionToBeTakenForLeftEye',
                                                ),
                                            }));
                                          }}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  ),
                                )
                              )}
                            </CustomRadioGroup>
                          </FormControl>
                            <FormMessage className={`mb-1 ${form.watch('actionToBeTakenForLeftEye') && 'invisible'} mt-0.5 min-h-[21px]`} />
                        </FormItem>
                      )}
                    />
                  </FlexBox>
                </>
              )}

            <TypographyP size={16} classname='!text-darkGray mt-5'>
              {t('translation.anythingToAdd')}
            </TypographyP>
            <FlexBox
              classname={`flex flex-wrap mt-2 ${userAccessToken?.role === LOGINS.READER && 'border-b border-b-lightGray'}`}
            >
              <FormField
                control={form.control}
                name='remarks'
                render={({ field }) => (
                  <FormItem className='w-full !flex-none'>
                    <FormControl>
                      <Textarea
                        rows={3}
                        maxLength={500}
                        className='max-h-[100px] resize-none space-y-8 rounded-[4px] border-none placeholder:font-normal focus:outline-none md:max-w-[717px]'
                        placeholder={
                          viewOnly ? '' : t('translation.typeHerePlaceholder')
                        }
                        showCount={!viewOnly}
                        count={field?.value?.length}
                        {...field}
                        onBlur={(e) =>
                          handleStateChange({ remarks: e.target.value })
                        }
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
                  </FormItem>
                )}
              />
            </FlexBox>

            {userAccessToken?.role === LOGINS.READER && (
              <>
                <TypographyP size={16} classname='!text-darkGray mt-5'>
                  {t('translation.howConfidentAreYou')}
                </TypographyP>
                <FlexBox classname='flex flex-wrap mt-2'>
                  <FormField
                    control={form.control}
                    name='isReaderConfident'
                    render={({ field }) => (
                      <FormItem className='w-full !flex-none'>
                        <FormControl>
                          <CustomRadioGroup
                            onValueChange={(val) => {
                              handleStateChange({ isReaderConfident: val });
                              field.onChange(val);
                            }}
                            defaultValue={field.value}
                            className='flex w-full flex-wrap gap-[16px]'
                          >
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={READER_CONFIDENCE.SURE}
                                  checked={
                                    field.value === READER_CONFIDENCE.SURE
                                  }
                                  label={DRAFT_DIAGNOSIS_FORM.SURE}
                                  disabled={viewOnly}
                                  disableCursorAllowed
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={READER_CONFIDENCE.NOT_SURE}
                                  checked={
                                    field.value === READER_CONFIDENCE.NOT_SURE
                                  }
                                  label={DRAFT_DIAGNOSIS_FORM.NOT_SURE}
                                  disabled={viewOnly}
                                  disableCursorAllowed
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
              </>
            )}

            <StepperFooter
              typeOfNext='submit'
              hideBack
              outlinedNext
              nextButtonText={viewOnly ? 'Next' : 'Save & Next'}
              loading={loading}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DraftDiagnosisForm;
