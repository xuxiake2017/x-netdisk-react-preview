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

export const GetUserDetail = () => {
  return request({
    url: '/user/detail',
    method: 'post'
  })
}

export const UpdateUserProfile = params => {
  return request({
    url: '/user/update',
    method: 'post',
    data: params
  })
}

export const UploadAvatar = file => {
  const data = new FormData()
  data.append('file', file)
  return request({
    url: '/user/uploadAvatar',
    method: 'post',
    data
  })
}

export const UpdatePassword = params => {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data: qs.stringify(params)
  })
}

export const SendEmailChangeCode = email => {
  return request({
    url: '/user/email/sendCode',
    method: 'post',
    data: qs.stringify({ email })
  })
}

export const ChangeEmail = params => {
  return request({
    url: '/user/email/change',
    method: 'post',
    data: params
  })
}

export const SendPhoneChangeCode = phone => {
  return request({
    url: '/user/phone/sendCode',
    method: 'post',
    data: qs.stringify({ phone })
  })
}

export const ChangePhone = params => {
  return request({
    url: '/user/phone/change',
    method: 'post',
    data: params
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
