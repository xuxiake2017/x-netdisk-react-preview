import request from '../utils/request'
import qs from 'qs'

export const RequestLogin = params => {
  return request({
    url: '/user/login',
    method: 'post',
    data: params
  })
}

export const GetInfo = params => {
  return request({
    url: '/user/getInfo',
    method: 'get',
    params
  })
}

export const Logout = () => {
  return request({
    url: '/user/logout',
    method: 'get',
  })
}
