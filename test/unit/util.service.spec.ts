import { UtilService } from '@modules/util/util.service';
import { Test } from '@nestjs/testing';

describe('UtilService', () => {
  const USER_FRIENDLY_ID_LENGTH = 6;
  const mockEncodedFile = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMA';

  let utilService: UtilService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UtilService],
    }).compile();

    utilService = moduleRef.get<UtilService>(UtilService);
  });

  describe('generateUserFriendlyId', () => {
    it('should generate random user friendly id', () => {
      const randomId = utilService.generateUserFriendlyId();
      expect(typeof randomId).toBe('string');
      expect(randomId.length).toBe(USER_FRIENDLY_ID_LENGTH);
    });
  });

  describe('getBase64EncodedFileType', () => {
    it('should return proper file type', () => {
      const result = utilService.getBase64EncodedFileType(mockEncodedFile);

      expect(result).toBe('png');
    });
  });

  describe('getRawFileFromBase64EncodedFile', () => {
    it('should return raw file as buffer', () => {
      const result =
        utilService.getRawFileFromBase64EncodedFile(mockEncodedFile);

      expect(result).toBeInstanceOf(Buffer);
    });
  });
});
