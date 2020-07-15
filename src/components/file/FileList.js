import React from "react";
import {Grid, Typography} from "@material-ui/core";
import FileIcon from "./FileIcon";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Loading from "../common/Loading";
import FileListView from "./FileListView";
import {useSelector} from "react-redux";
import ListFinishedText from "./ListFinishedText";

const useStyles = makeStyles((theme) => ({
    typeHeader: {
        margin: "10px 25px",
        color: "#6b6b6b",
        fontWeight: "500"
    }
}))

const FileList = (props) => {
    const classes = useStyles()
    const handleFileClick = (file) => {
        props.onFileClick(file)
    }
    const handleFileDoubleClick = (file) => {
        props.onFileDoubleClick(file)
    }
    const viewMode = useSelector(({ fileExplorer }) => {
        return fileExplorer.viewMode
    })
    const pagination = {
        count: props.count,
        rowsPerPage: props.rowsPerPage,
        page: props.page,
        onChangePage: (event, newPage) => {
            props.setReload(true)
            props.onChangePage(event, newPage)
        },
        onChangeRowsPerPage: (event) => {
            props.setReload(true)
            props.onChangeRowsPerPage(event)
        }
    }
    return (
        <React.Fragment>
            {
                props.loading && (
                    <Loading type={"DualRing"} size={50} />
                )
            }
            {
                !props.loading && viewMode === 'LIST' && (
                    <FileListView fileList={[
                        ...props.dirList,
                        ...props.fileList
                    ]} onFileClick={handleFileClick} onFileDoubleClick={handleFileDoubleClick} {...pagination}/>
                )
            }

            {
                !props.loading && viewMode !== 'LIST' && (
                    props.dirList.length > 0 && (
                        <div>
                            <Typography
                                variant="body2"
                                className={classes.typeHeader}
                            >
                                文件夹
                            </Typography>
                            <Grid
                                container
                                spacing={0}
                                alignItems="flex-start"
                            >
                                {props.dirList.map(file => (
                                    <Grid item xs={6} md={3} sm={4} lg={2} key={file.key}>
                                        <FileIcon file={file} onClick={() => {
                                            handleFileClick(file)
                                        }} onDoubleClick={() => {
                                            handleFileDoubleClick(file)
                                        }}/>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    )
                )
            }
            {
                !props.loading && viewMode !== 'LIST' && (
                    props.fileList.length > 0 && (
                        <div>
                            <Typography
                                variant="body2"
                                className={classes.typeHeader}
                            >
                                文件
                            </Typography>
                            <Grid
                                container
                                spacing={0}
                                alignItems="flex-start"
                            >
                                {props.fileList.map(file => (
                                    <Grid item xs={6} md={3} sm={4} lg={2} key={file.key}>
                                        <FileIcon file={file} onClick={() => {
                                            handleFileClick(file)
                                        }} onDoubleClick={() => {
                                            handleFileDoubleClick(file)
                                        }}/>
                                    </Grid>
                                ))}
                            </Grid>
                        </div>
                    )
                )
            }
            {
                props.finished && !props.loading && viewMode !== 'LIST' && (
                    // 列表加载完毕提示
                    <ListFinishedText/>
                )
            }
        </React.Fragment>
    )
}

FileList.propTypes = {
    dirList: PropTypes.arrayOf(
        PropTypes.shape({
            isDir: PropTypes.number,
            fileName: PropTypes.string,
            filePath: PropTypes.string,
            userId: PropTypes.number,
            parentId: PropTypes.number,
            key: PropTypes.string,
            createTime: PropTypes.number,
            updateTime: PropTypes.number,
            fileExtName: PropTypes.string,
            fileSize: PropTypes.number,
            fileType: PropTypes.number,
            thumbnailUrl: PropTypes.string,
            musicPoster: PropTypes.string
        })
    ).isRequired,
    fileList: PropTypes.arrayOf(
        PropTypes.shape({
            isDir: PropTypes.number,
            fileName: PropTypes.string,
            filePath: PropTypes.string,
            userId: PropTypes.number,
            parentId: PropTypes.number,
            key: PropTypes.string,
            createTime: PropTypes.number,
            updateTime: PropTypes.number,
            fileExtName: PropTypes.string,
            fileSize: PropTypes.number,
            fileType: PropTypes.number,
            thumbnailUrl: PropTypes.string,
            musicPoster: PropTypes.string
        })
    ).isRequired,
    onFileClick: PropTypes.func,
    onFileDoubleClick: PropTypes.func,
    loading: PropTypes.bool,
    count: PropTypes.number,
    rowsPerPage: PropTypes.number,
    page: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangeRowsPerPage: PropTypes.func,
    setReload: PropTypes.func,
    finished: PropTypes.bool,
}

export default FileList
