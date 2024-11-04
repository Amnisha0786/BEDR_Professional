export type TDoctorsList = {
  doctors: TDoctor[];
  otalDoctors: number;
};

export type TDoctor = {
  callingCode: string;
  dateOfBirth: string;
  description: string;
  email: string;
  firstName: string;
  gmcNumber: string;
  hospitalName: string;
  id: string;
  insuranceCertificate: string;
  lastName: string;
  mobileNumber: string;
  postCode: string;
  profilePicture: string;
  role: string;
  subSpecialties: string[];
};
