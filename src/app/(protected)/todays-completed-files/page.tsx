'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import Image from 'next/image';
import { toast } from 'sonner';
import dayjs from 'dayjs';

import SharedTable from '@/components/common-layout/shared-table';
import { Button } from '@/components/ui/button';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { getAllCompletedFiles } from '@/app/api/completed-files';
import { getErrorMessage } from '@/lib/utils';
import { TCompletedFiles } from '@/models/types/completed-files';
import { debounce } from '@/lib/common/debounce';
import { Input } from '@/components/ui/input';
import Icon from '@/components/custom-components/custom-icon';
import { TypographyP } from '@/components/ui/typography/p';
import { DIAGNOSIS_OPTIONS } from '@/enums/file-in-progress';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import CompletedFilesModal from '@/components/completed-files-reader-modal';
import { FILE_STATUSES, POSSIBLE_STATUS } from '@/enums/file-status-tracker';

type TCompletedFilesProps = { startDate?: Date; endDate?: Date };

const DEFAULT_OFFSET = 15;
const DEFAULT_PAGE = 1;

const TodaysCompletedFiles = () => {
  const { t } = useTranslation();

  const defaultRange = useMemo(() => {
    const today = new Date();
    if (today) {
      return { from: today, to: today };
    } else {
      return undefined;
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [completedFiles, setCompletedFiles] = useState<TCompletedFiles[]>([]);
  const [pageCount, setPageCount] = useState<number>(DEFAULT_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const [openCompletedFileModal, setOpenCompletedFileModal] = useState(false);
  const [patientDetails, setPatientDetails] = useState<
    TCompletedFiles | undefined
  >();
  const [searchInput, setSearchInput] = useState<string>('');

  const completedFilesPayload = (data: TCompletedFilesProps) => {
    let payload = {};
    if (data?.startDate) {
      payload = {
        ...payload,
        startDate: dayjs(data?.startDate)?.format('YYYY-MM-DD'),
      };
    }
    if (searchInput?.trim()?.length) {
      payload = {
        ...payload,
        searchQuery: searchInput,
      };
    }
    if (data?.endDate) {
      payload = {
        ...payload,
        endDate: dayjs(data?.endDate)?.format('YYYY-MM-DD'),
      };
    }
    return { ...payload };
  };

  const fetchAllCompletedFiles = useCallback(async () => {
    try {
      setLoading(true);
      const payload = completedFilesPayload({
        startDate: defaultRange?.from,
        endDate: defaultRange?.to,
      });
      const response = await getAllCompletedFiles({
        page: DEFAULT_PAGE,
        offset: DEFAULT_OFFSET,
        ...payload,
      });
      if (response?.status !== 200) {
        toast.error('Something went wrong!');
        return;
      }
      if (response?.data?.data?.length < DEFAULT_OFFSET) {
        setHideLoadMore(true);
      } else {
        setHideLoadMore(false);
      }
      setCompletedFiles(response.data?.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Something went wrong!');
    } finally {
      setLoading(false);
      setPageCount(DEFAULT_PAGE);
    }
  }, [searchInput, defaultRange]);

  useEffect(() => {
    fetchAllCompletedFiles();
  }, [fetchAllCompletedFiles]);

  const handleLoadMore = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      count: number,
    ) => {
      e.preventDefault();
      try {
        setLoadingMore(true);
        const payload = completedFilesPayload({
          startDate: defaultRange?.from,
          endDate: defaultRange?.to,
        });
        const response = await getAllCompletedFiles({
          offset: DEFAULT_OFFSET,
          page: count,
          ...payload,
        });
        if (response?.status !== 200) {
          toast.error('Something went wrong!');
          return;
        }
        setPageCount(count);
        if (response?.data?.data) {
          setCompletedFiles((prev) => [...prev, ...response.data.data]);
          if (response?.data?.data?.length < DEFAULT_OFFSET) {
            setHideLoadMore(true);
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || 'Something went wrong!');
        setHideLoadMore(true);
      } finally {
        setLoadingMore(false);
      }
    },
    [searchInput, defaultRange],
  );

  const onChangeInput = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchInput(value);
    },
    1000,
  );

  const handleViewDetail = (data: any) => {
    setPatientDetails(data);
    if (data) {
      setOpenCompletedFileModal(true);
    }
  };

  const columns: ColumnDef<TCompletedFiles>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <div className=' w-[150px] truncate'>
          {row.getValue('createdAt')
            ? dayjs(row.getValue('createdAt')).format('D MMM, YYYY')
            : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'idNumber',
      header: 'ID Number',
      cell: ({ row }) => (
        <div className='w-[100px] truncate capitalize'>
          {row.getValue('idNumber')}
        </div>
      ),
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ row }) => (
        <div className='w-[150px] truncate capitalize'>
          {row.getValue('lastName')}
        </div>
      ),
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }) => (
        <div className='w-[150px] truncate capitalize'>
          {row.getValue('firstName')}
        </div>
      ),
    },
    {
      accessorKey: 'diagnosis',
      header: 'Diagnosis',
      cell: ({ row }) => {
        const leftEyeDiagnosis = row?.original?.leftEyeDiagnosis;
        const rightEyeDiagnosis = row?.original?.rightEyeDiagnosis;
        const fileStatus = row?.original?.fileStatus;
        return fileStatus === POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE ||
          fileStatus === POSSIBLE_STATUS.MEDIA_OPACITY ? (
          <TypographyP
            noBottom
            classname='text-[16px] font-normal'
          >
            {FILE_STATUSES?.find((item) => item?.value === fileStatus)?.label ||
              fileStatus ||
              ''}
          </TypographyP>
        ) : (
          <div className='bottom-2 flex min-w-[300px] max-w-[300px] flex-col gap-1'>
            {leftEyeDiagnosis && (
              <FlexBox flex classname='gap-2 items-start'>
                <TypographyP
                  size={16}
                  primary
                  noBottom
                  classname='min-w-[80px]'
                >
                  Left eye:
                </TypographyP>

                <FlexBox flex classname='gap-3 max-w-[300px] break-words'>
                  <span>
                    {`${DIAGNOSIS_OPTIONS?.find((option) => option.value === leftEyeDiagnosis)?.label || leftEyeDiagnosis || ''}`}{' '}
                  </span>
                </FlexBox>
              </FlexBox>
            )}
            {rightEyeDiagnosis && rightEyeDiagnosis?.length > 0 && (
              <FlexBox flex classname='gap-2 items-start'>
                <TypographyP
                  noBottom
                  size={16}
                  primary
                  classname='min-w-[80px]'
                >
                  Right eye:
                </TypographyP>
                <FlexBox flex classname='gap-3 max-w-[300px] break-words'>
                  <span>
                    {`${DIAGNOSIS_OPTIONS?.find((option) => option.value === rightEyeDiagnosis)?.label || rightEyeDiagnosis || ''}`}{' '}
                  </span>
                </FlexBox>
              </FlexBox>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'viewDetail',
      header: 'Action',
      cell: ({ row }) => {
        const fileStatus = row?.original?.fileStatus;
        return fileStatus === POSSIBLE_STATUS.SOMETHING_WRONG_WITH_FILE ||
          fileStatus === POSSIBLE_STATUS.MEDIA_OPACITY ? (
          '-'
        ) : (
          <div
            className='w-[100px] cursor-pointer text-primary underline'
            onClick={() => {
              handleViewDetail(row.original);
            }}
          >
            View Detail
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Head>
        <title>BEDR | Todays’s Completed Files</title>
      </Head>
      <div className='py-[30px] max-ms:px-[20px] ms:px-[30px]'>
        <Card className='px-5 pb-[33px] pt-5'>
          <FlexBox
            flex
            classname='items-center md:flex-row flex-col gap-4 md:justify-between max-ms:items-start max-ms:flex-col max-ms:gap-5 max-ms:pb-6 w-full pb-[33px]'
          >
            <FlexBox flex>
              <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                <Image
                  src='assets/completed.svg'
                  alt='completed files'
                  width={18}
                  height={14}
                  className='m-auto'
                />
              </div>
              <TypographyH2 size={18}>
                Today’s Completed Files
                <span>{`(${completedFiles?.length})`}</span>
              </TypographyH2>
            </FlexBox>
            <div className='flex items-center gap-4 max-ms:flex-col max-ms:items-start max-ms:gap-5'>
              <div className='relative flex-1 max-ms:max-w-full md:w-[275px] md:flex-none'>
                <Input
                  label={''}
                  placeholder={t('translation.searchByNamePlaceholder')}
                  onChange={(event) => onChangeInput(event)}
                  disabled={
                    !completedFiles?.length && !searchInput?.trim()?.length
                  }
                  className={` min-h-[44px] rounded-[4px] border-[1px] !border-lightGray bg-transparent py-[0.4rem] ps-[1.8rem] !text-[16px] ring-transparent placeholder:font-normal focus:!border-primary focus:bg-lightPrimary max-ms:max-w-full md:max-w-[530px] ${searchInput && ' !border-primary'} disabled:pointer-events-none`}
                />
                <span className='absolute left-[9px] top-[14px]'>
                  <Icon name='search' width={16} height={16} />
                </span>
              </div>
            </div>
          </FlexBox>
          <div>
            <SharedTable
              data={completedFiles || []}
              columns={columns}
              loading={loading}
              noResultsMessage='No file completed yet.'
            />
          </div>
          {!hideLoadMore && completedFiles?.length > 0 && (
            <FlexBox flex centerItems centerContent classname='mt-[40px]'>
              <Button
                variant={'outline'}
                className='min-h-[40px] min-w-[114px] text-[16px]'
                onClick={(e) => {
                  handleLoadMore(e, pageCount + DEFAULT_PAGE);
                }}
                loading={loadingMore}
                center
              >
                Load more
              </Button>
            </FlexBox>
          )}
        </Card>
      </div>
      <Dialog
        open={openCompletedFileModal}
        onOpenChange={setOpenCompletedFileModal}
      >
        <CompletedFilesModal
          patientFileDetails={patientDetails}
          removeShadow={true}
        />
      </Dialog>
    </>
  );
};

export default TodaysCompletedFiles;
