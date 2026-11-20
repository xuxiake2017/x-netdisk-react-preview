import request from '../utils/request'
import qs from 'qs'

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

export const SendRegisterEmailCode = params => {
  return request({
    url: '/verify/sendCodeToEmail',
    method: 'post',
    data: qs.stringify(params)
  })
}

export const RegisterByEmail = params => {
  return request({
    url: '/user/register',
    method: 'post',
    data: qs.stringify(params)
  })
}
