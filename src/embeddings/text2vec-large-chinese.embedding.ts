import axios from 'axios';

import { Embeddings } from "langchain/embeddings";
export class T2VLargeChineseEmbeddings extends Embeddings {
    modelName;
    batchSize;
    stripNewLines;
    timeout;
    client;
    clientConfig;

    constructor(fields?, configuration?) {
        super(fields ?? {});
        Object.defineProperty(this, "modelName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "text-embedding-ada-002"
        });
        Object.defineProperty(this, "batchSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 512
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

        this.modelName = fields?.modelName ?? this.modelName;
        this.batchSize = fields?.batchSize ?? this.batchSize;
        this.stripNewLines = fields?.stripNewLines ?? this.stripNewLines;
        this.timeout = fields?.timeout;
        this.clientConfig = {
         
            ...configuration,
        };
    }
    async embedDocuments(texts) {
        const subPrompts = chunkArray(this.stripNewLines ? texts.map((t) => t.replaceAll("\n", " ")) : texts, this.batchSize);

        console.log('subPrompts',subPrompts);
        
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
        const { data } = await this.embeddingWithRetry({
            model: this.modelName,
            input: text,
        });
        return data.embedding;
    }
    async embeddingWithRetry(request) {

        
        const makeCompletionRequest = async (params:any) => {
            console.log('request',params);
            const res: any = await axios.post('http://192.168.1.99:56391/embedDocuments', params, {
                headers: {
                'Content-Type': 'application/json',
                },
            });
            return res;
        };
        return this.caller.call(makeCompletionRequest, request);
    }
}
function chunkArray (arr, chunkSize) {
   return  arr.reduce((chunks, elem, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    const chunk = chunks[chunkIndex] || [];
    // eslint-disable-next-line no-param-reassign
    chunks[chunkIndex] = chunk.concat([elem]);
    return chunks;
}, []);
}