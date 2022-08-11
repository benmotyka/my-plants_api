import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { AttachmentService } from '../../src/modules/attachment/attachment.service';
import * as fileUtils from '../../src/util/file';
import { PrismaService } from '../../src/modules/prisma/prisma.service';
import { InvalidFileException } from '../../src/modules/attachment/exceptions/InvalidFile.exception';

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
      }).rejects.toThrow(InvalidFileException);
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
