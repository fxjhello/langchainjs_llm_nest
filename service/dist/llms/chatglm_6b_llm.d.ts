import { BaseLLM } from 'langchain/llms/base';
import { LLMResult } from 'langchain/schema';
export declare class ChatGlm6BLLm extends BaseLLM {
    modelName: 'chatglm';
    temperature: number;
    max_length: number;
    top_p: number;
    constructor(fields: any, configuration?: any);
    invocationParams(): {
        model: "chatglm";
        temperature: number;
        top_p: number;
        max_length: number;
    };
    _identifyingParams(): {
        model: "chatglm";
        temperature: number;
        top_p: number;
        max_length: number;
        model_name: "chatglm";
    };
    identifyingParams(): {
        model: "chatglm";
        temperature: number;
        top_p: number;
        max_length: number;
        model_name: "chatglm";
    };
    formatMessagesAsPrompt(messages: any): string;
    _generate(prompts: string[], stop?: string[]): Promise<LLMResult>;
    completionWithRetry(request: any): Promise<any>;
    _combineLLMOutput(...llmOutputs: any[]): any;
    _llmType(): string;
}
