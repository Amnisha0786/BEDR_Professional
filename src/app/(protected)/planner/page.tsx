'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/custom-components/custom-icon';
import CustomViewOnlyCalendar from '@/components/custom-components/custom-view-only-calendar';
import { getErrorMessage } from '@/lib/utils';
import {
  cancelBooking,
  createBooking,
  getAvailableBookingsList,
  getBookings,
  getClinics,
  readClinicTermsConditions,
} from '@/app/api/planner';
import Loader from '@/components/custom-loader';
import {
  TAvailableBookings,
  TBookings,
  TClinicsList,
  TIsReadTerms,
} from '@/models/types/planner';
import { DynamicDropdown } from '@/components/planner/dynamic-dropdown';
import { DATE_FORMAT } from '@/lib/common/dob-validation';
import { Button } from '@/components/ui/button';
import { AlertDialog } from '@/components/ui/alert-dialog';
import CustomAlertBox from '@/components/custom-components/custom-alert-box';
import useAccessToken from '@/hooks/useAccessToken';
import { LOGINS } from '@/enums/auth';
import { Dialog } from '@radix-ui/react-dialog';
import PdfModalPreview from '@/components/pdf-modal-preview';
import { setAcceptedClinicRules } from '@/lib/clinicRules/clinicRulesSlice';
import { useAppDispatch } from '@/lib/hooks';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';
import useSocket from '@/hooks/useSocket';

dayjs.extend(isBetween);

const ITEMS_PER_PAGE = 3;

const Planner = () => {
  const [loading, setLoading] = useState(false);
  const [clinicList, setClinicList] = useState<TClinicsList[]>([]);
  const [selectedRules, setSelectedRules] = useState({ id: '', rules: '' });
  const [openRules, setOpenRules] = useState<boolean>();
  const [isReadTermAndConditions, setIsReadTermAndConditions] = useState<
    TIsReadTerms[]
  >([]);
  const [loadAvailableBookings, setLoadAvailableBookings] = useState(false);
  const [loadBookings, setLoadBookings] = useState(false);
  const [reading, setReading] = useState(false);
  const [triggerChangeBooking, setTriggerChangeBooking] = useState<string>();
  const [selectedBooking, setSelectedBooking] = useState<number[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<number[]>([]);
  const [creatingBooking, setCreatingBooking] = useState<string>();
  const [cancelingBooking, setCancelingBooking] = useState<string>();
  const [bookingToCancel, setBookingToCancel] = useState<TAvailableBookings>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [
    openCancelBookingConfirmationModal,
    setOpenCancelBookingConfirmationModal,
  ] = useState(false);
  const [allBookings, setAllBookings] = useState<TBookings>({
    bookings: [],
    totalBookings: 0,
  });
  const [availableBookings, setAvailableBookings] = useState<
    TAvailableBookings[]
  >([]);

  const START_DATE = useMemo(() => dayjs().format(DATE_FORMAT), []);
  const END_DATE = useMemo(
    () => dayjs().add(2, 'month').endOf('month').format(DATE_FORMAT),
    [],
  );

  const { t } = useTranslation();
  const session = useAccessToken();
  const dispatch = useAppDispatch();
  const socket = useSocket();

  const handleDateSelect = (date?: string) => {
    setSelectedDate(date ? dayjs(date)?.format(DATE_FORMAT) : null);
    setCurrentPage(0);
  };

  const handleNext = () => {
    if (currentItems?.some((item) => item?.date === END_DATE)) {
      return;
    }

    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevious = () => {
    if (currentItems[0]?.date === START_DATE) {
      return;
    }
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const fetchClinics = useCallback(async (hideLoading?: boolean) => {
    if (!hideLoading) {
      setLoading(true);
    }
    try {
      const response = await getClinics();

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setClinicList(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClinics();
  }, [fetchClinics]);

  useEffect(() => {
    const terms: TIsReadTerms[] = [];
    clinicList?.length > 0 &&
      clinicList?.map((item) => {
        terms.push({
          id: item?.clinicId,
          agreeTermsAndConditions: item?.agreeTermsAndConditions,
        });
      });
    setIsReadTermAndConditions(terms);
  }, [clinicList]);

  const readTermsAndConditions = useCallback(async (id: string) => {
    setReading(true);
    try {
      const response = await readClinicTermsConditions({ clinicId: id });

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      setIsReadTermAndConditions([
        { ...isReadTermAndConditions, id, agreeTermsAndConditions: true },
      ]);
      dispatch(setAcceptedClinicRules(1));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setReading(false);
    }
  }, []);

  const getAvailableBookings = useCallback(async (hideLoading = false) => {
    if (!hideLoading) {
      setLoadAvailableBookings(true);
    }
    try {
      const response = await getAvailableBookingsList({
        startDate: START_DATE,
        endDate: END_DATE,
      });

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      setAvailableBookings(response?.data?.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoadAvailableBookings(false);
    }
  }, []);

  useEffect(() => {
    getAvailableBookings();
  }, [getAvailableBookings]);

  const fetchAllBookings = useCallback(async (hideLoading?: boolean) => {
    if (!hideLoading) {
      setLoadBookings(true);
    }
    try {
      const response = await getBookings({});

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      setAllBookings(response?.data?.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoadBookings(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const handleCancelBooking = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      setOpenCancelBookingConfirmationModal(true);
      if (!bookingToCancel?.bookingId) {
        toast.warning('translation.somethingWentWrong');
        return;
      }

      try {
        setCancelingBooking(bookingToCancel?.date);
        const response = await cancelBooking({
          bookingId: bookingToCancel?.bookingId,
        });

        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }

        getAvailableBookings(true);
        fetchAllBookings(true);
        setSelectedBooking([]);
        setSelectedApproval([]);
        toast.success(t('translation.bookingCancelledSuccessful'));
        setOpenCancelBookingConfirmationModal(false);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setCancelingBooking(undefined);
      }
    },
    [bookingToCancel],
  );

  useEffect(() => {
    const socketEventApis = () => {
      getAvailableBookings(true);
      fetchAllBookings(true);
    };
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.CANCEL_BOOKING, socketEventApis);
      socket.on(SOCKET_EVENTS.BOOKING_CREATED, socketEventApis);
      socket.on(SOCKET_EVENTS.FILE_CAPACITY_UPDATE, socketEventApis);

      return () => {
        socket.off(SOCKET_EVENTS.CANCEL_BOOKING, socketEventApis);
        socket.off(SOCKET_EVENTS.BOOKING_CREATED, socketEventApis);
        socket.off(SOCKET_EVENTS.FILE_CAPACITY_UPDATE, socketEventApis);
      };
    }
  }, [socket, getAvailableBookings, fetchAllBookings]);

  const handleBookNow = useCallback(
    async (
      clinicId: string,
      date: string,
      index: number,
      defaultBookings?: number,
      defaultApprovals?: number,
    ) => {
      if (
        session?.role === LOGINS.DOCTOR &&
        (!selectedBooking?.length || selectedBooking?.[index] <= 0) &&
        (!selectedApproval?.length || selectedApproval?.[index] <= 0)
      ) {
        toast.warning(t('translation.noFilesSelected'));
        return;
      }
      if (
        (session?.role === LOGINS.READER && !selectedBooking?.length) ||
        selectedBooking?.[index] <= 0
      ) {
        toast.warning(t('translation.noFilesSelectedForDiagnose'));
        return;
      }

      if (!date || !clinicId) {
        toast.warning(t('translation.somethingWentWrong'));
        return;
      }

      try {
        setCreatingBooking(date);
        const response = await createBooking({
          filesToApprove: selectedApproval[index] || defaultApprovals || 0,
          filesToDiagnose: selectedBooking[index] || defaultBookings || 0,
          plannerDate: dayjs(date).format(DATE_FORMAT),
          clinicId: clinicId,
        });

        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        setTriggerChangeBooking(undefined);
        getAvailableBookings(true);
        fetchAllBookings(true);
        toast.success(t('translation.bookingSuccess'));
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setCreatingBooking(undefined);
      }
    },
    [selectedApproval, selectedBooking],
  );

  const currentBookings = allBookings?.bookings?.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleScrollUp = () => {
    if (startIndex - ITEMS_PER_PAGE < 0) {
      return;
    }
    setStartIndex(startIndex - ITEMS_PER_PAGE);
  };

  const handleScrollDown = () => {
    if (startIndex + ITEMS_PER_PAGE >= allBookings?.bookings?.length) {
      return;
    }
    setStartIndex(startIndex + ITEMS_PER_PAGE);
  };

  const filterBookings = useMemo(() => {
    const updatedBookings = availableBookings?.map((availBooking) => {
      const matchingBooking = allBookings?.bookings?.find(
        (booking) => booking?.bookingDate === availBooking?.date,
      );
      if (matchingBooking) {
        return { ...availBooking, bookingId: matchingBooking?.id };
      }
      return availBooking;
    });
    return updatedBookings;
  }, [allBookings, availableBookings]);

  const getItemsForPage = useCallback(
    (page: number, ITEMS_PER_PAGE: number, startDate?: string | null) => {
      if (!startDate) {
        return filterBookings?.slice(
          page * ITEMS_PER_PAGE,
          page * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
        );
      }
      const start = dayjs(startDate).add(page * ITEMS_PER_PAGE, 'day');
      const end = start.add(ITEMS_PER_PAGE - 1, 'day');
      return filterBookings.filter((booking) =>
        dayjs(booking?.date).isBetween(start, end, null, '[]'),
      );
    },
    [filterBookings, filterBookings],
  );

  const currentItems = useMemo(
    () => getItemsForPage(currentPage, ITEMS_PER_PAGE, selectedDate),
    [
      currentPage,
      selectedDate,
      filterBookings,
      selectedApproval,
      selectedBooking,
    ],
  );

  useEffect(() => {
    if (
      currentItems?.some(
        (item) => !item?.bookingId && item?.date !== triggerChangeBooking,
      )
    ) {
      setSelectedBooking([]);
      setSelectedApproval([]);
    }
  }, [currentPage]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{t('translation.plannerHead')}</title>
      </Head>
      <div className='p-[30px] md:px-[56px]'>
        <Card className='w-full p-3'>
          <FlexBox flex centerItems classname='justify-between'>
            <FlexBox classname='flex'>
              <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                <Image
                  src='assets/planner-small.svg'
                  alt={t('translation.calendar')}
                  width={18}
                  height={14}
                  className='m-auto'
                />
              </div>
              <TypographyH2 size={18}>{t('translation.planner')}</TypographyH2>
            </FlexBox>
            {isReadTermAndConditions?.[0]?.agreeTermsAndConditions && (
              <FlexBox centerItems classname='flex gap-1'>
                <Image
                  src='assets/blue-dot.svg'
                  alt={t('translation.calendar')}
                  width={12}
                  height={12}
                  className='m-auto'
                />
                <TypographyH2 size={12} classname='!font-light'>
                  {t('translation.workAvailable')}
                </TypographyH2>
              </FlexBox>
            )}
          </FlexBox>
        </Card>
        {clinicList?.map((item) => (
          <div
            key={item?.clinicId}
            className='my-[30px] grid grid-cols-1 justify-start gap-[15px] max-xxl:grid-cols-2 max-nm:grid-cols-1 xxl:grid-cols-3'
          >
            <Card className='min-h-[330px] rounded-[4px] p-4'>
              <Card className='rounded-[4px]'>
                <CardContent className='mb-0 p-3 text-center text-[17px] leading-7'>
                  <FlexBox flex>
                    <div className='mr-[10px] flex justify-center'>
                      <Image
                        src='assets/square-symbol.svg'
                        alt={t('translation.calendar')}
                        width={18}
                        height={14}
                        className='m-auto'
                      />
                    </div>
                    <FlexBox flex classname='flex-col items-baseline'>
                      <TypographyP
                        size={16}
                        noBottom
                        primary
                        classname='font-medium'
                      >
                        {item?.clinicName}
                      </TypographyP>
                    </FlexBox>
                  </FlexBox>
                  <FlexBox flex classname='mt-2 items-start'>
                    <Checkbox
                      className='mr-2 border-darkGray'
                      checked={
                        isReadTermAndConditions?.find(
                          (terms) =>
                            terms?.id === item?.clinicId &&
                            terms?.agreeTermsAndConditions,
                        )
                          ? true
                          : false
                      }
                      disabled={
                        reading ||
                        isReadTermAndConditions?.find(
                          (terms) =>
                            terms?.id === item?.clinicId &&
                            terms?.agreeTermsAndConditions,
                        )
                          ? true
                          : false
                      }
                      onCheckedChange={() => {
                        readTermsAndConditions(item?.clinicId);
                      }}
                    />
                    <TypographyP
                      size={12}
                      classname='font-normal text-left underline cursor-pointer'
                      noBottom
                      onClick={() => {
                        setSelectedRules({
                          id: item?.clinicId,
                          rules: item?.clinicRules,
                        });
                        setOpenRules(true);
                      }}
                    >
                      {t('translation.readAndAccept')}{' '}
                      <span className='font-semibold text-darkGray'>
                        {t('translation.newClinicRules')}
                      </span>{' '}
                      {t('translation.beforeBookings')}
                    </TypographyP>
                  </FlexBox>
                </CardContent>
              </Card>
            </Card>

            {isReadTermAndConditions?.find(
              (terms) =>
                terms?.id === item?.clinicId && terms?.agreeTermsAndConditions,
            ) && (
              <>
                <Card className='min-h-[330px] rounded-[4px] p-6'>
                  <CardContent className='mb-0 p-0 text-center text-[17px] leading-7'>
                    <FlexBox flex justify='between' classname='w-full'>
                      <FlexBox flex>
                        <div className='mr-[10px] flex justify-center'>
                          <Image
                            src='assets/black-calendar.svg'
                            alt={t('translation.calendar')}
                            width={18}
                            height={14}
                            className='m-auto'
                          />
                        </div>
                        <FlexBox flex classname='flex-col items-baseline'>
                          <TypographyP
                            size={16}
                            noBottom
                            primary
                            classname='font-medium'
                          >
                            {t('translation.yourBookingsInPlanner')}
                          </TypographyP>
                        </FlexBox>
                      </FlexBox>
                      <TypographyP
                        size={16}
                        noBottom
                        primary
                        classname='font-medium flex justify-center items-center rounded-full w-7 h-7 text-primary bg-lightPrimary'
                      >
                        {allBookings?.totalBookings || 0}
                      </TypographyP>
                    </FlexBox>
                  </CardContent>
                  <CardContent className='my-auto p-0 text-center text-[17px] leading-7'>
                    {loadBookings ? (
                      <div className='my-auto flex min-h-[250px] items-center justify-center'>
                        <Loader size={25} screen='small' />
                      </div>
                    ) : allBookings?.totalBookings > 0 ? (
                      <>
                        {currentBookings?.length > 0 && (
                          <FlexBox
                            flex
                            centerContent
                            classname='mt-2 mb-1 cursor-pointer'
                            onClick={handleScrollUp}
                            disable={startIndex - ITEMS_PER_PAGE < 0}
                          >
                            <Icon name='scroll-up' />
                          </FlexBox>
                        )}
                        <div className='min-h-[150px]'>
                          {currentBookings?.length > 0 ? (
                            currentBookings?.map((item) => (
                              <FlexBox
                                flex
                                classname='mt-2 flex-col gap-3'
                                key={item?.id}
                              >
                                <Card className='w-full rounded-[4px] p-[10px] shadow-none drop-shadow-medium'>
                                  <FlexBox flex centerItems classname='gap-4'>
                                    <FlexBox
                                      flex
                                      centerItems
                                      classname='flex-1'
                                    >
                                      <Icon name='gray-calendar' />
                                      <TypographyP
                                        size={14}
                                        noBottom
                                        primary
                                        classname='font-light'
                                      >
                                        {dayjs(item?.bookingDate)?.format(
                                          'ddd DD MMM',
                                        ) || '-'}
                                      </TypographyP>
                                    </FlexBox>
                                    <FlexBox flex classname='flex-col flex-1'>
                                      <TypographyP noBottom primary size={12}>
                                        <span className='!font-semibold'>
                                          {' '}
                                          {item?.filesToDiagnose > 0
                                            ? item?.filesToDiagnose
                                            : 0}
                                        </span>{' '}
                                        {item?.filesToDiagnose > 1
                                          ? t('translation.diagnoses')
                                          : t('translation.diagnosis')}
                                      </TypographyP>
                                      {session?.role === LOGINS.DOCTOR && (
                                        <TypographyP noBottom primary size={12}>
                                          <span className='!font-semibold'>
                                            {' '}
                                            {item?.filesToApprove > 0
                                              ? item?.filesToApprove
                                              : 0}
                                          </span>{' '}
                                          {t('translation.approvals')}
                                        </TypographyP>
                                      )}
                                    </FlexBox>
                                    <div className='h-4 w-4'>
                                      <Icon name='square-symbol' />
                                    </div>
                                  </FlexBox>
                                </Card>
                              </FlexBox>
                            ))
                          ) : (
                            <TypographyP center>
                              {t('translation.noBookings')}
                            </TypographyP>
                          )}
                        </div>

                        {currentBookings?.length > 0 && (
                          <FlexBox
                            flex
                            centerContent
                            classname='mt-2 mb-1 cursor-pointer'
                            onClick={handleScrollDown}
                            disable={
                              startIndex + ITEMS_PER_PAGE >=
                              allBookings?.bookings?.length
                            }
                          >
                            <Icon name='scroll-down' />
                          </FlexBox>
                        )}
                      </>
                    ) : (
                      <TypographyP
                        noBottom
                        center
                        classname='flex items-center justify-center'
                      >
                        {t('translation.noBookings')}
                      </TypographyP>
                    )}
                  </CardContent>
                </Card>
                <Card className='min-h-[330px] rounded-[4px] p-4'>
                  <CustomViewOnlyCalendar
                    bookings={allBookings?.bookings}
                    onChangeDate={(date) => handleDateSelect(date)}
                  />
                </Card>
              </>
            )}
          </div>
        ))}
        <Dialog open={openRules} onOpenChange={setOpenRules}>
          <PdfModalPreview fileKey={selectedRules?.rules} />
        </Dialog>
        {clinicList?.map((item) => {
          return (
            isReadTermAndConditions?.find(
              (terms) =>
                terms?.id === item?.clinicId && terms?.agreeTermsAndConditions,
            ) && (
              <div className='!mt-9' key={item?.clinicId}>
                <FlexBox flex>
                  <div className='mr-[10px] flex justify-center'>
                    <Image
                      src='assets/square-symbol.svg'
                      alt={t('translation.calendar')}
                      width={18}
                      height={14}
                      className='m-auto'
                    />
                  </div>
                  <FlexBox flex classname='flex-col items-baseline'>
                    <TypographyP
                      size={18}
                      noBottom
                      primary
                      classname='font-medium'
                    >
                      {item?.clinicName || ''}
                    </TypographyP>
                  </FlexBox>
                </FlexBox>
                <div className='mb-[30px] mt-4 flex gap-[15px]'>
                  <FlexBox
                    flex
                    centerContent
                    centerItems
                    classname='mt-2 mb-1 cursor-pointer'
                    onClick={handlePrevious}
                    disable={currentItems[0]?.date === START_DATE}
                  >
                    <div className='rounded-[3px] bg-lightPrimary px-[5px] py-[75px]'>
                      <Icon name='left-arrow' width={12} height={21} />
                    </div>
                  </FlexBox>
                  {loadAvailableBookings ? (
                    <Loader size={25} screen='small' />
                  ) : (
                    <div className='relative z-0 mx-auto grid grid-flow-col gap-4 overflow-x-auto pt-2 ms:auto-cols-[22rem]'>
                      {currentItems?.map((booking, index) => {
                        const updateBookings =
                          booking?.bookingId &&
                          booking?.date !== triggerChangeBooking
                            ? true
                            : false;
                        return (
                          <Card
                            key={booking?.date}
                            className='group col-span-1 min-h-[330px] rounded-[4px] p-0'
                          >
                            <CardContent className='mb-0 p-0 text-center text-[17px] leading-7'>
                              <FlexBox flex classname='p-4'>
                                <div className='mr-[10px] flex justify-center'>
                                  <Image
                                    src='assets/black-calendar.svg'
                                    alt={t('translation.calendar')}
                                    width={18}
                                    height={14}
                                    className='m-auto'
                                  />
                                </div>
                                <FlexBox
                                  flex
                                  classname='flex-col items-baseline'
                                >
                                  <TypographyP
                                    size={16}
                                    noBottom
                                    primary
                                    classname='font-medium'
                                  >
                                    {dayjs(booking?.date)?.format(
                                      'dddd D MMM YYYY',
                                    )}
                                  </TypographyP>
                                </FlexBox>
                              </FlexBox>
                              <FlexBox
                                flex
                                classname={`flex-col p-4 items-end gap-1 ${session?.role === LOGINS.DOCTOR && 'border-b border-lightGray'}`}
                              >
                                <TypographyP
                                  noBottom
                                  primary
                                  size={14}
                                  classname='font-medium'
                                >
                                  {`${booking?.diagnosisAvailable > 0 ? booking?.diagnosisAvailable : 0} ${booking?.diagnosisAvailable > 1 ? t('translation.diagnosesAvailable') : t('translation.diagnosisAvailable')}`}
                                </TypographyP>
                                {session?.role === LOGINS.DOCTOR && (
                                  <TypographyP
                                    noBottom
                                    primary
                                    size={14}
                                    classname='font-medium'
                                  >
                                    {`${booking?.approvalAvailables > 0 ? booking?.approvalAvailables : 0} ${t('translation.approvalsAvailable')}`}
                                  </TypographyP>
                                )}
                              </FlexBox>
                              <FlexBox
                                flex
                                justify='between'
                                centerItems
                                classname='p-4 border-b border-lightGray'
                              >
                                <TypographyP
                                  primary
                                  noBottom
                                  size={14}
                                  classname='font-normal flex-1 text-left'
                                >
                                  {t('translation.iCanDiagnose')}
                                </TypographyP>
                                <DynamicDropdown
                                  index={index}
                                  setSelectedOption={setSelectedBooking}
                                  totalCount={
                                    (booking?.filesToDiagnose || 0) +
                                      booking?.diagnosisAvailable || 0
                                  }
                                  id={`booking-${booking?.date}`}
                                  selectedOption={
                                    selectedBooking?.[index] ||
                                    booking?.filesToDiagnose
                                  }
                                  viewOnly={updateBookings}
                                />
                              </FlexBox>
                              {session?.role === LOGINS.DOCTOR && (
                                <FlexBox
                                  flex
                                  justify='between'
                                  centerItems
                                  classname='p-4'
                                >
                                  <TypographyP
                                    primary
                                    noBottom
                                    size={14}
                                    classname='font-normal flex-1 text-left'
                                  >
                                    {t('translation.iCanApprove')}
                                  </TypographyP>
                                  <DynamicDropdown
                                    index={index}
                                    setSelectedOption={setSelectedApproval}
                                    totalCount={
                                      (booking?.filesToApprove || 0) +
                                        booking?.approvalAvailables || 0
                                    }
                                    id={`approval-${booking?.date}`}
                                    selectedOption={
                                      selectedApproval?.[index] ||
                                      booking?.filesToApprove
                                    }
                                    viewOnly={updateBookings}
                                  />
                                </FlexBox>
                              )}
                            </CardContent>
                            <CardFooter className='m-auto w-full'>
                              {updateBookings ? (
                                <div className='flex w-full justify-between gap-3 max-ms:flex-col'>
                                  <Button
                                    variant={'outline'}
                                    className='min-w-[150px] text-[16px] max-ms:min-w-[182px]'
                                    onClick={() => {
                                      setBookingToCancel(booking);
                                      setOpenCancelBookingConfirmationModal(
                                        true,
                                      );
                                    }}
                                  >
                                    {t('translation.cancelBooking')}
                                  </Button>
                                  <Button
                                    className='min-w-[150px] text-[16px] text-white max-ms:min-w-[182px]'
                                    onClick={() => {
                                      setTriggerChangeBooking(booking?.date);
                                    }}
                                  >
                                    {t('translation.changeBooking')}
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant={'outline'}
                                  className='w-full text-[16px]'
                                  onClick={() =>
                                    handleBookNow(
                                      booking?.clinicId,
                                      booking.date,
                                      index,
                                      booking?.filesToDiagnose,
                                      booking?.filesToApprove,
                                    )
                                  }
                                  loading={creatingBooking === booking?.date}
                                >
                                  {triggerChangeBooking === booking?.date
                                    ? t('translation.confirmChange')
                                    : t('translation.bookNow')}
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        );
                      })}
                      <AlertDialog
                        open={openCancelBookingConfirmationModal}
                        onOpenChange={setOpenCancelBookingConfirmationModal}
                      >
                        <CustomAlertBox
                          setOpen={setOpenCancelBookingConfirmationModal}
                          handleConfirm={(e) => handleCancelBooking(e)}
                          loading={cancelingBooking === bookingToCancel?.date}
                          title={t('translation.cancelBookingConfirmation', {
                            today: bookingToCancel?.date
                              ? dayjs(bookingToCancel?.date).format(
                                  'DD/MM/YYYY',
                                )
                              : dayjs().format('DD/MM/YYYY'),
                          })}
                        />
                      </AlertDialog>
                    </div>
                  )}
                  <FlexBox
                    flex
                    centerContent
                    centerItems
                    classname='mt-2 mb-1 cursor-pointer'
                    onClick={handleNext}
                    disable={currentItems?.some(
                      (item) => item?.date === END_DATE,
                    )}
                  >
                    <div className='rounded-[3px] bg-lightPrimary px-[5px] py-[75px]'>
                      <Icon name='right-arrow' width={12} height={21} />
                    </div>
                  </FlexBox>
                </div>
              </div>
            )
          );
        })}
      </div>
    </>
  );
};

export default Planner;
