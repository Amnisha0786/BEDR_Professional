import React from 'react';

import Icon from '../custom-components/custom-icon';
import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';

type TProps = {
  height?: number;
  width?: number;
  containerHeight?: number;
};

const NoDataWithLogo = ({
  containerHeight = 400,
  height = 350,
  width = 400,
}: TProps) => {
  return (
    <FlexBox
      flex
      centerContent
      centerItems
      classname={`h-[${containerHeight}px] flex-col`}
    >
      <Icon name='no-data' height={height} width={width} />
    </FlexBox>
  );
};

export default NoDataWithLogo;
