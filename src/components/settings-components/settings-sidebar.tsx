'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { cn, getErrorMessage } from '@/lib/utils';
import { SETTINGS_SIDEBAR } from '@/enums/settings';
import FlexBox from '../ui/flexbox';
import { settingsSidebarItems } from '../../lib/constants/data';
import Icon from '../custom-components/custom-icon';
import { TypographyP } from '../ui/typography/p';
import SettingsPersonalInformation from './settings-personal-information';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import { logOutUser } from '@/app/api/auth';
import { getValueFromCookies } from '@/lib/common/manage-cookies';
import CustomAlertBox from '../custom-components/custom-alert-box';
import { COLORS } from '@/lib/constants/color';
import useAccessToken from '@/hooks/useAccessToken';
import SettingsHelpAndSupport from './settings-help-support';
import SettingsTermsConditions from './settings-terms-conditions';
import SettingsNotifications from './settings-notifications';
import SettingsChangePassword from './settings-change-password';
import { clearDataOnLogout } from '@/lib/common/clear-data-on-logout';
import useSocket from '@/hooks/useSocket';

const SettingsSidebar = () => {
  const [currentStep, setCurrentStep] = useState<string>(
    SETTINGS_SIDEBAR.PERSONAL_INFORMATION,
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const session = useAccessToken();
  const { t } = useTranslation();
  const socket = useSocket();

  const handleStepClick = useCallback((title: string) => {
    setCurrentStep(title);
  }, []);

  const renderStepComponent = useCallback(() => {
    switch (currentStep) {
      case SETTINGS_SIDEBAR.PERSONAL_INFORMATION:
        return <SettingsPersonalInformation />;
      case SETTINGS_SIDEBAR.HELP_SUPPORT:
        return <SettingsHelpAndSupport />;
      case SETTINGS_SIDEBAR.TERMS_CONDITIONS:
        return <SettingsTermsConditions />;
      case SETTINGS_SIDEBAR.NOTOFICATIONS:
        return <SettingsNotifications />;
      case SETTINGS_SIDEBAR.CHANGE_PASSWORD:
        return <SettingsChangePassword />;
      default:
        return null;
    }
  }, [currentStep]);

  const refreshToken = useMemo(() => {
    return getValueFromCookies('refreshToken');
  }, []);

  const handleLogout = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      try {
        if (!refreshToken) {
          return;
        }
        setOpen(true);
        setLoading(true);
        const response = await logOutUser(refreshToken);
        if (response?.data?.status !== 200) {
          toast.error(
            response?.data?.message || t('translation.somethingWentWrong'),
          );
          return;
        }
        toast.success(t('translation.logoutSuccessful'));
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || t('translation.somethingWentWrong'));
      } finally {
        setLoading(false);
        setOpen(false);
        clearDataOnLogout();
        if (socket?.connected) {
          socket.disconnect();
        }
        router.push('/login');
      }
    },
    [refreshToken, socket],
  );

  const steps = useMemo(() => {
    return settingsSidebarItems;
  }, [session]);

  return (
    <FlexBox classname='mt-5 md:gap-x-5'>
      <div className='rounded-[10px] bg-white pl-[14px] pr-[12px] md:pb-[27px] md:pl-0 md:pt-3'>
        <nav className='thin-scroll flex scroll-m-0 scroll-p-0 overflow-x-auto scroll-smooth md:grid md:items-start md:gap-2 md:overflow-hidden'>
          {steps?.map((item, index) => {
            return (
              <span
                key={index}
                className={cn(
                  '!md:rounded-r-[7px] group m-[10px] flex cursor-pointer items-center rounded-[7px] py-[15px] pl-[16px] pr-[9px] font-medium hover:bg-lightPrimary  md:m-0 md:rounded-l-none md:pl-[16px]',
                  item.disabled && 'opacity-80',
                  currentStep === item?.title && 'bg-lightPrimary',
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (item?.title === SETTINGS_SIDEBAR.LOGOUT && !open) {
                    setOpen(true);
                  } else {
                    if (!item.disabled && !open && !loading) {
                      handleStepClick(item?.title);
                    }
                  }
                }}
              >
                <div className='flex w-max items-center justify-center md:justify-between'>
                  <div className='flex items-center'>
                    <Icon
                      name={item?.icon || 'availablity'}
                      color={
                        currentStep === item?.title
                          ? COLORS.PRIMARY
                          : 'transparent'
                      }
                      className={`${item.margin && item.margin}
                            ${
                              currentStep === item?.title &&
                              currentStep === SETTINGS_SIDEBAR.CHANGE_PASSWORD
                                ? 'filledStroke'
                                : currentStep === item?.title &&
                                    currentStep !==
                                      SETTINGS_SIDEBAR.CHANGE_PASSWORD
                                  ? 'svgBlue'
                                  : 'transparent'
                            }`}
                    />
                    {item?.title === SETTINGS_SIDEBAR.LOGOUT ? (
                      <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger className='!outline-none'>
                          <TypographyP
                            size={16}
                            noBottom
                            classname={`${currentStep === item?.title && 'text-primary'} !mb-0 !outline-none leading-normal pr-[8px] ml-[9px]`}
                          >
                            {item.title}
                          </TypographyP>
                        </AlertDialogTrigger>

                        <CustomAlertBox
                          loading={loading}
                          setOpen={setOpen}
                          handleConfirm={handleLogout}
                        />
                      </AlertDialog>
                    ) : (
                      <TypographyP
                        size={16}
                        noBottom
                        classname={`${currentStep === item?.title && 'text-primary'} !mb-0 leading-normal pr-[8px] ml-[9px]`}
                      >
                        {item.title}
                      </TypographyP>
                    )}
                  </div>
                </div>
              </span>
            );
          })}
        </nav>
      </div>
      <div className='mt-5 w-full md:mt-0'>{renderStepComponent()}</div>
    </FlexBox>
  );
};

export default SettingsSidebar;
