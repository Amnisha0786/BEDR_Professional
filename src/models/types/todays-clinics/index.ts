type TFiles = {
  clinicId: string;
  clinicName: string;
  fileCount: number;
  fileStatus: string;
};

type TClinic = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isEnabled: boolean;
};

export type TBooking = {
  bookingDate: string;
  clinic: TClinic;
  createdAt: string;
  filesToApprove: number;
  filesToDiagnose: number;
  id: string;
  isEnabled: boolean;
  updatedAt: string;
  userRole: string;
};

export type TAvailableConsultants = {
  date: string;
  firstName: string;
  id: string;
  lastName: string;
  profilePicture?: string;
  role: string;
  active?: boolean;
  lastMessage?: string;
};

export type TBookingAlert = {
  alertStatus: string;
  alertType: string;
  date: string;
  id: string;
};

export type TTodaysClinics = {
  completedFiles: number;
  files: TFiles[];
  bookings: TBooking[];
  availableConsultantsReaders: TAvailableConsultants[];
  bookingAlerts: TBookingAlert[];
};

export type TOpening = {
  status: string;
  id: string;
};
