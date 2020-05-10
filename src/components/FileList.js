import React from "react";
import {Grid, Typography} from "@material-ui/core";
import FileIcon from "./FileIcon";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

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
    return (
        <React.Fragment>
            {props.dirList.length > 0 && (
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
            )}
            {props.fileList.length > 0 && (
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
            )}
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
    onFileDoubleClick: PropTypes.func
}

export default FileList
