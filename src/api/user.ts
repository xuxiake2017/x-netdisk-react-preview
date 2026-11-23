import request from '../utils/request'
import qs from 'qs'
import type { ApiResult } from './types'

export interface LoginParams {
  loginInfo: string
  password: string
  imgCode: string
  remindPwd?: boolean
}

export interface RegisterByEmailParams {
  email: string
  password: string
  emailCode: string
}

export interface SendRegisterCodeParams {
  email: string
  imgCode: string
}

export interface UpdateProfileParams {
  sex?: number | null
  realName?: string
  signature?: string
  nickName?: string
}

export interface UpdatePasswordPayload {
  oldPassword: string
  newPassword: string
  repeatPassword: string
}

export interface ChangeEmailParams {
  email: string
  emailCode: string
}

export interface ChangePhoneParams {
  phone: string
  phoneCode: string
}

export interface SysMessageItem {
  id: number
  type: number
  title: string
  description?: string
  userId?: number
  status?: number
  createTime?: number | string
}

export interface FriendListItem {
  userId: number
  friendId: number
  username: string
  realName?: string
  avatar?: string
  signature?: string
  nickName?: string
  alias?: string
}

// /user/getInfo、/user/login、注册后的返回值
export interface UserNetdiskInfo {
  id: number
  avatar?: string
  name: string
  totalMemory: number
  usedMemory: number
  availableMemory: number
  token: string
  messages: SysMessageItem[]
  friendList: FriendListItem[]
}

// /user/detail、资料修改、邮箱/手机号改绑后的返回值
export interface UserProfile {
  id: number
  username: string
  sex?: number | null
  realName?: string | null
  regTime?: number | string
  totalMemory?: number
  usedMemory?: number
  phone?: string | null
  email?: string | null
  userStatus?: number
  avatar?: string | null
  signature?: string | null
  nickName?: string | null
}

export const RequestLogin = (params: LoginParams) => {
  return request({
    url: '/user/login',
    method: 'post',
    data: params
  }) as unknown as Promise<ApiResult<UserNetdiskInfo>>
}

export const GetInfo = () => {
  return request({
    url: '/user/getInfo',
    method: 'post'
  }) as unknown as Promise<ApiResult<UserNetdiskInfo>>
}

export const GetUserDetail = () => {
  return request({
    url: '/user/detail',
    method: 'post'
  }) as unknown as Promise<ApiResult<UserProfile>>
}

export const UpdateUserProfile = (params: UpdateProfileParams) => {
  return request({
    url: '/user/update',
    method: 'post',
    data: params
  }) as unknown as Promise<ApiResult<UserProfile>>
}

export const UploadAvatar = (file: File) => {
  const data = new FormData()
  data.append('file', file)
  return request({
    url: '/user/uploadAvatar',
    method: 'post',
    data
  }) as unknown as Promise<ApiResult<string>>
}

export const UpdatePassword = (params: UpdatePasswordPayload) => {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data: qs.stringify(params)
  }) as unknown as Promise<ApiResult<null>>
}

export const SendEmailChangeCode = (email: string) => {
  return request({
    url: '/user/email/sendCode',
    method: 'post',
    data: qs.stringify({ email })
  }) as unknown as Promise<ApiResult<null>>
}

export const ChangeEmail = (params: ChangeEmailParams) => {
  return request({
    url: '/user/email/change',
    method: 'post',
    data: params
  }) as unknown as Promise<ApiResult<UserProfile>>
}

export const SendPhoneChangeCode = (phone: string) => {
  return request({
    url: '/user/phone/sendCode',
    method: 'post',
    data: qs.stringify({ phone })
  }) as unknown as Promise<ApiResult<null>>
}

export const ChangePhone = (params: ChangePhoneParams) => {
  return request({
    url: '/user/phone/change',
    method: 'post',
    data: params
  }) as unknown as Promise<ApiResult<UserProfile>>
}

export const Logout = () => {
  return request({
    url: '/user/logout',
    method: 'post'
  }) as unknown as Promise<ApiResult<null>>
}

export const SendRegisterEmailCode = (params: SendRegisterCodeParams) => {
  return request({
    url: '/verify/sendCodeToEmail',
    method: 'post',
    data: qs.stringify(params)
  }) as unknown as Promise<ApiResult<null>>
}

export const RegisterByEmail = (params: RegisterByEmailParams) => {
  return request({
    url: '/user/register',
    method: 'post',
    data: qs.stringify(params)
  }) as unknown as Promise<ApiResult<UserNetdiskInfo>>
}
