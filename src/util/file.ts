export const getBase64EncodedFileType = (encodedFile: string) => {
  const [, type] = encodedFile.split(';')[0].split('/');
  return type;
};

export const getRawFileFromBase64EncodedFile = (encodedFile: string) =>
  Buffer.from(encodedFile.replace(/^data:image\/\w+;base64,/, ''), 'base64');
