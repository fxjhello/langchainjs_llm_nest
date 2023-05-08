import qs from 'qs'
import { api } from './api'

export const chat = (params: any) => {
  return api({
    url: '/chat',
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
