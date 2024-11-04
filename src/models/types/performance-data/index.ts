import { PERFORMANCE_DATA_FOR } from "@/enums/performance-data";

export type TPerformanceData = {
  filesDiagnosed: number;
  percentageOfCareDelegatedFiles: number;
  percentageOfFilesDiagnosedByEndOfNextDay: number;
  percentageOfNonUrgentReferrals: number;
  percentageOfReassureAndDischargedFiles: number;
  percentageOfUrgentReferrals: number;
  totalFilesDiagnosed: number;
};
