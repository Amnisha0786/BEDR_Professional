import React, { Dispatch, SetStateAction } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import Loader from '../custom-loader';
import NoDataWithLogo from '../no-data-with-logo';
import { cn } from '@/lib/utils';
import { TypographyP } from '../ui/typography/p';

type TTableProps = {
  data: any[];
  columns: ColumnDef<any>[];
  loading?: boolean;
  sorting?: SortingState;
  setSorting?: Dispatch<SetStateAction<SortingState>>;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  setColumnVisibility?: Dispatch<SetStateAction<VisibilityState>>;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
  columnFilters?: ColumnFiltersState;
  columnVisibility?: VisibilityState;
  rowSelection?: RowSelectionState;
  cellPadding?: number;
  headerLabelClass?: string;
  noResultsMessage?: string;
  isOverviewFilesTable?: boolean;
};

const SharedTable = ({
  data,
  columns,
  sorting,
  setSorting,
  setColumnFilters,
  setColumnVisibility,
  setRowSelection,
  columnFilters,
  columnVisibility,
  rowSelection = {},
  loading = false,
  cellPadding = 4,
  headerLabelClass,
  isOverviewFilesTable,
  noResultsMessage = 'No results.',
}: TTableProps) => {
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Table>
      <TableHeader>
        {table?.getHeaderGroups()?.map((headerGroup) => (
          <TableRow
            className='border-none text-[18px] font-medium !text-darkGray'
            key={headerGroup.id}
          >
            {headerGroup?.headers?.map((header, index) => {
              return (
                <TableHead
                  className={cn(
                    'bg-backgroundGray py-[8px] leading-normal !text-darkGray',
                    headerLabelClass,
                  )}
                  key={index}
                >
                  {header?.isPlaceholder
                    ? null
                    : flexRender(
                        header.column?.columnDef?.header,
                        header?.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      {loading ? (
        <TableRow className='border-none hover:bg-transparent'>
          <TableCell colSpan={columns.length}>
            <Loader size={15} screen={'medium'} />
          </TableCell>
        </TableRow>
      ) : (
        <TableBody>
          {table?.getRowModel()?.rows?.length ? (
            table?.getRowModel()?.rows?.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row?.getIsSelected() && 'selected'}
                className='!border-lightGray text-[16px] font-normal !text-darkGray'
              >
                {row?.getVisibleCells()?.map((cell) => (
                  <TableCell
                    key={cell?.id}
                    cellPadding={cellPadding}
                    className={`${index === 0 ? '!pt-[30px]' : '!pt-[15px]'} !pb-[8px]`}
                  >
                    {flexRender(
                      cell?.column?.columnDef?.cell,
                      cell?.getContext(),
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className='h-24 text-center text-[18px] font-medium leading-normal text-gray'
              >
                {isOverviewFilesTable ? (
                  <TypographyP classname='!text-error mt-10'>
                    No outstanding tasks to do
                  </TypographyP>
                ) : (
                  <NoDataWithLogo />
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      )}
    </Table>
  );
};

export default SharedTable;
