'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';
import { FieldError } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import Icon from './custom-icon';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'outlined';
  label?: string;
  error?: FieldError;
  isContactNumber?: boolean;
  accept: string;
  id: string;
  onChangeInput: (file: File) => void;
  fieldValue?: File | null | undefined;
  onDelete: () => void;
  hidecross?: boolean;
}

const FileInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'secondary',
      label = '',
      isContactNumber = false,
      error,
      placeholder = '',
      accept,
      id,
      fieldValue,
      onChangeInput,
      onDelete = () => {},
      hidecross = false,
      ...props
    },
    ref,
  ) => {
    const [uploadedFile, setUploadedFile] = React.useState<File | undefined>();
    const inputVal = document.getElementById(id || 'id');
    const { t } = useTranslation();

    React.useEffect(() => {
      if (fieldValue) {
        setUploadedFile(fieldValue);
      }
    }, [fieldValue]);

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files) {
        const file: File = e.target.files[0];
        onChangeInput(file);
      }
    };

    return (
      <div className='relative'>
        <label htmlFor={id}>
          <FlexBox
            flex
            centerContent
            centerItems
            classname={`min-h-[58px] border-[1.7px] relative w-full cursor-pointer rounded-md border ${error ? 'border-error' : 'border-darkGray'} text-[18px] m-auto px-3`}
          >
            <FlexBox flex centerContent centerItems>
              <div>
                <Icon name='file-attach' color='transparent' />
              </div>
              {uploadedFile?.name || uploadedFile ? (
                <div className='grid grid-flow-col items-center justify-between !font-medium text-darkGray'>
                  <div
                    className='truncate'
                    title={
                      typeof uploadedFile === 'string'
                        ? uploadedFile
                        : uploadedFile?.name
                    }
                  >
                    {typeof uploadedFile === 'string'
                      ? uploadedFile
                      : uploadedFile?.name}
                  </div>
                  {!hidecross && (
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete();
                        setUploadedFile(undefined);
                        (inputVal as HTMLInputElement).value = '';
                      }}
                    >
                      <XIcon size={18} />
                    </span>
                  )}
                </div>
              ) : (
                <TypographyP
                  center
                  noBottom
                  primary
                  size={16}
                  classname='!font-normal text-darkGray truncate'
                >
                  {t('translation.addInsurance')}
                </TypographyP>
              )}
            </FlexBox>
          </FlexBox>
        </label>

        <input
          type='file'
          className='hidden'
          accept={accept}
          {...props}
          ref={ref}
          id={id}
          onChange={onChangeFile}
          placeholder={placeholder}
        />
      </div>
    );
  },
);

FileInput.displayName = 'FileInput';

export { FileInput };
