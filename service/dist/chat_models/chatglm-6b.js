"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGlm6BLLM = void 0;
const chat_models_1 = require("langchain/chat_models");
const axios_1 = require("axios");
const schema_1 = require("langchain/schema");
class ChatGlm6BLLM extends chat_models_1.BaseChatModel {
    constructor(fields, configuration) {
        var _a, _b, _c, _d;
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
            value: 2048,
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
        this.history = (_d = fields === null || fields === void 0 ? void 0 : fields.history) !== null && _d !== void 0 ? _d : [];
    }
    invocationParams() {
        return {
            model: this.modelName,
            temperature: this.temperature,
            top_p: this.top_p,
            max_length: this.max_length,
            history: this.history
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
    async _generate(messages) {
        const params = this.invocationParams();
        const res = await this.completionWithRetry(Object.assign(Object.assign({}, params), { prompt: this.formatMessagesAsPrompt(messages) }));
        console.log('res ', res);
        const generations = [
            {
                text: res.response,
                message: new schema_1.AIChatMessage(res.response),
            },
        ];
        return {
            generations,
        };
    }
    async completionWithRetry(request) {
        const makeCompletionRequest = async () => {
            var _a;
            const res = await axios_1.default.post((_a = process.env.CHATGLM_6B_SERVER_URL) !== null && _a !== void 0 ? _a : 'http://localhost', request, {
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
}
exports.ChatGlm6BLLM = ChatGlm6BLLM;
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
//# sourceMappingURL=chatglm-6b.js.map