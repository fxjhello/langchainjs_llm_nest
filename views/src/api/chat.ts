import qs from 'qs'
import { api } from './api'

export const chat = (params: any) => {
  return api({
    url: '/chat',
    method: 'post',
    data: qs.stringify(params),
  })
}
export const chatOpenAI = (params: any) => {
  return api({
    url: '/chatOpenAI',
    method: 'post',
    data: qs.stringify(params),
  })
}

export const chatfile = (params: any) => {
  return api({
    url: '/chatfile',
    method: 'post',
    data: qs.stringify(params),
  })
}
export const chatfileOpenai = (params: any) => {
  return api({
    url: '/chatfileOpenai',
    method: 'post',
    data: qs.stringify(params),
  })
}

export const getfilelist = () => {
  return api({
    url: '/file/query-list',
    method: 'get',
  })
}

export const deletefile = (params: any) => {
  return api({
    url: '/file/delete',
    method: 'post',
    data: qs.stringify(params),
  })
}

export const setembedding = (params: any) => {
  return api({
    url: '/set-embedding',
    method: 'post',
    data: qs.stringify(params),
  })
}
