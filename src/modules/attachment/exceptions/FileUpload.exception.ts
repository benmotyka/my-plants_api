import { BadRequestException } from '@nestjs/common';

export class FileUploadException extends BadRequestException {
  constructor() {
    super('error-uploading-file');
  }
}
