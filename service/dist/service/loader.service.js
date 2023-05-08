"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const hnswlib_1 = require("langchain/vectorstores/hnswlib");
const text_1 = require("langchain/document_loaders/fs/text");
const directory_1 = require("langchain/document_loaders/fs/directory");
const chains_1 = require("langchain/chains");
const chatglm_6b_llm_1 = require("../llms/chatglm_6b_llm");
const text2vec_large_chinese_embedding_1 = require("../embeddings/text2vec-large-chinese.embedding");
let AppService = class AppService {
    async run() {
        const model = new chatglm_6b_llm_1.ChatGlm6BLLm({});
        const loader = new directory_1.DirectoryLoader("./fileUpload", {
            ".txt": (path) => new text_1.TextLoader(path),
        });
        const docs = await loader.load();
        console.log({ docs });
        const vectorStore = await hnswlib_1.HNSWLib.fromDocuments(docs, new text2vec_large_chinese_embedding_1.T2VLargeChineseEmbeddings());
        const directory = './fileProcessing';
        await vectorStore.save(directory);
        const loadedVectorStore = await hnswlib_1.HNSWLib.load(directory, new text2vec_large_chinese_embedding_1.T2VLargeChineseEmbeddings());
        const chain = chains_1.RetrievalQAChain.fromLLM(model, loadedVectorStore.asRetriever());
        const res = await chain.call({
            query: 'What did the president say about Justice Breyer?',
        });
        console.log({ res });
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=loader.service.js.map