'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Head from 'next/head';
import Image from 'next/image';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/utils';
import { getPracticeOptometrists } from '@/app/api/optometrists';
import SharedTable from '@/components/common-layout/shared-table';
import { TOptometristList } from '@/models/types/optometrists';
import ViewOptometrist from '@/components/optometrists/view-optometrist';

const DEFAULT_OFFSET = 15;
const DEFAULT_PAGE = 1;

const Optometrists = () => {
  const [pageCount, setPageCount] = useState<number>(DEFAULT_PAGE);
  const [optometristList, setOptometristList] = useState<TOptometristList[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const [viewDetail, setViewDetail] = useState<TOptometristList | null>(null);

  const router = useRouter();

  const fetchAllOptometrists = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPracticeOptometrists({
        page: DEFAULT_PAGE,
        offset: DEFAULT_OFFSET,
      });
      if (response?.status !== 200) {
        toast.error('Something went wrong!');
      } else {
        if (response?.data?.data?.length < DEFAULT_OFFSET) {
          setHideLoadMore(true);
        } else {
          setHideLoadMore(false);
        }
        setOptometristList(response.data?.data);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Something went wrong!');
    } finally {
      setLoading(false);
      setPageCount(DEFAULT_PAGE);
    }
  }, []);

  useEffect(() => {
    fetchAllOptometrists();
  }, [fetchAllOptometrists]);

  const handleLoadMore = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      count: number,
    ) => {
      e.preventDefault();
      try {
        setLoadingMore(true);
        const response = await getPracticeOptometrists({
          page: count,
          offset: DEFAULT_OFFSET,
        });
        if (response?.status !== 200) {
          toast.error('Something went wrong!');
        } else {
          setPageCount(count);
          if (response?.data?.data) {
            setOptometristList((prev) => [...prev, ...response.data.data]);
            if (response?.data?.data?.length < DEFAULT_OFFSET) {
              setHideLoadMore(true);
            } else {
              setHideLoadMore(false);
            }
          }
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || 'Something went wrong!');
      } finally {
        setLoadingMore(false);
      }
    },
    [],
  );

  const columns: ColumnDef<TOptometristList>[] = [
    {
      accessorKey: 'gocNumber',
      header: 'GOC Number',
      cell: ({ row }) => (
        <div className=' w-[150px] truncate'>{row.getValue('gocNumber')}</div>
      ),
    },
    {
      accessorKey: 'lastName',
      header: 'Surname',
      cell: ({ row }) => (
        <div className='w-[100px] truncate capitalize'>
          {row.getValue('lastName')}
        </div>
      ),
    },
    {
      accessorKey: 'firstName',
      header: 'First Name(s)',
      cell: ({ row }) => (
        <div className='w-[150px] truncate capitalize'>
          {row.getValue('firstName')}
        </div>
      ),
    },
    {
      accessorKey: 'mobileNumber',
      header: 'Phone Number',
      cell: ({ row }) => (
        <div className='w-[150px] truncate'>{`${row?.original?.callingCode} ${row.getValue('mobileNumber')}`}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email Address',
      cell: ({ row }) => (
        <div className='w-[200px] truncate'>{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'viewDetail',
      header: 'Action',
      cell: ({ row }) => (
        <div
          className='w-[100px] cursor-pointer text-primary underline'
          onClick={(e) => {
            e.preventDefault();
            setViewDetail(row?.original);
          }}
        >
          View Detail
        </div>
      ),
    },
  ];

  const onSuccess = () => {
    fetchAllOptometrists();
  };

  return (
    <>
      <Head>
        <title>BEDR | Optometrists</title>
      </Head>
      {viewDetail ? (
        <ViewOptometrist
          details={viewDetail}
          setdetails={setViewDetail}
          onSuccess={onSuccess}
        />
      ) : (
        <div className='py-[30px] max-ms:px-[16px] ms:px-[20px]'>
          <Card className='px-5 pb-[33px] pt-5'>
            <FlexBox
              flex
              classname='items-center md:justify-between max-ms:flex-col max-ms:gap-5 max-ms:pb-6 w-full justify-center pb-[41px]'
            >
              <FlexBox flex>
                <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                  <Image
                    src='assets/opto.svg'
                    alt='optometrists'
                    width={18}
                    height={14}
                    className='m-auto'
                  />
                </div>
                <TypographyH2 size={18}>Optometrists</TypographyH2>
              </FlexBox>
              <Button
                variant={'outline'}
                className={`ml-auto text-[18px] max-ms:ml-0`}
                onClick={() => router.push('/optometrists/add-optometrist')}
              >
                Add new Optometrist
              </Button>
            </FlexBox>
            <SharedTable
              data={optometristList}
              columns={columns}
              loading={loading}
              noResultsMessage='No optometrist added yet.'
            />
            {!hideLoadMore && optometristList?.length > 0 && (
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
      )}
    </>
  );
};

export default Optometrists;
