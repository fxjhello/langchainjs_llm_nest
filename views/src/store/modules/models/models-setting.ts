import { defineStore } from 'pinia'

export const modelsStore = defineStore('modelsStore', {
  state: () => {
    return {
      chatglm: true,
      Chatgpt: false,
      embedding: 'default',
      Coherekey: '',
      Openaikey: '',
      Coherepath: '',
      Openaipath: '',
    }
  },

})
