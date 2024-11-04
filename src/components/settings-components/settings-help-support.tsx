import React, { useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Card } from '../ui/card';
import { TypographyH2 } from '../ui/typography/h2';
import { TypographyP } from '../ui/typography/p';
import { helpAndSupportSettingsSchema } from '@/models/validations/settings';
import { TSettingsHelpAndSupport } from '@/models/types/settings';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { getErrorMessage } from '@/lib/utils';
import { helpAndSupport } from '@/app/api/settings';

const SettingsHelpAndSupport = () => {
  const [submitting, setSubmitting] = useState(false);

  const { t } = useTranslation();

  const form = useForm<TSettingsHelpAndSupport>({
    resolver: yupResolver(helpAndSupportSettingsSchema),
    defaultValues: {
      query: '',
      emailToYourself: false,
    },
    mode: 'onSubmit',
  });

  const onSubmit = useCallback(async (values: TSettingsHelpAndSupport) => {
    setSubmitting(true);
    try {
      const response = await helpAndSupport(values);

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      toast.success(t('translation.querySubmitSuccess'));
      form.reset();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <Card className='min-h-[855px] p-5'>
      <div className='min-h-[500px] w-full flex-col md:max-w-[608px]'>
        <TypographyH2 size={20}>{t('translation.helpSupport')}</TypographyH2>
        <TypographyP size={16} primary classname='font-normal mt-3 mb-4'>
          {t('translation.helpSupportDescription')}
        </TypographyP>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FormField
              control={form.control}
              name='query'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={4}
                      maxLength={500}
                      className='max-h-[136px] resize-none space-y-8 !rounded-[6px] border-none placeholder:font-normal focus:outline-none md:max-w-[606px]'
                      placeholder={t('translation.writeQuery')}
                      showCount={false}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='mb-1.5 mt-0.5 min-h-[21px]' />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='w-full !py-6 text-[16px] font-semibold text-white nm:w-[50%] md:w-[50%]'
              loading={submitting}
            >
              {t('translation.submit')}
            </Button>
          </form>
        </Form>
        <div className='mt-10'>
          <TypographyH2 size={18}>
            {t('translation.contactUsLabel')}
            <span className='text-[16px] font-normal'>
              {' '}
              {t('translation.stillHaveIssue')}
            </span>
          </TypographyH2>
          <TypographyP size={16} primary classname='font-normal mt-3'>
            {t('translation.emailUs')}{' '}
            <span className='font-medium'>support@bookaneyedoctor.co.uk</span>
          </TypographyP>
          <TypographyP size={16} primary classname='font-normal'>
            {t('translation.phone')}{' '}
            <span className='font-medium'>[XXXXXXXXXX]</span>
          </TypographyP>
        </div>
      </div>
    </Card>
  );
};

export default SettingsHelpAndSupport;
