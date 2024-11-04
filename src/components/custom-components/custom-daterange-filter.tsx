'use client';

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { DateRange } from 'react-day-picker';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

import { Button } from '@/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Calendar } from '../ui/calendar';
import FlexBox from '../ui/flexbox';
import { DIAGNOSIS_OPTIONS } from '@/enums/file-in-progress';

type TProps = {
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
  handleClickOk?: (selectedDate: DateRange) => void;
  selectedDiagnosis?: string;
  setSelectedDiagnosis?: Dispatch<SetStateAction<string | undefined>>;
  hideDiagnosis?: boolean;
  refetch?: () => void;
  isDisabled?: boolean;
};

export function FilterDateRangeDropdown({
  dateRange,
  selectedDiagnosis,
  setDateRange,
  handleClickOk,
  setSelectedDiagnosis,
  hideDiagnosis = false,
  refetch = () => {},
  isDisabled = false,
}: TProps) {
  const [selectedDates, setSelecetedDates] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleCalendarSelect = (selectedDateRange: DateRange | undefined) => {
    setSelecetedDates(selectedDateRange);
    setIsOpen(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleOpenChange = () => {
    if (!calendarRef?.current) {
      setIsOpen(!isOpen);
    }
  };

  const handleOkClick = () => {
    if (!selectedDates?.from || !selectedDates?.to) {
      return;
    }
    setSelecetedDates(selectedDates);
    setDateRange(selectedDates);
    handleClickOk?.(selectedDates);
    setIsOpen(false);
  };



  const handleClickClear = () => {
    if (!selectedDates?.from || !selectedDates?.to) {
      return;
    }
    setDateRange(undefined)
    setSelecetedDates(undefined);
    handleClickOk?.({from: undefined ,to: undefined});
  }

  useEffect(() => {
    setSelecetedDates(dateRange);
  }, [isOpen]);


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDiagnosisChange = (value: string) => {
    setSelectedDiagnosis?.(value);
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange} open={isOpen}>
      <DropdownMenuTrigger
        asChild
        className={`focus!bg-white outline-none hover:bg-white`}
      >
        <Button
          variant='ghost'
          className={`justify-between border bg-white focus:!text-primary md:w-[133px] ${selectedDiagnosis || dateRange?.from ? '!border-primary text-primary' : '!border-lightGray text-darkGray'}`}
          disabled={isDisabled}
        >
          <FlexBox flex centerItems justify='between' classname='mr-2'>
            <span className='me-1'>
              <Filter size={15} />
            </span>
            <span className='text-[16px] font-normal'>Filters</span>{' '}
          </FlexBox>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 !gap-5 border-none'>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              className={`!px-3 !py-2 ${!hideDiagnosis && 'mb-1'} hover:!bg-lightPrimary focus:text-primary ${dateRange && '!bg-lightPrimary text-primary'}`}
            >
              Date
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                ref={calendarRef}
                className='border-none outline-none hover:!bg-white'
              >
                <DropdownMenuItem className='border-none hover:!bg-white'>
                  <Calendar
                    mode='range'
                    selected={{
                      from: selectedDates?.from,
                      to: selectedDates?.to,
                    }}
                    onSelect={handleCalendarSelect}
                    className='rounded-md hover:!bg-white'
                    captionLayout='dropdown-buttons'
                    showOutsideDays={false}
                    footer={
                      <FlexBox
                        flex
                        justify='between'
                        classname='mt-2 text-darkGray text-[12px] font-semibold'
                      >
                        <div
                          onClick={handleClickClear}
                          className='cursor-pointer'
                        >
                          CLEAR
                        </div>
                        <FlexBox flex justify='between' classname='gap-[10px]'>
                          <div
                            onClick={() => {
                              setDateRange(undefined);
                              setIsOpen(false);
                              refetch();
                            }}
                            className='cursor-pointer'
                          >
                            CLOSE
                          </div>
                          <div
                            onClick={handleOkClick}
                            className='cursor-pointer'
                          >
                            OK
                          </div>
                        </FlexBox>
                      </FlexBox>
                    }
                  />
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        {!hideDiagnosis && (
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger
                className={`!px-3 !py-2 hover:!bg-lightPrimary focus:text-primary ${selectedDiagnosis && '!bg-lightPrimary text-primary'}`}
              >
                Diagnosis
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='border-none outline-none hover:!bg-white'>
                  {DIAGNOSIS_OPTIONS.map((option, index) => (
                    <DropdownMenuItem
                      key={index}
                      className={`cursor-pointer border-none ${selectedDiagnosis === option.value && '!bg-lightPrimary text-primary'}`}
                      onClick={() => handleDiagnosisChange(option?.value)}
                    >
                      {option?.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
