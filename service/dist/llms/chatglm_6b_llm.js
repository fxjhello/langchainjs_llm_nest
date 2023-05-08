"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGlm6BLLm = void 0;
const base_1 = require("langchain/llms/base");
const axios_1 = require("axios");
class ChatGlm6BLLm extends base_1.BaseLLM {
    constructor(fields, configuration) {
        var _a, _b, _c;
        super(fields !== null && fields !== void 0 ? fields : {});
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
            value: 256,
        });
        Object.defineProperty(this, 'top_p', {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.7,
        });
        this.modelName = 'chatglm';
        this.temperature = (_a = fields === null || fields === void 0 ? void 0 : fields.temperature) !== null && _a !== void 0 ? _a : this.temperature;
        this.max_length = (_b = fields === null || fields === void 0 ? void 0 : fields.max_length) !== null && _b !== void 0 ? _b : this.max_length;
        this.top_p = (_c = fields === null || fields === void 0 ? void 0 : fields.top_p) !== null && _c !== void 0 ? _c : this.top_p;
    }
    invocationParams() {
        return {
            model: this.modelName,
            temperature: this.temperature,
            top_p: this.top_p,
            max_length: this.max_length,
        };
    }
    _identifyingParams() {
        return Object.assign({ model_name: this.modelName }, this.invocationParams());
    }
    identifyingParams() {
        return Object.assign({ model_name: this.modelName }, this.invocationParams());
    }
    formatMessagesAsPrompt(messages) {
        return (messages
            .map(message => {
            const messagePrompt = getAnthropicPromptFromMessage(message._getType());
            return `${messagePrompt} ${message.text}`;
        })
            .join('') + '\n\nAssistant:');
    }
    async _generate(prompts, stop) {
        console.log('prompts ', prompts);
        console.log('stop ', stop);
        return prompts;
    }
    async completionWithRetry(request) {
        console.log('request ', request);
        const makeCompletionRequest = async () => {
            const res = await axios_1.default.post('http://192.168.1.99:56721/', request, {
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
    _combineLLMOutput(...llmOutputs) {
        return llmOutputs.reduce((acc, llmOutput) => {
            var _a, _b, _c;
            if (llmOutput && llmOutput.tokenUsage) {
                acc.tokenUsage.completionTokens +=
                    (_a = llmOutput.tokenUsage.completionTokens) !== null && _a !== void 0 ? _a : 0;
                acc.tokenUsage.promptTokens += (_b = llmOutput.tokenUsage.promptTokens) !== null && _b !== void 0 ? _b : 0;
                acc.tokenUsage.totalTokens += (_c = llmOutput.tokenUsage.totalTokens) !== null && _c !== void 0 ? _c : 0;
            }
            return acc;
        }, {
            tokenUsage: {
                completionTokens: 0,
                promptTokens: 0,
                totalTokens: 0,
            },
        });
    }
    _llmType() {
        return 'chatglm';
    }
}
exports.ChatGlm6BLLm = ChatGlm6BLLm;
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
//# sourceMappingURL=chatglm_6b_llm.js.map