import { Embeddings } from "langchain/embeddings";
import { Document } from "langchain/document";
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
export declare class MyVectorStore {
    private static instance;
    hnswlibStore: HNSWLib;
    directory: string;
    embedding: Embeddings;
    private constructor();
    static getInstance(directory?: string, embedding?: Embeddings): MyVectorStore;
    static resetInstance(docs: Document<Record<string, any>>[], newEmbedding: Embeddings): Promise<void>;
}
