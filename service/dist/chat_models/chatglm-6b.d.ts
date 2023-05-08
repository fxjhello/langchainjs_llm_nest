import { BaseChatModel } from 'langchain/chat_models';
import { BaseChatMessage, ChatResult } from 'langchain/dist/schema';
export declare class ChatGlm6BLLM extends BaseChatModel {
    modelName: 'chatglm';
    temperature: number;
    max_length: number;
    top_p: number;
    history: [][];
    constructor(fields: any, configuration?: any);
    invocationParams(): {
        model: "chatglm";
        temperature: number;
        top_p: number;
        max_length: number;
        history: [][];
    };
    _identifyingParams(): {
        model: "chatglm";
        temperature: number;
        top_p: number;
        max_length: number;
        history: [][];
        model_name: "chatglm";
    };
    identifyingParams(): {
        model: "chatglm";
        temperature: number;
        top_p: number;
        max_length: number;
        history: [][];
        model_name: "chatglm";
    };
    formatMessagesAsPrompt(messages: any): string;
    _generate(messages: BaseChatMessage[]): Promise<ChatResult>;
    completionWithRetry(request: any): Promise<any>;
    _llmType(): string;
    _combineLLMOutput(...llmOutputs: any[]): any;
}
