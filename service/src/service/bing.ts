import {BingSerpAPI} from 'langchain/tools'
export class BingService{
    async search(body) {
      const { message,api_key} = body;
        const bing=new BingSerpAPI(api_key)
        
        return bing._call(message)
      }

}