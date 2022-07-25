import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Attachment, Plant } from '@prisma/client';
import { S3 } from 'aws-sdk';
import { PrismaService } from '../prisma/prisma.service';
import { FileUploadException } from './exceptions/FileUpload.exception';
import { v4 as uuid } from 'uuid';

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

  async uploadFile(file: any, plant: Plant): Promise<Attachment> {
    try {
      const rawImage = Buffer.from(
        file.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );

      const s3Params = {
        Bucket: this.configService.get('S3_BUCKET_NAME'),
        Key: uuid(),
        Body: rawImage,
        // ACL: 'public-read',
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
