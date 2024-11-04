'use client';

import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

import SettingsSidebar from '@/components/settings-components/settings-sidebar';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { Card } from '@/components/ui/card';

const Settings = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('translation.settingsHead')}</title>
      </Head>
      <div className='px-[20px] py-[24px] md:px-[20px]'>
        <Card className='w-full p-3'>
          <FlexBox flex centerItems>
            <div className='mr-[22px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='assets/settings-gear.svg'
                alt={t('translation.settingsGear')}
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyH2 size={18}>{t('translation.settings')}</TypographyH2>
          </FlexBox>
        </Card>
        <SettingsSidebar />
      </div>
    </>
  );
};

export default Settings;
