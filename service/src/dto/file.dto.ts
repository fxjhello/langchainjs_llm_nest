import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
  }

export class FileDeleteDto {
    fileName: string;
  }

export class searchDto {
    api_key:string;
    message: string;
  }