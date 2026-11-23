// 后端统一响应结构；request / shareRequest 已在拦截器中剥离 axios 外壳
export interface ApiResult<T = unknown> {
    code: number
    msg?: string
    data: T
}

// PageHelper 分页结构（仅保留前端使用的字段）
export interface PageInfo<T> {
    total: number
    pages: number
    pageNum: number
    pageSize: number
    list: T[]
}

// 分页查询通用参数
export interface PageQuery {
    pageNum?: number
    pageSize?: number
    fileRealName?: string
}
