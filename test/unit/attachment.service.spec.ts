import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { AttachmentService } from '@modules/attachment/attachment.service';
import { PrismaService } from '@modules/prisma/prisma.service';
import * as fileUtils from '@util/file';
import { BadRequestException } from '@nestjs/common';

describe('AttachmentService', () => {
  let attachmentService: AttachmentService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AttachmentService, ConfigService, PrismaService],
    }).compile();

    attachmentService = moduleRef.get<AttachmentService>(AttachmentService);
  });

  describe('uploadFile', () => {
    it('should throw invalid file exception', async () => {
      jest
        .spyOn(fileUtils, 'getBase64EncodedFileType')
        .mockReturnValue('invalid-file-type');

      expect(async () => {
        await attachmentService.uploadFile('file');
      }).rejects.toThrow(BadRequestException);
    });

    // @TODO: mock s3
    // it('should upload file successfully', async () => {
    //   jest.spyOn(fileUtils, 'getBase64EncodedFileType').mockReturnValue('png');

    //   jest
    //     .spyOn(fileUtils, 'resizeImage')
    //     .mockImplementation(async () => 'resized-img');

    //   jest
    //     .spyOn(fileUtils, 'getRawFileFromBase64EncodedFile')
    //     .mockImplementation(() => Buffer.from('file'));

    //   expect(await attachmentService.uploadFile('file')).toBe('he');
    // });
  });
});
