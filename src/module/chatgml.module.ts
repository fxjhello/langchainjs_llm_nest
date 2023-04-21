import { Module } from '@nestjs/common';
import { ChatglmController } from '../controller/chatglm.controller';
import { ChatglmService } from '../service/chatglm.service';

@Module({

  controllers: [ChatglmController],
  providers: [ChatglmService],
})
export class ChatglmModule {}
