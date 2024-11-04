import React from 'react';

import FlexBox from '../ui/flexbox';
import { TypographyP } from '../ui/typography/p';
import { Card } from '../ui/card';

const ReadOnlyService = () => {
  return (
    <Card className=' w-full p-3'>
      <FlexBox flex centerContent centerItems classname='max-md:!items-start'>
        <TypographyP
          noBottom
          size={18}
          center
          classname='!text-darkGray !font-medium '
        >
          Signup successful.
          <p className='mt-0'>{`You will be able to start submitting files to the platform once your practice has assigned you to it's account. Please note that you have to log out and then log back in after that to start submitting files.`}</p>
        </TypographyP>
      </FlexBox>
    </Card>
  );
};

export default ReadOnlyService;
