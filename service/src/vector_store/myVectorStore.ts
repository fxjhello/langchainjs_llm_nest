/* import { Embeddings } from "langchain/embeddings";
import { Document } from "langchain/document";
import { HNSWLib } from 'langchain/vectorstores/hnswlib';

export class MyVectorStore {
  private static instance: MyVectorStore;
  hnswlibStore: HNSWLib;
  directory:string;
  embedding:Embeddings;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor(directory?:string , embedding?:Embeddings) {
    this.directory = directory;
    this.embedding = embedding;
    try {
      if(directory  !== undefined) {
        HNSWLib.load(directory, embedding).then((hnswlibStore) => {
          this.hnswlibStore = hnswlibStore;
        }).catch((error) => {
          console.log(error);
        });
      }
    } catch (error) {
      console.log(error)
    }

  }

  public static getInstance(directory?:string , embedding?:Embeddings): MyVectorStore {
    if (!MyVectorStore.instance) {
        MyVectorStore.instance =  new MyVectorStore(directory , embedding);
    }
    return MyVectorStore.instance;
  }
  public static async resetInstance(docs:Document<Record<string, any>>[] , newEmbedding:Embeddings) {
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      newEmbedding
    );
    const directory = './fileProcessing';
    await vectorStore.save(directory);
    MyVectorStore.instance = new MyVectorStore(directory , newEmbedding);
  }
} */