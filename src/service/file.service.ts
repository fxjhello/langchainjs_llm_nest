import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
@Injectable()
export class FileService {
  async readTextFile(file: string): Promise<string> {
    return await fs.readFileSync(`fileUpload/${file}`, 'utf8');
  }
}
