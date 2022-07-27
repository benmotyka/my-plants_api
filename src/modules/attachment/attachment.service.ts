import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Attachment, Plant } from '@prisma/client';
import { S3 } from 'aws-sdk';
import { PrismaService } from '../prisma/prisma.service';
import { FileUploadException } from './exceptions/FileUpload.exception';
import { v4 as uuid } from 'uuid';
import {
  getBase64EncodedFileType,
  getRawFileFromBase64EncodedFile,
  resizeImage
} from 'src/util/file';
import { InvalidFileException } from './exceptions/InvalidFile.exception';

@Injectable()
export class AttachmentService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  private readonly s3Client = new S3({
    accessKeyId: this.configService.get('S3_ACCESS_KEY'),
    secretAccessKey: this.configService.get('S3_SECRET_KEY'),
  });

  async uploadFile(
    base64EncodedFile: string,
    plant: Plant,
  ): Promise<Attachment> {
    try {
      const availableFileTypes = ['png', 'jpg', 'jpeg', 'heic'];
      if (
        !availableFileTypes.includes(
          getBase64EncodedFileType(base64EncodedFile),
        )
      ) {
        throw new InvalidFileException();
      }
      const resizedImage = await resizeImage(base64EncodedFile)

      const rawImage = getRawFileFromBase64EncodedFile(resizedImage);

      const s3Params = {
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: uuid(),
        Body: rawImage,
      };

      const result = await this.s3Client.upload(s3Params).promise();

      return await this.prisma.attachment.create({
        data: {
          plantId: plant.id,
          url: result.Location,
          attachment_type: 'plant_picture',
        },
      });
    } catch (error) {
      console.log(error);
      throw new FileUploadException();
    }
  }
}
