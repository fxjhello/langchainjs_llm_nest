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
const text_1 = require("langchain/document_loaders/fs/text");
const docx_1 = require("langchain/document_loaders/fs/docx");
const pdf_1 = require("langchain/document_loaders/fs/pdf");
const directory_1 = require("langchain/document_loaders/fs/directory");
const chatglm_6b_1 = require("../chat_models/chatglm-6b");
const chains_1 = require("langchain/chains");
const langchain_1 = require("langchain");
const text2vec_large_chinese_embedding_1 = require("../embeddings/text2vec-large-chinese.embedding");
const embedding_manager_1 = require("../embeddings/embedding-manager");
const memory_1 = require("langchain/vectorstores/memory");
const prompts_1 = require("langchain/prompts");
const text_splitter_1 = require("langchain/text_splitter");
let AppService = class AppService {
    async refactorVectorStore() {
        const loader = new directory_1.DirectoryLoader("./fileUpload", {
            ".txt": (path) => new text_1.TextLoader(path),
            ".docx": (path) => new docx_1.DocxLoader(path),
            ".pdf": (path) => new pdf_1.PDFLoader(path),
        });
        const textsplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            separators: ["\n\n", "\n", "。", "！", "？"],
            chunkSize: 400,
            chunkOverlap: 100,
        });
        const docs = await loader.loadAndSplit(textsplitter);
        const vectorStore = await memory_1.MemoryVectorStore.fromDocuments(docs, embedding_manager_1.EmbeddingManager.getEmbedding('cohere'));
    }
    async chatfile(body) {
        const { message, history } = body;
        const loader = new directory_1.DirectoryLoader("./fileUpload", {
            ".txt": (path) => new text_1.TextLoader(path),
            ".docx": (path) => new docx_1.DocxLoader(path),
            ".pdf": (path) => new pdf_1.PDFLoader(path),
        });
        const textsplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            separators: ["\n\n", "\n", "。", "！", "？"],
            chunkSize: 400,
            chunkOverlap: 100,
        });
        const docs = await loader.loadAndSplit(textsplitter);
        const vectorStore = await memory_1.MemoryVectorStore.fromDocuments(docs, embedding_manager_1.EmbeddingManager.getEmbedding('cohere'));
        const result = await vectorStore.similaritySearch(message, 1);
        const fileSourceStr = result[0].metadata.source;
        const chat = new chatglm_6b_1.ChatGlm6BLLM({ temperature: 0.01, history: history });
        const translationPrompt = prompts_1.ChatPromptTemplate.fromPromptMessages([
            prompts_1.SystemMessagePromptTemplate.fromTemplate(`基于已知内容, 回答用户问题。如果无法从中得到答案，请说'没有足够的相关信息'。已知内容:${result[0].pageContent}`),
            prompts_1.HumanMessagePromptTemplate.fromTemplate("{text}"),
        ]);
        const chain = new chains_1.LLMChain({
            prompt: translationPrompt,
            llm: chat,
        });
        const response = await chain.call({
            text: message,
        });
        return {
            response: response,
            url: '/static/' + fileSourceStr.split("\\")[fileSourceStr.split("\\").length - 1]
        };
    }
    async chatfileOpenAI(body) {
        const { message, history, api_key, basePath } = body;
        console.log("step1", basePath);
        const loader = new directory_1.DirectoryLoader("./fileUpload", {
            ".txt": (path) => new text_1.TextLoader(path),
            ".docx": (path) => new docx_1.DocxLoader(path),
            ".pdf": (path) => new pdf_1.PDFLoader(path),
        });
        const textsplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            separators: ["\n\n", "\n", "。", "！", "？"],
            chunkSize: 400,
            chunkOverlap: 100,
        });
        const docs = await loader.loadAndSplit(textsplitter);
        const vectorStore = await memory_1.MemoryVectorStore.fromDocuments(docs, new text2vec_large_chinese_embedding_1.T2VLargeChineseEmbeddings());
        const result = await vectorStore.similaritySearch(message, 1);
        console.log('step2', result);
        const fileSourceStr = result[0].metadata.source;
        console.log('fileSourceStr', fileSourceStr);
        const chat = new langchain_1.OpenAI({ temperature: 0.01, openAIApiKey: api_key }, { basePath: basePath.replace(/\/+$/, '') });
        const translationPrompt = prompts_1.ChatPromptTemplate.fromPromptMessages([
            prompts_1.SystemMessagePromptTemplate.fromTemplate(`基于已知内容, 回答用户问题。如果无法从中得到答案，请说'没有足够的相关信息'。已知内容:${result[0].pageContent}`),
            prompts_1.HumanMessagePromptTemplate.fromTemplate("{text}"),
        ]);
        const chain = new chains_1.LLMChain({
            prompt: translationPrompt,
            llm: chat,
        });
        const response = await chain.call({
            text: message,
        });
        return {
            response: response,
            url: '/static/' + fileSourceStr.split("\\")[fileSourceStr.split("\\").length - 1]
        };
    }
    async chat(chatcontent, history) {
        const chat = new chatglm_6b_1.ChatGlm6BLLM({ temperature: 0.01, history: history });
        const translationPrompt = prompts_1.ChatPromptTemplate.fromPromptMessages([
            prompts_1.HumanMessagePromptTemplate.fromTemplate("{text}"),
        ]);
        const chain = new chains_1.LLMChain({
            prompt: translationPrompt,
            llm: chat,
        });
        const response = await chain.call({
            text: chatcontent,
        });
        return response;
    }
    async chatOpenAI(body) {
        const { message, history, api_key, basePath } = body;
        console.log("step1", message);
        const chat = new langchain_1.OpenAI({ temperature: 0.01, openAIApiKey: api_key }, { basePath: basePath.replace(/\/+$/, '') });
        const translationPrompt = prompts_1.ChatPromptTemplate.fromPromptMessages([
            prompts_1.HumanMessagePromptTemplate.fromTemplate("{text}"),
        ]);
        const chain = new chains_1.LLMChain({
            prompt: translationPrompt,
            llm: chat,
        });
        const response = await chain.call({
            text: message,
        });
        return response;
    }
    getHello() {
        return { hello: 'world' };
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map