import React from 'react';

type IProps = {
  classname?: string;
  children: React.ReactNode;
  flex?: boolean;
  centerItems?: boolean;
  centerContent?: boolean;
  justify?: 'between' | 'around' | 'end' | 'start';
  onClick?: () => void;
  disable?: boolean;
};

const FlexBox = ({
  classname,
  children,
  flex,
  centerContent,
  centerItems,
  justify,
  onClick,
  disable = false,
}: IProps): JSX.Element => (
  <div
    className={`${flex ? 'flex' : 'block md:flex'} ${centerItems && 'items-center'} ${centerContent && 'justify-center'} ${justify && `justify-${justify}`} ${disable && '!cursor-not-allowed !bg-opacity-80 !text-opacity-85'} ${classname}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export default FlexBox;
