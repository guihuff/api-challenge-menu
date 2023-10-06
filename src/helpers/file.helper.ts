import { extname } from 'path';
import { Request } from 'express';
import * as fs from 'fs';
import { promisify } from 'util';

export class HelperFile {
  static customFilename(req: Request, file: Express.Multer.File, cb: any) {
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    const nameFile = cb(null, `${randomName}${extname(file.originalname)}`);

    return nameFile;
  }

  static async removeFile(file: string) {
    const unlink = promisify(fs.unlink);
    try {
      await unlink(`./${file}`);
    } catch (err) {
      throw new Error('Arquivo não encontrado');
    }
    return true;
  }
}
