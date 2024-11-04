'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'sonner';

import { Card } from '../ui/card';
import { TypographyH2 } from '../ui/typography/h2';
import { TypographyP } from '../ui/typography/p';
import { notificationsSchema } from '@/models/validations/settings';
import { TNotificationPayload } from '@/models/types/settings';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Switch } from '../ui/switch';
import FlexBox from '../ui/flexbox';
import {
  getNotificationSettings,
  notificationSettings,
} from '@/app/api/settings';
import { getErrorMessage } from '@/lib/utils';
import Loader from '../custom-loader';

const defaultValues = {
  fileUpdates: false,
  messages: false,
  regularUpdates: false,
};

const SettingsNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [notifications, setNotifications] = useState<TNotificationPayload>();

  const { t } = useTranslation();
  const form = useForm<TNotificationPayload>({
    resolver: yupResolver(notificationsSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const fetchNotificationSettings = useCallback(async () => {
    setFetching(true);
    try {
      const response = await getNotificationSettings();

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setNotifications(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationSettings();
  }, [fetchNotificationSettings]);

  useEffect(() => {
    form.reset({
      fileUpdates: notifications?.fileUpdates || false,
      messages: notifications?.messages || false,
      regularUpdates: notifications?.regularUpdates || false,
    });
  }, [notifications]);

  const handleChange = useCallback(
    async (value: TNotificationPayload) => {
      setLoading(true);
      try {
        const response = await notificationSettings(value);

        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        toast.success(t('translation.notificationSettingsSuccess'));
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
      }
    },
    [form],
  );

  if (fetching) {
    return <Loader />;
  }

  return (
    <Card className='min-h-[855px] p-5'>
      <div className='min-h-[500px] w-full flex-col'>
        <TypographyH2 size={20} classname='font-semibold'>
          {t('translation.notifications')}
        </TypographyH2>
        <div className=' w-full border-b border-lightGray '>
          <TypographyP
            primary
            size={16}
            classname='!pb-3 !font-normal mt-1 max-w-[85%]'
          >
            {t('translation.notificationsDescription')}
          </TypographyP>
        </div>
        <Form {...form}>
          <form noValidate className='mt-4 flex flex-col gap-3'>
            <FormField
              control={form.control}
              name='fileUpdates'
              render={({ field }) => (
                <FormItem>
                  <FlexBox flex centerItems classname='w-full justify-between'>
                    <div>
                      <TypographyP
                        primary
                        noBottom
                        size={16}
                        classname='font-medium'
                      >
                        {t('translation.fileUpdates')}
                      </TypographyP>
                      <TypographyP
                        primary
                        noBottom
                        size={14}
                        classname='font-normal'
                      >
                        {t('translation.controlNotifications')}
                      </TypographyP>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked);
                          handleChange({ fileUpdates: checked });
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                  </FlexBox>
                  <FormMessage className='mb-1.5 mt-0.5 min-h-[7px]' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='messages'
              render={({ field }) => (
                <FormItem>
                  <FlexBox flex centerItems classname='w-full justify-between'>
                    <div>
                      <TypographyP
                        primary
                        noBottom
                        size={16}
                        classname='font-medium'
                      >
                        {t('translation.messages')}
                      </TypographyP>
                      <TypographyP
                        primary
                        noBottom
                        size={14}
                        classname='font-normal'
                      >
                        {t('translation.receiveMessage')}
                      </TypographyP>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked);
                          handleChange({ messages: checked });
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                  </FlexBox>
                  <FormMessage className='mb-1.5 mt-0.5 min-h-[7px]' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='regularUpdates'
              render={({ field }) => (
                <FormItem>
                  <FlexBox flex centerItems classname='w-full justify-between'>
                    <div>
                      <TypographyP
                        primary
                        noBottom
                        size={16}
                        classname='font-medium'
                      >
                        {t('translation.regularUpdates')}
                      </TypographyP>
                      <TypographyP
                        primary
                        noBottom
                        size={14}
                        classname='font-normal'
                      >
                        {t('translation.receiveRoutineUpdate')}
                      </TypographyP>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked: boolean) => {
                          field.onChange(checked);
                          handleChange({ regularUpdates: checked });
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                  </FlexBox>
                  <FormMessage className='mb-1.5 mt-0.5 min-h-[7px]' />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default SettingsNotifications;
