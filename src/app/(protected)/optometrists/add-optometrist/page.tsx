'use client';

import React, { useCallback, useRef, useState } from 'react';
import { CheckedState } from '@radix-ui/react-checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { toast } from 'sonner';
import Image from 'next/image';

import { getErrorMessage } from '@/lib/utils';
import { addOptometrist, getAllOptometrists } from '@/app/api/optometrists';
import { TOptometristList } from '@/models/types/optometrists';
import { Checkbox } from '@/components/ui/checkbox';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TypographyP } from '@/components/ui/typography/p';
import { Input } from '@/components/ui/input';
import Icon from '@/components/custom-components/custom-icon';
import SharedTable from '@/components/common-layout/shared-table';

type TSelect = {
  type: 'single' | 'all' | '';
  data: string[];
};

const AddOptometrist = () => {
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [addingOptometrist, setAddingOptometrist] = useState(false);
  const [showTableCard, setShowTableCard] = useState(false);
  const [optometristList, setOptometristList] = useState<TOptometristList[]>(
    [],
  );
  const [rowSelection, setRowSelection] = useState<TSelect>({
    type: 'single',
    data: [],
  });

  const previousValueRef = useRef('');
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (
        searchInput?.length === 0 ||
        previousValueRef.current === searchInput
      ) {
        return;
      }

      try {
        setLoading(true);
        const response = await getAllOptometrists({
          name: searchInput,
        });
        if (response?.status !== 200) {
          toast.error('Something went wrong!');
        } else {
          setOptometristList(response.data?.data);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || 'Something went wrong!');
      } finally {
        setLoading(false);
        setShowTableCard(true);
      }

      previousValueRef.current = searchInput;
    },
    [previousValueRef, searchInput],
  );

  const handleRowSelect = (
    checked: CheckedState,
    rowId: string,
    type: 'all' | 'single',
  ) => {
    if (type == 'all') {
      if (checked) {
        setRowSelection({
          type: 'all',
          data: optometristList?.map((item) => item?.id),
        });
      } else {
        setRowSelection({
          type: 'single',
          data: [],
        });
      }
    } else {
      const updatedKeys = checked
        ? [...rowSelection.data, rowId]
        : rowSelection?.data?.filter((key) => key !== rowId);
      setRowSelection({ type: 'single', data: updatedKeys });
    }
  };

  const handleAddOptometrist = useCallback(async () => {
    if (rowSelection?.data?.length === 0) {
      toast.warning('Please select optometrist to add.');
      return;
    }
    try {
      setAddingOptometrist(true);
      const response = await addOptometrist({
        optometristIds: rowSelection?.data,
      });
      if (response?.status !== 200) {
        toast.error('Something went wrong!');
      } else {
        toast.success('Optometrist(s) added successfully.');
        router.push('/optometrists');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Something went wrong!');
    } finally {
      setAddingOptometrist(false);
    }
  }, [rowSelection]);

  const columns: ColumnDef<TOptometristList>[] = [
    {
      id: 'id',
      header: () => (
        <Checkbox
          checked={rowSelection?.type === 'all'}
          disabled={!optometristList?.length}
          onCheckedChange={(val) => handleRowSelect(val, '', 'all')}
        />
      ),
      cell: ({ row }) => (
        <div className='flex'>
          <Checkbox
            checked={
              rowSelection?.data?.includes(row?.original?.id) ? true : false
            }
            onCheckedChange={(val) =>
              handleRowSelect(val, row?.original?.id, 'single')
            }
          />
        </div>
      ),
    },
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
      header: 'Phone Number ',
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
  ];
  return (
    <>
      <Head>
        <title>BEDR | Add new optometrist</title>
      </Head>
      <div className='py-[30px] max-ms:px-[16px] ms:px-[20px] md:px-[56px]'>
        <FlexBox flex classname='items-end justify-between pb-[41px]'>
          <FlexBox flex>
            <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='../assets/opto.svg'
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
            className='bg-transparent'
            onClick={() => router.back()}
          >
            Back
          </Button>
        </FlexBox>
        <Card className='mb-[30px] w-fit p-5'>
          <TypographyP size={16} classname='!mt-0 !mb-3 leading-normal'>
            Search for the new optometrist and add them in your practice
          </TypographyP>
          <form onSubmit={(e) => handleSearchSubmit(e)} noValidate>
            <FlexBox classname='flex'>
              <div className='relative flex-1 md:w-[530px] md:flex-none'>
                <Input
                  label={''}
                  placeholder='Enter optometrist name, or email address'
                  value={searchInput}
                  onChange={handleChange}
                  className='min-h-[44px] !border-lightGray py-[0.4rem] ps-[1.8rem] !text-[16px] ring-transparent placeholder:font-normal focus:bg-lightPrimary md:max-w-[530px]'
                />
                <span className='absolute left-[9px] top-[14px]'>
                  <Icon name='search' width={16} height={16} />
                </span>
              </div>
              <Button
                type='submit'
                className='ml-3 min-h-[44px] min-w-[100px] text-[16px] text-white'
                loading={loading}
                center
                disabled={loading || !searchInput?.length}
              >
                Search
              </Button>
            </FlexBox>
          </form>
        </Card>
        {showTableCard && (
          <Card className='mb-[30px] w-full p-5'>
            <SharedTable
              data={optometristList}
              columns={columns}
              noResultsMessage='No optometrist found.'
            />
            {optometristList?.length > 0 && (
              <Button
                className='mx-auto mb-6 mt-[40px] w-[110px] text-[18px] text-white'
                onClick={handleAddOptometrist}
                loading={addingOptometrist}
                center
              >
                Add
              </Button>
            )}
          </Card>
        )}
      </div>
    </>
  );
};

export default AddOptometrist;
