import React from 'react';
import { useTranslation } from 'react-i18next';

import { DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import { LOGINS } from '@/enums/auth';

type TProps = {
  handleConfirm: () => void;
  role?: string;
};

const PendingApprovalModal = ({ handleConfirm = () => {}, role }: TProps) => {
  const { t } = useTranslation();

  const renderContent = () => {
    if (role == LOGINS.PRACTICE) {
      return (
        <TypographyP size={16} center primary>
          {t('translation.weWillTouch')}
        </TypographyP>
      );
    }
    return (
      <TypographyP size={16} center primary>
        {t('translation.nextSteps')}
      </TypographyP>
    );
  };

  return (
    <DialogContent
      className='min-h-[200px] min-w-[354px] max-w-[620px] rounded-[6px] p-5'
      hidecross
      onFocusOutside={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
    >
      <FlexBox flex centerContent centerItems classname='mt-5 flex-col'>
        <TypographyP center primary classname='font-semibold'>
          {t('translation.signupSucces')}
        </TypographyP>
        {renderContent()}
        <Button
          onClick={handleConfirm}
          className='mt-4 min-w-[150px] text-[16px]'
        >
          {t('translation.ok')}
        </Button>
      </FlexBox>
    </DialogContent>
  );
};

export default PendingApprovalModal;
