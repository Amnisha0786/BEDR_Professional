'use client';

import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

import { TypographyP } from './p';
import FlexBox from '../flexbox';
import Icon from '@/components/custom-components/custom-icon';
import { TAvailableConsultants } from '@/models/types/todays-clinics';
import { getImageUrl } from '@/lib/common/getImageUrl';
import useUserProfile from '@/hooks/useUserProfile';
import { Separator } from '../separator';
import useOnlineUsers from '@/hooks/useOnlineUsers';
import NoDataWithLogo from '@/components/no-data-with-logo';

export interface ListProps extends React.LiHTMLAttributes<HTMLUListElement> {
  lists: TAvailableConsultants[];
  handleClick?: (id: string) => void;
  hideIcon?: boolean;
  readersList?: boolean;
  doctorsList?: boolean;
}

const TypographyList = React.forwardRef<HTMLUListElement, ListProps>(
  (
    {
      lists,
      handleClick = () => { },
      hideIcon = false,
      readersList,
      doctorsList,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const user = useUserProfile();
    const onlineUsers = useOnlineUsers();

    const handleUserSelection = useCallback((id: string) => {
      handleClick(id);
    }, []);

    return (
      <ul ref={ref}>
        {lists?.length ? (
          lists
            .sort((a, b) => {
              if (a.id === user?.id) return -1;
              if (b.id === user?.id) return 1;
              return 0;
            })
            .map((item, index) => {
              const profilePictureUrl = getImageUrl(
                user?.s3BucketUrl,
                item?.profilePicture,
              );
              return (
                <div key={index}>
                  <li
                    className={`cursor-pointer px-5 py-3 hover:bg-lightPrimary sm:py-4 ${hideIcon && '!cursor-auto hover:!bg-transparent'}`}
                    onClick={() => {
                      if (user?.id !== item?.id) {
                        handleUserSelection(item?.id)
                      }
                    }}
                  >
                    <div className='flex items-center space-x-4 rtl:space-x-reverse'>
                      <div className='flex-shrink-0'>
                        <div className='relative'>
                          <Image
                            className='h-[48px] w-[48px] rounded-full'
                            src={profilePictureUrl || 'assets/default-user.svg'}
                            alt='User image'
                            height={49}
                            width={49}
                          />
                          <span
                            className={`absolute bottom-0 left-[35px] h-3 w-3 rounded-full border-0 border-white ${onlineUsers?.includes(item?.id) ? 'bg-online' : ''}`}
                          ></span>
                        </div>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <TypographyP
                          size={16}
                          noBottom
                          classname='!text-darkGray truncate capitalize font-medium'
                        >
                          {user?.id === item?.id
                            ? `You`
                            : `${item?.firstName || ''} ${item?.lastName || ''}`}
                        </TypographyP>

                        <FlexBox flex justify='between'>
                          <TypographyP
                            noBottom
                            size={14}
                            classname='md:max-w-[150px] nm:max-w-[150px] max-w-[450px] truncate font-normal'
                          >
                            {item?.lastMessage || ''}
                          </TypographyP>
                          {!hideIcon && user?.id !== item?.id && <Icon name='black-messages' />}
                        </FlexBox>
                      </div>
                    </div>
                  </li>
                  {index != lists?.length - 1 && (
                    <Separator className='mx-auto w-[90%] bg-lightGray' />
                  )}
                </div>
              );
            })
        ) : (
          <>
            {readersList || doctorsList ? (
              <TypographyP size={16} classname='py-4 px-5 mt-[30%]' center>
                {t(
                  readersList
                    ? 'translation.noReaderFound'
                    : doctorsList
                      ? 'translation.noDoctorFound'
                      : '',
                )}
              </TypographyP>
            ) : (
              <NoDataWithLogo containerHeight={280} height={280} width={350} />
            )}
          </>
        )}
      </ul>
    );
  },
);

TypographyList.displayName = 'TypographyList';

export default TypographyList;
