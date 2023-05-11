
import { T2VLargeChineseEmbeddings } from './text2vec-large-chinese.embedding'
import { OpenAIEmbeddings, CohereEmbeddings } from "langchain/embeddings";
import { Embeddings } from "langchain/embeddings";
export class EmbeddingManager {
  private static instance: EmbeddingManager;
  private embeddings: { [key: string]: Embeddings } = {};
  currentEmbedding: Embeddings;
  private constructor(init?: { openAIKey: string, cohereKey: string }) {
    this.embeddings.default = new T2VLargeChineseEmbeddings();
    console.log('openAIKey', init?.openAIKey);

    // init?.openAIKey && (this.embeddings.openai = new OpenAIEmbeddings({ openAIApiKey: init?.openAIKey ?? process.env.OPENAI_API_KEY }));
    (init?.cohereKey || process.env.COHERE_API_KEY) && (this.embeddings.cohere = new CohereEmbeddings({ apiKey: init?.cohereKey ?? process.env.COHERE_API_KEY }));
    this.currentEmbedding = this.embeddings.default;
  }
  public static getInstance(init?: { openAIKey: string, cohereKey: string }): EmbeddingManager {
    if (!EmbeddingManager.instance) {
      if (!init) {
        EmbeddingManager.instance = new EmbeddingManager();
      } else {
        EmbeddingManager.instance = new EmbeddingManager(init);

      }
    }
    return EmbeddingManager.instance;
  }
  public static getEmbedding(name: string): Embeddings {
    return EmbeddingManager.getInstance().embeddings[name];
  }
  public static getCurrentEmbedding(): Embeddings {
    return EmbeddingManager.getInstance().currentEmbedding;
  }
  public static setCurrentEmbedding(name: string): void {
    EmbeddingManager.getInstance().currentEmbedding = EmbeddingManager.getInstance().embeddings[name];
  }
}