import { HelperFile } from './file.helper';
import { Request } from 'express';

describe('HelperFile', () => {
  describe('customFilename', () => {
    it('should generate a custom filename', () => {
      const req: Request = {} as Request;
      const file = {
        originalname: 'test.jpg',
      } as Express.Multer.File;
      const cb = jest.fn();

      HelperFile.customFilename(req, file, cb);

      expect(cb).toHaveBeenCalledWith(
        null,
        expect.stringMatching(/[a-f0-9]{32}\.jpg/),
      );
    });
  });
});
