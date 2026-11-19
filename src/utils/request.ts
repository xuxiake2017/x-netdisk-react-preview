import axios from 'axios'
import qs from 'qs'
import AppConf from "../conf/AppConf";
import store from "../store/store";
import { openNotification } from "../actions";
import { getToken, removeToken } from "./auth";

// 创建axios实例
const service = axios.create({
    baseURL: AppConf.baseUrl(), // api 的 base_url
    timeout: 50000, // 请求超时时间
    withCredentials: true,
    paramsSerializer: function (params) {
        return qs.stringify(params, {arrayFormat: 'repeat'})
    }
})

// request拦截器
service.interceptors.request.use(
    config => {
        // 让每个请求携带自定义token 请根据实际情况自行修改
        const token = getToken()
        if (token) {
            config.headers['X-Token'] = token
        }
        return config
    },
    error => {
        // Do something with request error
        Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非20000是抛错 可结合自己业务进行修改
         */
        const res = response.data
        if (res.code !== 20000) {
            store.dispatch(openNotification({
                autoHideDuration: 3000,
                severity: 'error',
                message: response.data.msg
            }))
            // 登录过期
            if (res.code === 20016) {
                removeToken()
                window.setInterval(() => {
                    window.location.reload()
                }, 1000)
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error) // for debug
        store.dispatch(openNotification({
            autoHideDuration: 3000,
            severity: 'error',
            message: error
        }))
        return Promise.reject(error)
    }
)

export default service
