"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyVectorStore = void 0;
const hnswlib_1 = require("langchain/vectorstores/hnswlib");
class MyVectorStore {
    constructor(directory, embedding) {
        this.directory = directory;
        this.embedding = embedding;
        try {
            if (directory !== undefined) {
                hnswlib_1.HNSWLib.load(directory, embedding).then((hnswlibStore) => {
                    this.hnswlibStore = hnswlibStore;
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    static getInstance(directory, embedding) {
        if (!MyVectorStore.instance) {
            MyVectorStore.instance = new MyVectorStore(directory, embedding);
        }
        return MyVectorStore.instance;
    }
    static async resetInstance(docs, newEmbedding) {
        const vectorStore = await hnswlib_1.HNSWLib.fromDocuments(docs, newEmbedding);
        const directory = './fileProcessing';
        await vectorStore.save(directory);
        MyVectorStore.instance = new MyVectorStore(directory, newEmbedding);
    }
}
exports.MyVectorStore = MyVectorStore;
//# sourceMappingURL=myVectorStore.js.map