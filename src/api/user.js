import request from '@/utils/request'
import {baseUrl} from './const'


export function login(data) {
  return request({
    url: `${baseUrl}/login`,
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: `${baseUrl}/getInfo`,
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
