import React from 'react';

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { TypographyP } from '../ui/typography/p';

type TProps = {
  title?: string;
  description?: string;
  moreDescription?: string;
};

const CustomEthnicityDialog = ({
  title = '',
  description = '',
  moreDescription = '',
}: TProps) => {
  return (
    <DialogContent className='sm:max-w-[510px]'>
      <DialogHeader>
        <DialogTitle className='mb-4 text-darkGray'>{title}</DialogTitle>
        <DialogDescription>
          <TypographyP size={14}>{description}</TypographyP>
          <TypographyP size={14}>{moreDescription}</TypographyP>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default CustomEthnicityDialog;
