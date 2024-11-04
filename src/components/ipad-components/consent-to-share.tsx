'use client';
import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldPath, useForm } from 'react-hook-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '../ui/card';
import { yupResolver } from '@hookform/resolvers/yup';
import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  TDiagnosisReportShare,
  TGetUnpaidFileData,
  TPatientConsentIpad,
} from '@/models/types/ipad';
import { diagnosisReportShare } from '@/models/validations/ipad';
import PatientConsentFooterInfo from './patient-consent-footer-info';

type Tprops = {
  setStep?: Dispatch<SetStateAction<number>>;
  fileData?: TGetUnpaidFileData | null;
  setFormedData: Dispatch<SetStateAction<TPatientConsentIpad | undefined>>;
  formedData?: TPatientConsentIpad;
};

const PatientContentContent2 = ({
  setStep = () => {},
  fileData = null,
  formedData,
  setFormedData = () => {},
}: Tprops) => {
  const form = useForm<TDiagnosisReportShare>({
    resolver: yupResolver(diagnosisReportShare),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
    },
  });
  const hideError = useCallback(
    (name: FieldPath<TDiagnosisReportShare>) => form.clearErrors(name),
    [],
  );

  const handleChangeValue = useCallback(
    (name: FieldPath<TDiagnosisReportShare>, value: string) => {
      form.setValue(name, value);
    },
    [],
  );

  const { t } = useTranslation();

  const { errors } = form.formState;

  const onSubmit = useCallback(async (values: TDiagnosisReportShare) => {
    setFormedData({
      ...formedData,
      name: values?.name?.trim()?.length ? values?.name : undefined,
      email: values?.email?.trim()?.length ? values?.email : undefined,
    } as TPatientConsentIpad);
    setStep((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (formedData) {
      form.setValue('name', formedData?.name || '');
      form.setValue('email', formedData?.email || '');
    }
    if (!formedData && fileData?.communicationForm?.id) {
      form.reset({
        ...fileData?.communicationForm,
        email: fileData?.communicationForm?.email || '',
        name: fileData?.communicationForm?.name || '',
      } as TDiagnosisReportShare);
    }
  }, [formedData, form, fileData?.communicationForm]);

  return (
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
                {t('translation.expressConsentToAllowBedrToShare')}
              </TypographyP>
            </CardDescription>
          </CardHeader>
          <CardContent className='px-[30px] pb-[15px]'>
            <TypographyP size={16} primary classname='font-normal '>
              {t('translation.expressConsentToMyOptometrist', {
                name: `${fileData?.patient?.firstName || ''} ${fileData?.patient?.lastName || ''}`,
              })}
            </TypographyP>
            <div className='mb-[10px] mt-3 w-[50%]'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type='text'
                        label={t('translation.name')}
                        error={errors?.name}
                        {...field}
                        value={field?.value || ''}
                        onChange={(e) => {
                          handleChangeValue('name', e.target.value);
                          hideError('name');
                        }}
                      />
                    </FormControl>
                    <FormMessage className='mb-0  min-h-[21px]' />
                  </FormItem>
                )}
              />
            </div>
            <div className='w-[50%]'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type='text'
                        label={t('translation.emailAddress')}
                        error={errors?.email}
                        {...field}
                        value={field?.value || ''}
                        onChange={(e) => {
                          handleChangeValue('email', e.target.value);
                          hideError('email');
                        }}
                      />
                    </FormControl>
                    <FormMessage className='mb-[12px] min-h-[21px]' />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className=' mt-[21px]  flex-col px-[30px]'>
            <PatientConsentFooterInfo fileData={fileData} />
            <FlexBox flex classname='gap-5  w-full justify-end mt-[30px]'>
              <Button
                onClick={() => setStep((prev) => prev - 1)}
                variant={'outlineWithoutHover'}
                className='px-[60px]'
                type='button'
              >
                {t('translation.back')}
              </Button>
              <Button
                type='submit'
                variant={'default'}
                className='px-[60px] text-white'
              >
                {t('translation.next')}
              </Button>
            </FlexBox>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default PatientContentContent2;
