'use client';

import React, { useMemo } from 'react';
import { useControls } from 'react-zoom-pan-pinch';

import FlexBox from '../ui/flexbox';
import Icon from '../custom-components/custom-icon';
import { TypographyP } from '../ui/typography/p';

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  const buttonOptions = useMemo(() => {
    return [
      { title: 'Zoom in', icon: 'zoom-in', func: () => zoomIn() },
      { title: 'Zoom out', icon: 'zoom-out', func: () => zoomOut() },
      { title: 'Reset', icon: 'reset', func: () => resetTransform() },
    ];
  }, [zoomIn, zoomOut, resetTransform]);

  return (
    <FlexBox flex classname='gap-5 mt-5'>
      {buttonOptions?.map((item, index) => (
        <FlexBox
          flex
          centerItems
          classname='flex-col text-[12px] gap-1 cursor-pointer'
          key={index}
          onClick={item.func}
        >
          <Icon
            name={item?.icon || ''}
            width={20}
            height={20}
            color='transparent'
            className='text-gray'
          />
          <TypographyP noBottom size={12}>
            {item.title}
          </TypographyP>
        </FlexBox>
      ))}
    </FlexBox>
  );
};

export default Controls;
