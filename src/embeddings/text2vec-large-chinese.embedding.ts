import axios from 'axios';
import { chunkArray } from "langchain/dist/util/chunk";
import { Embeddings } from "langchain/embeddings";
export class T2VLargeChineseEmbeddings extends Embeddings {
    modelName;
    batchSize;
    stripNewLines;
    timeout;
    client;
    clientConfig;

    constructor(fields, configuration) {
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
        const apiKey = fields?.openAIApiKey ??
            // eslint-disable-next-line no-process-env
            (typeof process !== "undefined" ? process.env.OPENAI_API_KEY : undefined);
        if (!apiKey) {
            throw new Error("OpenAI API key not found");
        }
        this.modelName = fields?.modelName ?? this.modelName;
        this.batchSize = fields?.batchSize ?? this.batchSize;
        this.stripNewLines = fields?.stripNewLines ?? this.stripNewLines;
        this.timeout = fields?.timeout;
        this.clientConfig = {
            apiKey,
            ...configuration,
        };
    }
    async embedDocuments(texts) {
        const subPrompts = chunkArray(this.stripNewLines ? texts.map((t) => t.replaceAll("\n", " ")) : texts, this.batchSize);
        const embeddings = [];
        for (let i = 0; i < subPrompts.length; i += 1) {
            const input = subPrompts[i];
            const { data } = await this.embeddingWithRetry({
                model: this.modelName,
                input,
            });
            for (let j = 0; j < input.length; j += 1) {
                embeddings.push(data.data[j].embedding);
            }
        }
        return embeddings;
    }
    async embedQuery(text) {
        const { data } = await this.embeddingWithRetry({
            model: this.modelName,
            input: this.stripNewLines ? text.replaceAll("\n", " ") : text,
        });
        return data.data[0].embedding;
    }
    async embeddingWithRetry(request) {
      const makeCompletionRequest = async (params:any) => {
        const res: any = await axios.post('http://192.168.1.99:56721/', params, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return res;
      };
        return this.caller.call(makeCompletionRequest, request);
    }
}
