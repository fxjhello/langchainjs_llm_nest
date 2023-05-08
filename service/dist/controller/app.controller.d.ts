/// <reference types="multer" />
import { AppService } from '../service/app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    sayHello(): {
        hello: string;
    };
    uploadFile(file: Express.Multer.File): Promise<void>;
    chatfile(chatcontent: any): Promise<{
        response: import("langchain/schema").ChainValues;
        url: string;
    }>;
    chat(chatcontent: any): Promise<import("langchain/schema").ChainValues>;
}
