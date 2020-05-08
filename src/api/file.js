import request from '../utils/request'
import qs from 'qs'

export const GetFileList = params => {
    return request({
        url: '/file/listFile',
        method: 'post',
        data: qs.stringify(params)
    })
}
