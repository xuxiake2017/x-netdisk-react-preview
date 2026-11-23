import request from '../utils/request'
import qs from 'qs'
import type { ApiResult, PageInfo, PageQuery } from './types'

export interface RecycleItem {
    recycleId: number
    deleteTime: number | string
    overTime: number | string
    key: string
    fileName: string
    fileSize?: number | null
    fileType: number
    isDir: number
}

export type RecyclePage = PageInfo<RecycleItem>

export type RecycleQuery = PageQuery

export interface RebackRecycleParams {
    recycleId: number
    fileKey: string
}

export const GetRecycleList = (params: RecycleQuery) => request({
    url: '/recycle/toRecycleList',
    method: 'get',
    params
}) as unknown as Promise<ApiResult<RecyclePage>>

// 原父目录不存在时 data 为 20122，文件会被恢复到“我的资源”
export const RebackRecycleFile = (params: RebackRecycleParams) => request({
    url: '/recycle/reback',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<ApiResult<number | null>>

export const DeleteRecycleFile = (recycleId: number) => request({
    url: `/recycle/delete/${recycleId}`,
    method: 'delete'
}) as unknown as Promise<ApiResult<null>>
