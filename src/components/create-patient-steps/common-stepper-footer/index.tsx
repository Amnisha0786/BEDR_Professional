import { Button } from '@/components/ui/button';
import { LoaderIcon } from 'lucide-react';
import React from 'react';

type Iprops = {
  onClickBack?: () => void;
  hideBack?: boolean;
  outlinedNext?: boolean;
  typeOfNext?: 'submit' | 'button';
  onClickNext?: () => void;
  nextButtonText?: string;
  loading?: boolean;
  nextButtonWidth?: string;
  fontSize?: number;
};

const StepperFooter = ({
  onClickBack,
  hideBack,
  outlinedNext,
  typeOfNext = 'button',
  onClickNext,
  nextButtonText,
  loading = false,
  nextButtonWidth = '160',
  fontSize,
}: Iprops) => {
  return (
    <div className='mt-5 flex items-end justify-end align-baseline'>
      {!hideBack && (
        <Button
          type='button'
          variant={'outlineWithoutHover'}
          className='mr-5 text-[18px] nm:w-[160px] md:w-[160px]'
          onClick={onClickBack}
          disabled={loading}
        >
          Back
        </Button>
      )}
      <Button
        type={typeOfNext}
        variant={outlinedNext ? 'outline' : 'default'}
        className={`nm:[${nextButtonWidth}px] md:w-[${nextButtonWidth}px] w-[${nextButtonWidth}px] ${!outlinedNext && 'text-white'} min-w-[140px] text-[18px] ${fontSize && `!text-[${fontSize}px]`}`}
        onClick={onClickNext}
        disabled={loading}
      >
        {loading ? (
          <LoaderIcon size={15} className='m-auto animate-spin' />
        ) : (
          nextButtonText || 'Save & Next'
        )}
      </Button>
    </div>
  );
};

export default StepperFooter;
