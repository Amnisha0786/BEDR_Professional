'use cleint';

import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Icon from '../custom-components/custom-icon';

import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import { Separator } from '../ui/separator';
import { TChatUsers, TMessage } from '@/models/types/messages';
import { getImageUrl } from '@/lib/common/getImageUrl';
import { UserData } from '@/lib/userProfile/userProfileSlice';
import { getLastSeen } from '@/lib/common/get-last-seen';
import LimitedText from '../custom-components/limited-text';
import { MESSAGE_CONTENT_TYPE } from '@/enums/chat';

export interface ListProps extends React.LiHTMLAttributes<HTMLUListElement> {
  lists: TChatUsers[];
  user: UserData | null;
  currentId?: string;
  setActiveTab?: Dispatch<SetStateAction<number>>;
  messages?: TMessage[];
}

const UsersGroupList = React.forwardRef<HTMLUListElement, ListProps>(
  (
    { lists = [], user, currentId = '', setActiveTab = () => 2, messages = [] },
    ref,
  ) => {
    const router = useRouter();
    const { t } = useTranslation();

    return (
      <ul className='max-w-full' ref={ref}>
        {lists?.map((item, arrayIndex) =>
          item?.users?.map((chatUser, index) => {
            const getProfilePicture =
              getImageUrl(user?.s3BucketUrl, chatUser?.profilePicture) ||
              '../../assets/default-user.svg';
            const contentType = item?.lastMessage?.contentType;
            const isMediaContent =
              contentType === MESSAGE_CONTENT_TYPE.IMAGE ||
              contentType === MESSAGE_CONTENT_TYPE.VIDEO ||
              contentType === MESSAGE_CONTENT_TYPE.FILE;
            return (
              <div key={index}>
                <li
                  className={`cursor-pointer !px-0 py-3 hover:bg-lightPrimary sm:py-4 ${currentId === item?.id && 'bg-lightPrimary'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/chat-messages/${item?.id}`);
                    setActiveTab(2);
                  }}
                >
                  <div className='flex items-center space-x-4 px-4 rtl:space-x-reverse'>
                    <div className='flex-shrink-0'>
                      <div className='relative'>
                        <Image
                          className='h-[48px] w-[48px] rounded-full'
                          src={getProfilePicture}
                          alt='Neil image'
                          height={48}
                          width={48}
                        />
                        <span
                          className={`absolute bottom-0 left-[34px]  h-3 w-3 rounded-full border-0 border-white ${chatUser?.userActivity && 'bg-online'}`}
                        ></span>
                      </div>
                    </div>
                    <div className='min-w-0 flex-1'>
                      <FlexBox flex justify='between'>
                        <TypographyP
                          size={16}
                          noBottom
                          classname='!text-darkGray truncate font-medium capitalize'
                        >
                          {`${chatUser?.firstName || ''} ${chatUser?.lastName || ''}`}
                        </TypographyP>
                        {item?.unreadMessages > 0 && (
                          <span className='h-4 min-w-4 truncate rounded-full bg-primary px-[2px] py-[1px] text-center !text-[10px] text-white'>
                            {item?.unreadMessages}
                          </span>
                        )}
                      </FlexBox>
                      <FlexBox flex justify='between'>
                        <TypographyP noBottom size={14} classname='font-normal'>
                          {isMediaContent ? (
                            <FlexBox flex classname='gap-0'>
                              <Icon
                                name='attachment'
                                color='transparent'
                                width={20}
                                height={20}
                              />
                              <span>{t('translation.file')}</span>
                            </FlexBox>
                          ) : (
                            <LimitedText
                              text={item?.lastMessage?.content || ''}
                              textLength={18}
                            />
                          )}
                        </TypographyP>
                        <TypographyP size={12} noBottom>
                          {item?.lastMessage?.createdAt &&
                            getLastSeen(item?.lastMessage?.createdAt)}
                        </TypographyP>
                      </FlexBox>
                    </div>
                  </div>
                </li>
                {arrayIndex != lists?.length - 1 && (
                  <Separator className='mx-auto w-[90%] bg-lightGray' />
                )}
              </div>
            );
          }),
        )}
      </ul>
    );
  },
);

UsersGroupList.displayName = 'UsersGroupList';

export default UsersGroupList;
