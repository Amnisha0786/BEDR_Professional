'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import Image from 'next/image';

import {
  getNonUrgentFiles,
  getResubmissionFiles,
  getUnreadFiles,
  getUrgentFiles,
} from '@/app/api/overview';
import SharedTable from '@/components/common-layout/shared-table';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FlexBox from '@/components/ui/flexbox';
import { TypographyH2 } from '@/components/ui/typography/h2';
import { FILE_STATUSES } from '@/enums/file-status-tracker';
import { DESCRIPTION, ISSUE, OVERVIEW_FILE_NAME } from '@/enums/overview';
import { getErrorMessage } from '@/lib/utils';
import { TViewFiles } from '@/models/types/overview';
import { TypographyP } from '@/components/ui/typography/p';

const ViewDetails = () => {
  const [loading, setLoading] = useState(false);
  const [viewDetails, setViewDetails] = useState<TViewFiles[]>();

  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();

  const fetchViewDetails = useCallback(async () => {
    if (!params?.fileName) {
      return;
    }
    setLoading(true);
    try {
      let response;
      if (params?.fileName === OVERVIEW_FILE_NAME.UNREAD_ACTION) {
        response = await getUnreadFiles();
      } else if (params?.fileName === OVERVIEW_FILE_NAME.URGENT_ACTION) {
        response = await getUrgentFiles();
      } else if (params?.fileName === OVERVIEW_FILE_NAME.NON_URGENT_ACTION) {
        response = await getNonUrgentFiles();
      } else {
        response = await getResubmissionFiles();
      }

      if (response?.data?.status !== 200) {
        toast.error(
          response?.data?.message || t('translation.somethingWentWrong'),
        );
        return;
      }
      const responseData = response?.data?.data;
      setViewDetails(responseData);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage || t('translation.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchViewDetails();
  }, [fetchViewDetails]);

  const pageHeading = useMemo(() => {
    let heading;
    if (params?.fileName === OVERVIEW_FILE_NAME.UNREAD_ACTION) {
      heading = t('translation.unreadReports');
    } else if (params?.fileName === OVERVIEW_FILE_NAME.URGENT_ACTION) {
      heading = t('translation.urgentReferralsAction');
    } else if (params?.fileName === OVERVIEW_FILE_NAME.NON_URGENT_ACTION) {
      heading = t('translation.nonUrgentAction');
    } else {
      heading = t('translation.filesForResubmission');
    }
    return heading;
  }, [params]);

  const actionColumn: ColumnDef<TViewFiles> = useMemo(() => {
    let column: ColumnDef<TViewFiles>;
    if (params?.fileName === OVERVIEW_FILE_NAME.UNREAD_ACTION) {
      column = {
        accessorKey: 'actionToBeTakenForLeftEye',
        header: t('translation.actionRequired'),
        cell: ({ row }) => {
          const actionRequiredForLefteye =
            FILE_STATUSES.find(
              (item) =>
                row?.original?.actionToBeTakenForLeftEye === item?.value,
            )?.label || row?.original?.actionToBeTakenForLeftEye;
          const actionRequiredForRighteye =
            FILE_STATUSES.find(
              (item) =>
                row?.original?.actionToBeTakenForRightEye === item?.value,
            )?.label || row?.original?.actionToBeTakenForRightEye;
          return (
            <>
              <div className='bottom-2 flex min-w-[300px] max-w-[300px] flex-col gap-1'>
                {actionRequiredForLefteye && (
                  <FlexBox flex classname='gap-2 items-start'>
                    <TypographyP
                      size={16}
                      primary
                      noBottom
                      classname='min-w-[80px]'
                    >
                      Left eye:
                    </TypographyP>
                    <FlexBox
                      flex
                      classname='gap-3 max-w-[300px] truncate capitalize'
                    >
                      <span title={actionRequiredForLefteye}>
                        {actionRequiredForLefteye || ''}
                      </span>
                    </FlexBox>
                  </FlexBox>
                )}
                {actionRequiredForRighteye &&
                  actionRequiredForRighteye?.length > 0 && (
                    <FlexBox flex classname='gap-2 items-start'>
                      <TypographyP
                        noBottom
                        size={16}
                        primary
                        classname='min-w-[80px]'
                      >
                        Right eye:
                      </TypographyP>
                      <FlexBox
                        flex
                        classname='gap-3 max-w-[300px] truncate capitalize'
                      >
                        <span title={actionRequiredForRighteye}>
                          {actionRequiredForRighteye || ''}
                        </span>
                      </FlexBox>
                    </FlexBox>
                  )}
              </div>
            </>
          );
        },
      };
    } else if (params?.fileName === OVERVIEW_FILE_NAME.FILE_RESUBMISSION) {
      column = {
        accessorKey: 'issueWith',
        header: t('translation.issue'),
        cell: ({ row }) => {
          const fileIssue =
            ISSUE?.find((item) => item?.value === row?.getValue('issueWith'))
              ?.label ||
            row?.getValue('issueWith') ||
            '';
          const issueDescription =
            DESCRIPTION?.find(
              (item) => item?.value === row?.original?.issueDescription,
            )?.label ||
            row?.original?.issueDescription ||
            '';
          return (
            <div className='w-[250px] truncate'>
              {`${fileIssue} ${issueDescription}`}
            </div>
          );
        },
      };
    } else {
      column = {
        accessorKey: 'receivedAt',
        header: t('translation.actionRequiredBy'),
        cell: ({ row }) => {
          const submissionDate = row?.original?.receivedAt;
          const isMoreThan24HoursAgo =
            dayjs().diff(dayjs(submissionDate), 'hour') >= 24;
          return (
            <div className='w-[120px] truncate capitalize'>
              {isMoreThan24HoursAgo ? 'Yesterday' : 'Today'}
            </div>
          );
        },
      };
    }
    return column;
  }, [viewDetails, params]);

  const fileResubmissionColumns: ColumnDef<TViewFiles>[] = [
    {
      accessorKey: 'receivedAt',
      header: t('translation.dateReceived'),
      cell: ({ row }) => (
        <div className='w-[120px] truncate capitalize'>
          {row?.getValue('receivedAt')
            ? dayjs(row?.getValue('receivedAt')).format('DD MMM, YYYY')
            : '-'}
        </div>
      ),
    },
    {
      accessorKey: 'patientLastName',
      header: t('translation.patientSurname'),
      cell: ({ row }) => (
        <div className='w-[100px] truncate capitalize'>
          {row?.getValue('patientLastName') || ''}
        </div>
      ),
    },
    {
      accessorKey: 'patientFirstName',
      header: t('translation.patientFirstName'),
      cell: ({ row }) => (
        <div className='w-[100px] truncate capitalize'>
          {row?.getValue('patientFirstName') || ''}
        </div>
      ),
    },
    {
      accessorKey: 'optometristFirstName',
      header: t('translation.submittedByOptom'),
      cell: ({ row }) => (
        <div className='w-[150px] truncate capitalize'>
          {`${row?.getValue('optometristFirstName') || ''} ${row?.original?.optometristLastName || ''}`}
        </div>
      ),
    },
    {
      ...actionColumn,
    },
  ];

  const commonColumns: ColumnDef<TViewFiles>[] = [
    ...fileResubmissionColumns,
    {
      accessorKey: '',
      header: t('translation.action'),
      cell: ({ row }) => {
        return (
          <div
            className={`w-[80px] cursor-pointer text-primary underline hover:opacity-85`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/overview/view/${params?.fileName}/${row?.original?.id}`,
              );
            }}
          >
            {t('translation.view')}
          </div>
        );
      },
    },
  ];

  return (
    <div className='px-[30px] py-[30px] md:px-[56px]'>
      <Card className='w-full p-3'>
        <FlexBox flex centerItems classname='justify-between'>
          <FlexBox classname='flex'>
            <div className='mr-[12px] flex h-[30px] w-[30px] justify-center rounded-full bg-lightPrimary'>
              <Image
                src='../../assets/overview-small.svg'
                alt={t('translation.overview')}
                width={18}
                height={14}
                className='m-auto'
              />
            </div>
            <TypographyH2 size={18} classname='capitalize'>
              {pageHeading}
            </TypographyH2>
          </FlexBox>
          <Button
            variant='outline'
            onClick={() => router.back()}
            className='bg-transparent text-[14px]'
          >
            {t('translation.back')}
          </Button>
        </FlexBox>
      </Card>
      <Card className='mt-[30px] min-h-[300px] p-5'>
        <SharedTable
          data={viewDetails || []}
          columns={
            params?.fileName === OVERVIEW_FILE_NAME.FILE_RESUBMISSION
              ? fileResubmissionColumns
              : commonColumns
          }
          isOverviewFilesTable={true}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default ViewDetails;
