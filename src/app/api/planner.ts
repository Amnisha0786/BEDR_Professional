import { API_URLS } from './api-constants';
import { postAPIRequestWithEncryption } from './axios';

type TReadClinicTermsConditions = {
  clinicId: string;
};

type TGetAvailableBookings = {
  startDate?: string;
  endDate?: string;
};

type TCreateBookings = {
  filesToApprove: number;
  filesToDiagnose: number;
  plannerDate: string;
  clinicId: string;
};

type TCancelBookings = {
  bookingId: string;
};

type TGetBookings = {
  page?: number;
  offset?: number;
};

export const getClinics = async () => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_CLINICS_LIST,
    data: {},
  });
};

export const readClinicTermsConditions = async (
  data: TReadClinicTermsConditions,
) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.READ_CLINIC_TERMS_CONDITIONS,
    data,
  });
};

export const getAvailableBookingsList = async (data: TGetAvailableBookings) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_AVAILABLE_BOOKINGS,
    data,
  });
};

export const createBooking = async (data: TCreateBookings) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.CREATE_BOOKING,
    data,
  });
};

export const cancelBooking = async (data: TCancelBookings) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.CANCEL_BOOKING,
    data,
  });
};

export const getBookings = async (data: TGetBookings) => {
  return await postAPIRequestWithEncryption({
    url: API_URLS.GET_BOOKINGS,
    data,
  });
};
