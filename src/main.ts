import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { MyVectorStore } from './vector_store/myVectorStore';
import { T2VLargeChineseEmbeddings } from './embeddings/text2vec-large-chinese.embedding';
import * as dotenv from 'dotenv';
dotenv.config({
  path:  '.env'
});
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const directory = './fileProcessing';
  MyVectorStore.getInstance(directory , new T2VLargeChineseEmbeddings());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
