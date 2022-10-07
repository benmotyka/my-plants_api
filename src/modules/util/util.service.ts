import sharp from 'sharp';
import nanoid from 'nanoid';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  private RESIZED_IMAGE_SIZE_PX = 300;
  private USER_FRIENDLY_ID_ALPHABET =
    'ABCDEFGHKMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz';
  private USER_FRIENDLY_ID_LENGTH = 6;

  private generator = nanoid.customAlphabet(
    this.USER_FRIENDLY_ID_ALPHABET,
    this.USER_FRIENDLY_ID_LENGTH,
  );

  getBase64EncodedFileType(encodedFile: string): string {
    const [, type] = encodedFile.split(';')[0].split('/');
    return type;
  }

  getRawFileFromBase64EncodedFile(encodedFile: string): Buffer {
    return Buffer.from(
      encodedFile.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
  }

  async resizeImage(encodedFile: string): Promise<string> {
    try {
      const parts = encodedFile.split(';');
      const mimType = parts[0].split(':')[1];
      const imageData = parts[1].split(',')[1];

      const img = Buffer.from(imageData, 'base64');

      const resizedImageBuffer = await sharp(img)
        .resize(this.RESIZED_IMAGE_SIZE_PX, this.RESIZED_IMAGE_SIZE_PX)
        .toBuffer();

      const resizedImageData = resizedImageBuffer.toString('base64');
      return `data:${mimType};base64,${resizedImageData}`;
    } catch (error) {
      console.log(error);
      throw new Error('error-resizing-image');
    }
  }

  generateUserFriendlyId(): string {
    return this.generator();
  }
}
