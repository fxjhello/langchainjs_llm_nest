export declare class AppService {
    refactorVectorStore(): Promise<void>;
    chatfile(chatcontent: any, history: any): Promise<{
        response: import("langchain/schema").ChainValues;
        url: string;
    }>;
    chat(chatcontent: any, history: any): Promise<import("langchain/schema").ChainValues>;
    getHello(): {
        hello: string;
    };
}
