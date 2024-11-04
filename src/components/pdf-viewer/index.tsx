'use client';

import React, { useCallback, useState } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Page as PDFPage } from 'react-pdf';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import Loader from '../custom-loader';
import { TypographyP } from '../ui/typography/p';
import FlexBox from '../ui/flexbox';
import { Button } from '../ui/button';
import { COLORS } from '@/lib/constants/color';
import NoDataFound from '../custom-components/custom-no-data-found';

type TProps = {
  fileUrl: string;
  pagination?: boolean;
  isSettingsTerms?: boolean;
};

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PdfViewer = ({
  fileUrl,
  pagination = false,
  isSettingsTerms,
}: TProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    [],
  );

  return (
    <div className='my-auto'>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <Loader size={30} screen={isSettingsTerms ? 'centered' : 500} />
        }
        error={
          <NoDataFound
            heading={t('translation.failedToLoadPdf')}
            title=''
            hideButton
          />
        }
        noData={
          <NoDataFound title={t('translation.nofileSpecified')} hideButton />
        }
      >
        <PDFPage
          pageNumber={currentPage}
          scale={3}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
      {(pagination || numPages > 1) && (
        <FlexBox flex centerContent centerItems classname='gap-3'>
          <Button
            variant={'secondary'}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage < 2}
          >
            <ArrowLeftCircleIcon color={COLORS.PRIMARY} />
          </Button>
          {numPages > 0 && (
            <TypographyP noBottom size={18}>
              {currentPage}/{numPages}
            </TypographyP>
          )}
          <Button
            variant={'secondary'}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === numPages}
          >
            <ArrowRightCircleIcon color={COLORS.PRIMARY} />
          </Button>
        </FlexBox>
      )}
    </div>
  );
};

export default PdfViewer;
