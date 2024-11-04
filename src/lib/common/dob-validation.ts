import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const DATE_FORMAT = 'YYYY-MM-DD';

export const dateOfBirthValidator = (value?: string) => {
  if (!value) {
    return false;
  }
  const isValidDate = dayjs(value, DATE_FORMAT, true).isValid();
  if (!isValidDate) {
    return false;
  }
  const dob = dayjs(value, DATE_FORMAT, true);
  if (dob.isAfter(dayjs()) || dob.isBefore(dayjs().subtract(150, 'years'))) {
    return false;
  }

  return true;
};

export const validateDate = (value?: string) => {
  if (!value) {
    return true;
  }
  const isValidDate = dayjs(value, DATE_FORMAT, true).isValid();
  if (!isValidDate) {
    return false;
  }
  return true;
};
