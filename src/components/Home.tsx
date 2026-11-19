// @ts-nocheck -- Legacy module pending typed refactor.
import Navbar from "./NavBar";
import React, {useEffect} from "react";
import { Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FileList from "./file/FileList";
import { useDispatch, useSelector } from "react-redux";
import { GetFileList, MkDir, DeleteFile } from "../api/file";
import FileBreadcrumbs from "./file/FileBreadcrumbs";
import ContextMenu from "./file/ContextMenu";
import {
    openSuccessNotification,
    setUserInfo,
    openImagePreviewPopover,
    drawerToggleAction
} from "../actions";
import { GetInfo } from "../api/user";
import FILE_TYPE from "../utils/FileUtils";
import { useHistory } from "react-router";
import { Scrollbars } from 'react-custom-scrollbars';
import TextFieldDialog from "./common/TextFieldDialog";
import FileContextMenu from "./file/FileContextMenu";
import UploadWithBusiness from "./file/UploadWithBusiness";
import AppConf from "../conf/AppConf"
import ConfirmDialog from "./common/ConfirmDialog";
import MoveFileDialog from "./file/MoveFileDialog";

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
        overflowY: "auto",
        position: "relative"
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

    // 加载状态标记
    const [loading, setLoading] = React.useState(false)
    const [finished, setFinished] = React.useState(false)
    const viewMode = useSelector(state => state.fileExplorer.viewMode)
    const requestId = React.useRef(0)
    const requestPending = React.useRef(false)
    const loadFailed = React.useRef(false)

    // 重载标记
    let reloadFlag = React.useRef(false)

    useEffect(() => {
        const params = {
            ...pagination,
            ...filters
        }
        getFileList(params)
        dispatch(drawerToggleAction(true))
        return () => {
            requestId.current += 1
        }
    }, [])
    // 数据重新加载
    const reLoad = (filters_) => {
        setLoading(true)
        const pagination_ = {
            ...pagination,
            pageNum: 1
        }
        setPagination(pagination_)
        reloadFlag.current = true

        getFileList({
            ...filters_,
            ...pagination_
        })
    }
    // 获取文件
    const getFileList = (params) => {
        const id = ++requestId.current
        const replace = params.pageNum === 1 || reloadFlag.current
        reloadFlag.current = false
        requestPending.current = true
        loadFailed.current = false
        setLoading(true)
        setFinished(false)
        if (replace) {
            setDirList([])
            setFileList([])
        }
        GetFileList(params).then(res => {
            if (id !== requestId.current) return
            const { total, pageNum, pageSize, pages, list } = res.data.pageInfo
            setFinished(pageNum >= pages || list.length === 0)
            setPagination({ total, pageNum, pageSize, pages })
            const fileList_ = []
            const dirList_ = []
            list.forEach(item => {
                if (item.isDir === 0) {
                    dirList_.push(item)
                } else if (item.isDir === 1) {
                    fileList_.push(item)
                }
            })
            setDirList(previous => replace ? dirList_ : [...previous, ...dirList_])
            setFileList(previous => replace ? fileList_ : [...previous, ...fileList_])
        }).catch(() => {
            if (id === requestId.current) loadFailed.current = true
        }).finally(() => {
            if (id !== requestId.current) return
            requestPending.current = false
            setLoading(false)
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
        if (file.fileType === FILE_TYPE.FILE_TYPE_OF_VIDEO
            || file.fileType === FILE_TYPE.FILE_TYPE_OF_MUSIC
            || file.fileType === FILE_TYPE.FILE_TYPE_OF_WORD
            || file.fileType === FILE_TYPE.FILE_TYPE_OF_EXCEL
            || file.fileType === FILE_TYPE.FILE_TYPE_OF_POWERPOINT
            || file.fileType === FILE_TYPE.FILE_TYPE_OF_TXT
            || file.fileType === FILE_TYPE.FILE_TYPE_OF_PDF) {
            history.push(`/mediaPreview/${file.key}`)
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
    // 鼠标右键点击
    const handleContextMenu = (e) => {
        e.preventDefault()
        if (contextMenuOpen || fileContextMenuOpen) {
            return
        }
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
    const handleScrollFrame = ({ clientHeight, scrollHeight, scrollTop }) => {
        if (viewMode === 'LIST' || loading || requestPending.current || finished || clientHeight <= 0 || pagination.pageNum >= pagination.pages) {
            return
        }
        if (scrollHeight - (scrollTop + clientHeight) < 100) {
            getFileList({
                ...pagination,
                ...filters,
                pageNum: pagination.pageNum + 1
            })
        }
    }
    const handleScrollUpdate = (values) => {
        if (!loadFailed.current && values.scrollHeight <= values.clientHeight + 1) {
            handleScrollFrame(values)
        }
    }
    const setReload = (flag) => {
        // reloadFlag = flag
        // setReloadFlag(flag)
        reloadFlag.current = flag
    }
    const handleReLoad = (nextViewMode) => {
        if (nextViewMode === 'GRID') {
            return
        }
        reLoad(filters)
    }
    const  [mkdirDialogOpen, setMkdirDialogOpen] = React.useState(false)
    const handleMkdir = () => {
        setContextMenuOpen(false)
        setMkdirDialogOpen(true)
    }
    const handleMkdirDialogClose = () => {
        setMkdirDialogOpen(false)
    }
    const handleMkdirConfirm = (value) => {

        MkDir({fileName: value, parentId: filters.parentId}).then(res => {
            dispatch(openSuccessNotification(`文件夹"${value}"新建成功！`))
            reLoad(filters)
            setMkdirDialogOpen(false)
        }).catch(res => {
        })
    }
    const uploadRef = React.useRef(null)
    // 选择文件上传
    const selectUploadFile = () => {
        uploadRef.current.uploadInnerRef.current.handleClick()
        setContextMenuOpen(false)
    }
    const [selectFile, setSelectFile] = React.useState({
        isDir: 0
    })
    const handleFileContextMenu = (e, file) => {
        e.stopPropagation()
        e.preventDefault()
        setSelectFile(file)
        if (contextMenuOpen || fileContextMenuOpen) {
            return
        }
        setFileContextMenuPosition({
            mouseX: e.clientX,
            mouseY: e.clientY
        })
        setFileContextMenuOpen(true)
    }
    const [fileContextMenuOpen, setFileContextMenuOpen] = React.useState(false)
    const handleFileContextMenuClose = () => {
        setFileContextMenuOpen(false)
        setFileContextMenuPosition({
            mouseX: null,
            mouseY: null
        })
    }
    const [fileContextMenuPosition, setFileContextMenuPosition] = React.useState({
        mouseX: null,
        mouseY: null
    })
    const handleOpenDir = () => {
        setFileContextMenuOpen(false)
        handleFileDoubleClick(selectFile)
    }
    const handleOpenFile = () => {
        setFileContextMenuOpen(false)
        handleFileDoubleClick(selectFile)
    }
    const handleDelFile = () => {
        setFileContextMenuOpen(false)
        setDelFileDialogOpen(true)
    }
    const handleDownloadFile = () => {
        setFileContextMenuOpen(false)
        const link = document.createElement('a')
        link.href = `${AppConf.baseUrl()}/file/downLoad?fileKey=${encodeURIComponent(selectFile.key)}`
        link.target = '_blank'
        link.rel = 'noopener'
        document.body.appendChild(link)
        link.click()
        link.remove()
    }
    const handleMoveFile = () => {
        setFileContextMenuOpen(false)
        setMoveFileDialogOpen(true)
    }
    const [delFileDialogOpen, setDelFileDialogOpen] = React.useState(false)
    const handleDelFileDialogClose = () => {
        setDelFileDialogOpen(false)
    }
    const handleDelFileConfirm = () => {
        setDelFileDialogOpen(false)
        DeleteFile({ fileKey: selectFile.key }).then(res => {
            dispatch(openSuccessNotification(`删除成功！`))
            reLoad(filters)
            GetInfo().then(res => {
                dispatch(setUserInfo(res.data))
            })
        })
    }
    const [moveFileDialogOpen, setMoveFileDialogOpen] = React.useState(false)
    return (
        <div className={classes.root}>
            <TextFieldDialog
                open={mkdirDialogOpen}
                onClose={handleMkdirDialogClose}
                onConfirm={handleMkdirConfirm}
                title={'删除文件'}
                contentText={''}/>
            <ConfirmDialog open={delFileDialogOpen} title={'提示'} onClose={handleDelFileDialogClose} onConfirm={handleDelFileConfirm} >你确认删除该文件吗?</ConfirmDialog>
            {
                moveFileDialogOpen && (
                    <MoveFileDialog
                        moveFileDialogOpen={moveFileDialogOpen}
                        setMoveFileDialogOpen={flag => {
                            setMoveFileDialogOpen(flag)
                        }}
                        selectFile={selectFile}
                        onReLoad={() => {
                            reLoad(filters)
                        }}
                    />
                )
            }
            <Navbar>
                <UploadWithBusiness ref={uploadRef} onReLoad={() => {
                    reLoad(filters)
                }} filters={filters} />
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
                        onUpload={selectUploadFile}
                        onMkdir={handleMkdir}
                    />
                    <FileContextMenu
                        file={selectFile}
                        open={fileContextMenuOpen}
                        onClose={handleFileContextMenuClose}
                        mouseX={fileContextMenuPosition.mouseX}
                        mouseY={fileContextMenuPosition.mouseY}
                        onOpenDir={handleOpenDir}
                        onOpenFile={handleOpenFile}
                        onDelFile={handleDelFile}
                        onDownloadFile={handleDownloadFile}
                        onMoveFile={handleMoveFile}
                    />
                    <Scrollbars onScrollFrame={handleScrollFrame} onUpdate={handleScrollUpdate} autoHide>
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
                        }} setReload={setReload} finished={finished} onFileContextMenu={handleFileContextMenu}/>
                    </Scrollbars>
                </div>
            </Navbar>
        </div>
    )
}

export default Home
