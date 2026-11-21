import request from '../utils/request'
import shareRequest from '../utils/shareRequest'
import qs from 'qs'

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

interface ShareResult<T = any> {
    code: number
    msg?: string
    data: T
}

// 以下接口匿名可访问，结果由调用方按 code 处理
export const GetShareInfo = (shareId: string) => shareRequest({
    url: '/share/getShareFile',
    method: 'get',
    params: { shareId }
}) as unknown as Promise<ShareResult<ShareSummary>>

export const CheckSharePwd = (params: { shareId: string; sharePwd: string }) => shareRequest({
    url: '/share/checkPwd',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ShareResult>

export const GetShareSubList = (params: { shareId: string; sharePwd?: string; parentId?: number }) => shareRequest({
    url: '/share/getSubList',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ShareResult<{ nginxServer: string; files: ShareListFile[] }>>

export const GetShareMediaInfo = (params: { shareId: string; sharePwd?: string; fileId: number }) => shareRequest({
    url: '/share/getFileMediaInfo',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ShareResult<ShareMediaInfo>>

export const SaveShareToCloud = (params: { shareId: string; sharePwd?: string; fileId: number }) => shareRequest({
    url: '/share/saveToCloud',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ShareResult>

// 以下接口需要登录
export const CreateShare = (params: { fileKey: string; isPublic: number; expireDays: number }) => request({
    url: '/share/shareFile',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ShareResult<{ shareFile: MyShare; serverHost: string }>>

export const GetMyShares = (params: { pageNum: number; pageSize: number; fileRealName?: string }) => request({
    url: '/share/findAll',
    method: 'get',
    params
}) as unknown as Promise<ShareResult<{ pageInfo: { total: number; pages: number; pageNum: number; pageSize: number; list: MyShare[] }; serverHost: string }>>

export const DeleteMyShare = (id: number) => request({
    url: `/share/delete/${id}`,
    method: 'delete'
}) as unknown as Promise<ShareResult>
