import { Embeddings } from "langchain/embeddings";
export declare class T2VLargeChineseEmbeddings extends Embeddings {
    modelName: any;
    batchSize: any;
    stripNewLines: any;
    timeout: any;
    client: any;
    constructor(fields?: any);
    embedDocuments(texts: any): Promise<any[]>;
    embedQuery(text: any): Promise<any>;
    embeddingWithRetry(request: any): Promise<any>;
}
