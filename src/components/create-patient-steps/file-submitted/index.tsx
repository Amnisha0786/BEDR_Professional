import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { TypographyP } from '@/components/ui/typography/p';
import { TRegisterNewPatientForm } from '@/models/types/create-patient-forms';

type Tprops = {
  patient?: TRegisterNewPatientForm;
};

const FileSubmitted = ({ patient }: Tprops) => {
  return (
    <Card className='min-h-[200px] justify-center bg-white px-5 pb-5 pt-[30px] md:px-[40px] md:pb-[40px]'>
      <div className='mb-[50px] flex flex-col justify-center'>
        <Image
          src='/assets/solid-tick.svg'
          alt='tick'
          width={56}
          height={56}
          className='m-auto h-14 w-14'
        />
        <TypographyH2 center classname='mb-2 mt-4'>
          File successfully submitted!
        </TypographyH2>
        <TypographyP size={16} center classname='!mb-0'>
          {patient?.firstName || ''} {patient?.lastName || ''}’s file has been
          successfully submitted to the platform for next day diagnosis.
        </TypographyP>
        <TypographyP size={16} center>
          A confirmation email has been sent to{' '}
          <span className='text-primary'>{patient?.email || ''}</span>
        </TypographyP>
      </div>
      <Link href={'/availability'} className='m-auto'>
        <Button variant={'outline'} className='w-[190px]'>
          Done
        </Button>
      </Link>
    </Card>
  );
};

export default FileSubmitted;
