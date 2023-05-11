import { Injectable } from '@nestjs/common';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { ChatGlm6BLLM } from '../chat_models/chatglm-6b'
import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain';
//import { ChatGlm6BLLm } from '../llms/chatglm_6b_llm';
import { T2VLargeChineseEmbeddings } from '../embeddings/text2vec-large-chinese.embedding';
import { MemoryVectorStore } from "langchain/vectorstores/memory";
//import { MyVectorStore } from '../vector_store/myVectorStore';
import {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
  
} from "langchain/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";


@Injectable()
export class AppService {
  async refactorVectorStore() {
    const loader = new DirectoryLoader(
      "./fileUpload",
      {
        //".json": (path) => new JSONLoader(path, "/texts"),
        //".jsonl": (path) => new JSONLinesLoader(path, "/html"),
        ".txt": (path) => new TextLoader(path),
        ".docx": (path) => new DocxLoader(path),
        ".pdf": (path) => new PDFLoader(path),
        //".csv": (path) => new CSVLoader(path, "text"),
      }
    );
    // Split the docs into chunks
    // 文本切割,将文档拆分为块
    const textsplitter = new RecursiveCharacterTextSplitter({
      separators: ["\n\n", "\n", "。", "！", "？"],
      chunkSize: 400,
      chunkOverlap: 100,
    })
    const docs = await loader.loadAndSplit(textsplitter);
    // Load the docs into the vector store
    // 加载向量存储库 
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new T2VLargeChineseEmbeddings()
    );
    //MyVectorStore.resetInstance(docs, new T2VLargeChineseEmbeddings());
  }
  /**
   * 
   * @param chatcontent 
   * @param history 
   * @description 根据内容回答问题
   * @returns 
   */
  async chatfile(body) {
    const { message, history } = body;
    //const app = await NestFactory.create(AppModule);
    // const directory = './fileProcessing';
    // const loadedVectorStore = await HNSWLib.load(directory, new T2VLargeChineseEmbeddings());
    const loader = new DirectoryLoader(
      "./fileUpload",
      {
        //".json": (path) => new JSONLoader(path, "/texts"),
        //".jsonl": (path) => new JSONLinesLoader(path, "/html"),
        ".txt": (path) => new TextLoader(path),
        ".docx": (path) => new DocxLoader(path),
        ".pdf": (path) => new PDFLoader(path),
        //".csv": (path) => new CSVLoader(path, "text"),
      }
    );
    // Split the docs into chunks
    // 文本切割,将文档拆分为块
    const textsplitter = new RecursiveCharacterTextSplitter({
      separators: ["\n\n", "\n", "。", "！", "？"],
      chunkSize: 400,
      chunkOverlap: 100,
    })
    const docs = await loader.loadAndSplit(textsplitter);
    // Load the docs into the vector store
    // 加载向量存储库 
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new T2VLargeChineseEmbeddings()
    );
    //const loadedVectorStore = await MyVectorStore.getInstance().hnswlibStore;
    const result = await vectorStore.similaritySearch(message, 1);
    
    const fileSourceStr = result[0].metadata.source
    const chat = new ChatGlm6BLLM({ temperature: 0.01, history: history });
    const translationPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `基于已知内容, 回答用户问题。如果无法从中得到答案，请说'没有足够的相关信息'。已知内容:${result[0].pageContent}`
      ),
      /* new MessagesPlaceholder("history"), */
      HumanMessagePromptTemplate.fromTemplate("{text}"),
    ]);
    /* const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
    /* const chain = new ConversationChain({  prompt: translationPrompt,llm: chat, memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }), }); */
    const chain = new LLMChain({
      prompt: translationPrompt,
      llm: chat,
    });
    const response = await chain.call({
      text: message,
    });
    return {
      response: response,
      url: '/static/' + fileSourceStr.split("\\")[fileSourceStr.split("\\").length - 1]
    }
  }
  /**
   * 
   * @param chatcontent 
   * @param history 
   * @description 根据内容回答问题
   * @returns 
   */
   async chatfileOpenAI(body) {
    const { message, history , api_key , basePath} = body;
    //const app = await NestFactory.create(AppModule);
    // const directory = './fileProcessing';
    // const loadedVectorStore = await HNSWLib.load(directory, new T2VLargeChineseEmbeddings());
    console.log("step1" , basePath);
    
    const loader = new DirectoryLoader(
      "./fileUpload",
      {
        //".json": (path) => new JSONLoader(path, "/texts"),
        //".jsonl": (path) => new JSONLinesLoader(path, "/html"),
        ".txt": (path) => new TextLoader(path),
        ".docx": (path) => new DocxLoader(path),
        ".pdf": (path) => new PDFLoader(path),
        //".csv": (path) => new CSVLoader(path, "text"),
      }
    );
    // Split the docs into chunks
    // 文本切割,将文档拆分为块
    const textsplitter = new RecursiveCharacterTextSplitter({
      separators: ["\n\n", "\n", "。", "！", "？"],
      chunkSize: 400,
      chunkOverlap: 100,
    })
    const docs = await loader.loadAndSplit(textsplitter);
    // Load the docs into the vector store
    // 加载向量存储库 
    const vectorStore = await MemoryVectorStore.fromDocuments(
      docs,
      new T2VLargeChineseEmbeddings()
    );
    //const loadedVectorStore = await MyVectorStore.getInstance().hnswlibStore;
    const result = await vectorStore.similaritySearch(message, 1);
    console.log('step2', result);
    
    const fileSourceStr = result[0].metadata.source
    console.log('fileSourceStr', fileSourceStr);
    
    const chat = new OpenAI({ temperature: 0.01 ,openAIApiKey: api_key}, {basePath: basePath.replace(/\/+$/, '') });
    const translationPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `基于已知内容, 回答用户问题。如果无法从中得到答案，请说'没有足够的相关信息'。已知内容:${result[0].pageContent}`
      ),
      /* new MessagesPlaceholder("history"), */
      HumanMessagePromptTemplate.fromTemplate("{text}"),
    ]);
    /* const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
    /* const chain = new ConversationChain({  prompt: translationPrompt,llm: chat, memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }), }); */
    const chain = new LLMChain({
      prompt: translationPrompt,
      llm: chat,
    });
    const response = await chain.call({
      text: message,
    });
    return {
      response: response,
      url: '/static/' + fileSourceStr.split("\\")[fileSourceStr.split("\\").length - 1]
    }
  }
  async chat(chatcontent, history) {
    //根据内容回答问题
    //const app = await NestFactory.create(AppModule);

    const chat = new ChatGlm6BLLM({ temperature: 0.01, history: history });
    const translationPrompt = ChatPromptTemplate.fromPromptMessages([
    /*   SystemMessagePromptTemplate.fromTemplate(
      ), */
      /* new MessagesPlaceholder("history"), */
      HumanMessagePromptTemplate.fromTemplate("{text}"),
    ]);
    /* const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
    console.log(1111111,memory); */

    /* const chain = new ConversationChain({  prompt: translationPrompt,llm: chat, memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }), }); */
    const chain = new LLMChain({
      prompt: translationPrompt,
      llm: chat,
    });
    const response = await chain.call({
      text: chatcontent,
    });
    //response.push({link: '/static' +fileSourceStr.split("\\")[fileSourceStr.split("\\").length-1]})

    return response



  }
  async chatOpenAI(body) {
    //根据内容回答问题
    //const app = await NestFactory.create(AppModule);
    const { message, history , api_key , basePath} = body;
    const chat = new OpenAI({ temperature: 0.01});
    const translationPrompt = ChatPromptTemplate.fromPromptMessages([
    /*   SystemMessagePromptTemplate.fromTemplate(
      ), */
      /* new MessagesPlaceholder("history"), */
      HumanMessagePromptTemplate.fromTemplate("{text}"),
    ]);
    /* const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
    console.log(1111111,memory); */

    /* const chain = new ConversationChain({  prompt: translationPrompt,llm: chat, memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }), }); */
    const chain = new LLMChain({
      prompt: translationPrompt,
      llm: chat,
    });
    const response = await chain.call({
      text: message,
    });
    //response.push({link: '/static' +fileSourceStr.split("\\")[fileSourceStr.split("\\").length-1]})

    return response



  }

  getHello() {
    return { hello: 'world' };
  }
}
