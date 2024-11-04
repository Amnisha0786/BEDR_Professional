import React, { Dispatch, SetStateAction, useMemo } from 'react';

import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import { Card, CardContent } from '../ui/card';
import Icon from '../custom-components/custom-icon';
import { TypographyH2 } from '../ui/typography/h2';
import { TCurrentTab } from '@/models/types/file-in-progress';
import { TRightEyeImagesForm } from '@/models/types/create-patient-forms';
import {
  FILE_IN_PROGRESS_STEPS,
  LEFT_EYE_TABS_OPTIONS,
} from '@/enums/file-in-progress';
import StepperFooter from '../create-patient-steps/common-stepper-footer';
import NoDataFound from '../custom-components/custom-no-data-found';
import FilesPreview from './common-file-preview/file-preview';

type Tprops = {
  rightEyeImagesFormData?: TRightEyeImagesForm;
  setCurrentStep: Dispatch<SetStateAction<string>>;
};

const RightEyeImagesProgress = ({
  rightEyeImagesFormData,
  setCurrentStep,
}: Tprops) => {
  const showTabs = useMemo(() => {
    if (rightEyeImagesFormData) {
      const filter = LEFT_EYE_TABS_OPTIONS?.filter((item) => {
        const multipleValue = item?.mutipleValue;
        const value = item?.value;
        const hasMultipleValue = multipleValue && multipleValue?.length > 0;
        const hasValue = value?.length > 0;
        const keyToCheck = multipleValue ?? value;
        const isValid =
          (hasMultipleValue || hasValue) &&
          (rightEyeImagesFormData[multipleValue as keyof TRightEyeImagesForm] ||
            rightEyeImagesFormData[value as keyof TRightEyeImagesForm]) &&
          Object.keys(rightEyeImagesFormData)?.includes(keyToCheck);

        return isValid;
      });

      return filter;
    }
  }, [rightEyeImagesFormData]);

  const handleNextClick = () => {
    setCurrentStep(FILE_IN_PROGRESS_STEPS.LEFT_EYE_IMAGES);
  };

  const getDefaultCurrentTab = (key: string, multipleKey?: string) => {
    let itemObj: TCurrentTab = {
      itemValue:
        rightEyeImagesFormData?.[key as keyof TRightEyeImagesForm] || '',
      multiselect: undefined,
      keyname: key,
    };

    if (multipleKey) {
      itemObj = {
        ...itemObj,
        multiselect:
          rightEyeImagesFormData?.[multipleKey as keyof TRightEyeImagesForm],
      };
    }

    return { ...itemObj };
  };

  const renderFilesInMobile = () => {
    return (
      <div>
        <FlexBox
          flex
          classname='overflow-x-auto scroll-smooth gap-5 w-full flex-col'
        >
          {showTabs?.map((item, index) => (
            <Card
              className='border border-backgroundGray p-5 shadow-none'
              key={index}
            >
              <TypographyP
                noBottom
                size={16}
                center
                classname={`py-3 px-6 rounded-[4px] flex-none hover:bg-lightPrimary bg-lightPrimary text-primary`}
              >
                {item?.title || ''}
              </TypographyP>
              <FilesPreview
                currentTab={getDefaultCurrentTab(
                  item?.value,
                  item?.mutipleValue,
                )}
              />
            </Card>
          ))}
        </FlexBox>
      </div>
    );
  };

  return (
    <FlexBox flex classname='gap-5 flex-col'>
      <Card className='justify-start bg-white py-[30px] max-ms:px-[10px] ms:px-5'>
        <FlexBox classname='flex'>
          <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
            <Icon
              name='communication-preferances'
              width={17}
              height={17}
              className='m-auto'
            />
          </div>
          <TypographyH2 size={18}>Right Eye Images</TypographyH2>
        </FlexBox>
      </Card>
      <Card className='min-h-[200px] justify-start bg-white py-5 max-ms:px-[10px] ms:px-5'>
        {showTabs?.length ? (
          <CardContent className='w-full !p-0'>
            {renderFilesInMobile()}
          </CardContent>
        ) : (
          <NoDataFound
            title={'There is no file to preview.'}
            hideButton={true}
          />
        )}
        <StepperFooter
          typeOfNext='submit'
          hideBack
          outlinedNext
          nextButtonText='Next'
          onClickNext={handleNextClick}
        />
      </Card>
    </FlexBox>
  );
};

export default RightEyeImagesProgress;
