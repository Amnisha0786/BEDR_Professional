export const getImageUrl = (s3Url?: string, key?: string) => {
  if (s3Url && key) {
    return `${s3Url}${key}`;
  }
};
