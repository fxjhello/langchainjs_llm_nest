"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.T2VLargeChineseEmbeddings = void 0;
const axios_1 = require("axios");
const embeddings_1 = require("langchain/embeddings");
class T2VLargeChineseEmbeddings extends embeddings_1.Embeddings {
    constructor(fields) {
        var _a, _b, _c;
        super(fields !== null && fields !== void 0 ? fields : {});
        Object.defineProperty(this, "batchSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1024
        });
        Object.defineProperty(this, "stripNewLines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "timeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "clientConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.modelName = (_a = fields === null || fields === void 0 ? void 0 : fields.modelName) !== null && _a !== void 0 ? _a : this.modelName;
        this.batchSize = (_b = fields === null || fields === void 0 ? void 0 : fields.batchSize) !== null && _b !== void 0 ? _b : this.batchSize;
        this.stripNewLines = (_c = fields === null || fields === void 0 ? void 0 : fields.stripNewLines) !== null && _c !== void 0 ? _c : this.stripNewLines;
        this.timeout = fields === null || fields === void 0 ? void 0 : fields.timeout;
    }
    async embedDocuments(texts) {
        const subPrompts = chunkArray(this.stripNewLines ? texts.map((t) => t.replaceAll("\n", " ")) : texts, this.batchSize);
        const embeddings = [];
        for (let i = 0; i < subPrompts.length; i += 1) {
            const input = subPrompts[i];
            const { data } = await this.embeddingWithRetry({
                documents: input,
            });
            for (let j = 0; j < input.length; j += 1) {
                embeddings.push(data[j]);
            }
        }
        return embeddings;
    }
    async embedQuery(text) {
        console.log('my embedding text ', text);
        const { data } = await this.embeddingWithRetry({
            documents: text,
        });
        return data[0];
    }
    async embeddingWithRetry(request) {
        const makeCompletionRequest = async (params) => {
            var _a;
            const res = await axios_1.default.post(`${(_a = process.env.EMBEDDING_SERVER_URL) !== null && _a !== void 0 ? _a : 'http://localhost'}/embedDocuments`, params, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return res;
        };
        return this.caller.call(makeCompletionRequest, request);
    }
}
exports.T2VLargeChineseEmbeddings = T2VLargeChineseEmbeddings;
function chunkArray(arr, chunkSize) {
    return arr.reduce((chunks, elem, index) => {
        const chunkIndex = Math.floor(index / chunkSize);
        const chunk = chunks[chunkIndex] || [];
        chunks[chunkIndex] = chunk.concat([elem]);
        return chunks;
    }, []);
}
//# sourceMappingURL=text2vec-large-chinese.embedding.js.map