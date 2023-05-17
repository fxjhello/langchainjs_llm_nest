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
import { EmbeddingManager } from 'src/embeddings/embedding-manager.bak';
import { ApiBody, ApiConsumes, ApiParam, ApiProperty } from '@nestjs/swagger';



class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  
  
   //文件相关处理
   
  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadDto,
 })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(decodeURIComponent(escape(file.originalname)));
    return await this.appService.refactorVectorStore();

  }
  @Get('file/query-list')
  async queryFileList( ) {
    console.log(await this.appService.getFileList())
    return  await this.appService.getFileList()
  }
  @Post('file/delete')
  @ApiParam({ name: 'fileName', type: String, description: 'example.txt' })
  async deleteFile(@Body() body:any) {
    return  await this.appService.deleteFile(body.fileName)
  }

  //Chatglm相关
  
  @Post('chat')
  @ApiParam({ name: 'message', type: String, description: '你好' })
  @ApiParam({ name: 'history', type: Array<string>, description: '[[Human:xx,Assistant:xx],[Human:xx,Assistant:xx]]' })
  async chat(
    @Body() body:any,

  ) {
    return await this.appService.chat(body);

  }
  
  @Post('chatfile')
  @ApiParam({ name: 'message', type: String, description: '你好' })
  @ApiParam({ name: 'history', type: Array<string>, description: '[[Human:xx,Assistant:xx],[Human:xx,Assistant:xx]]' })
  async chatfile(
    @Body() body: any,

  ) {
    return await this.appService.chatfile(body);

  }
  @Post('chatfileOpenai')
  @ApiParam({ name: 'message', type: String, description: '你好' })
  @ApiParam({ name: 'history', type: Array<string>, description: '[[Human:xx,Assistant:xx],[Human:xx,Assistant:xx]]' })
  async chatfileGPT(
    @Body() body: any,
  ) {
    console.log('chatfile-openai',body);
    console.log('xxxxxxxxxxxx,test');
    
    return await this.appService.chatfileOpenAI(body);
  }
  

  @Post('chatOpenAI')
  @ApiParam({ name: 'message', type: String, description: '你好' })
  @ApiParam({ name: 'history', type: Array<string>, description: '[[Human:xx,Assistant:xx],[Human:xx,Assistant:xx]]' })
  async chatOpenAI(
    @Body() body,
  ) {
    return await this.appService.chatOpenAI(body);

  }
  @Post('set-embedding')
  @ApiParam({ name: 'name', type: String, description: 'default/cohere/openai' })
  @ApiParam({ name: 'api_key', type: String, description: 'xxxxxxxx' })
  async setEmbedding(
    @Body() body,
  ) {
    const { name ,api_key} = body
    console.log('set-embedding',body);
    
    const strategys = {
      default: async() => {
        await EmbeddingManager.resetEmbedding();
        EmbeddingManager.setCurrentEmbedding('default');
      },
      cohere: async() => {
        await EmbeddingManager.resetEmbedding({ cohereKey: api_key });
        EmbeddingManager.setCurrentEmbedding('cohere');
      },
      openai: async() => {
        await EmbeddingManager.resetEmbedding({ openAIKey: api_key });
        EmbeddingManager.setCurrentEmbedding('openai');
      }
    }
    if (strategys[name]) {
      strategys[name]()
    }
  }

}
