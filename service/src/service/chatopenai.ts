import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain';
import {
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
    ChatPromptTemplate,
    
  } from "langchain/prompts";
import {GlobalService} from 'src/service/global';

export class ChatopenaiService {
    //文档问答
    async chatfileOpenAI(body) {
        const { message, history , api_key , basePath} = body;
        console.log("step1" , basePath);

        const vectorStore = GlobalService.globalVar
        const result = await vectorStore.similaritySearch(message, 1);
        console.log('step2', result);
        
        const fileSourceStr = result[0].metadata.source
        
        const chat = new OpenAI({ temperature: 0.01 ,openAIApiKey: api_key,}, {basePath: basePath.replace(/\/+$/, '') });
        const translationPrompt = ChatPromptTemplate.fromPromptMessages([
          SystemMessagePromptTemplate.fromTemplate(
            `基于已知内容, 回答用户问题。如果无法从中得到答案，请说'没有足够的相关信息'。已知内容:${result[0].pageContent}`
          ),
          HumanMessagePromptTemplate.fromTemplate("{text}"),
        ]);
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
    
    //自由对话
    async chatOpenAI(body) {
        //根据内容回答问题
        //const app = await NestFactory.create(AppModule);
        const { message, history , api_key , basePath} = body;
        console.log("step1" , message);
        
        const chat = new OpenAI({ temperature: 0.01 ,openAIApiKey: api_key}, {basePath: basePath.replace(/\/+$/, '') });
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
  }