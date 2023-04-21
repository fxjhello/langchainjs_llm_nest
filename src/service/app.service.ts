import { Injectable } from '@nestjs/common';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";

import { RetrievalQAChain } from 'langchain/chains';
import { ChatGlm6BLLm } from '../llms/chatglm_6b_llm';
import { T2VLargeChineseEmbeddings } from '../embeddings/text2vec-large-chinese.embedding';
import { CohereEmbeddings } from "langchain/embeddings/cohere";
// import { OpenAI } from 'langchain/llms/openai';

@Injectable()
export class AppService {
  async run() {
    // Create docs with a loader
    const model = new ChatGlm6BLLm({});
    const loader = new DirectoryLoader(
      "./fileUpload",
      {
        //".json": (path) => new JSONLoader(path, "/texts"),
        //".jsonl": (path) => new JSONLinesLoader(path, "/html"),
        ".txt": (path) => new TextLoader(path),
        //".csv": (path) => new CSVLoader(path, "text"),
      }
    );
   /*  const loader = new TextLoader(
      //'src/config/config.default.ts'
      `./fileUpload`
    ); */
    const docs = await loader.load();
    //console.log({ docs });
    // Load the docs into the vector store

     const vectorStore = await HNSWLib.fromDocuments(
       docs,
       new T2VLargeChineseEmbeddings()
     );
    const directory = './fileProcessing';
     await vectorStore.save(directory);

    // Load the vector store from the same directory
    const loadedVectorStore = await HNSWLib.load(
      directory,
      new T2VLargeChineseEmbeddings()
    );
    // Search for the most similar document
    const chain = RetrievalQAChain.fromLLM(
      model,
      loadedVectorStore.asRetriever()
    );
    const res = await chain.call({
      query: 'What did the president say about Justice Breyer?',
    });
    console.log({ res });
    /* const result = await loadedVectorStore.similaritySearch('hello world', 1);
    console.log(result); */
  }
  getHello() {
    return { hello: 'world' };
  }
}
