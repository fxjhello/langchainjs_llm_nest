/// <reference types="multer" />
import { AppService } from '../service/app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    sayHello(): {
        hello: string;
    };
    uploadFile(file: Express.Multer.File): Promise<void>;
    chatfile(body: any): Promise<{
        response: import("langchain/schema").ChainValues;
        url: string;
    }>;
    chatfileGPT(body: any): Promise<{
        response: import("langchain/schema").ChainValues;
        url: string;
    }>;
    chat(chatcontent: any): Promise<import("langchain/schema").ChainValues>;
    chatOpenAI(body: any): Promise<import("langchain/schema").ChainValues>;
    setEmbedding(body: any): Promise<void>;
}
