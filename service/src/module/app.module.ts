import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { join } from 'path';

//import dayjs = require('dayjs');
import { diskStorage } from 'multer';
import { FileController } from 'src/controller/file.controller';
import { FileService } from 'src/service/file.service';
@Module({
  imports:[
    MulterModule.register({
      storage: diskStorage({
        //自定义路径
        destination: `./fileUpload`,
        filename: (req, file, cb) => {
          // 自定义文件名
          // const filename = `${nuid.next()}.${file.mimetype.split('/')[1]}`;
          // return cb(null, filename);
          return  cb(null, decodeURIComponent(escape(file.originalname)));
        },
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'fileUpload'),
      serveRoot: '/static',
    }),
    
  ],
  controllers: [AppController,FileController],
  providers: [AppService , FileService],
})
export class AppModule {}
