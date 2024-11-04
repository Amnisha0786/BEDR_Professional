export const openUploadDialog = (
  fileType?: string,
  accept?: string,
): Promise<FileList> => {
  return new Promise<FileList>((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept =
      accept ??
      `${fileType === 'video/mp4' || fileType === 'video' ? `${fileType} , .avi, video` : `${fileType}`}`;
    input.classList.add('hidden');
    document.body.appendChild(input);
    input.click();
    input.addEventListener('change', (e: any) => {
      resolve(e.target.files as FileList);
      document.body.removeChild(input);
    });
  });
};

export const openDownloadDialog = ({
  url,
  data,
  filename,
}: {
  url?: string;
  data?: ArrayBuffer;
  filename: string;
}): void => {
  const downloadUrl: any = url || data;
  const a = document.createElement('a');

  if (typeof a.download === 'undefined') {
    window.location = downloadUrl;
  } else {
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  }

  document.body.removeChild(a);
};
