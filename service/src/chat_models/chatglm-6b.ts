import { BaseChatModel } from 'langchain/chat_models';
import axios from 'axios';
import { BaseChatMessage, ChatResult } from 'langchain/dist/schema';
import { AIChatMessage } from 'langchain/schema';
export class ChatGlm6BLLM extends BaseChatModel {
  modelName: 'chatglm';
  // prompt: string;
  temperature: number;
  max_length: number;
  top_p: number;
  history:[][];
  constructor(fields, configuration?) {
    super(fields ?? {});

    Object.defineProperty(this, 'temperature', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0.7,
    });
    Object.defineProperty(this, 'max_length', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 2048,
    });
    Object.defineProperty(this, 'top_p', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0.7,
    });
    this.modelName = 'chatglm';
    this.temperature = fields?.temperature ?? this.temperature;
    this.max_length = fields?.max_length ?? this.max_length;
    this.top_p = fields?.top_p ?? this.top_p;
    this.history =fields?.history ??[];
  }
  invocationParams() {
    return {
      model: this.modelName,
      temperature: this.temperature,
      top_p: this.top_p,
      max_length: this.max_length,
      history:this.history
    };
  }
  _identifyingParams() {
    return {
      model_name: this.modelName,
      ...this.invocationParams(),
    };
  }
  /**
   * Get the identifying parameters for the model
   */
  identifyingParams() {
    return {
      model_name: this.modelName,
      ...this.invocationParams(),
    };
  }
  formatMessagesAsPrompt(messages) {
    return (
      messages
        .map(message => {
          const messagePrompt = getAnthropicPromptFromMessage(
            message._getType()
          );
          return `${messagePrompt} ${message.text}`;
        })
        .join('') + '\n\nAssistant:'
    );
  }
  async _generate(messages: BaseChatMessage[]): Promise<ChatResult> {
    const params = this.invocationParams();
    const res: any = await this.completionWithRetry({
      ...params,
      prompt: this.formatMessagesAsPrompt(messages),
    });
    console.log('res ', res);

    const generations: any = [
      {
        text: res.response,
        message: new AIChatMessage(res.response),
      },
    ];
    return {
      generations,
    };
  }
  async completionWithRetry(request) {
    const makeCompletionRequest = async () => {
      const res: any = await axios.post(process.env.CHATGLM_6B_SERVER_URL ?? 'http://localhost', request, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res;
    };
    return this.caller.call(makeCompletionRequest).then(res => {
      return res.data;
    });
  }
  _llmType() {
    return 'chatglm';
  }
  _combineLLMOutput(...llmOutputs) {
    return llmOutputs.reduce(
      (acc, llmOutput) => {
        if (llmOutput && llmOutput.tokenUsage) {
          acc.tokenUsage.completionTokens +=
            llmOutput.tokenUsage.completionTokens ?? 0;
          acc.tokenUsage.promptTokens += llmOutput.tokenUsage.promptTokens ?? 0;
          acc.tokenUsage.totalTokens += llmOutput.tokenUsage.totalTokens ?? 0;
        }
        return acc;
      },
      {
        tokenUsage: {
          completionTokens: 0,
          promptTokens: 0,
          totalTokens: 0,
        },
      }
    );
  }
}
function getAnthropicPromptFromMessage(type) {
  switch (type) {
    case 'ai':
      return '\n\nAssistant:';
    case 'human':
      return '\n\nHuman:';
    case 'system':
      return '';
    default:
      throw new Error(`Unknown message type: ${type}`);
  }
}
