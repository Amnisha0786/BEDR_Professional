import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

import LeftEyeImages from '../create-patient-steps/left-eye-images';
import { TGetUnpaidFileData } from '@/models/types/ipad';
import {
  TLeftEyeImagesForm,
  TRightEyeImagesForm,
} from '@/models/types/create-patient-forms';
import RightEyeImages from '../create-patient-steps/right-eye-images';
import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import { Button } from '../ui/button';
import { STEPPER } from '@/enums/create-patient';
import { Card } from '../ui/card';

type TProp = {
  setSelectedSection?: Dispatch<SetStateAction<string>> | undefined;
  fileData?: TGetUnpaidFileData | null;
  hideHeaders?: boolean;
  goToPatientList?: boolean;
};

const UploadMedia = ({
  setSelectedSection = () => {},
  fileData = null,
  hideHeaders = false,
  goToPatientList = false,
}: TProp) => {
  const [leftEyeImagesFormData, setLeftEyeImagesFormData] =
    useState<TLeftEyeImagesForm>();
  const [rightEyeImagesFormData, setRightEyeImagesFormData] =
    useState<TRightEyeImagesForm>();
  const [eyeComponent, setEyeComponent] = useState<string>('right');

  const { t } = useTranslation();

  useEffect(() => {
    if (fileData?.leftEyeImages) {
      const leftEyeData = fileData?.leftEyeImages;
      setLeftEyeImagesFormData({
        ...leftEyeData,
        fundusImage: leftEyeData?.fundusImage ?? '',
        octVideo: leftEyeData?.octVideo ?? '',
        thicknessMap: leftEyeData?.thicknessMap ?? '',
        opticDiscImage: leftEyeData?.opticDiscImage ?? '',
        visualFieldTest: leftEyeData?.visualFieldTest ?? '',
        dicomFile: leftEyeData?.dicomFile ?? '',
        discOctVideo: leftEyeData?.discOctVideo ?? '',
        discThicknessProfile: leftEyeData?.discThicknessProfile ?? '',
        discDicomFile: leftEyeData?.discDicomFile ?? '',
        addAnotherImage: leftEyeData?.addAnotherImage ?? '',
      });
    }
    if (fileData?.rightEyeImages) {
      const rightEyeData = fileData?.rightEyeImages;
      setRightEyeImagesFormData({
        ...rightEyeData,
        fundusImage: rightEyeData?.fundusImage ?? '',
        octVideo: rightEyeData?.octVideo ?? '',
        thicknessMap: rightEyeData?.thicknessMap ?? '',
        opticDiscImage: rightEyeData?.opticDiscImage ?? '',
        visualFieldTest: rightEyeData?.visualFieldTest ?? '',
        dicomFile: rightEyeData?.dicomFile ?? '',
        discOctVideo: rightEyeData?.discOctVideo ?? '',
        discThicknessProfile: rightEyeData?.discThicknessProfile ?? '',
        discDicomFile: rightEyeData?.discDicomFile ?? '',
        addAnotherImage: rightEyeData?.addAnotherImage ?? '',
      });
    }
  }, [fileData]);

  return (
    <div>
      {!hideHeaders && (
        <Card className='mb-[30px] w-full p-3'>
          <FlexBox flex classname='justify-between'>
            <FlexBox flex classname='items-center gap-4'>
              <div className='flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
                <Image
                  src={'/assets/upload-media.svg'}
                  alt='create-patient'
                  width={18}
                  height={14}
                  className='m-auto'
                />
              </div>
              <TypographyP primary noBottom>
                {t('translation.uploadMediaHeader')}
              </TypographyP>
            </FlexBox>
            <Button
              onClick={() => setSelectedSection('')}
              variant={'outlineWithoutHover'}
              className='!bg-backgroundGray px-[37.35px] py-[6.5px] text-[18px]'
            >
              {t('translation.back')}
            </Button>
          </FlexBox>
        </Card>
      )}
      <FlexBox flex classname='justify-center gap-[10px] mb-[30px]'>
        {' '}
        <Button
          onClick={() => setEyeComponent('right')}
          variant={eyeComponent === 'right' ? 'default' : 'outline'}
          className={`px-8 py-[10px] text-[16px] ${eyeComponent === 'right' ? 'text-white' : 'text-primary'}`}
        >
          {t('translation.rightEyeImages')}
        </Button>
        <Button
          onClick={() => setEyeComponent('left')}
          variant={eyeComponent === 'left' ? 'default' : 'outline'}
          className={`px-8 py-[10px] text-[16px] ${eyeComponent === 'left' ? 'text-white' : 'text-primary'}`}
        >
          {t('translation.leftEyeImages')}
        </Button>
      </FlexBox>
      {eyeComponent === 'left' ? (
        <>
          <LeftEyeImages
            completedSteps={[STEPPER.LEFT_EYE_IMAGES]}
            currentStep=''
            setCurrentStep={() => {}}
            leftEyeImagesFormData={leftEyeImagesFormData}
            setLeftEyeImagesFormData={setLeftEyeImagesFormData}
            fileId={fileData?.id}
            isIpadView={true}
            setSelectedSection={setSelectedSection}
            goToPatientList={goToPatientList}
          />
          <TypographyP primary noBottom size={16} center classname='mt-3'>
            {goToPatientList
              ? t('translation.saveAndGoToFiles')
              : t('translation.saveAndGoToHome')}
          </TypographyP>
        </>
      ) : (
        <RightEyeImages
          completedSteps={[STEPPER.RIGHT_EYE_IMAGES]}
          currentStep=''
          setCurrentStep={() => {}}
          rightEyeImagesFormData={rightEyeImagesFormData}
          setRightEyeImagesFormData={setRightEyeImagesFormData}
          fileId={fileData?.id}
          isIpadView={true}
          setEyeComponent={setEyeComponent}
        />
      )}
    </div>
  );
};

export default UploadMedia;
