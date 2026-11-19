import request from '../utils/request'

export const RequestLogin = params => {
  return request({
    url: '/user/login',
    method: 'post',
    data: params
  })
}

export const GetInfo = () => {
  return request({
    url: '/user/getInfo',
    method: 'post'
  })
}

export const Logout = () => {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
