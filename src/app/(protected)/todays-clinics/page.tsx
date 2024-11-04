'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route } from 'next';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Head from 'next/head';
import Image from 'next/image';
import dayjs from 'dayjs';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import TypographyList from '@/components/ui/typography/list';
import { getTodaysClinics, openNextFile } from '@/app/api/todays-clinics';
import { getErrorMessage } from '@/lib/utils';
import Loader from '@/components/custom-loader';
import {
  TAvailableConsultants,
  TBooking,
  TBookingAlert,
  TOpening,
  TTodaysClinics,
} from '@/models/types/todays-clinics';
import { FILE_STATUS } from '@/enums/todays-clinics';
import useAccessToken from '@/hooks/useAccessToken';
import { LOGINS } from '@/enums/auth';
import SharedTable from '@/components/common-layout/shared-table';
import { getUserChatId } from '@/app/api/messages';
import UrgentNeedForBookings from '@/components/urgent-need-modal';
import { Dialog } from '@/components/ui/dialog';
import useUserProfile from '@/hooks/useUserProfile';
import { getChatUsers } from '@/lib/chatUsers/chatUsersSlice';
import { useAppDispatch } from '@/lib/hooks';
import useChatUsers from '@/hooks/useChatUsers';
import { TChatUsers, TUsers } from '@/models/types/messages';
import AddBankAccountCard from '@/components/common-layout/add-bank-account';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';
import NoDataFound from '@/components/custom-components/custom-no-data-found';
import useSocket from '@/hooks/useSocket';
import { setIsUserFromClinic } from '@/lib/usersFromTodaysClinic/usersFromTodaysClinicSlice';
import useRefreshStates from '@/hooks/useRefreshStates';
import { setRefreshData } from '@/lib/updateReduxState/updateReduxStateSlice';

const TodaysClinics = () => {
  const [loading, setLoading] = useState(false);
  const [todaysClinics, setTodaysClinics] = useState<TTodaysClinics>();
  const [openingFile, setOpeningFile] = useState<TOpening | undefined>(
    undefined,
  );
  const { t } = useTranslation();
  const router = useRouter();
  const sessionTokens = useAccessToken();
  const user = useUserProfile();
  const dispatch = useAppDispatch();
  const allChatUsers = useChatUsers() || [];
  const socket = useSocket();
  const isRefresh = useRefreshStates();

  const fetchTodaysClinics = useCallback(async (hideLoading = false) => {
    if (!hideLoading) {
      setLoading(true);
    }
    try {
      const response = await getTodaysClinics();

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      const filtered =
        sessionTokens?.role === LOGINS.READER
          ? responseData?.bookingAlerts?.filter(
              (item: TBookingAlert) => item?.alertType !== 'approvals',
            )
          : responseData?.bookingAlerts;
      setTodaysClinics({
        ...responseData,
        bookingAlerts: filtered,
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
      dispatch(setRefreshData({ ...isRefresh, isRefreshTodaysClinic: false }));
    }
  }, []);

  useEffect(() => {
    fetchTodaysClinics();
  }, [fetchTodaysClinics]);

  useEffect(() => {
    if (isRefresh?.isRefreshTodaysClinic) {
      fetchTodaysClinics(true);
    }
  }, [isRefresh]);

  const handleFileOpening = useCallback(
    async (id: string, fileStatus: string) => {
      if (!fileStatus) {
        return;
      }
      setOpeningFile({
        status: fileStatus,
        id,
      });
      try {
        const response = await openNextFile({ fileType: fileStatus });

        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        router.push('/file-in-progress');
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setOpeningFile(undefined);
      }
    },
    [],
  );

  const columnsForReader: ColumnDef<TBooking | boolean>[] = [
    {
      accessorKey: 'bookingDate',
      header: t('translation.date'),
      cell: ({ row }) => (
        <div className=' w-[100px] truncate'>
          {row.getValue('bookingDate')
            ? dayjs(row.getValue('bookingDate')).format('ddd D MMM')
            : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'filesToDiagnose',
      header: t('translation.diagnosis'),
      cell: ({ row }) => (
        <div className='w-[90px] truncate text-center capitalize'>
          {row.getValue('filesToDiagnose')} {t('translation.fileS')}
        </div>
      ),
    },
  ];

  const columnsForDoctor: ColumnDef<TBooking | boolean>[] = [
    ...columnsForReader,
    {
      accessorKey: 'filesToApprove',
      header: t('translation.approvals'),
      cell: ({ row }) => (
        <div className='w-[90px] truncate text-center capitalize'>
          {row.getValue('filesToApprove')} {t('translation.fileS')}
        </div>
      ),
    },
  ];

  const filteredTeam = useMemo(() => {
    const doctorsData: TAvailableConsultants[] = [];
    const readersData: TAvailableConsultants[] = [];
    todaysClinics?.availableConsultantsReaders?.map((item) => {
      if (item?.role === LOGINS.DOCTOR) {
        doctorsData?.push(item);
      } else {
        readersData?.push(item);
      }
    });

    return { doctorsData, readersData };
  }, [todaysClinics]);

  const handleBookNow = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    router.push('/planner' as Route);
  };

  const getChatId = useCallback(
    async (userId?: string) => {
      if (!userId) {
        return;
      }
      setLoading(true);
      try {
        const response = await getUserChatId({ userId: userId });

        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }

        const chatUser = todaysClinics?.availableConsultantsReaders?.find(
          (item) => item?.id === userId,
        );
        const loggedInUser = {
          firstName: user?.firstName || '',
          id: user?.id || '',
          lastName: user?.lastName || '',
          profilePicture: user?.profilePicture || '',
          email: user?.email || '',
          callingCode: user?.callingCode || '',
          mobileNumber: user?.mobileNumber || '',
          role: user?.role || '',
        };
        router.push(`/chat-messages/${response?.data?.data?.chatId}`);

        dispatch(setIsUserFromClinic(true));

        if (chatUser) {
          const userData = {
            id: response?.data?.data?.chatId,
            createdAt: new Date().toISOString(),
            unreadMessages: 0,
            messages: [],
            updatedAt: new Date().toISOString(),
            users: [loggedInUser, chatUser] as TUsers[],
          };
          const newUsers = [...(allChatUsers || [])];
          newUsers?.push(userData);
          const filteredArr = newUsers?.reduce((acc, current) => {
            const x = acc?.find((item: TChatUsers) => item?.id === current?.id);
            if (!x) {
              return acc?.concat([current] as any);
            } else {
              return acc;
            }
          }, []);
          dispatch(getChatUsers(filteredArr));
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setLoading(false);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      }
    },
    [todaysClinics, allChatUsers],
  );

  useEffect(() => {
    const socketEventApis = () => {
      fetchTodaysClinics(true);
    };
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.FILE_PICKED_BY_PROFESSIONAL, socketEventApis);
      return () => {
        socket.off(SOCKET_EVENTS.FILE_PICKED_BY_PROFESSIONAL, socketEventApis);
      };
    }
  }, [socket, fetchTodaysClinics]);

  const handleOpenChange = (id: any) => {
    const filtered = todaysClinics?.bookingAlerts?.filter(
      (item) => item?.id !== id,
    );
    setTodaysClinics((prev: any) => ({
      ...prev,
      bookingAlerts: filtered,
    }));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>{t('translation.todaysClinicsHead')}</title>
      </Head>
      <div className='px-[30px] py-[30px] md:px-[43px]'>
        {!user?.stripeAccountLinked && <AddBankAccountCard />}
        <Card className='w-full p-3'>
          <FlexBox classname='flex'>
            <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='assets/todays-files.svg'
                alt={t('translation.files')}
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyH2 size={18}>
              {dayjs()?.format('dddd MMMM D YYYY')}
            </TypographyH2>
          </FlexBox>
        </Card>
        <div
          className={`my-[30px] grid grid-cols-1 justify-start gap-[15px] max-xxl:grid-cols-2 max-nm:grid-cols-1 ${sessionTokens?.role === LOGINS.READER ? 'xxl:grid-cols-2' : 'xxl:grid-cols-3'}`}
        >
          {todaysClinics?.files?.map((item, index) => (
            <Card key={index} className='min-h-[255px] '>
              <CardContent className='mb-0 pt-6 text-center text-[17px] leading-7'>
                <FlexBox flex>
                  <div className='mr-[10px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                    <Image
                      src='assets/file.svg'
                      alt={t('translation.file')}
                      width={18}
                      height={14}
                      className='m-auto'
                    />
                  </div>
                  <FlexBox flex classname='flex-col items-baseline'>
                    <TypographyP size={17} noBottom classname='font-semibold'>
                      {t('translation.todaysClinic', {
                        clinic: item?.clinicName || '',
                      })}
                    </TypographyP>
                    <TypographyP size={17} noBottom classname='font-semibold'>
                      {item.fileStatus === FILE_STATUS.SUBMITTED
                        ? t('translation.newFiles')
                        : t('translation.fileForApproval')}
                    </TypographyP>
                    <FlexBox flex classname='flex-col mt-5 items-baseline'>
                      <TypographyP
                        size={18}
                        classname='font-normal !text-darkGray text-left'
                        noBottom
                      >
                        <span className='text-[20px] font-medium'>
                          {item?.fileCount || 0}
                        </span>{' '}
                        {item.fileStatus === FILE_STATUS.SUBMITTED
                          ? t(
                              item?.fileCount == 1
                                ? 'translation.fileReady'
                                : 'translation.filesReady',
                            )
                          : t(
                              item?.fileCount == 1
                                ? 'translation.fileWaitingForApproval'
                                : 'translation.filesWaitingForApproval',
                            )}
                      </TypographyP>
                    </FlexBox>
                  </FlexBox>
                </FlexBox>
              </CardContent>
              <CardFooter className='!mt-4 mb-2 justify-center'>
                <Button
                  variant='outline'
                  className=' w-[210px] text-[16px]'
                  loading={
                    openingFile?.id === item?.clinicId &&
                    openingFile?.status === item?.fileStatus
                  }
                  onClick={() =>
                    handleFileOpening(item?.clinicId, item?.fileStatus)
                  }
                >
                  {t('translation.openNextFile')}
                </Button>
              </CardFooter>
            </Card>
          ))}

          {(sessionTokens?.role === LOGINS.DOCTOR ||
            sessionTokens?.role === LOGINS.READER) && (
            <Card className='min-h-[255px] '>
              <CardContent className='mb-0 pt-6 text-center text-[17px] leading-7'>
                <FlexBox flex>
                  <div className='mr-[10px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                    <Image
                      src='assets/file.svg'
                      alt={t('translation.file')}
                      width={18}
                      height={14}
                      className='m-auto'
                    />
                  </div>
                  <FlexBox flex classname='flex-col items-baseline'>
                    <TypographyP size={17} noBottom classname='font-semibold'>
                      {t('translation.completedByYou')}
                    </TypographyP>
                    <FlexBox flex classname='flex-col mt-[27px] items-baseline'>
                      <TypographyP
                        size={18}
                        classname='font-normal !text-darkGray'
                        noBottom
                      >
                        <span className='text-[20px] font-medium'>
                          {todaysClinics?.completedFiles || 0}
                        </span>{' '}
                        {t(
                          todaysClinics?.completedFiles &&
                            todaysClinics?.completedFiles === 1
                            ? 'translation.file'
                            : 'translation.files',
                        )}
                      </TypographyP>
                    </FlexBox>
                  </FlexBox>
                </FlexBox>
              </CardContent>
              <CardFooter className='!mt-4 mb-2 justify-center'>
                <Button
                  variant='outline'
                  className=' w-[210px] text-[16px]'
                  onClick={() => {
                    sessionTokens?.role === LOGINS.READER
                      ? router.push(`/todays-completed-files`)
                      : router.push(
                          `/completed-files?redirectFromHome=${true}`,
                        );
                  }}
                >
                  {t('translation.viewFiles')}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
        <div
          className={`my-[30px] flex grid-cols-1 justify-start gap-[15px] max-xxl:grid-cols-2 max-nm:grid-cols-1 max-nm:flex-col  ${sessionTokens?.role === LOGINS.READER ? 'xxl:grid-cols-2' : 'xxl:grid-cols-3'}`}
        >
          <div className='w-[50%] max-nm:w-full'>
            <Accordion
              type='single'
              collapsible
              className=' self-start rounded-[10px] bg-white px-5 shadow-md '
            >
              <AccordionItem value='item-1'>
                <AccordionTrigger>
                  <FlexBox flex justify='between' centerItems>
                    <FlexBox flex centerItems>
                      <div className='mr-[10px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                        <Image
                          src='assets/your-bookings.svg'
                          alt={t('translation.bookings')}
                          width={18}
                          height={14}
                          className='m-auto'
                        />
                      </div>
                      <TypographyP
                        noBottom
                        size={16}
                        classname='font-medium !text-darkGray'
                      >
                        {t('translation.yourBookings')}
                      </TypographyP>
                    </FlexBox>
                  </FlexBox>
                  <FlexBox flex classname='ml-auto mr-2'>
                    <span className='me-2 flex h-8 w-8 items-center justify-center rounded-full bg-lightPrimary text-primary'>
                      {todaysClinics?.bookings?.length || 0}
                    </span>
                    <Button
                      variant={'outline'}
                      className='max-h-[30px] !py-0 text-[14px]'
                      onClick={(e) => handleBookNow(e)}
                    >
                      {t('translation.bookNow')}
                    </Button>
                  </FlexBox>
                </AccordionTrigger>
                <AccordionContent className='h-[400px] overflow-y-auto'>
                  {todaysClinics?.bookings &&
                  todaysClinics?.bookings?.length ? (
                    <SharedTable
                      data={(todaysClinics?.bookings as any[]) || []}
                      cellPadding={3}
                      headerLabelClass='!text-[16px]'
                      columns={
                        sessionTokens?.role === LOGINS.DOCTOR
                          ? columnsForDoctor
                          : columnsForReader
                      }
                    />
                  ) : (
                    <NoDataFound
                      className='my-auto h-[300px]'
                      heading={t('translation.noBooking')}
                      title={
                        sessionTokens?.role === LOGINS.DOCTOR
                          ? ''
                          : t('translation.noReaderBooking')
                      }
                      hideButton
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Accordion
              type='single'
              collapsible
              className='mt-[15px] self-start rounded-[10px] bg-white !px-0 shadow-md'
            >
              <AccordionItem value='item-3'>
                <AccordionTrigger className='px-5'>
                  <FlexBox
                    flex
                    centerItems
                    justify='between'
                    classname='w-full'
                  >
                    <div className='!flex items-center'>
                      <div className='mr-[10px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                        <Image
                          src='assets/communication-preferances.svg'
                          alt={t('translation.bookings')}
                          width={18}
                          height={14}
                          className='m-auto'
                        />
                      </div>
                      <TypographyP
                        noBottom
                        size={16}
                        classname='font-medium !text-darkGray'
                      >
                        {t('translation.yourTeamConsultant')}
                      </TypographyP>
                    </div>
                    <span className='me-2 flex h-7 w-7 items-center justify-center rounded-full bg-lightPrimary text-[16px] text-primary'>
                      {filteredTeam?.doctorsData?.length || 0}
                    </span>
                  </FlexBox>
                </AccordionTrigger>
                <AccordionContent className='h-[400px] overflow-y-auto'>
                  <TypographyList
                    lists={filteredTeam?.doctorsData || []}
                    handleClick={(id: string) => getChatId(id)}
                    doctorsList={true}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <Accordion
            type='single'
            collapsible
            className='w-[50%] self-start rounded-[10px] bg-white !px-0 shadow-md max-nm:w-full md:mb-0 '
          >
            <AccordionItem value='item-2'>
              <AccordionTrigger className='px-5'>
                <FlexBox flex centerItems justify='between' classname='w-full'>
                  <div className='!flex items-center'>
                    <div className='mr-[10px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                      <Image
                        src='assets/communication-preferances.svg'
                        alt={t('translation.bookings')}
                        width={18}
                        height={14}
                        className='m-auto'
                      />
                    </div>
                    <TypographyP
                      noBottom
                      size={16}
                      classname='font-medium !text-darkGray'
                    >
                      {t('translation.yourTeamReaders')}
                    </TypographyP>
                  </div>
                  <span className='me-2 flex h-7 w-7 items-center justify-center rounded-full bg-lightPrimary text-[16px] text-primary'>
                    {filteredTeam?.readersData?.length || 0}
                  </span>
                </FlexBox>
              </AccordionTrigger>
              <AccordionContent className='h-[400px] overflow-y-auto'>
                <TypographyList
                  lists={filteredTeam?.readersData || []}
                  handleClick={(id: string) => getChatId(id)}
                  readersList={true}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      {todaysClinics?.bookingAlerts?.map((alert) => {
        return (
          <Dialog
            key={alert?.id}
            open={!!alert?.id}
            onOpenChange={() => handleOpenChange(alert?.id)}
          >
            <UrgentNeedForBookings
              setOpen={() => handleOpenChange(alert?.id)}
              urgentBookingId={alert?.id || ''}
            />
          </Dialog>
        );
      })}
    </>
  );
};

export default TodaysClinics;
