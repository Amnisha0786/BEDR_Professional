import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

import Icon from '../custom-components/custom-icon';
import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import { TUsers } from '@/models/types/messages';
import { getImageUrl } from '@/lib/common/getImageUrl';
import useUserProfile from '@/hooks/useUserProfile';
import { Loginas } from '@/lib/constants/data';

type TProps = {
  currentUser?: TUsers;
  setActiveTab?: Dispatch<SetStateAction<number>>;
  showAll?: boolean;
};

const UserProfile = ({
  currentUser,
  setActiveTab = () => 2,
  showAll = false,
}: TProps) => {
  const { t } = useTranslation();
  const user = useUserProfile();

  const getProfileUrl = useMemo(
    () =>
      getImageUrl(user?.s3BucketUrl, currentUser?.profilePicture) ||
      '../../assets/default-user.svg',
    [user, currentUser],
  );

  return (
    <div className='!px-4'>
      <FlexBox
        flex
        justify='end'
        classname='cursor-pointer'
        onClick={() => {
          setActiveTab(2);
        }}
      >
        <Icon name='circle-cross' />
      </FlexBox>
      <FlexBox
        flex
        centerContent
        classname={`flex-1 flex-col gap-4 md:mb-0 mb-5 ${!showAll ? '!px-11' : 'px-0'}`}
      >
        <div className='m-auto'>
          <Image
            src={getProfileUrl}
            alt='profile-pic'
            width={100}
            height={100}
            className='h-[100px] w-[100px] rounded-full'
          />
        </div>
        <div>
          <TypographyP
            primary
            noBottom
            center
            size={16}
            classname='font-semibold capitalize'
          >
            {`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`}
          </TypographyP>
          <TypographyP
            primary
            noBottom
            center
            size={12}
            classname='font-medium truncate'
          >
            {currentUser?.email}
          </TypographyP>
        </div>

        <FlexBox flex classname='mt-3 flex-col gap-5'>
          <FlexBox
            flex
            centerItems
            classname='rounded-[5px] bg-backgroundGray p-3 gap-4'
          >
            <div>
              <Icon name='call-icon' />
            </div>
            <div>
              <TypographyP primary noBottom size={12} classname='font-normal'>
                {t('translation.mobileNo')}
              </TypographyP>
              <TypographyP primary noBottom size={14} classname='font-semibold'>
                {`${currentUser?.callingCode || ''} ${currentUser?.mobileNumber || ''}`}
              </TypographyP>
            </div>
          </FlexBox>
          <FlexBox
            flex
            centerItems
            classname='rounded-[5px] bg-backgroundGray p-3 gap-4'
          >
            <div>
              <Icon name='work-profile' />
            </div>
            <div>
              <TypographyP primary noBottom size={12} classname='font-normal'>
                {t('translation.workProfile')}
              </TypographyP>
              <TypographyP primary noBottom size={14} classname='font-semibold'>
                {
                  Loginas?.find((item) => item?.value === currentUser?.role)
                    ?.label
                }
              </TypographyP>
            </div>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </div>
  );
};

export default UserProfile;
