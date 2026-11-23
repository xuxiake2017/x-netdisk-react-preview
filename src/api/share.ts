import request from '../utils/request'
import shareRequest from '../utils/shareRequest'
import qs from 'qs'
import type { ApiResult, PageInfo, PageQuery } from './types'

export interface ShareSummary {
    shareId: string
    shareTime: number | string
    shareUser: string
    avatar?: string
    fileId: number
    fileKey: string
    fileName: string
    fileSize?: number
    fileType: number
    isDir: number
    isPublic: number
    overTime?: number | string | null
}

export interface ShareListFile {
    id: number
    key: string
    fileName: string
    isDir: number
    fileType: number
    fileSize?: number
    thumbnailUrl?: string
    musicPoster?: string
    parentId?: number
    userId?: number
    createTime?: number | string
    updateTime?: number | string
}

export interface ShareMediaInfo {
    fileName: string
    fileOrigin: {
        fileType: number
        previewUrl: string
        fileSize?: number
    }
    fileMedia: {
        thumbnailUrl?: string
        musicPoster?: string
        musicArtist?: string
        videoWidth?: number
        videoHeight?: number
        videoDuration?: number
    } | null
}

export interface MyShare {
    id: number
    shareId: string
    sharePwd?: string | null
    shareTime: number | string
    overTime?: number | string | null
    isPublic: number
    accessTimes?: number
    downloadTimes?: number
    saveTimes?: number
    fileId: number
    fileName: string
    fileSize?: number
    fileType: number
    isDir: number
}

export interface CheckSharePwdParams {
    shareId: string
    sharePwd: string
}

export interface ShareListParams {
    shareId: string
    sharePwd?: string
    parentId?: number
}

export interface ShareFileParams {
    shareId: string
    sharePwd?: string
    fileId: number
}

export interface CreateShareParams {
    fileKey: string
    isPublic: number
    expireDays: number
}

export interface MySharePage {
    pageInfo: PageInfo<MyShare>
    serverHost: string
}

export interface ShareSubList {
    nginxServer: string
    files: ShareListFile[]
}

// 以下接口匿名可访问，结果由调用方按 code 处理
export const GetShareInfo = (shareId: string) => shareRequest({
    url: '/share/getShareFile',
    method: 'get',
    params: { shareId }
}) as unknown as Promise<ApiResult<ShareSummary>>

export const CheckSharePwd = (params: CheckSharePwdParams) => shareRequest({
    url: '/share/checkPwd',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ApiResult<null>>

export const GetShareSubList = (params: ShareListParams) => shareRequest({
    url: '/share/getSubList',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ApiResult<ShareSubList>>

export const GetShareMediaInfo = (params: ShareFileParams) => shareRequest({
    url: '/share/getFileMediaInfo',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ApiResult<ShareMediaInfo>>

export const SaveShareToCloud = (params: ShareFileParams) => shareRequest({
    url: '/share/saveToCloud',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ApiResult<null>>

// 以下接口需要登录
export const CreateShare = (params: CreateShareParams) => request({
    url: '/share/shareFile',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ApiResult<{ shareFile: MyShare; serverHost: string }>>

export const GetMyShares = (params: PageQuery) => request({
    url: '/share/findAll',
    method: 'get',
    params
}) as unknown as Promise<ApiResult<MySharePage>>

export const DeleteMyShare = (id: number) => request({
    url: `/share/delete/${id}`,
    method: 'delete'
}) as unknown as Promise<ApiResult<null>>
