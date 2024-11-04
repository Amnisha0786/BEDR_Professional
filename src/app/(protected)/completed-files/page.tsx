'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DateRange } from 'react-day-picker';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { XIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { toast } from 'sonner';
import dayjs from 'dayjs';

import SharedTable from '@/components/common-layout/shared-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { getAllCompletedFiles } from '@/app/api/completed-files';
import { getErrorMessage } from '@/lib/utils';
import { TCompletedFiles } from '@/models/types/completed-files';
import { FilterDateRangeDropdown } from '@/components/custom-components/custom-daterange-filter';
import { debounce } from '@/lib/common/debounce';
import { Input } from '@/components/ui/input';
import Icon from '@/components/custom-components/custom-icon';
import {
  SortingDropdown,
  sortOptions,
} from '@/components/custom-components/custom-sort-dropdown';
import { TypographyP } from '@/components/ui/typography/p';
import { DIAGNOSIS_OPTIONS } from '@/enums/file-in-progress';
import { FILE_STATUSES, POSSIBLE_STATUS } from '@/enums/file-status-tracker';
import { useAppDispatch } from '@/lib/hooks';
import useRefreshStates from '@/hooks/useRefreshStates';
import { setRefreshData } from '@/lib/updateReduxState/updateReduxStateSlice';

type TCompletedFilesProps = { startDate?: Date; endDate?: Date };

const DEFAULT_OFFSET = 15;
const DEFAULT_PAGE = 1;

const CompletedFiles = () => {
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const defaultRange = useMemo(() => {
    const today = new Date();
    if (searchParams?.get('redirectFromHome')) {
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
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultRange,
  );
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>();
  const [sort, setSort] = useState<string>();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const isRefresh = useRefreshStates();

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
    if (sort) {
      payload = {
        ...payload,
        sortBy: sort,
      };
    }
    if (selectedDiagnosis) {
      payload = {
        ...payload,
        diagnosis: selectedDiagnosis,
      };
    }
    return { ...payload };
  };

  const fetchAllCompletedFiles = useCallback(
    async (hideLoading = false) => {
      try {
        if (!hideLoading) {
          setLoading(true);
        }
        const payload = completedFilesPayload({
          startDate: dateRange?.from,
          endDate: dateRange?.to,
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
        dispatch(
          setRefreshData({ ...isRefresh, isRefreshCompletedFiles: false }),
        );
      }
    },
    [searchInput, sort, selectedDiagnosis, dateRange],
  );

  useEffect(() => {
    fetchAllCompletedFiles();
  }, [fetchAllCompletedFiles]);

  useEffect(() => {
    if (isRefresh?.isRefreshCompletedFiles) {
      fetchAllCompletedFiles(true);
    }
  }, [isRefresh, fetchAllCompletedFiles]);

  const handleLoadMore = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      count: number,
    ) => {
      e.preventDefault();
      try {
        setLoadingMore(true);
        const payload = completedFilesPayload({
          startDate: dateRange?.from,
          endDate: dateRange?.to,
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
    [searchInput, sort, selectedDiagnosis, dateRange],
  );

  const onChangeInput = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchInput(value);
    },
    1000,
  );

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
      cell: ({ row }) => (
        <div
          className='w-[100px] cursor-pointer text-primary underline'
          onClick={(e) => {
            e.preventDefault();
            router.push(`/completed-files/view-file/${row?.original?.id}`);
          }}
        >
          View Detail
        </div>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>BEDR | Completed Files</title>
      </Head>
      <div className='py-[30px] max-ms:px-[16px] ms:px-[20px]'>
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
                Completed Files<span>{`(${completedFiles?.length})`}</span>
              </TypographyH2>
            </FlexBox>
            <div className='flex items-center gap-4 max-ms:flex-col max-ms:items-start max-ms:gap-5'>
              <FilterDateRangeDropdown
                selectedDiagnosis={selectedDiagnosis}
                setSelectedDiagnosis={setSelectedDiagnosis}
                setDateRange={setDateRange}
                dateRange={dateRange}
                refetch={() => fetchAllCompletedFiles()}
                isDisabled={
                  !completedFiles?.length && !dateRange?.from && !dateRange?.to
                }
              />
              <SortingDropdown
                sortOption={sort}
                setSortOption={setSort}
                isDisabled={!completedFiles?.length && !sort}
              />
              <div className='relative flex-1 max-ms:max-w-full md:w-[275px] md:flex-none'>
                <Input
                  label={''}
                  placeholder={t(
                    'translation.searchByNameCompletedFilesPlaceholder',
                  )}
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
            <FlexBox flex classname='gap-[10px]'>
              {dateRange?.from && dateRange?.to && (
                <div className='mb-[8px] rounded-[6px] border border-primary bg-lightPrimary px-[10px] py-[6px] text-[14px] text-primary nm:max-w-[269px] md:max-w-[269px] '>
                  <FlexBox
                    flex
                    centerItems
                    justify='between'
                    classname='gap-[6px]'
                  >
                    Date:{' '}
                    {`${dateRange?.from ? dayjs(dateRange?.from).format('D MMM, YYYY') : ''} - ${dateRange?.to ? dayjs(dateRange?.to).format('D MMM, YYYY') : ''}`}
                    <div
                      className='cursor-pointer'
                      onClick={() => {
                        setDateRange(undefined);
                        fetchAllCompletedFiles();
                      }}
                    >
                      <XIcon size={12} />
                    </div>
                  </FlexBox>
                </div>
              )}
              {selectedDiagnosis && (
                <div className='mb-[8px] rounded-[6px] border border-primary bg-lightPrimary px-[10px] py-[6px] text-[14px] text-primary nm:max-w-[350px] md:max-w-[350px] '>
                  <FlexBox
                    flex
                    centerItems
                    justify='between'
                    classname='gap-[6px]'
                  >
                    Diagnosis:{' '}
                    {`${DIAGNOSIS_OPTIONS.find((option) => option.value === selectedDiagnosis)?.label}`}
                    <div
                      className='cursor-pointer'
                      onClick={() => setSelectedDiagnosis(undefined)}
                    >
                      <XIcon size={12} />
                    </div>
                  </FlexBox>
                </div>
              )}
              {sort && (
                <div className='mb-[8px] rounded-[6px] border border-primary bg-lightPrimary px-[10px] py-[6px] text-[14px] text-primary nm:max-w-[269px] md:max-w-[269px] '>
                  <FlexBox
                    flex
                    centerItems
                    justify='between'
                    classname='gap-[6px]'
                  >
                    {`${sortOptions.find((option) => option.value === sort)?.label}: ${' '} ${sortOptions.find((option) => option.value === sort)?.subLabel}`}
                    <div
                      className='cursor-pointer'
                      onClick={() => setSort(undefined)}
                    >
                      <XIcon size={12} />
                    </div>
                  </FlexBox>
                </div>
              )}
            </FlexBox>
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
    </>
  );
};

export default CompletedFiles;
