import { Test } from '@nestjs/testing';
import { AttachmentService } from './attachment.service';
import * as fileUtils from '../../util/file';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { InvalidFileException } from './exceptions/InvalidFile.exception';

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
