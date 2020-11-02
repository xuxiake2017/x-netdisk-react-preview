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
    const filesInStore = useSelector(state => {
        return state.files
    })

    // 文件上传
    const [uploadData, setUploadData] = React.useState({
        parentId: -1,
        md5Hex: '',
        lastModifiedDate: null
    })
    const [uploadProgressOpen, setUploadProgressOpen] = React.useState(false)
    const [uploadFileList, setUploadFileList] = React.useState([])
    // fileListRef为空后，重新加载文件列表
    const fileListRef = React.useRef([])

    const getFile = (uid) => {
        return filesInStore.find(file => file.uid === uid)
    }

    // 选择上传文件后
    const changeHandle = (file, fileList) => {
        // console.log(file)
        if (file.status === 'ready') {

            if (file.size > 1024 * 1024 * 100) {
                dispatch(openWarningNotification('文件过大，请重新选择'))
                return;
            }
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
                    fileListRef.current.push({...fileInfo, isExist, parentId: props.filters.parentId})
                    startUpload(file.uid)
                }).catch(res => {
                    console.log(res)
                })
            })
        }
    }
    // 上传成功回调
    const handleUploadSuccess = (res, file) => {
        console.log('handleUploadSuccess', file)
        if (res.code !== 20000) {
            dispatch(openErrNotification(res.msg))
        } else {
            dispatch(openSuccessNotification(`${file.name}上传成功！`))
            // reLoad(filters)
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

    // 开始上传
    const startUpload = (uid) => {
        ref.current.submit(uid)
    }

    // 在文件上传之前
    const beforeUpload = (file) => {
        const availableMemory = user.availableMemory
        if (file.size > availableMemory) {

            dispatch(openWarningNotification('剩余空间不足，请删除部分文件再试'))
            throw new Error('剩余空间不足，请删除部分文件再试');
        }
        const file_ = getFile(file.uid)
        if (!file_) {
            dispatch(openWarningNotification('MD5未计算完毕'))
            throw new Error('MD5未计算完毕');
        } else {
            setUploadData({
                lastModifiedDate: file_.lastModifiedDate,
                md5Hex: file_.md5Hex,
                parentId: props.filters.parentId
            })
        }
        if (file_.isExist) {
            // 服务器已经存在该文件
            UploadMD5(file_).then(res => {
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
            }).catch(res => {
            })
            throw new Error('服务器已经存在该文件');
            // return false
        } else {
            // 服务器不存在该文件，需要上传
            return true
        }
    }
    const handleProgress = (event, file, fileList) => {

        setUploadProgressOpen(true)
        const file_ = Object.assign({}, file)
        file_.percentage = event.percent
        const uploadFileList_ = Object.assign([], fileList)
        uploadFileList_.splice(fileList.indexOf(file), 1, file_)
        setUploadFileList(uploadFileList_)
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
                data={uploadData}
                withCredentials={true}
                action={uploadAction}
                onChange={changeHandle}
                onSuccess={handleUploadSuccess}
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
})

UploadWithBusiness.propTypes = {
    onReLoad: PropTypes.func,
    filters: PropTypes.object
}

UploadWithBusiness.displayName = 'UploadWithBusiness'

export default UploadWithBusiness
