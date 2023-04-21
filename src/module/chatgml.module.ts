import { Module } from '@nestjs/common';
import { ChatglmController } from '../controller/chatglm.controller';
import { ChatglmService } from 'src/service/chatglm.service';
import { FileService } from 'src/service/file.service';

@Module({

  controllers: [ChatglmController],
  providers: [ChatglmService,FileService],
})
export class ChatglmModule {}
