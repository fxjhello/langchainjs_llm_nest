import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
@Injectable()
export class FileService {
  async getFileList() {
    const directoryPath = './fileUpload';
    const files = fs.readdirSync(directoryPath);
    return files;
  }
  async deleteFile(fileName) {
    const directoryPath = './fileUpload';
    fs.rmSync(`${directoryPath}/${fileName}`);
  }
}
