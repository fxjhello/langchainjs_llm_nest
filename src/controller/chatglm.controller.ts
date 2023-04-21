import { Body, Controller, Post } from '@nestjs/common';
import { ChatglmService } from '../service/chatglm.service';
import { FileService } from 'src/service/file.service';
@Controller('chatglm')
export class ChatglmController {
  constructor(private readonly chatglmService: ChatglmService ,
    private readonly fileService: FileService
    ) {}
  @Post('question')
  async embbedingQuery(@Body() body:any ) {
    const {fileName} = body;
    const text = await this.fileService.readTextFile(fileName)
    return text
  }
}
