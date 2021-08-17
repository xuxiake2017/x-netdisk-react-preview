import React from 'react';
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles';
import Upload from "../upload";
import AppConf from "../../conf/AppConf";
import {
    openErrNotification,
    openSuccessNotification,
    openWarningNotification,
    setUserInfo,
} from "../../actions";
import GetFileMD5 from "../../utils/getFileMD5";
import { CheckMd5, UploadMD5 } from "../../api/file";
import { GetInfo } from "../../api/user";
import { useDispatch, useSelector } from "react-redux";
import UploadProgress from "./UploadProgress";

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
const UploadWithBusiness = React.forwardRef((props, ref) => {

    const dispatch = useDispatch()
    const classes = useStyles()
    const user = useSelector(state => {
        return state.userInfo
    })
    // fileListRef为空后，重新加载文件列表
    const fileListRef = React.useRef([])
    const [uploadProgressOpen, setUploadProgressOpen] = React.useState(false)
    const [uploadFileList, setUploadFileList] = React.useState([])

    // 上传成功回调
    const handleUploadSuccess = (res, file) => {
        if (res.code !== 20000) {
            dispatch(openErrNotification(res.msg))
        } else {
            dispatch(openSuccessNotification(`${file.name}上传成功！`))
            fileListRef.current.splice(fileListRef.current.indexOf(file), 1)
            if (fileListRef.current.length === 0) {
                props.onReLoad()
                GetInfo().then(res => {
                    dispatch(setUserInfo(res.data))
                })
            }
        }
        let flag = true
        uploadFileList.forEach(item => {
            if (item.percentage !== 100) {
                flag = false
            }
        })
        if (flag) {
            setUploadProgressOpen(false)
        }
    }

    /**
     * 在文件上传之前（必须返回Promise，将uploadData传递过去）
     * @param {*} file 
     * @returns {Promise}
     */
    const beforeUpload = async (file) => {

        const availableMemory = user.availableMemory
        if (file.size > 1024 * 1024 * 20) {
            dispatch(openWarningNotification('文件过大，请重新选择'))
            return await Promise.reject(false)
        }
        if (file.size > availableMemory) {
            dispatch(openWarningNotification('剩余空间不足，请删除部分文件再试'))
            return await Promise.reject(false)
        }
        const fileInfo = await GetFileMD5(file, file.uid)
        const checkMd5Res = await CheckMd5({ md5Hex: fileInfo.md5Hex })

        let isExist = false;
        if (checkMd5Res.data === 20034) {
            // 服务器存在该MD5值
            isExist = true
        } else if (checkMd5Res.data === 20033) {
            // 服务器不存在该MD5值
            isExist = false
        }
        const file_ = { ...fileInfo, isExist, parentId: props.filters.parentId }
        fileListRef.current.push(file_)
    
        const uploadData_ = {
            lastModifiedDate: file_.lastModifiedDate,
            md5Hex: file_.md5Hex,
            parentId: props.filters.parentId
        }

        if (file_.isExist) {
            // 服务器已经存在该文件
            await UploadMD5(file_)
            dispatch(openSuccessNotification(`${file.name}上传成功！`))
            let flag = true
            uploadFileList.forEach(item => {
                if (item.percentage !== 100) {
                    flag = false
                }
            })
            if (flag) {
                setUploadProgressOpen(false)
            }
            fileListRef.current.splice(fileListRef.current.indexOf(file), 1)
            if (fileListRef.current.length === 0) {
                props.onReLoad()
                GetInfo().then(res => {
                    dispatch(setUserInfo(res.data))
                })
            }
            return await Promise.reject(false)
        } else {
            // 服务器不存在该文件，需要上传
            return uploadData_
        }
        
    }
    const handleProgress = React.useCallback((event, file, fileList) => {
        if (!uploadProgressOpen) setUploadProgressOpen(true)
        const uploadFileList_ = Object.assign([], fileList)
        setUploadFileList(uploadFileList_)
    }, [uploadProgressOpen])

    // 在文件移除之前
    const beforeRemove = (file, fileList) => {
        return true
    }
    return (
        <React.Fragment>
            <Upload
                className={classes.uploadComponent}
                withCredentials={true}
                action={uploadAction}
                onSuccess={handleUploadSuccess}
                autoUpload={false}
                ref={ref}
                showFileList={false}
                beforeUpload={ async (file) => {
                    return await beforeUpload(file)
                }}
                beforeRemove={beforeRemove}
                onProgress={handleProgress}
                multiple={true}
            />
            <UploadProgress open={uploadProgressOpen} uploadFileList={uploadFileList}/>
        </React.Fragment>
    )
})

UploadWithBusiness.propTypes = {
    onReLoad: PropTypes.func,
    filters: PropTypes.object
}

UploadWithBusiness.displayName = 'UploadWithBusiness'

export default UploadWithBusiness
