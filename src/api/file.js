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
