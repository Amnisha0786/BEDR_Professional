import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface UserData {
  practiceName?: string;
  contactPerson?: string;
  contactPersonEmail?: string;
  icoNumber?: string;
  practiceAddress?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber: string;
  postCode: string;
  callingCode: string;
  dateOfBirth: string;
  email: string;
  gocNumber?: string;
  gmcNumber?: string;
  id: string;
  optometristId: string;
  practiseId?: string;
  role: string;
  s3BucketUrl: string;
  insuranceCertificate?: string;
  termsAndConditions: boolean;
  profilePicture?: string;
  chatDecryptionKey: string;
  chatEncryptionKey: string;
  stripePublishableKey: string;
  hospitalName?: string;
  description?: string;
  subSpecialties?: string[];
  clinicTermsAndConditions?: number;
  stripeAccountLinked?: boolean;
  unreadNotificationsCount?: number;
  dicomViewerDomain?: string;
  insuranceRenewalDate?: string;
  salutation?: string;
}

interface UserDetailResponse {
  data: UserData;
  message?: string;
  status: number;
}

interface UserProfile {
  data: UserDetailResponse | null;
  loading: false;
  error: null;
}

const initialState: UserProfile = {
  data: null,
  loading: false,
  error: null,
};

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    userProfile: (state, action: PayloadAction<UserDetailResponse>) => {
      (state.data = action?.payload), (state.loading = false);
    },
    resetUser: () => initialState,
  },
});

export const { userProfile, resetUser } = userProfileSlice.actions;
