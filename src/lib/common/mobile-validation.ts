export const mobileNumberValidator = (
  value: string,
  context: { parent: { callingCode: string } },
) => {
  const callingCode = context.parent.callingCode || '';
  const combinedNumber = value.replace(callingCode, '');
  const phone = combinedNumber.replace(/\s/g, '');
  if (phone) {
    return /^[0-9]{5,10}$/.test(phone);
  } else {
    return false;
  }
};

export const getMobileNumber = (phone: string, callingCode: string) => {
  const combinedNumber = phone.replace(callingCode, '');
  const phoneNumber = combinedNumber.replace(/\s/g, '');
  return phoneNumber;
};
