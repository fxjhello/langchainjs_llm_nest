import { Body, Controller, Get, Post } from '@nestjs/common';

import { FileService } from 'src/service/file.service';
@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService
    ) {}
  @Get('query-list')
  async queryFileList( ) {
    return  await this.fileService.getFileList()
  }
  @Post('delete')
  async deleteFile(@Body() body) {
    return  await this.fileService.deleteFile(body.fileName)
  }
}
