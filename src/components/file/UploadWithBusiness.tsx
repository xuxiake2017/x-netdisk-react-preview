// @ts-nocheck -- Legacy module pending typed refactor.
import React from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import Upload from "../upload";
import AppConf from "../../conf/AppConf";
import {
    delFile,
    openErrNotification,
    openSuccessNotification,
    openWarningNotification,
    setUserInfo,
    storeFile
} from "../../actions";
import GetFileMD5 from "../../utils/getFileMD5";
import { CheckMd5, UploadMD5 } from "../../api/file";
import { GetInfo } from "../../api/user";
import { useDispatch, useSelector, useStore } from "react-redux";
import UploadProgress from "./UploadProgress";
import { getToken } from "../../utils/auth";

const useStyles = makeStyles(() => (
    {
        uploadComponent: {
            display: "none"
        }
    }
))

const uploadAction = `${AppConf.baseUrl()}/file/fileUpload`

/*
* 上传组件（包含具体的业务）
* */
const UploadWithBusiness = (props, ref) => {

    const dispatch = useDispatch()
    const classes = useStyles()
    const user = useSelector(state => {
        return state.userInfo
    })
    const store = useStore()

    const [uploadProgressOpen, setUploadProgressOpen] = React.useState(false)
    const [uploadFileList, setUploadFileList] = React.useState([])
    const uploadTasksRef = React.useRef(new Map())
    const pendingFilesRef = React.useRef(new Set())
    const hideTimerRef = React.useRef(null)

    React.useEffect(() => () => {
        if (hideTimerRef.current) {
            window.clearTimeout(hideTimerRef.current)
        }
    }, [])

    const publishUploadTasks = () => {
        setUploadFileList(Array.from(uploadTasksRef.current.values()))
    }

    const addUploadTask = (file) => {
        // 上传组件的成功回调之后还会触发一次 onChange，旧实现可能携带 ready 状态。
        // 同一个 uid 只能创建一次任务，避免完成到 100% 后被重新初始化为 0%。
        if (uploadTasksRef.current.has(file.uid)) return
        if (hideTimerRef.current) {
            window.clearTimeout(hideTimerRef.current)
            hideTimerRef.current = null
        }
        const existingTasks = Array.from(uploadTasksRef.current.values())
        if (existingTasks.length > 0 && existingTasks.every(item => item.status === 'success' || item.status === 'fail')) {
            uploadTasksRef.current.clear()
        }
        uploadTasksRef.current.set(file.uid, {
            uid: file.uid,
            name: file.name,
            percentage: 0,
            status: 'preparing'
        })
        pendingFilesRef.current.add(file.uid)
        publishUploadTasks()
        setUploadProgressOpen(true)
    }

    const updateUploadTask = (uid, patch) => {
        const task = uploadTasksRef.current.get(uid)
        if (!task) return
        if (task.status === 'success' || task.status === 'fail') return
        const nextPatch = { ...patch }
        if (typeof nextPatch.percentage === 'number') {
            nextPatch.percentage = Math.max(task.percentage || 0, nextPatch.percentage)
        }
        uploadTasksRef.current.set(uid, { ...task, ...nextPatch })
        publishUploadTasks()
    }

    const completeUploadTask = (uid, status) => {
        const task = uploadTasksRef.current.get(uid)
        if (task) {
            uploadTasksRef.current.set(uid, {
                ...task,
                status,
                percentage: status === 'success' ? 100 : task.percentage
            })
            publishUploadTasks()
        }

        const tasks = Array.from(uploadTasksRef.current.values())
        if (tasks.length > 0 && tasks.every(item => item.status === 'success' || item.status === 'fail')) {
            setUploadProgressOpen(false)
            hideTimerRef.current = window.setTimeout(() => {
                const currentTasks = Array.from(uploadTasksRef.current.values())
                if (currentTasks.every(item => item.status === 'success' || item.status === 'fail')) {
                    uploadTasksRef.current.clear()
                    setUploadFileList([])
                }
                hideTimerRef.current = null
            }, 1000)
        }
    }

    const finishPendingFile = (uid) => {
        if (!pendingFilesRef.current.delete(uid)) return
        dispatch(delFile(uid))
        if (pendingFilesRef.current.size === 0) {
            props.onReLoad()
            GetInfo().then(res => {
                dispatch(setUserInfo(res.data))
            })
        }
    }

    // 写入 store 后会立即开始上传，此时组件尚未重新渲染，必须直接读取 store
    const getFile = (uid) => {
        return store.getState().files.find(file => file.uid === uid)
    }

    const getUploadData = (file) => {
        const file_ = getFile(file.uid)
        return {
            lastModifiedDate: file_.lastModifiedDate,
            md5Hex: file_.md5Hex,
            parentId: file_.parentId
        }
    }

    // 选择上传文件后
    const changeHandle = (file, fileList) => {
        // console.log(file)
        if (file.status === 'ready') {

            if (file.size > 1024 * 1024 * 100) {
                dispatch(openWarningNotification('文件过大，请重新选择'))
                return;
            }
            addUploadTask(file)
            GetFileMD5(file.raw, file.uid, (fileInfo) => {
                let isExist = false;
                // console.log(fileInfo)
                CheckMd5({md5Hex: fileInfo.md5Hex}).then(res => {
                    console.log(res)
                    if (res.data === 20034) {
                        // 服务器存在该MD5值
                        isExist = true
                    } else if (res.data === 20033) {
                        // 服务器不存在该MD5值
                        isExist = false
                    }
                    dispatch(storeFile({...fileInfo, isExist, parentId: props.filters.parentId}))
                    startUpload(file.uid)
                }).catch(res => {
                    completeUploadTask(file.uid, 'fail')
                    finishPendingFile(file.uid)
                })
            })
        }
    }
    // 上传成功回调
    const handleUploadSuccess = (res, file) => {
        console.log('handleUploadSuccess', file)
        if (res.code !== 20000) {
            dispatch(openErrNotification(res.msg))
            completeUploadTask(file.uid, 'fail')
        } else {
            dispatch(openSuccessNotification(`${file.name}上传成功！`))
            completeUploadTask(file.uid, 'success')
        }
        finishPendingFile(file.uid)
    }

    const handleUploadError = (error, file) => {
        dispatch(openErrNotification(`${file.name}上传失败，请稍后重试`))
        completeUploadTask(file.uid, 'fail')
        finishPendingFile(file.uid)
    }

    // 开始上传
    const startUpload = (uid) => {
        ref.current.submit(uid)
    }

    // 在文件上传之前
    const beforeUpload = (file) => {
        const availableMemory = user.availableMemory
        if (file.size > availableMemory) {

            dispatch(openWarningNotification('剩余空间不足，请删除部分文件再试'))
            completeUploadTask(file.uid, 'fail')
            finishPendingFile(file.uid)
            return false
        }
        const file_ = getFile(file.uid)
        if (!file_) {
            dispatch(openWarningNotification('MD5未计算完毕'))
            completeUploadTask(file.uid, 'fail')
            finishPendingFile(file.uid)
            return false
        }
        if (file_.isExist) {
            // 服务器已经存在该文件
            UploadMD5(file_).then(res => {
                dispatch(openSuccessNotification(`${file.name}上传成功！`))
                completeUploadTask(file.uid, 'success')
                finishPendingFile(file.uid)
            }).catch(res => {
                completeUploadTask(file.uid, 'fail')
                finishPendingFile(file.uid)
            })
            return false
        } else {
            // 服务器不存在该文件，需要上传
            return true
        }
    }
    const handleProgress = (event, file, fileList) => {
        updateUploadTask(file.uid, {
            percentage: Math.max(0, Math.min(100, event.percent || 0)),
            status: 'uploading'
        })
    }
    // 在文件移除之前
    const beforeRemove = (file, fileList) => {
        // this.$toast(`移除文件"${file.name}"`);
        dispatch(delFile(file.uid))
        return true
    }
    return (
        <React.Fragment>
            <Upload
                className={classes.uploadComponent}
                data={getUploadData}
                withCredentials={true}
                headers={getToken() ? { 'X-Token': getToken() } : {}}
                action={uploadAction}
                onChange={changeHandle}
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
                autoUpload={false}
                ref={ref}
                showFileList={false}
                beforeUpload={beforeUpload}
                beforeRemove={beforeRemove}
                onProgress={handleProgress}
                multiple={true}
            />
            <UploadProgress open={uploadProgressOpen} uploadFileList={uploadFileList}/>
        </React.Fragment>
    )
}

UploadWithBusiness.propTypes = {
    onReLoad: PropTypes.func,
    filters: PropTypes.object
}

export default React.forwardRef(UploadWithBusiness)
