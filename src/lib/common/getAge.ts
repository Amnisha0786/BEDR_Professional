import dayjs from 'dayjs';

export const getAge = (dob: string) => {
  const now = dayjs();

  const age = now.diff(dob, 'year');
  return age;
};
