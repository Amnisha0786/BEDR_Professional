'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { XIcon } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

import { getOptometristPatientFiles } from '@/app/api/patient-files';
import SharedTable from '@/components/common-layout/shared-table';
import { FilterDateRangeDropdown } from '@/components/custom-components/custom-daterange-filter';
import Icon from '@/components/custom-components/custom-icon';
import {
  SortingDropdown,
  sortOptions,
} from '@/components/custom-components/custom-sort-dropdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { Input } from '@/components/ui/input';
import { TypographyH2 } from '@/components/ui/typography/h2';
import useOptometristPractice from '@/hooks/useOptometristPractice';
import { debounce } from '@/lib/common/debounce';
import { getErrorMessage } from '@/lib/utils';
import { TCompletedFiles } from '@/models/types/completed-files';
import { TCompletedFilesProps } from '@/models/types/patient-files';
import { DATE_FORMAT } from '@/lib/common/dob-validation';
import { SOCKET_EVENTS } from '@/lib/constants/socket-events';
import useSocket from '@/hooks/useSocket';

const DEFAULT_OFFSET = 15;
const DEFAULT_PAGE = 1;

const PatientFiles = () => {
  const [loading, setLoading] = useState(false);
  const [patientFiles, setPatientFiles] = useState<TCompletedFiles[]>([]);
  const [pageCount, setPageCount] = useState<number>(DEFAULT_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string>();
  const [sort, setSort] = useState<string>();

  const router = useRouter();
  const optometristPractice = useOptometristPractice();
  const { t } = useTranslation();
  const socket = useSocket();

  const patientFilesPayload = (data: TCompletedFilesProps) => {
    let payload = {};
    if (data?.startDate) {
      payload = {
        ...payload,
        startDate: dayjs(data?.startDate)?.format(DATE_FORMAT),
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
        endDate: dayjs(data?.endDate)?.format(DATE_FORMAT),
      };
    }
    if (sort) {
      payload = {
        ...payload,
        sortBy: sort,
      };
    }
    return { ...payload };
  };

  const fetchOptometristPatientFiles = useCallback(
    async ({
      startDate,
      endDate,
      hideLoading = false,
    }: TCompletedFilesProps) => {
      if (!optometristPractice?.practiceId) {
        return;
      }
      try {
        if (!hideLoading) {
          setLoading(true);
        }
        const payload = patientFilesPayload({ startDate, endDate });
        const response = await getOptometristPatientFiles({
          practiceId: optometristPractice?.practiceId,
          page: DEFAULT_PAGE,
          offset: DEFAULT_OFFSET,
          ...payload,
        });
        if (response?.status !== 200) {
          toast.error(t('translation.somethingWentWrong'));
          return;
        }
        if (response?.data?.data?.length < DEFAULT_OFFSET) {
          setHideLoadMore(true);
        } else {
          setHideLoadMore(false);
        }
        setPatientFiles(response.data?.data);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
        setPageCount(DEFAULT_PAGE);
      }
    },
    [searchInput, sort, optometristPractice?.practiceId],
  );

  useEffect(() => {
    fetchOptometristPatientFiles({});
  }, [fetchOptometristPatientFiles]);

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
        const payload = patientFilesPayload({
          startDate: dateRange?.from,
          endDate: dateRange?.to,
        });
        const response = await getOptometristPatientFiles({
          practiceId: optometristPractice?.practiceId,
          offset: DEFAULT_OFFSET,
          page: count,
          ...payload,
        });
        if (response?.status !== 200) {
          toast.error(t('translation.somethingWentWrong'));
          return;
        }
        setPageCount(count);
        if (response?.data?.data) {
          setPatientFiles((prev) => [...prev, ...response.data.data]);
          if (response?.data?.data?.length < DEFAULT_OFFSET) {
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
    [searchInput, sort, optometristPractice?.practiceId],
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
      accessorKey: 'idNumber',
      header: t('translation.idNumber'),
      cell: ({ row }) => (
        <div className='w-[100px] truncate capitalize'>
          {row.getValue('idNumber')}
        </div>
      ),
    },
    {
      accessorKey: 'lastName',
      header: t('translation.lastNameLabel'),
      cell: ({ row }) => (
        <div className='w-[150px] truncate capitalize'>
          {row.getValue('lastName')}
        </div>
      ),
    },
    {
      accessorKey: 'firstName',
      header: t('translation.firstNameLabel'),
      cell: ({ row }) => (
        <div className='w-[150px] truncate capitalize'>
          {row.getValue('firstName')}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('translation.date'),
      cell: ({ row }) => (
        <div className=' w-[150px] truncate'>
          {row.getValue('createdAt')
            ? dayjs(row.getValue('createdAt')).format('D MMM, YYYY')
            : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'viewDetail',
      header: t('translation.action'),
      cell: ({ row }) => (
        <div
          className='w-[100px] cursor-pointer text-primary underline'
          onClick={(e) => {
            e.preventDefault();
            router.push(`/patient-files/view-file/${row?.original?.id}`);
          }}
        >
          {t('translation.viewFile')}
        </div>
      ),
    },
  ];

  const handleClickOk = useCallback(
    (selectedDate?: DateRange | undefined) => {
      fetchOptometristPatientFiles({
        startDate: selectedDate?.from,
        endDate: selectedDate?.to,
      });
    },
    [fetchOptometristPatientFiles],
  );

  useEffect(() => {
    const socketEventApis = () => {
      fetchOptometristPatientFiles({ hideLoading: true });
    };
    if (socket?.connected) {
      socket.on(SOCKET_EVENTS.FILE_MOVED_TO_PATIENT_FILES, socketEventApis);
      socket.on(SOCKET_EVENTS.REFERRED_PATIENT, socketEventApis);
      return () => {
        socket.off(SOCKET_EVENTS.FILE_MOVED_TO_PATIENT_FILES, socketEventApis);
        socket.off(SOCKET_EVENTS.REFERRED_PATIENT, socketEventApis);
      };
    }
  }, [socket, fetchOptometristPatientFiles]);

  return (
    <>
      <Head>
        <title>{t('translation.patientFileHead')}</title>
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
                  src='assets/referral.svg'
                  alt={t('translation.patientFilesAlt')}
                  width={18}
                  height={14}
                  className='m-auto'
                />
              </div>
              <TypographyH2 size={18}>
                {t('translation.patientFilesTitle')}
              </TypographyH2>
            </FlexBox>
            <div className='flex items-center gap-4 max-ms:flex-col max-ms:items-start max-ms:gap-5'>
              <FilterDateRangeDropdown
                selectedDiagnosis={selectedDiagnosis}
                setSelectedDiagnosis={setSelectedDiagnosis}
                setDateRange={setDateRange}
                dateRange={dateRange}
                handleClickOk={handleClickOk}
                hideDiagnosis={true}
                refetch={() => fetchOptometristPatientFiles({})}
                isDisabled={
                  !patientFiles?.length && !dateRange?.from && !dateRange?.to
                }
              />
              <SortingDropdown
                sortOption={sort}
                setSortOption={setSort}
                isDisabled={!patientFiles?.length && !sort}
              />
              <div className='relative flex-1 md:w-[275px] md:flex-none'>
                <Input
                  label={''}
                  placeholder={t('translation.searchHerePlaceholder')}
                  onChange={(event) => onChangeInput(event)}
                  disabled={
                    !patientFiles?.length && !searchInput?.trim()?.length
                  }
                  className='min-h-[44px] rounded-[4px] border-[1px] !border-lightGray bg-transparent py-[0.4rem] ps-[1.8rem] !text-[16px] ring-transparent placeholder:font-normal focus:bg-lightPrimary disabled:pointer-events-none md:max-w-[530px]'
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
                    {t('translation.date')}:{' '}
                    {`${dateRange?.from ? dayjs(dateRange?.from).format('D MMM, YYYY') : ''} - ${dateRange?.to ? dayjs(dateRange?.to).format('D MMM, YYYY') : ''}`}
                    <div
                      className='cursor-pointer'
                      onClick={() => {
                        setDateRange(undefined);
                        fetchOptometristPatientFiles({});
                      }}
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
              data={patientFiles || []}
              columns={columns}
              loading={loading}
              noResultsMessage='No file completed yet.'
            />
          </div>
          {!hideLoadMore && patientFiles?.length > 0 && (
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
                {t('translation.loadMore')}
              </Button>
            </FlexBox>
          )}
        </Card>
      </div>
    </>
  );
};

export default PatientFiles;
