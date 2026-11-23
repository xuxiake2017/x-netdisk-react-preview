import request from '../utils/request'
import qs from 'qs'
import type { ApiResult, PageInfo } from './types'

// 文件夹 / 文件列表项（FileShowInfo）
export interface UserFileItem {
    id: number
    originId?: number | null
    fileName: string
    isDir: number
    userId?: number
    parentId: number
    key: string
    status?: number
    createTime?: number | string
    updateTime?: number | string
    fileExtName?: string
    fileSize?: number | null
    fileType: number
    thumbnailUrl?: string
    musicPoster?: string
}

// /dir/listAllDir 返回的文件夹节点
export interface DirItem {
    id: number
    fileName: string
    isDir: number
    parentId?: number
    key: string
    status?: number
    createTime?: number | string
    updateTime?: number | string
}

export interface FileOriginInfo {
    id: number
    filePath?: string
    previewUrl: string
    fileRealName?: string
    fileExtName?: string
    fileSize?: number
    fileType: number
    userId?: number
    md5Hex?: string
    fileStatus?: number
    createTime?: number | string
    updateTime?: number | string
}

export interface FileMediaItem {
    id?: number
    originId?: number
    shootTime?: number | string
    imgWidth?: number
    imgHeight?: number
    videoWidth?: number
    videoHeight?: number
    videoDuration?: number
    thumbnailUrl?: string
    musicPoster?: string
    musicArtist?: string
}

// /file/getFileMediaInfo 返回值（FileShowMedia）
export interface FileMediaDetail {
    id: number
    originId?: number
    fileName: string
    filePath?: string
    isDir: number
    userId?: number
    parentId?: number
    key: string
    status?: number
    createTime?: number | string
    updateTime?: number | string
    fileMedia: FileMediaItem | null
    fileOrigin: FileOriginInfo
}

export interface FileListParams {
    pageNum?: number
    pageSize?: number
    parentId?: number
    fileRealName?: string
    orderBy?: string
}

export interface CheckMd5Params {
    md5Hex: string
}

// 秒传参数（FileUploadParamByMD5）
export interface UploadByMd5Params {
    md5Hex: string
    fileSize: number
    fileRealName: string
    lastModifiedDate?: number
    parentId?: number
}

export interface MkDirParams {
    fileName: string
    parentId: number
}

export interface DeleteFileParams {
    fileKey: string
}

export interface MoveFileParams {
    parentId: number
    key: string
}

export interface FileMediaQuery {
    fileKey: string
}

export const GetFileList = (params: FileListParams) => {
    return request({
        url: '/file/listFile',
        method: 'post',
        // 以formdata传输参数
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<PageInfo<UserFileItem>>>
}

export const GetPicList = (params: FileListParams) => {
    return request({
        url: '/file/getPicList',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<PageInfo<UserFileItem>>>
}

export const GetVideoList = (params: FileListParams) => {
    return request({
        url: '/file/getVideoList',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<PageInfo<UserFileItem>>>
}

export const GetAudioList = (params: FileListParams) => {
    return request({
        url: '/file/getAudioList',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<PageInfo<UserFileItem>>>
}

export const GetDocumentList = (params: FileListParams) => {
    return request({
        url: '/file/getDocumentList',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<PageInfo<UserFileItem>>>
}

export const CheckMd5 = (params: CheckMd5Params) => {
    return request({
        url: '/file/checkMd5',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<number>>
}

export const UploadMD5 = (params: UploadByMd5Params) => {
    return request({
        url: '/file/uploadMD5',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<unknown>>
}

export const GetFileMediaInfo = (params: FileMediaQuery) => {
    return request({
        url: '/file/getFileMediaInfo',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<FileMediaDetail>>
}

export const MkDir = (params: MkDirParams) => {
    return request({
        url: '/dir/mkDir',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<unknown>>
}

export const DeleteFile = (params: DeleteFileParams) => {
    return request({
        url: '/file/deleteFile',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<unknown>>
}

export const ListAllDir = (params: { parentId: number }) => {
    return request({
        url: '/dir/listAllDir',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<DirItem[]>>
}

export const MoveFile = (params: MoveFileParams) => {
    return request({
        url: '/dir/moveFile',
        method: 'post',
        data: qs.stringify(params)
    }) as unknown as Promise<ApiResult<unknown>>
}
