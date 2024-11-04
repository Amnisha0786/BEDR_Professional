'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Head from 'next/head';
import { toast } from 'sonner';

import Icon from '@/components/custom-components/custom-icon';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import { getDoctorsList } from '@/app/api/doctor-profiles';
import { getErrorMessage } from '@/lib/utils';
import { debounce } from '@/lib/common/debounce';
import { TDoctor } from '@/models/types/doctor-profiles';
import { Button } from '@/components/ui/button';
import { getImageUrl } from '@/lib/common/getImageUrl';
import useUserProfile from '@/hooks/useUserProfile';
import Loader from '@/components/custom-loader';
import NoDataWithLogo from '@/components/no-data-with-logo';
import { SUB_SPECIALITIES } from '@/enums/settings';
import LimitedText from '@/components/custom-components/limited-text';

const DEFAULT_OFFSET = 9;
const DEFAULT_PAGE = 1;

const DoctorsProfile = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState<number>(DEFAULT_PAGE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hideLoadMore, setHideLoadMore] = useState(false);
  const [doctorsList, setDoctorsList] = useState<TDoctor[]>([]);

  const user = useUserProfile();
  const { t } = useTranslation();

  const fetchAllCompletedFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDoctorsList({
        page: DEFAULT_PAGE,
        offset: DEFAULT_OFFSET,
        searchQuery: searchInput,
      });
      if (response?.status !== 200) {
        toast.error(t('translation.somethingWentWrong'));
        return;
      }
      if (response?.data?.data?.doctors?.length < DEFAULT_OFFSET) {
        setHideLoadMore(true);
      } else {
        setHideLoadMore(false);
      }
      setDoctorsList(response.data?.data?.doctors);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
      setPageCount(DEFAULT_PAGE);
    }
  }, [searchInput]);

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

        const response = await getDoctorsList({
          page: count,
          offset: DEFAULT_OFFSET,
          searchQuery: searchInput,
        });
        if (response?.status !== 200) {
          toast.error(t('translation.somethingWentWrong'));
          return;
        }
        setPageCount(count);
        if (response?.data?.data?.doctors) {
          setDoctorsList((prev) => [...prev, ...response.data.data.doctors]);
          if (response?.data?.data?.doctors?.length < DEFAULT_OFFSET) {
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
    [searchInput],
  );

  const onChangeInput = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setSearchInput(value);
    },
    1000,
  );

  const renderComponent = () => {
    if (loading) {
      return <Loader />;
    } else if (doctorsList?.length > 0) {
      return (
        <>
          <div className='my-5 grid grid-cols-1 justify-center gap-7 nm:grid-cols-2 md:grid-cols-3'>
            {doctorsList?.map((details, index) => {
              const getProfile =
                getImageUrl(user?.s3BucketUrl, details?.profilePicture) ||
                '/assets/default-user.svg';
              return (
                <Card
                  className='min-h-[255px] justify-start pt-2 nm:max-w-md md:max-w-sm'
                  key={index}
                >
                  <CardHeader className='p-[14px] !pb-0'>
                    <CardTitle>
                      <FlexBox classname='flex items-center relative mb-5'>
                        <div className='absolute mr-[10px] flex h-9 w-9 justify-center rounded-full border border-primary bg-lightPrimary text-center'>
                          <span className='m-auto text-[14px] font-medium uppercase leading-[auto]'>
                            {`${details.firstName?.charAt(0) || ''}${details.lastName?.charAt(0) || ''}`}
                          </span>
                        </div>

                        <FlexBox classname='flex-col flex justify-center items-center flex-1'>
                          <TypographyH2 classname='text-[20px] break-words w-[75%] text-center'>
                            {`${details.firstName || ''} ${details.lastName || ''}`}
                          </TypographyH2>
                        </FlexBox>
                      </FlexBox>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='p-[14px]'>
                    <div className='relative w-full'>
                      <Image
                        src={getProfile}
                        alt='doctor'
                        width={272}
                        height={180}
                        className='h-[180px] !w-full object-fill'
                      />
                    </div>
                  </CardContent>
                  <CardFooter className='flex flex-col items-start justify-start p-[14px] !pt-0'>
                    <div className='w-full border-b border-lightGray pb-3'>
                      <div className='flex items-center justify-start'>
                        <Icon
                          name='location'
                          height={16}
                          width={16}
                          className='mr-[6px]'
                        />
                        <TypographyP size={16} classname='!mb-0 leading-normal font-normal'>
                          {t('translation.hospital')}
                        </TypographyP>
                        <TypographyP
                          size={16}
                          classname='!mb-0 leading-normal font-medium truncate ml-2'
                        >
                          {details?.hospitalName || ''}
                        </TypographyP>
                      </div>
                      <div className='flex items-start justify-start'>
                        <div className='flex items-start'>
                          <div className='!mr-[6px] w-[16px]'>
                            <Icon
                              name='user'
                              height={16}
                              width={16}
                              className='mr-1'
                            />
                          </div>
                          <TypographyP
                            size={16}
                            classname='!mb-0 leading-normal font-normal'
                          >
                            {t('translation.specialisms')}
                            <span className='ml-2 font-medium'>
                              {details?.subSpecialties?.length > 0
                                ? details?.subSpecialties?.map(
                                    (speciality, index) => {
                                      const specialities =
                                        SUB_SPECIALITIES?.find(
                                          (item) => item?.value === speciality,
                                        )?.label ||
                                        speciality ||
                                        '';
                                      return `${specialities}${index === details?.subSpecialties?.length - 1 ? '.' : ','} `;
                                    },
                                  )
                                : ''}
                            </span>
                          </TypographyP>
                        </div>
                      </div>
                    </div>
                    <div className='mt-[14px] !min-h-[100px] w-full'>
                      <div className='!mb-[6px] flex w-full items-center'>
                        <Icon
                          name='info'
                          height={16}
                          width={16}
                          className='mr-1'
                        />
                        <TypographyP
                          size={16}
                          noBottom
                          classname='leading-normal w-full font-normal'
                        >
                          {t('translation.about')}
                        </TypographyP>
                      </div>
                      <LimitedText
                        textLength={200}
                        text={details?.description || ''}
                        className='word-break !mb-0 w-full leading-normal !text-gray'
                      />
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          {!hideLoadMore && doctorsList?.length > 0 && (
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
        </>
      );
    }
    return <NoDataWithLogo />;
  };

  return (
    <>
      <Head>
        <title>{t('translation.doctorProfilesHead')}</title>
      </Head>
      <div className='px-[30px] py-[30px] md:px-[43px]'>
        <Card className='w-full p-3'>
          <FlexBox classname='justify-between flex items-center'>
            <FlexBox classname='flex'>
              <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                <Image
                  src='assets/doctors-profile.svg'
                  alt={t('translation.doctorProfiles')}
                  width={18}
                  height={14}
                  className='m-auto'
                />
              </div>
              <TypographyH2 size={18}>
                {t('translation.doctorProfiles')}
              </TypographyH2>
            </FlexBox>
            <div className='relative hidden nm:block md:block'>
              <input
                placeholder={t('translation.searchName')}
                onChange={onChangeInput}
                className='min-w-[290px] rounded-[6px] border border-lightGray px-[13px] py-1 ps-8 !text-[16px] outline-none ring-transparent placeholder:font-light placeholder:text-gray focus:bg-lightPrimary focus:outline-none'
              />
              <span className='absolute left-[9px] top-[8px]'>
                <Icon name='search' width={16} height={16} />
              </span>
            </div>
          </FlexBox>
        </Card>

        {renderComponent()}
      </div>
    </>
  );
};

export default DoctorsProfile;
