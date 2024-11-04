import React from 'react';
import { LoaderIcon } from 'lucide-react';

import FlexBox from '../ui/flexbox';

type TLoaderProps = {
  size?: number;
  screen?: 'small' | 'large' | 'medium' | 'centered' | number;
  className?: string;
};

const Loader = ({ size, screen = 'large', className }: TLoaderProps) => {
  return (
    <FlexBox
      centerContent
      centerItems
      flex
      classname={`${screen === 'large' ? 'h-screen' : screen === 'medium' ? 'min-h-[100px]' : screen === 'centered' ? 'min-h-[60vh]' : `!h-[${screen}px]`} w-full ${className}`}
    >
      <LoaderIcon
        className={`${size ? `h-[${size}px] w-[${size}px]` : ' h-[50px] w-[40px]'} animate-spin text-primary`}
      />{' '}
    </FlexBox>
  );
};

export default Loader;
