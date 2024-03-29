import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Attachment, AttachmentType } from '@prisma/client';

import { PrismaService } from '@modules/prisma/prisma.service';
import { Exception } from '@enums/Exception';
import { UtilService } from '@modules/util/util.service';

@Injectable()
export class AttachmentService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private utilService: UtilService,
  ) {}
  private readonly logger = new Logger(AttachmentService.name);

  private readonly s3Client = new S3({
    accessKeyId: this.configService.get('S3_ACCESS_KEY'),
    secretAccessKey: this.configService.get('S3_SECRET_KEY'),
  });

  async uploadFile(base64EncodedFile: string): Promise<string> {
    const availableFileTypes = ['png', 'jpg', 'jpeg', 'heic'];
    const fileType =
      this.utilService.getBase64EncodedFileType(base64EncodedFile);
    this.logger.debug(`Starting uploading file of type: ${fileType}`);

    if (!availableFileTypes.includes(fileType)) {
      throw new BadRequestException(Exception.INVALID_FILE);
    }
    this.logger.debug(`Resizing image`);
    const resizedImage = await this.utilService.resizeImage(base64EncodedFile);

    this.logger.debug(`Image resized, getting raw image data from it`);
    const rawImage =
      this.utilService.getRawFileFromBase64EncodedFile(resizedImage);

    const s3Params = {
      Bucket: this.configService.get('S3_BUCKET_NAME'),
      Key: uuid(),
      Body: rawImage,
    };

    this.logger.debug(`Uploading image to s3`);
    const result = await this.s3Client.upload(s3Params).promise();

    return result.Location;
  }

  async createAttachment({
    plantId,
    userId,
    url,
    attachmentType,
  }: {
    plantId: string;
    userId: string;
    url: string;
    attachmentType: AttachmentType;
  }): Promise<Attachment> {
    this.logger.debug(`Creating attachment`);
    return await this.prisma.attachment.create({
      data: {
        plantId,
        url,
        userId,
        attachmentType,
      },
    });
  }

  async getAttachmentsByPlantId(id: string): Promise<Attachment[]> {
    return await this.prisma.attachment.findMany({
      where: {
        plantId: id,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAttachmentById(id: string): Promise<Attachment> {
    return await this.prisma.attachment.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            deviceId: true,
          },
        },
      },
    });
  }

  async softDeleteAttachmentById(id: string): Promise<Attachment> {
    return await this.prisma.attachment.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
