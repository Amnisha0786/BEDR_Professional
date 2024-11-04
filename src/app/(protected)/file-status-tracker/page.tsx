'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import Image from 'next/image';
import Head from 'next/head';
import { ColumnDef, Row } from '@tanstack/react-table';
import { CheckedState } from '@radix-ui/react-checkbox';
import { toast } from 'sonner';

import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/custom-components/custom-icon';
import { Button } from '@/components/ui/button';
import { cn, getErrorMessage } from '@/lib/utils';
import {
  getFileStatusTrackerList,
  moveToPatientFiles,
} from '@/app/api/file-status-tracker';
import useOptometristPractice from '@/hooks/useOptometristPractice';
import { TFileStatusTrackerList } from '@/models/types/file-status-tracker';
import { debounce } from '@/lib/common/debounce';
import SharedTable from '@/components/common-layout/shared-table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FILE_STATUSES,
  MOVE_FILES_LIST,
  POSSIBLE_STATUS,
  REMOVE_FROM_FILE_STATUS_TRACKER_COUNT,
} from '@/enums/file-status-tracker';
import { TypographyP } from '@/components/ui/typography/p';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';
import useSocket from '@/hooks/useSocket';
import { useAppDispatch } from '@/lib/hooks';
import { setFileStatusTracker } from '@/lib/fileStausTracketList/fileStatustTrackerListSlice';
import { COMMON_ACTION_TO_BE_TAKEN_OPTIONS } from '@/enums/file-in-progress';
import useRefreshStates from '@/hooks/useRefreshStates';
import { setRefreshData } from '@/lib/updateReduxState/updateReduxStateSlice';

const DEFAULT_ITEMS = 100;
const DEFAULT_PAGE_COUNT = 1;

const FileStatusTracker = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [movingFiles, setMovingFiles] = useState(false);
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const [pageCount, setPageCount] = useState<number>(DEFAULT_PAGE_COUNT);
  const [searchInput, setSearchInput] = useState<string>('');
  const [rowSelection, setRowSelection] = useState<string[]>([]);
  const [isHideMoveFiles, setIsHideMoveFiles] = useState(false);
  const [fileStatusTrackerList, setFileStatusTrackerList] = useState<
    TFileStatusTrackerList[]
  >([]);

  const optometristPractice = useOptometristPractice();
  const { t } = useTranslation();
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useAppDispatch();
  const isRefresh = useRefreshStates();

  const fetchFileStatusTrackerList = useCallback(
    async (hideLoading = false) => {
      if (!hideLoading) {
        setLoading(true);
      }
      if (!optometristPractice?.practiceId) {
        return;
      }
      try {
        const response = await getFileStatusTrackerList({
          practiceId: optometristPractice?.practiceId,
          offset: DEFAULT_ITEMS,
          page: DEFAULT_PAGE_COUNT,
          searchQuery: searchInput,
        });
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        setFileStatusTrackerList(response?.data?.data);
        if (!searchInput?.trim()?.length) {
          dispatch(setFileStatusTracker(response?.data?.data));
        }
        if (response?.data?.data?.length < DEFAULT_ITEMS) {
          setHideLoadMore(true);
        } else {
          setHideLoadMore(false);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
        setHideLoadMore(true);
      } finally {
        setLoading(false);
        setPageCount(DEFAULT_PAGE_COUNT);
        dispatch(
          setRefreshData({ ...isRefresh, isRefreshFileStatusTracker: false }),
        );
      }
    },
    [optometristPractice?.practiceId, searchInput],
  );

  useEffect(() => {
    fetchFileStatusTrackerList();
  }, [fetchFileStatusTrackerList]);

  useEffect(() => {
    if (isRefresh?.isRefreshFileStatusTracker) {
      fetchFileStatusTrackerList(true);
    }
  }, [isRefresh]);

  useEffect(() => {
    const handleSocketEvent = () => {
      fetchFileStatusTrackerList(true);
    };
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.FILE_MOVED_TO_PATIENT_FILES, handleSocketEvent);
      socket.on(SOCKET_EVENTS.REFERRED_PATIENT, handleSocketEvent);
      return () => {
        socket.off(
          SOCKET_EVENTS.FILE_MOVED_TO_PATIENT_FILES,
          handleSocketEvent,
        );
        socket.off(SOCKET_EVENTS.REFERRED_PATIENT, handleSocketEvent);
      };
    }
  }, [socket]);

  const handleLoadMore = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      count: number,
    ) => {
      e.preventDefault();
      if (!optometristPractice?.practiceId) {
        return;
      }
      try {
        setLoadingMore(true);
        const response = await getFileStatusTrackerList({
          practiceId: optometristPractice?.practiceId,
          offset: DEFAULT_ITEMS,
          page: count,
        });
        if (response?.status !== 200) {
          toast.error(t('translation.somethingWentWrong'));
          return;
        }
        setPageCount(count);
        if (response?.data?.data) {
          setFileStatusTrackerList((prev) => [...prev, ...response.data.data]);
          if (response?.data?.data?.length < DEFAULT_ITEMS) {
            setHideLoadMore(true);
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
        setHideLoadMore(true);
      } finally {
        setLoadingMore(false);
      }
    },
    [optometristPractice?.practiceId],
  );

  const handleRowSelect = (checked: CheckedState, rowId: string) => {
    const updatedKeys = checked
      ? [...rowSelection, rowId]
      : rowSelection?.filter((key) => key !== rowId);
    setRowSelection(updatedKeys);
  };

  const diagnosisEyeAction = (detail: TFileStatusTrackerList) => {
    const leftEyeAction = detail?.actionToBeTakenForLeftEye;
    const rightEyeAction = detail?.actionToBeTakenForRightEye;
    const isLeftEyeUrgent =
      leftEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL ||
      leftEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL;
    const isRightEyeUrgent =
      rightEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL ||
      rightEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL;
    return (
      <div className='bottom-2 flex min-w-[300px] max-w-[300px] flex-col gap-1'>
        {leftEyeAction && (
          <FlexBox
            flex
            classname={cn('gap-2 items-start text-darkGray font-normal', {
              '!text-error font-semibold': isLeftEyeUrgent,
            })}
          >
            <TypographyP
              size={16}
              primary
              noBottom
              classname={cn('min-w-[80px] text-darkGray', {
                '!text-error': isLeftEyeUrgent,
              })}
            >
              {t('translation.leftEye')}
            </TypographyP>
            <FlexBox flex classname='gap-3 max-w-[300px] break-words'>
              <span>
                {`${COMMON_ACTION_TO_BE_TAKEN_OPTIONS?.find((option) => option.value === leftEyeAction)?.label || leftEyeAction || ''}`}{' '}
              </span>
            </FlexBox>
          </FlexBox>
        )}
        {rightEyeAction && rightEyeAction?.length > 0 && (
          <FlexBox
            flex
            classname={cn('gap-2 items-start text-darkGray font-normal', {
              '!text-error font-semibold': isRightEyeUrgent,
            })}
          >
            <TypographyP
              noBottom
              size={16}
              primary
              classname={cn('min-w-[80px] text-darkGray', {
                '!text-error': isRightEyeUrgent,
              })}
            >
              {t('translation.rightEye')}
            </TypographyP>
            <FlexBox flex classname='gap-3 max-w-[300px] break-words'>
              <span>
                {`${COMMON_ACTION_TO_BE_TAKEN_OPTIONS?.find((option) => option.value === rightEyeAction)?.label || rightEyeAction || ''}`}{' '}
              </span>
            </FlexBox>
          </FlexBox>
        )}
      </div>
    );
  };

  const renderViewOption = (row: Row<TFileStatusTrackerList>) => {
    const currentStatus = row?.original?.fileStatus;
    const leftEyeAction = row?.original?.actionToBeTakenForLeftEye;
    const rightEyeAction = row?.original?.actionToBeTakenForRightEye;
    if (
      currentStatus === POSSIBLE_STATUS.REFERRED ||
      currentStatus === POSSIBLE_STATUS.APPROVED
    ) {
      return (
        <FlexBox flex>
          <Image
            src={
              (leftEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL ||
                leftEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL ||
                rightEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL ||
                rightEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL) &&
              currentStatus !== POSSIBLE_STATUS.REFERRED
                ? '/assets/red-rounded-tick.svg'
                : '/assets/black-rounded-tick.svg'
            }
            height={16}
            width={16}
            alt='tick'
            className='mr-1'
          />

          <div
            className={cn(
              `w-[160px] cursor-pointer underline hover:opacity-85`,
              {
                '!text-error':
                  (leftEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL ||
                    leftEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL ||
                    rightEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL ||
                    rightEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL) &&
                  currentStatus !== POSSIBLE_STATUS.REFERRED,
                '!font-semibold':
                  !REMOVE_FROM_FILE_STATUS_TRACKER_COUNT?.includes(
                    currentStatus as POSSIBLE_STATUS,
                  ) && !row?.original?.readByOptometrist,
              },
            )}
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/file-status-tracker/view-report/${row?.original?.id}`,
              );
            }}
          >
            {t('translation.viewReport')}
          </div>
        </FlexBox>
      );
    } else if (
      currentStatus === POSSIBLE_STATUS.DRAFT ||
      currentStatus === POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE
    ) {
      return (
        <div
          className={cn(
            `ml-6 w-[160px] cursor-pointer underline hover:opacity-85`,
            {
              '!font-semibold':
                !REMOVE_FROM_FILE_STATUS_TRACKER_COUNT?.includes(
                  currentStatus as POSSIBLE_STATUS,
                ) && !row?.original?.readByOptometrist,
            },
          )}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/file-status-tracker/view-file/${row?.original?.id}`);
          }}
        >
          {t('translation.viewFile')}
        </div>
      );
    }
    return (
      <div
        className={cn(
          'ml-6 w-[160px] cursor-pointer underline hover:opacity-85',
          {
            '!font-semibold':
              !REMOVE_FROM_FILE_STATUS_TRACKER_COUNT?.includes(
                currentStatus as POSSIBLE_STATUS,
              ) && !row?.original?.readByOptometrist,
          },
        )}
        onClick={(e) => {
          e.stopPropagation();
          router.push(
            `/patient-files/view-file/${row?.original?.id}?viewOnly=${true}`,
          );
        }}
      >
        {t('translation.viewFile')}
      </div>
    );
  };

  const columns: ColumnDef<TFileStatusTrackerList>[] = useMemo(
    () => [
      {
        accessorKey: 'idNumber',
        header: t('translation.idNumberSentenceCase'),
        cell: ({ row }) => (
          <div className='w-[120px] truncate capitalize max-ms:w-[90px]'>
            {row?.getValue('idNumber') || ''}
          </div>
        ),
      },
      {
        accessorKey: 'lastName',
        header: t('translation.lastName'),
        cell: ({ row }) => (
          <div className='w-[120px] truncate capitalize'>
            {row?.getValue('lastName') || ''}
          </div>
        ),
      },
      {
        accessorKey: 'firstName',
        header: t('translation.firstName'),
        cell: ({ row }) => (
          <div className='w-[120px] truncate capitalize'>
            {row?.getValue('firstName') || ''}
          </div>
        ),
      },
      {
        accessorKey: '',
        header: t('translation.diagnosisReady'),
        cell: ({ row }) => {
          return renderViewOption(row);
        },
      },
      {
        accessorKey: 'fileStatus',
        header: t('translation.statusOrAction'),
        cell: ({ row }) => {
          const status = row?.getValue('fileStatus');
          const isApproved = row?.original?.fileStatus === 'approved';
          const leftEyeAction = row?.original?.actionToBeTakenForLeftEye;
          const rightEyeAction = row?.original?.actionToBeTakenForRightEye;
          const dateSubmitted = row?.original?.submittedAt;
          const statusLabel =
            FILE_STATUSES?.find((item) => item.value === status)?.label || '';
          let currentStatus: string | React.ReactNode = '';
          if (
            status !== POSSIBLE_STATUS.REFERRED &&
            status === POSSIBLE_STATUS.APPROVED
          ) {
            currentStatus = diagnosisEyeAction(row?.original);
          } else if (
            dateSubmitted &&
            (status === POSSIBLE_STATUS.SUBMITTED ||
              status === POSSIBLE_STATUS.IN_REVIEW_BY_READER ||
              status === POSSIBLE_STATUS.PENDING_APPROVAL ||
              status === POSSIBLE_STATUS.IN_REVIEW_BY_DOCTOR)
          ) {
            currentStatus = `${statusLabel} ${dayjs(dateSubmitted)?.format('DD.MM.YY')}`;
          } else {
            currentStatus = statusLabel;
          }
          return (
            <div
              className={cn('w-[210px] font-normal', {
                'font-semibold !text-error':
                  (status === POSSIBLE_STATUS.URGENT_REFERRAL ||
                    status === POSSIBLE_STATUS.NON_URGENT_REFERRAL ||
                    leftEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL ||
                    rightEyeAction === POSSIBLE_STATUS.URGENT_REFERRAL ||
                    leftEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL ||
                    rightEyeAction === POSSIBLE_STATUS.NON_URGENT_REFERRAL) &&
                  status !== POSSIBLE_STATUS.REFERRED &&
                  status === POSSIBLE_STATUS.APPROVED,
              })}
            >
              {currentStatus ? currentStatus : isApproved || '-'}
            </div>
          );
        },
      },
      {
        id: 'id',
        header: t('translation.moveToPatientFiles'),
        cell: ({ row }) => {
          const currentStatus = row?.original?.fileStatus as POSSIBLE_STATUS;
          const isRead = row?.original?.readByOptometrist;
          const leftEyeAction = row?.original
            ?.actionToBeTakenForLeftEye as POSSIBLE_STATUS;
          const rightEyeAction = row?.original
            ?.actionToBeTakenForRightEye as POSSIBLE_STATUS;
          const leftIncluded =
            leftEyeAction && MOVE_FILES_LIST?.includes(leftEyeAction);
          const rightIncluded =
            rightEyeAction && MOVE_FILES_LIST?.includes(rightEyeAction);
          const bothIncluded =
            leftEyeAction &&
            rightEyeAction &&
            MOVE_FILES_LIST?.includes(rightEyeAction) &&
            MOVE_FILES_LIST?.includes(leftEyeAction);
          return (
            <div className='flex w-[200px] justify-center'>
              {(MOVE_FILES_LIST?.includes(currentStatus) ||
                (((leftEyeAction && !rightEyeAction && leftIncluded) ||
                  (rightEyeAction && !leftEyeAction && rightIncluded) ||
                  (rightEyeAction && leftEyeAction && bothIncluded)) &&
                  currentStatus === POSSIBLE_STATUS.APPROVED)) &&
                isRead && (
                  <Checkbox
                    checked={
                      rowSelection?.includes(row?.original?.id) ? true : false
                    }
                    onCheckedChange={(val) =>
                      handleRowSelect(val, row?.original?.id)
                    }
                  />
                )}
            </div>
          );
        },
      },
    ],
    [fileStatusTrackerList, rowSelection],
  );

  const onChangeInput = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchInput(value);
    },
    1000,
  );

  const onMoveFiles = useCallback(async () => {
    if (!rowSelection?.length) {
      toast.warning(t('translation.pleaseSelectRowsToMove'));
      return;
    }
    try {
      setMovingFiles(true);
      const response = await moveToPatientFiles({
        patientFileIds: rowSelection,
      });
      if (response?.status !== 200) {
        toast.error(t('translation.somethingWentWrong'));
        return;
      }
      toast.success(t('translation.filesMovedSuccessfully'));
      setRowSelection([]);
      fetchFileStatusTrackerList(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
      setHideLoadMore(true);
    } finally {
      setMovingFiles(false);
    }
  }, [rowSelection]);

  useEffect(() => {
    if (fileStatusTrackerList?.length) {
      const patientsToMove = fileStatusTrackerList?.filter((item) =>
        MOVE_FILES_LIST.includes(item?.fileStatus as POSSIBLE_STATUS),
      );
      if (!patientsToMove || patientsToMove?.length === 0) {
        setIsHideMoveFiles(true);
      } else {
        setIsHideMoveFiles(false);
      }
    } else {
      setIsHideMoveFiles(true);
    }
  }, [fileStatusTrackerList]);

  return (
    <>
      <Head>
        <title>{t('translation.fileStatusTrackerHead')}</title>
      </Head>
      <div className='px-[20px] py-[24px] md:px-[20px]'>
        <Card className='min-h-[200px] justify-start bg-white px-5 py-[30px] md:px-[40px] md:pb-[40px]'>
          <FlexBox classname='flex items-center justify-between max-ms:flex-col max-ms:gap-4 max-ms:items-start'>
            <FlexBox classname='flex items-center'>
              <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                <Image
                  src='assets/file-status-tracker.svg'
                  alt={t('translation.fileStatusTracker')}
                  width={18}
                  height={14}
                  className='m-auto'
                />
              </div>
              <TypographyH2 size={18}>
                {t('translation.fileStatusTrackerTitle')}
              </TypographyH2>
            </FlexBox>
            <div className='flex items-center gap-4'>
              <div className='relative flex-1 md:w-[275px] md:flex-none'>
                <Input
                  label={''}
                  placeholder={t('translation.searchHerePlaceholder')}
                  onChange={(event) => onChangeInput(event)}
                  disabled={
                    !fileStatusTrackerList?.length &&
                    !searchInput?.trim()?.length
                  }
                  className='min-h-[44px] !border-lightGray bg-transparent py-[0.4rem] ps-[1.8rem] !text-[16px] ring-transparent placeholder:font-normal focus:bg-lightPrimary md:max-w-[530px]'
                />
                <span className='absolute left-[9px] top-[14px]'>
                  <Icon name='search' width={16} height={16} />
                </span>
              </div>
            </div>
          </FlexBox>
          <FlexBox flex classname='flex-col mt-4'>
            <TypographyP noBottom size={16} classname='!text-darkGray mb-1'>
              {t('translation.trackTheStatus')}
            </TypographyP>
            <TypographyP noBottom size={14}>
              {t('translation.noLongerNeedToseeFile')}
            </TypographyP>
          </FlexBox>
          <div className='mt-[25px]'>
            <div className='flex flex-col items-end gap-5'>
              <SharedTable
                data={fileStatusTrackerList}
                columns={columns}
                loading={loading}
                noResultsMessage='No files found!'
              />
              {!loading && !isHideMoveFiles && (
                <Button
                  className='min-w-[100px] text-[14px] text-white'
                  onClick={onMoveFiles}
                  loading={movingFiles}
                >
                  {t('translation.moveFiles')}
                </Button>
              )}
            </div>

            {!loading && !hideLoadMore && fileStatusTrackerList?.length > 0 && (
              <FlexBox flex centerItems centerContent>
                <Button
                  variant={'outline'}
                  className='mt-[58px] min-h-[40px] min-w-[114px] text-[16px]'
                  onClick={(e) =>
                    handleLoadMore(e, pageCount + DEFAULT_PAGE_COUNT)
                  }
                  loading={loadingMore}
                  center
                >
                  {t('translation.loadMore')}
                </Button>
              </FlexBox>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default FileStatusTracker;
