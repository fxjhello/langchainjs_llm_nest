import {
  Body,
  Controller,
  Get,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AppService } from '../service/app.service';
import { EmbeddingManager } from 'src/embeddings/embedding-manager';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  sayHello() {
    return this.appService.getHello();
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.appService.refactorVectorStore();

  }
  @Post('chatfile')
  async chatfile(
    @Body() body: any,

  ) {
    return await this.appService.chatfile(body);

  }
  @Post('chatfileOpenai')
  async chatfileGPT(
    @Body() body: any,
  ) {
    console.log('chatfile-openai',body);
    console.log('xxxxxxxxxxxx,test');
    
    return await this.appService.chatfileOpenAI(body);
  }
  @Post('chat')
  async chat(
    @Body() chatcontent,

  ) {
    return await this.appService.chat(chatcontent.message, chatcontent.history);

  }

  @Post('chatOpenAI')
  async chatOpenAI(
    @Body() body,
  ) {
    return await this.appService.chatOpenAI(body);

  }
  @Post('set-embedding')
  async setEmbedding(
    @Body() body,
  ) {
    return EmbeddingManager.setCurrentEmbedding(body.name)

  }

}
