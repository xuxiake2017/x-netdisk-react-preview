import AppConf from '../conf/AppConf'
import { formatDate } from './FileUtils'

export const SHARE_PWD_LOCKED = 20134
export const SHARE_NOT_AUTHENTICATED = 20141
export const SHARE_UN_AUTHENTICATED = 41000

const SHARE_ERROR_TEXT = {
    20131: '您所访问的资源不存在',
    20132: '分享密码错误',
    20133: '分享已过期',
    20134: '提取码错误次数过多，请稍后再试',
    20141: '请先登录',
    20142: '您的剩余空间不足，请删除部分文件再试！',
    20143: '保存失败，目标目录存在同名文件夹',
    20144: '保存失败',
    20151: '下载出错',
    20161: '获取文件列表错误',
    20191: '获取分享文件媒体信息错误',
    30000: '参数为空或错误',
    41000: '未授权',
    43000: '禁止访问'
}

export const shareErrorText = (code, msg) => {
    if (msg) {
        return msg
    }
    return SHARE_ERROR_TEXT[code] || '操作失败，请稍后重试'
}

// 分享地址始终指向当前部署的前端（HashRouter）
export const buildShareUrl = (shareId) => {
    const { origin, pathname } = window.location
    return `${origin}${pathname.replace(/index\.html$/, '')}#/s/${encodeURIComponent(shareId)}`
}

export const pwdStorageKey = (shareId) => `share_pwd_${shareId}`

export const formatShareTime = (value, pattern = 'yyyy-MM-dd hh:mm') => {
    if (!value) {
        return '--'
    }
    const date = value instanceof Date ? value : new Date(value)
    if (isNaN(date.getTime())) {
        return '--'
    }
    return formatDate(date, pattern)
}

export const isShareExpired = (overTime) => {
    if (!overTime) {
        return false
    }
    const date = new Date(overTime)
    return !isNaN(date.getTime()) && date.getTime() <= Date.now()
}

export const copyText = async (text) => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return true
        }
    } catch (e) {
    }
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    let copied = false
    try {
        copied = document.execCommand('copy')
    } catch (e) {
        copied = false
    }
    textarea.remove()
    return copied
}

let downloadFrame = null

// 下载接口是带鉴权的 POST 且直接返回文件流，用隐藏表单提交，避免把文件读入内存
export const downloadShareFile = (shareId, sharePwd, fileId) => {
    if (downloadFrame) {
        downloadFrame.remove()
    }
    const frame = document.createElement('iframe')
    frame.name = `share-download-${Date.now()}`
    frame.style.display = 'none'
    document.body.appendChild(frame)
    downloadFrame = frame

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = `${AppConf.baseUrl()}/share/download`
    form.target = frame.name
    form.style.display = 'none'
    const fields = {
        shareId: String(shareId),
        sharePwd: sharePwd || ''
    } as { [key: string]: string }
    if (fileId !== undefined && fileId !== null) {
        fields.fileId = String(fileId)
    }
    Object.keys(fields).forEach(name => {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = fields[name]
        form.appendChild(input)
    })
    document.body.appendChild(form)
    form.submit()
    form.remove()
}
