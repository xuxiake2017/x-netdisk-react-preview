import Navbar from "./NavBar";
import React, {useEffect} from "react";
import {
    makeStyles, Divider
} from "@material-ui/core";
import FileList from "./FileList";
import { useDispatch } from "react-redux";
import {GetFileList} from "../api/file";
import FileBreadcrumbs from "./FileBreadcrumbs";

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
    return (
        <div className={classes.root}>
            <Navbar>
                <div className={classes.breadcrumb}>
                    <FileBreadcrumbs pathStore={pathStore} onClick={jump}/>
                </div>
                <Divider/>
                <div className={classes.fileList}>
                    <FileList dirList={dirList} fileList={fileList} onFileClick={file => {
                        handleFileClick(file)
                    }} onFileDoubleClick={file => {
                        handleFileDoubleClick(file)
                    }}/>
                </div>
            </Navbar>
        </div>
    )
}

export default Home
