import decamelizeKeys from 'decamelize-keys';

export const convertJsonToFormdata = (data: any) => {
  if (!data) {
    return;
  }
  const updatedData = decamelizeKeys(data);

  const formData = new FormData();

  Object.keys(updatedData)?.forEach((key) =>
    formData.append(key, updatedData?.[key]),
  );

  return formData;
};
