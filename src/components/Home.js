import Navbar from "./NavBar";
import React, {useEffect} from "react";
import {
    makeStyles, Divider
} from "@material-ui/core";
import FileList from "./FileList";
import {useDispatch, useSelector} from "react-redux";
import {GetFileList, UploadMD5} from "../api/file";
import FileBreadcrumbs from "./FileBreadcrumbs";
import Upload from "./upload";
import AppConf from "../conf/AppConf";
import GetFileMD5 from "../utils/getFileMD5";
import ContextMenu from "./ContextMenu";
import {delFile, openWarningNotification, openSuccessNotification, storeFile, setUserInfo} from "../actions";
import { CheckMd5 } from "../api/file";
import {GetInfo} from "../api/user";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    breadcrumb: {
        display: 'flex',
        height: '48px',
        padding: '8px 16px',
        alignItems: 'center',
    },
    breadcrumbsButton: {
        fontSize: '1rem'
    },
    fileList: {
        padding: 10
    }
}))

const Home = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [fileList, setFileList] = React.useState([])
    const [dirList, setDirList] = React.useState([])
    // 查询过滤条件
    const [filters, setFilters] = React.useState({
        parentId: -1,
        fileRealName: ''
    })
    // 分页参数
    const [pagination, setPagination] = React.useState({
        total: 0,
        pageNum: 0,
        pageSize: 20
    })
    // 文件上传
    const [uploadData, setUploadData] = React.useState({
        parentId: -1,
        md5Hex: '',
        lastModifiedDate: null
    })

    const [uploadFileList, setUploadFileList] = React.useState([])
    const user = useSelector(state => {
        return state.userInfo
    })

    const filesInStore = useSelector(state => {
        return state.files
    })

    const getFile = (uid) => {
        return filesInStore.find(file => file.uid === uid)
    }

    const uploadAction = `${AppConf.baseUrl()}/file/fileUpload`
    useEffect(() => {
        getFileList()
    }, [])
    const getFileList = (params) => {
        GetFileList(params).then(res => {
            const data = res.data.pageInfo.list
            const fileList_ = []
            const dirList_ = []
            data.forEach(item => {
                if (item.isDir === 0) {
                    dirList_.push(item)
                } else if (item.isDir === 1) {
                    fileList_.push(item)
                }
            })
            setDirList(dirList_)
            setFileList(fileList_)
        })
    }
    // 文件单击
    const handleFileClick = (file) => {
        // console.log('handleFileClick', file)
    }
    // 文件双击
    const handleFileDoubleClick = (file) => {
        // console.log('handleFileDoubleClick', file)
        if (file.isDir === 0) {
            const params = {
                parentId: file.id
            }
            getFileList(params)
            const pathStore_ = [...pathStore, {parentId: file.id, fileRealName: file.fileName}]
            setPathStore(pathStore_)
        }
    }
    // 储存文件树路径
    const [pathStore, setPathStore] = React.useState([
        {parentId: -1, fileRealName: '全部文件'}
    ])
    // 路径跳转
    const jump = (parentId, index) => {
        // console.log(parentId, index)
        if ((pathStore.length === 1) || (pathStore.length > 1 && index + 1 === pathStore.length)) {
            return
        }
        const pathStore_ = []
        Object.assign(pathStore_, pathStore)
        pathStore_.splice(index + 1, pathStore_.length - 1)
        setPathStore(pathStore_)
        const params = {
            parentId
        }
        getFileList(params)
    }
    const uploadRef = React.useRef(null)
    const selectFile = () => {
        uploadRef.current.uploadInnerRef.current.handleClick()
        setContextMenuOpen(false)
    }
    const startUpload = () => {

        uploadRef.current.submit()
    }
    const changeHandle = (file, fileList) => {
        console.log(file)
        if (file.status === 'ready') {
            GetFileMD5(file.raw, file.uid, (fileInfo) => {
                let isExist = false;
                console.log(fileInfo)
                CheckMd5({ md5Hex: fileInfo.md5Hex }).then(res => {
                    console.log(res)
                    if (res.data === 20034) {
                        // 服务器存在该MD5值
                        isExist = true
                    } else if (res.data === 20033) {
                        // 服务器不存在该MD5值
                        isExist = false
                    }
                    dispatch(storeFile({ ...fileInfo, isExist, parentId: filters.parentId }))
                    startUpload()
                }).catch(res => {
                    console.log(res)
                })
            })
        }
    }
    // 上传成功回调
    const handleUploadSuccess = (res, file) => {
        dispatch(openSuccessNotification(`${file.name}上传成功！`))
        getFileList(filters)
        GetInfo().then(res => {
            dispatch(setUserInfo(res.data))
        })
    }
    // 鼠标右键点击
    const handleContextMenu = (e) => {
        e.preventDefault()
        setContextMenuOpen(true)
        setContextMenuPosition({
            mouseX: e.clientX,
            mouseY: e.clientY
        })
    }
    const [contextMenuOpen, setContextMenuOpen] = React.useState(false)
    const [contextMenuPosition, setContextMenuPosition] = React.useState({
        mouseX: null,
        mouseY: null
    })
    // 右键菜单关闭
    const onContextMenuClose = () => {
        setContextMenuOpen(false)
        setContextMenuPosition({
            mouseX: null,
            mouseY: null
        })
    }
    // 在文件移除之前
    const beforeRemove = (file, fileList) => {
        // this.$toast(`移除文件"${file.name}"`);
        dispatch(delFile(file.uid))
        return true
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
            const uploadData_ = {
                lastModifiedDate: file_.lastModifiedDate,
                md5Hex: file_.md5Hex,
                parentId: filters.parentId
            }
            setUploadData(uploadData_)
        }
        if (file_.isExist) {
            // 服务器已经存在该文件
            UploadMD5(file_).then(res => {
                dispatch(openSuccessNotification(`${file.name}上传成功！`))
                GetInfo().then(res => {
                    dispatch(setUserInfo(res.data))
                })
                const uploadFileList_ = Object.assign([], uploadFileList)
                uploadFileList_.push({ name: file.name, url: '' })
                setUploadFileList(uploadFileList_)
                getFileList(filters)
            }).catch(res => {
            })
            throw new Error('服务器已经存在该文件');
            // return false
        } else {
            // 服务器不存在该文件，需要上传
            return true
        }
    }
    return (
        <div className={classes.root}>
            <Navbar>
                <div className={classes.breadcrumb}>
                    <FileBreadcrumbs pathStore={pathStore} onClick={jump}/>
                </div>
                <Divider/>
                <div className={classes.fileList} onContextMenu={handleContextMenu}>
                    <ContextMenu
                        open={contextMenuOpen}
                        onClose={onContextMenuClose}
                        mouseX={contextMenuPosition.mouseX}
                        mouseY={contextMenuPosition.mouseY}
                        onUpload={selectFile}
                    />
                    <FileList dirList={dirList} fileList={fileList} onFileClick={file => {
                        handleFileClick(file)
                    }} onFileDoubleClick={file => {
                        handleFileDoubleClick(file)
                    }}/>
                </div>
                <div>
                    <Upload
                        data={uploadData}
                        withCredentials={true}
                        className={classes.uploadTest}
                        action={uploadAction}
                        onChange={changeHandle}
                        onSuccess={handleUploadSuccess}
                        autoUpload={false}
                        ref={uploadRef}
                        showFileList={false}
                        beforeUpload={beforeUpload}
                        fileList={uploadFileList}
                    />
                </div>
            </Navbar>
        </div>
    )
}

export default Home
