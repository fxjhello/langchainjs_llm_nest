export declare class AppService {
    refactorVectorStore(): Promise<void>;
    chatfile(body: any): Promise<{
        response: import("langchain/schema").ChainValues;
        url: string;
    }>;
    chatfileOpenAI(body: any): Promise<{
        response: import("langchain/schema").ChainValues;
        url: string;
    }>;
    chat(chatcontent: any, history: any): Promise<import("langchain/schema").ChainValues>;
    chatOpenAI(chatcontent: any, OpenAIKey: any, baseUrl: any): Promise<import("langchain/schema").ChainValues>;
    getHello(): {
        hello: string;
    };
}
