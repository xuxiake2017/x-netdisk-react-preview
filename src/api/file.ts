import request from '../utils/request'
import qs from 'qs'

export const GetFileList = params => {
    return request({
        url: '/file/listFile',
        method: 'post',
        // 以formdata传输参数
        data: qs.stringify(params)
    })
}

export const GetPicList = params => {
    return request({
        url: '/file/getPicList',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const GetVideoList = params => {
    return request({
        url: '/file/getVideoList',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const GetAudioList = params => {
    return request({
        url: '/file/getAudioList',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const GetDocumentList = params => {
    return request({
        url: '/file/getDocumentList',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const CheckMd5 = params => {
    return request({
        url: '/file/checkMd5',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const UploadMD5 = params => {
    return request({
        url: '/file/uploadMD5',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const GetFileMediaInfo = params => {
    return request({
        url: '/file/getFileMediaInfo',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const MkDir = params => {
    return request({
        url: '/dir/mkDir',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const DeleteFile = params => {
    return request({
        url: '/file/deleteFile',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const ListAllDir = params => {
    return request({
        url: '/dir/listAllDir',
        method: 'post',
        data: qs.stringify(params)
    })
}

export const MoveFile = params => {
    return request({
        url: '/dir/moveFile',
        method: 'post',
        data: qs.stringify(params)
    })
}
