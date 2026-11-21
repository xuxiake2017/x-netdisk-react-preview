import request from '../utils/request'
import qs from 'qs'

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

export interface RecyclePage {
    total: number
    pages: number
    pageNum: number
    pageSize: number
    list: RecycleItem[]
}

interface RecycleResult<T = any> {
    code: number
    msg?: string
    data: T
}

export const GetRecycleList = (params: { pageNum: number; pageSize: number; fileRealName?: string }) => request({
    url: '/recycle/toRecycleList',
    method: 'get',
    params
}) as unknown as Promise<RecycleResult<RecyclePage>>

export const RebackRecycleFile = (params: { recycleId: number; fileKey: string }) => request({
    url: '/recycle/reback',
    method: 'post',
    data: qs.stringify(params)
}) as unknown as Promise<RecycleResult>

export const DeleteRecycleFile = (recycleId: number) => request({
    url: `/recycle/delete/${recycleId}`,
    method: 'delete'
}) as unknown as Promise<RecycleResult>
