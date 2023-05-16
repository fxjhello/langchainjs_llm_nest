
import * as fs from 'fs';
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
