'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { FieldPath, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FlexBox from '@/components/ui/flexbox';
import { getErrorMessage } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  CustomRadioGroup,
  CustomRadioGroupItem,
} from '@/components/custom-components/custom-radio';
import {
  CLOSE_FILE,
  COLOR_CODING,
  ISSUE_DESCRIPTION,
  REASON_TO_CANCEL,
  SOMETHING_WRONG_WITH,
} from '@/enums/file-in-progress';
import { AFFECTED_EYE } from '@/enums/create-patient';
import { closeFileWithReason } from '@/app/api/file-in-progress';
import { TCloseFileForm } from '@/models/types/file-in-progress';
import { closeFileFormSchema } from '@/models/validations/file-in-progress';

type TProps = {
  fileId?: string;
};

const defaultValues = {
  reasonToSkip: '',
};

const CloseFileWithReason = ({ fileId }: TProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<TCloseFileForm>({
    resolver: yupResolver(closeFileFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const onSubmit = useCallback(
    async (values: TCloseFileForm) => {
      try {
        if (!fileId) {
          return;
        }
        if (
          values?.reasonToSkip !==
          REASON_TO_CANCEL.DUE_TO_SOMETHING_WRONG_WITH_FILE
        ) {
          delete values?.affectedEye;
          delete values?.issueWith;
          delete values?.issueDescription;
        }
        setOpen(true);
        setLoading(true);
        const response = await closeFileWithReason({
          patientFileId: fileId,
          ...values,
        });
        if (response?.status !== 200) {
          toast.error(response?.data?.message || 'Something went wrong!');
        } else {
          setOpen(false);
          toast.success('File closed!');
          router.push('/todays-clinics');
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage || 'Something went wrong!');
      } finally {
        setLoading(false);
      }
    },
    [fileId],
  );

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  const setDefaultValue = (
    keyname: FieldPath<TCloseFileForm>,
    value: string,
  ) => {
    form.setValue(keyname, value);
  };

  const somethingWrongWithFile = () => {
    return (
      <FlexBox
        flex
        classname='w-full overflow-auto gap-5 border border-lightGray px-[28px] pb-5 pt-[10px]'
      >
        <FlexBox flex>
          <FormField
            control={form.control}
            name='issueWith'
            render={({ field }) => (
              <FormItem className='w-full flex-col'>
                <FormControl>
                  <CustomRadioGroup
                    onValueChange={(val) => {
                      field.onChange(val);
                     
                    }}
                    defaultValue={field.value}
                    className='flex flex-col gap-[16px]'
                  >
                    <FormItem>
                      <FormControl>
                        <CustomRadioGroupItem
                          value={SOMETHING_WRONG_WITH.FUNDUS_IMAGE}
                          checked={
                            field.value === SOMETHING_WRONG_WITH.FUNDUS_IMAGE
                          }
                          label={CLOSE_FILE.FUNDUS_IMAGE}
                          fieldColor={COLOR_CODING.RED}
                          labelClass='w-full'
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <CustomRadioGroupItem
                          value={SOMETHING_WRONG_WITH.OCT_VIDEO}
                          checked={
                            field.value === SOMETHING_WRONG_WITH.OCT_VIDEO
                          }
                          label={CLOSE_FILE.OCT_VIDEO}
                          fieldColor={COLOR_CODING.RED}
                          labelClass='w-full'
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <CustomRadioGroupItem
                          value={SOMETHING_WRONG_WITH.THICKNESS_MAP}
                          checked={
                            field.value === SOMETHING_WRONG_WITH.THICKNESS_MAP
                          }
                          label={CLOSE_FILE.THICKNESS_MAP}
                          fieldColor={COLOR_CODING.RED}
                          labelClass='w-full'
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <CustomRadioGroupItem
                          value={SOMETHING_WRONG_WITH.OPTIC_DISC_IMAGE}
                          checked={
                            field.value ===
                            SOMETHING_WRONG_WITH.OPTIC_DISC_IMAGE
                          }
                          label={CLOSE_FILE.OPTIC_DISC_IMAGE}
                          fieldColor={COLOR_CODING.RED}
                          labelClass='w-full'
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <CustomRadioGroupItem
                          value={SOMETHING_WRONG_WITH.VISUAL_TEST_FIELD}
                          checked={
                            field.value ===
                            SOMETHING_WRONG_WITH.VISUAL_TEST_FIELD
                          }
                          label={CLOSE_FILE.VISUAL_TEST_FIELD}
                          fieldColor={COLOR_CODING.RED}
                          labelClass='w-full'
                        />
                      </FormControl>
                    </FormItem>
                  </CustomRadioGroup>
                </FormControl>
                <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
              </FormItem>
            )}
          />
        </FlexBox>
        <FlexBox flex>
          <FormField
            control={form.control}
            name='affectedEye'
            render={({ field }) => (
              <FormItem className='w-full flex-col'>
                <FormControl>
                  <CustomRadioGroup
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    defaultValue={field.value}
                    className='flex flex-col gap-[16px]'
                  >
                    <FormItem>
                      <FormControl>
                        <CustomRadioGroupItem
                          value={AFFECTED_EYE.RIGHT}
                          checked={field.value === AFFECTED_EYE.RIGHT}
                          label={CLOSE_FILE.RIGHT_EYE}
                          fieldColor={COLOR_CODING.RED}
                          labelClass='w-full'
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <CustomRadioGroupItem
                          value={AFFECTED_EYE.LEFT}
                          checked={field.value === AFFECTED_EYE.LEFT}
                          label={CLOSE_FILE.LEFT_EYE}
                          fieldColor={COLOR_CODING.RED}
                          labelClass='w-full'
                        />
                      </FormControl>
                    </FormItem>

                    <FormItem>
                      <FormControl>
                        <CustomRadioGroupItem
                          value={AFFECTED_EYE.BOTH_EYES}
                          checked={field.value === AFFECTED_EYE.BOTH_EYES}
                          label={CLOSE_FILE.BOTH_EYES}
                          fieldColor={COLOR_CODING.RED}
                          labelClass='w-full'
                        />
                      </FormControl>
                    </FormItem>

                  </CustomRadioGroup>
                </FormControl>
                <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
              </FormItem>
            )}
          />
        </FlexBox>
        <FlexBox flex>
          <FormField
            control={form.control}
            name='issueDescription'
            render={({ field }) => (
              <FormItem className='w-full flex-col'>
                <FormControl>
                  <CustomRadioGroup
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    defaultValue={field.value}
                    className='flex flex-col gap-[16px]'
                  >
                    <FormItem>
                      <FormControl>
                        <CustomRadioGroupItem
                          value={ISSUE_DESCRIPTION.IS_MISSING}
                          checked={field.value === ISSUE_DESCRIPTION.IS_MISSING}
                          label={CLOSE_FILE.IS_MISSING}
                          fieldColor={COLOR_CODING.RED}
                          labelClass='w-full'
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormControl>
                        <CustomRadioGroupItem
                          value={ISSUE_DESCRIPTION.IS_POOR_QUALITY}
                          checked={
                            field.value === ISSUE_DESCRIPTION.IS_POOR_QUALITY
                          }
                          label={CLOSE_FILE.IS_POOR_QUALITY}
                          fieldColor={COLOR_CODING.RED}
                          labelClass='w-full'
                        />
                      </FormControl>
                    </FormItem>
                  </CustomRadioGroup>
                </FormControl>
                <FormMessage className='mb-1 mt-0.5 min-h-[21px]' />
              </FormItem>
            )}
          />
        </FlexBox>
      </FlexBox>
    );
  };

  return (
    <FlexBox flex classname='justify-end'>
      <FlexBox flex centerContent>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className='!outline-none'>
            <Button className='peer rounded-[4px] border border-error bg-white px-3 text-[16px] text-error !outline-none outline-none hover:bg-error hover:text-white focus:bg-error focus:text-white xs:text-[14px] md:!px-6'>
              <X className='mr-1 h-5 w-5 xs:h-4 xs:w-4' />
              Close file
            </Button>
          </DialogTrigger>
          <DialogContent
            onFocusOutside={(e) => e.preventDefault()}
            className={`max-h-screen w-full max-w-[620px] justify-center overflow-y-scroll px-5 pb-[25px] pt-[34px] md:max-w-[656px]`}
            oulinedCross
          >
            <DialogHeader>
              <DialogTitle className='text-center text-[16px] font-medium text-darkGray'>
                Please say why you are closing the file without finishing it
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className='overflow-y-auto'
              >
                <DialogDescription>
                  <FormField
                    control={form.control}
                    name='reasonToSkip'
                    render={({ field }) => (
                      <FormItem className='w-full flex-col'>
                        <FormControl>
                          <CustomRadioGroup
                            onValueChange={(val) => {
                              field.onChange(val);
                              if (
                                val ===
                                REASON_TO_CANCEL.DUE_TO_SOMETHING_WRONG_WITH_FILE
                              ) {
                                setDefaultValue(
                                  'issueWith',
                                  SOMETHING_WRONG_WITH.FUNDUS_IMAGE,
                                );
                                setDefaultValue(
                                  'affectedEye',
                                  AFFECTED_EYE.RIGHT,
                                );
                                setDefaultValue(
                                  'issueDescription',
                                  ISSUE_DESCRIPTION.IS_MISSING,
                                );
                              }
                            }}
                            defaultValue={field.value}
                            className='flex w-full flex-col items-center justify-center gap-[16px]'
                          >
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={
                                    REASON_TO_CANCEL.DUE_TO_RUN_OUT_OF_TIME
                                  }
                                  checked={
                                    field.value ===
                                    REASON_TO_CANCEL.DUE_TO_RUN_OUT_OF_TIME
                                  }
                                  label={CLOSE_FILE.RUN_OUT_OF_TIME}
                                  fieldColor={COLOR_CODING.RED}
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={
                                    REASON_TO_CANCEL.DUE_TO_SOMETHING_WRONG_WITH_FILE
                                  }
                                  checked={
                                    field.value ===
                                    REASON_TO_CANCEL.DUE_TO_SOMETHING_WRONG_WITH_FILE
                                  }
                                  label={CLOSE_FILE.SOMETHING_WRONG_WITH_FILE}
                                  fieldColor={COLOR_CODING.RED}
                                />
                              </FormControl>
                            </FormItem>
                            {form?.watch('reasonToSkip') ===
                              REASON_TO_CANCEL.DUE_TO_SOMETHING_WRONG_WITH_FILE &&
                              somethingWrongWithFile()}
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={
                                    REASON_TO_CANCEL.DUE_TO_OTSIDE_AREA_OF_EXPERTISE
                                  }
                                  checked={
                                    field.value ===
                                    REASON_TO_CANCEL.DUE_TO_OTSIDE_AREA_OF_EXPERTISE
                                  }
                                  label={CLOSE_FILE.OUTSIDE_AREA_OF_EXPERTISE}
                                  fieldColor={COLOR_CODING.RED}
                                />
                              </FormControl>
                            </FormItem>
                            <FormItem className='!flex-none'>
                              <FormControl>
                                <CustomRadioGroupItem
                                  value={REASON_TO_CANCEL.DUE_TO_MEDIA_OPACITY}
                                  checked={
                                    field.value ===
                                    REASON_TO_CANCEL.DUE_TO_MEDIA_OPACITY
                                  }
                                  label={CLOSE_FILE.MEDIA_OPACITY}
                                  fieldColor={COLOR_CODING.RED}
                                />
                              </FormControl>
                            </FormItem>
                          </CustomRadioGroup>
                        </FormControl>
                        <FormMessage className='mb-2 mt-1 min-h-[21px] text-center' />
                      </FormItem>
                    )}
                  />
                </DialogDescription>
                <DialogFooter className='m-auto w-[70%] justify-center'>
                  <Button
                    type='button'
                    disabled={loading}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                    }}
                    className='w-full border-error !bg-error text-[16px] text-white outline-none'
                  >
                    Cancel
                  </Button>
                  <Button
                    type='submit'
                    className='w-full border-[1.7px] border-error !bg-white text-[16px] text-error outline-none hover:text-error hover:opacity-80 focus:text-error'
                    disabled={loading}
                    loading={loading}
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </FlexBox>
    </FlexBox>
  );
};

export default CloseFileWithReason;
