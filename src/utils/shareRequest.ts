import axios from 'axios'
import qs from 'qs'
import AppConf from '../conf/AppConf'
import { getToken } from './auth'

// 分享页允许匿名访问，错误码（不存在/过期/提取码错误）需要页面自行展示，因此不走全局提示
const service = axios.create({
    baseURL: AppConf.baseUrl(),
    timeout: 50000,
    withCredentials: true,
    paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' })
    }
})

service.interceptors.request.use(
    config => {
        const token = getToken()
        if (token) {
            config.headers['X-Token'] = token
        }
        return config
    },
    error => Promise.reject(error)
)

service.interceptors.response.use(
    response => response.data,
    error => {
        const data = error.response && error.response.data
        if (data && typeof data.code !== 'undefined') {
            return Promise.resolve(data)
        }
        return Promise.reject(error)
    }
)

export default service
