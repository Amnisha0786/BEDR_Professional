'use client';

import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import DiagnosisReport from '../file-in-progress/diagnosis-report';
import { TCompletedFiles } from '@/models/types/completed-files';

type IProp = {
  patientFileDetails?: TCompletedFiles | undefined;
  removeShadow?: boolean;
};

const CompletedFilesModal = ({ patientFileDetails, removeShadow }: IProp) => {
  return (
    <DialogContent
      autoFocus={false}
      className={`max-h-[80%] !max-w-[50rem] gap-0 border-none !p-0 px-0 pb-[25px] text-left outline-none`}
    >
      {patientFileDetails && (
        <div className='py-[50px] max-ms:px-[20px] ms:px-[30px]'>
          <DiagnosisReport
            fileId={patientFileDetails?.id}
            viewOnly={true}
            diagnosisReportHtml={patientFileDetails?.diagnosisFormHtml}
            removeShadow={removeShadow}
          />
        </div>
      )}
    </DialogContent>
  );
};

export default CompletedFilesModal;
