import { Injectable } from '@nestjs/common';
import { FileService } from 'src/service/file';
import {ChatglmService} from 'src/service/chatglm'
import { ChatopenaiService } from './chatopenai';


@Injectable()
export class AppService {
  
 //chatglm交互
    //自由对话
  async chat(body) {
    const res=new ChatglmService
    return res.chat(body)
  }
    //文档问答
  async chatfile(body) {
    const res=new ChatglmService
    return res.chatfile(body)
  }


 //OpenAI交互
  //文档问答
   async chatfileOpenAI(body) {
    const res=new ChatopenaiService
    return res.chatfileOpenAI(body)
    
  }
  //自由对话
  async chatOpenAI(body) {
    const res=new ChatopenaiService
    return res.chatOpenAI(body)
  }

  //文件相关处理
     //文件向量化
  async refactorVectorStore() {
    const res=new FileService
    return res.refactorVectorStore()
  }
    //获取文件列表
  async getFileList() {
    const res=new FileService
    return res.getFileList()
  }
  //删除文件
  async deleteFile(fileName) {
    const res=new FileService
    return res.deleteFile(fileName)
  }
}
