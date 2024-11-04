'use client';

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import dayjs from 'dayjs';

import FlexBox from '../ui/flexbox';
import { TypographyH2 } from '../ui/typography/h2';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { TOptometristList } from '@/models/types/optometrists';
import { removeOptometrist } from '@/app/api/optometrists';
import { getErrorMessage } from '@/lib/utils';
import { TypographyP } from '../ui/typography/p';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import CustomAlertBox from '../custom-components/custom-alert-box';
import { getImageUrl } from '@/lib/common/getImageUrl';
import useUserProfile from '@/hooks/useUserProfile';

type TProps = {
  details: TOptometristList | null;
  setdetails: Dispatch<SetStateAction<TOptometristList | null>>;
  onSuccess: () => void;
};

const ViewOptometrist = ({ details, setdetails, onSuccess }: TProps) => {
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  const user = useUserProfile();

  const handleRemoveOptometrist = useCallback(async () => {
    if (!details?.id) {
      return;
    }
    try {
      setRemoving(true);
      const response = await removeOptometrist({
        optometristId: details?.id,
      });
      if (response?.status !== 200) {
        toast.error('Something went wrong!');
      } else {
        onSuccess();
        toast.success('Optometrist removed successfully.');
        setdetails(null);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || 'Something went wrong!');
    } finally {
      setRemoving(false);
    }
  }, [details]);

  const getProfilePic = useMemo(
    () =>
      getImageUrl(user?.s3BucketUrl, details?.profilePicture) ||
      '/assets/default-user.svg',
    [user, details],
  );

  return (
    <div className='py-[30px] max-ms:px-[16px] ms:px-[20px] md:px-[56px]'>
      <FlexBox flex classname='items-end justify-between pb-[41px]'>
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
          className='bg-transparent'
          onClick={() => setdetails(null)}
        >
          Back
        </Button>
      </FlexBox>
      <Card className='mb-[30px] w-full px-[40px] pb-[40px] pt-[33px]'>
        <FlexBox flex justify='between' classname='items-end'>
          <TypographyH2 size={20}>Personal Information</TypographyH2>
          <AlertDialog open={open || removing} onOpenChange={setOpen}>
            <AlertDialogTrigger className='!outline-none'>
              <Button variant={'error'} className='min-w-[116px]'>
                Remove
              </Button>
            </AlertDialogTrigger>
            <CustomAlertBox
              loading={removing}
              setOpen={setOpen}
              handleConfirm={handleRemoveOptometrist}
              title='Are you sure you want to remove this optometrist.'
            />
          </AlertDialog>
        </FlexBox>
        <FlexBox flex classname='mt-[47px] md:flex-row flex-col'>
          <FlexBox
            flex
            centerContent
            classname='md:w-[33%] max-nm:flex-col max-nm:items-center max-nm:gap-5 md:items-start nm:items-center w-full md:flex-col nm:flex-row nm:gap-[40px] md:gap-[65px]'
          >
            <div className='nm:flex-1'>
              <Image
                src={getProfilePic}
                alt='profile-pic'
                width={100}
                height={100}
                className='h-[100px] w-[100px] rounded-full'
              />
            </div>
            <FlexBox flex classname='flex-col nm:flex-1'>
              <TypographyP noBottom size={14} classname='!font-light'>
                GOC number
              </TypographyP>
              <TypographyP
                noBottom
                size={18}
                classname='font-normal !text-darkGray'
              >
                {details?.gocNumber || ''}
              </TypographyP>
            </FlexBox>
          </FlexBox>
          <FlexBox
            flex
            centerContent
            classname='md:w-[67%] w-full max-nm:flex-col max-nm:mt-5 max-nm:items-center max-nm:gap-5 nm:mt-[30px] gap-[40px]'
          >
            <FlexBox
              flex
              centerContent
              classname='flex-col nm:flex-1 max-nm:w-full max-nm:gap-5 nm:gap-[30px]'
            >
              <FlexBox flex classname='flex-col nm:flex-1'>
                <TypographyP noBottom size={14} classname='!font-light'>
                  First name
                </TypographyP>
                <TypographyP
                  noBottom
                  size={18}
                  classname='font-normal !text-darkGray'
                >
                  {details?.firstName || ''}
                </TypographyP>
              </FlexBox>
              <FlexBox flex classname='flex-col nm:flex-1'>
                <TypographyP noBottom size={14} classname='!font-light'>
                  Last name
                </TypographyP>
                <TypographyP
                  noBottom
                  size={18}
                  classname='font-normal !text-darkGray'
                >
                  {details?.lastName || ''}
                </TypographyP>
              </FlexBox>
              <FlexBox flex classname='flex-col nm:flex-1'>
                <TypographyP noBottom size={14} classname='!font-light'>
                  Date of birth(dd/mm/yyyy)
                </TypographyP>
                <TypographyP
                  noBottom
                  size={18}
                  classname='font-normal !text-darkGray'
                >
                  {details?.dateOfBirth
                    ? dayjs(details?.dateOfBirth)?.format('DD/MM/YYYY')
                    : ''}
                </TypographyP>
              </FlexBox>
            </FlexBox>
            <FlexBox
              flex
              centerContent
              classname='flex-col nm:flex-1 max-nm:w-full max-nm:gap-5 nm:gap-[30px]'
            >
              <FlexBox flex classname='flex-col nm:flex-1'>
                <TypographyP noBottom size={14} classname='!font-light'>
                  Email address
                </TypographyP>
                <TypographyP
                  noBottom
                  size={18}
                  classname='font-normal !text-darkGray truncate'
                >
                  {details?.email || ''}
                </TypographyP>
              </FlexBox>
              <FlexBox flex classname='flex-col nm:flex-1'>
                <TypographyP noBottom size={14} classname='!font-light'>
                  Mobile number
                </TypographyP>
                <TypographyP
                  noBottom
                  size={18}
                  classname='font-normal !text-darkGray'
                >
                  {`${details?.callingCode || ''} ${details?.mobileNumber || ''}`}
                </TypographyP>
              </FlexBox>
              <FlexBox flex classname='flex-col nm:flex-1'>
                <TypographyP noBottom size={14} classname='!font-light'>
                  Postcode
                </TypographyP>
                <TypographyP
                  noBottom
                  size={18}
                  classname='font-normal !text-darkGray'
                >
                  {details?.postCode || ''}
                </TypographyP>
              </FlexBox>
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </Card>
    </div>
  );
};

export default ViewOptometrist;
