'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldPath, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import dayjs from 'dayjs';

import { ipadNewPatientSearchSchema } from '@/models/validations/create-patient-forms';
import PatientDetailCard from '@/components/custom-components/patient-detail-card';
import {
  getAllPatients,
  getFileInProgressIpad,
} from '@/app/api/create-patient-request';
import { TypographyP } from '@/components/ui/typography/p';
import { Button } from '@/components/ui/button';
import {
  TIpadPatientListDetails,
  TNewPatientSearch,
  TRegisterNewPatientForm,
} from '@/models/types/create-patient-forms';
import { getErrorMessage } from '@/lib/utils';
import FlexBox from '@/components/ui/flexbox';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import RegisterPatient from '@/components/create-patient-steps/ipad-register-new-patient';
import { DATE_FORMAT } from '@/lib/common/dob-validation';
import Loader from '@/components/custom-loader';
import NoDataFound from '@/components/custom-components/custom-no-data-found';

const PAGE_SIZE = 6;
const DEFAULT_LIMIT = 1;

const Patients = () => {
  const [patientList, setPatientList] = useState<TIpadPatientListDetails[]>([]);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [patientDetails, setPatientDetails] =
    useState<TRegisterNewPatientForm>();
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileId, setFileId] = useState<string | undefined>(undefined);

  const { t } = useTranslation();
  const router = useRouter();

  const form = useForm<TNewPatientSearch>({
    resolver: yupResolver(ipadNewPatientSearchSchema),
    defaultValues: {},
  });

  const fetchfileInProgress = useCallback(async () => {
    try {
      const response = await getFileInProgressIpad();
      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      if (response?.data?.data?.id) {
        setViewOnly(true);
      }
      setFileId(response?.data?.data?.id || '');
      setPatientDetails(response.data?.data?.patient);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    }
  }, []);

  useEffect(() => {
    fetchfileInProgress();
  }, [fetchfileInProgress]);

  const searchPayload = (data?: TNewPatientSearch) => {
    let payload = {};
    const firstName = data?.firstName || form?.watch('firstName') || '';
    const lastName = data?.lastName || form?.watch('lastName') || '';
    const dateOfBirth = data?.dateOfBirth || form?.watch('dateOfBirth') || '';

    if (firstName?.trim()?.length) {
      payload = {
        ...payload,
        firstName,
      };
    }
    if (lastName?.trim()?.length) {
      payload = {
        ...payload,
        lastName,
      };
    }
    if (dateOfBirth?.trim()?.length) {
      payload = {
        ...payload,
        dateOfBirth,
      };
    }
    return { ...payload };
  };

  const onSubmit = useCallback(async (values: TNewPatientSearch) => {
    const payload = searchPayload(values);
    try {
      setLoading(true);
      const response = await getAllPatients({
        ...payload,
        page: DEFAULT_LIMIT,
        offset: PAGE_SIZE,
      });
      if (response?.status !== 200) {
        toast.error(t('translation.somethingWentWrong'));
      } else {
        if (response?.data?.data?.length < PAGE_SIZE) {
          setHideLoadMore(true);
        } else {
          setHideLoadMore(false);
        }
        setPatientList(response.data?.data);
        setShowCards(true);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
      setLimit(DEFAULT_LIMIT);
    }
  }, []);

  const hideError = (name: FieldPath<TNewPatientSearch>) =>
    form.clearErrors(name);

  const handleChangeValue = (
    name: FieldPath<TNewPatientSearch>,
    value: string,
  ) => form.setValue(name, value);

  const isFormEmpty = useMemo(
    () =>
      !form.watch('firstName') &&
      !form.watch('lastName') &&
      !form.watch('dateOfBirth'),
    [form.watch()],
  );

  const handleLoadMore = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      count: number,
    ) => {
      e.preventDefault();
      if (isFormEmpty) {
        return;
      }
      try {
        setLoadingMore(true);
        const payload = searchPayload();
        const response = await getAllPatients({
          ...payload,
          page: count,
          offset: PAGE_SIZE,
        });
        if (response?.status !== 200) {
          toast.error(t('translation.somethingWentWrong'));
        } else {
          setLimit(count);
          if (response?.data?.data) {
            setPatientList((prev) => [...prev, ...response.data.data]);
            setShowCards(true);
            if (response?.data?.data?.length < PAGE_SIZE) {
              setHideLoadMore(true);
            }
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoadingMore(false);
      }
    },
    [isFormEmpty, form?.watch()],
  );

  const onDiscardFileSuccess = () => {
    setShowPersonalDetails(false);
    setFileId('');
    setPatientDetails(undefined);
    setViewOnly(false);
  };

  const handleSelectPatientClick = (patient: TIpadPatientListDetails) => {
    if (patient) {
      const registerPatient = {
        ...patient,
        id: undefined,
        patientId: patient?.id,
        mobileNumber: `${patient.callingCode}${patient.mobileNumber}`,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: patient?.dateOfBirth
          ? dayjs(patient?.dateOfBirth)?.format(DATE_FORMAT)
          : '',
      };
      setPatientDetails(registerPatient);
      setShowPersonalDetails(true);
      setViewOnly(true);
    }
  };

  const handleRegisterNewPatientClick = () => {
    setShowPersonalDetails(true);
  };

  const handleViewList = () => {
    router.push('/ipad/practice/patients-list');
  };

  if (fileId === undefined) {
    return <Loader />;
  }

  return fileId || showPersonalDetails ? (
    <RegisterPatient
      setShowPersonalDetails={setShowPersonalDetails}
      fileId={fileId}
      patientDetails={patientDetails}
      setFileId={setFileId}
      onDiscardFileSuccess={onDiscardFileSuccess}
      viewOnly={viewOnly}
      setViewOnly={setViewOnly}
      setPatientDetails={setPatientDetails}
    />
  ) : (
    <div className='p-[30px]'>
      <Card className='mb-5 w-full p-3'>
        <FlexBox flex justify='between' centerItems>
          <FlexBox flex classname='items-center gap-3'>
            <div className='flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src={'/assets/search.svg'}
                alt={t('translation.search')}
                width={14}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyP primary noBottom>
              {t('translation.searchPatient')}
            </TypographyP>
          </FlexBox>
          <Button
            className={'text-[16px] max-ms:mt-2'}
            onClick={handleViewList}
          >
            {t('translation.patientsList')}
          </Button>
        </FlexBox>
      </Card>
      <Card className='mb-8 p-5'>
        <FlexBox
          flex
          classname='items-center justify-between max-ms:flex-col pb-5 border-b bottom-[0.5px] border-lightGray'
        >
          <TypographyP primary noBottom classname='w-[65%] max-ms:w-full'>
            {t('translation.registerNewPatientTitle')}
          </TypographyP>
          <Button
            variant={'outline'}
            className={'text-[18px] max-ms:mt-2'}
            onClick={handleRegisterNewPatientClick}
          >
            {t('translation.registerNewPatient')}
          </Button>
        </FlexBox>
        <TypographyP size={16} classname='pt-5 !mt-0 !mb-3 leading-normal'>
          {t('translation.registerNewPatientSearchTitle')}
        </TypographyP>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            autoComplete='off'
            className='flex flex-col justify-between'
          >
            <FlexBox flex classname='gap-[16px] max-ms:flex-col'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type='text'
                        label={t('translation.firstName')}
                        {...field}
                        onChange={(e) => {
                          handleChangeValue('firstName', e.target.value);
                          hideError('firstName');
                        }}
                      />
                    </FormControl>
                    <FormMessage className='mb-2' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type='text'
                        label={t('translation.lastName')}
                        {...field}
                        onChange={(e) => {
                          handleChangeValue('lastName', e.target.value);
                          hideError('lastName');
                        }}
                      />
                    </FormControl>
                    <FormMessage className='mb-2' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type='date'
                        label={t('translation.dob')}
                        {...field}
                        onChange={(e) => {
                          handleChangeValue('dateOfBirth', e.target.value);
                          hideError('dateOfBirth');
                        }}
                        onKeyUp={() => hideError('dateOfBirth')}
                      />
                    </FormControl>
                    <FormMessage className='mb-2' />
                  </FormItem>
                )}
              />
            </FlexBox>
            <Button
              type='submit'
              className='ml-auto min-h-[44px] min-w-[150px] text-[16px] text-white'
              loading={loading}
              center
              disabled={loading || isFormEmpty}
            >
              {t('translation.search')}
            </Button>
          </form>
        </Form>
      </Card>
      {showCards && (
        <>
          <div className='mb-5 grid grid-cols-3 gap-4 max-nm:grid-cols-2'>
            {patientList && patientList?.length > 0 ? (
              patientList?.map((patient, index) => (
                <PatientDetailCard
                  patient={patient}
                  key={index}
                  handleSelectPatientClick={handleSelectPatientClick}
                />
              ))
            ) : (
              <TypographyP noBottom center classname='w-full col-span-3 mt-12'>
                <NoDataFound
                  title={t('translation.ipadNewPatientNotFound')}
                  buttonText={t('translation.registerNewPatient')}
                  onClickButton={handleRegisterNewPatientClick}
                  buttonClass='bg-transparent mt-3'
                />
              </TypographyP>
            )}
          </div>
          {!hideLoadMore && patientList?.length > 0 && (
            <FlexBox flex centerItems centerContent>
              <Button
                variant={'outline'}
                className='min-h-[40px] min-w-[150px] text-[16px]'
                onClick={(e) => {
                  handleLoadMore(e, limit + DEFAULT_LIMIT);
                }}
                loading={loadingMore}
                center
              >
                {t('translation.loadMore')}
              </Button>
            </FlexBox>
          )}
        </>
      )}
    </div>
  );
};

export default Patients;
