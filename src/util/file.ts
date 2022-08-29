import sharp from 'sharp';

const RESIZED_IMAGE_SIZE_PX = 300;

export const getBase64EncodedFileType = (encodedFile: string): string => {
  const [, type] = encodedFile.split(';')[0].split('/');
  return type;
};

export const getRawFileFromBase64EncodedFile = (encodedFile: string): Buffer =>
  Buffer.from(encodedFile.replace(/^data:image\/\w+;base64,/, ''), 'base64');

export const resizeImage = async (encodedFile: string): Promise<string> => {
  try {
    const parts = encodedFile.split(';');
    const mimType = parts[0].split(':')[1];
    const imageData = parts[1].split(',')[1];

    const img = Buffer.from(imageData, 'base64');

    const resizedImageBuffer = await sharp(img)
      .resize(RESIZED_IMAGE_SIZE_PX, RESIZED_IMAGE_SIZE_PX)
      .toBuffer();

    const resizedImageData = resizedImageBuffer.toString('base64');
    return `data:${mimType};base64,${resizedImageData}`;
  } catch (error) {
    console.log(error);
    throw new Error('error-resizing-image');
  }
};
