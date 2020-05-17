import Navbar from "./NavBar";
import React, {useEffect} from "react";
import {
    makeStyles, Divider
} from "@material-ui/core";
import FileList from "./FileList";
import {useDispatch, useSelector} from "react-redux";
import {GetFileList, GetFileMediaInfo, UploadMD5} from "../api/file";
import FileBreadcrumbs from "./FileBreadcrumbs";
import Upload from "./upload";
import AppConf from "../conf/AppConf";
import GetFileMD5 from "../utils/getFileMD5";
import ContextMenu from "./ContextMenu";
import {
    delFile,
    openWarningNotification,
    openSuccessNotification,
    storeFile,
    setUserInfo,
    openImagePreviewPopover,
    drawerToggleAction, openErrNotification
} from "../actions";
import { CheckMd5 } from "../api/file";
import { GetInfo } from "../api/user";
import FILE_TYPE from "../utils/FileUtils";
import { useHistory } from "react-router";
import { Scrollbars } from 'react-custom-scrollbars';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    breadcrumb: {
        display: 'flex',
        height: '48px',
        padding: '8px 16px',
        alignItems: 'center',
        position: "relative",
    },
    breadcrumbsButton: {
        fontSize: '1rem'
    },
    fileList: {
        padding: 10,
        height: 'calc(100% - 112px)',
        overflowY: "auto"
    },
    uploadComponent: {
        display: "none"
    }
}))

const Home = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
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
        pages: 0,
        pageNum: 1,
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

    // 加载状态标记
    const [loading, setLoading] = React.useState(false)
    const [finished, setFinised] = React.useState(false)

    // 重载标记
    let reloadFlag = false

    const uploadAction = `${AppConf.baseUrl()}/file/fileUpload`
    useEffect(() => {
        const params = {
            ...pagination,
            ...filters
        }
        getFileList(params)
        dispatch(drawerToggleAction(true))
    }, [])
    // 数据重新加载
    const reLoad = (filters_) => {
        setLoading(true)
        const pagination_ = {
            ...pagination,
            pageNum: 1
        }
        setPagination(pagination_)
        reloadFlag = true;
        getFileList({
            ...filters_,
            ...pagination_
        })
    }
    // 获取文件
    const getFileList = (params) => {
        // setLoading(true)
        setFinised(false)
        GetFileList(params).then(res => {
            setLoading(false)
            const pagination_ = {}
            pagination_.total = res.data.pageInfo.total
            pagination_.pageNum = res.data.pageInfo.pageNum
            pagination_.pageSize = res.data.pageInfo.pageSize
            pagination_.pages = res.data.pageInfo.pages
            if (pagination_.pageNum * pagination_.pageSize > res.data.pageInfo.list.length) {
                setFinised(true)
            }
            setPagination(pagination_)
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
            if (reloadFlag) {
                setDirList([
                    ...dirList_
                ])
                setFileList([
                    ...fileList_
                ])
            } else {
                setDirList([
                    ...dirList,
                    ...dirList_
                ])
                setFileList([
                    ...fileList,
                    ...fileList_
                ])
            }
            reloadFlag = false;
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
            const filters_ = {
                ...filters,
                parentId: file.id
            }
            setFilters(filters_)
            setLoading(true)
            reLoad(filters_)
            const pathStore_ = [...pathStore, {parentId: file.id, fileRealName: file.fileName}]
            setPathStore(pathStore_)
        }
        if (file.fileType === FILE_TYPE.FILE_TYPE_OF_PIC) {
            dispatch(openImagePreviewPopover([
                {
                    src: file.thumbnailUrl,
                    intro: file.fileName
                }
            ]))
        }
        if (file.fileType === FILE_TYPE.FILE_TYPE_OF_VIDEO) {
            history.push('/mediaPreview/1')
            console.log(history)
        }
    }
    // 储存文件树路径
    const [pathStore, setPathStore] = React.useState([
        {parentId: -1, fileRealName: '全部文件'}
    ])
    // 路径跳转
    const jump = (parentId, index) => {
        if ((pathStore.length === 1) || (pathStore.length > 1 && index + 1 === pathStore.length)) {
            return
        }
        const pathStore_ = []
        Object.assign(pathStore_, pathStore)
        pathStore_.splice(index + 1, pathStore_.length - 1)
        setPathStore(pathStore_)
        const filters_ = {
            ...filters,
            parentId
        }
        setFilters(filters_)
        setLoading(true)
        reLoad(filters_)
    }
    const uploadRef = React.useRef(null)
    // 选择文件上传
    const selectFile = () => {
        uploadRef.current.uploadInnerRef.current.handleClick()
        setContextMenuOpen(false)
    }
    // 开始上传
    const startUpload = () => {

        uploadRef.current.submit()
    }
    // 选择上传文件后
    const changeHandle = (file, fileList) => {
        console.log(file)
        if (file.status === 'ready') {

            if (file.size > 1024 * 1024 * 100) {
                dispatch(openWarningNotification('文件过大，请重新选择'))
                return;
            }
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
        if (res.code !== 2000) {
            dispatch(openErrNotification(res.msg))
        } else {
            dispatch(openSuccessNotification(`${file.name}上传成功！`))
            reLoad(filters)
            GetInfo().then(res => {
                dispatch(setUserInfo(res.data))
            })
        }

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
                reLoad(filters)
            }).catch(res => {
            })
            throw new Error('服务器已经存在该文件');
            // return false
        } else {
            // 服务器不存在该文件，需要上传
            return true
        }
    }
    // 分页页码改变
    const handleChangePage = (event, newPage) => {
        if (newPage === pagination.pageNum) {
            return
        }
        const pagination_ = {
            ...pagination,
            pageNum: newPage
        }
        setLoading(true)
        getFileList({
            ...pagination_,
            ...filters
        })
        setPagination(pagination_)
    }
    // 分页大小改变
    const handleChangeRowsPerPage = (event) => {
        const pagination_ = {
            ...pagination,
            pageNum: 1,
            pageSize: +event.target.value
        }
        setLoading(true)
        getFileList({
            ...pagination_,
            ...filters
        })
        setPagination(pagination_)
    }
    // 滚动事件处理（滚动加载）
    const handleScrollFrame = ({ clientHeight,
                                   clientWidth,
                                   left,
                                   scrollHeight,
                                   scrollLeft,
                                   scrollTop,
                                   scrollWidth,
                                   top }) => {
        if (scrollHeight - (scrollTop + clientHeight) < 100) {
            if (pagination.pageNum * pagination.pageSize > (fileList.length + dirList.length)) {
                setFinised(true)
                return;
            }
            if (loading) {
                return
            }
            console.log('翻页')
            const pagination_ = {
                ...pagination,
                pageNum: pagination.pageNum + 1
            }
            getFileList({
                ...pagination_,
                ...filters
            })
            setPagination(pagination_)
        }
    }
    const setReload = (flag) => {
        reloadFlag = flag
    }
    const handleReLoad = (nextViewMode) => {
        if (nextViewMode === 'GRID') {
            return
        }
        reLoad(filters)
    }
    return (
        <div className={classes.root}>
            <Navbar>
                <Upload
                    className={classes.uploadComponent}
                    data={uploadData}
                    withCredentials={true}
                    action={uploadAction}
                    onChange={changeHandle}
                    onSuccess={handleUploadSuccess}
                    autoUpload={false}
                    ref={uploadRef}
                    showFileList={false}
                    beforeUpload={beforeUpload}
                    beforeRemove={beforeRemove}
                    fileList={uploadFileList}
                />
                <div className={classes.breadcrumb}>
                    <FileBreadcrumbs pathStore={pathStore} onClick={jump} onReLoad={handleReLoad}/>
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
                    <Scrollbars onScrollFrame={handleScrollFrame} autoHide>
                        <FileList
                            dirList={dirList}
                            fileList={fileList}
                            loading={loading}
                            count={pagination.pages}
                            page={pagination.pageNum}
                            rowsPerPage={pagination.pageSize}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            onFileClick={file => {
                                handleFileClick(file)
                            }} onFileDoubleClick={file => {
                            handleFileDoubleClick(file)
                        }} setReload={setReload} finised={finished}/>
                    </Scrollbars>
                </div>
            </Navbar>
        </div>
    )
}

export default Home
