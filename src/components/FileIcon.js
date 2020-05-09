import {
    ButtonBase, Divider, lighten, makeStyles
} from "@material-ui/core";
import classNames from "classnames";
import MySvgIcon from "./SvgIcon";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ContentLoader from 'react-content-loader'
import PropTypes from 'prop-types'
import fileIcoFilter from "../utils/FileUtils";

const useStyles = makeStyles((theme) => ({
        container: {
            padding: "14px"
        },

        selected: {
            "&:hover": {
                border: "1px solid #d0d0d0"
            },
            backgroundColor:
                theme.palette.type === "dark"
                    ? "#fff"
                    : lighten(theme.palette.primary.main, 0.8)
        },

        notSelected: {
            "&:hover": {
                backgroundColor: theme.palette.background.default,
                border: "1px solid #d0d0d0"
            },
            backgroundColor: theme.palette.background.paper
        },

        button: {
            border: "1px solid " + theme.palette.divider,
            width: "100%",
            borderRadius: "6px",
            boxSizing: "border-box",
            transition:
                "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            alignItems: "initial",
            display: "initial"
        },
        folderNameSelected: {
            color:
                theme.palette.type === "dark"
                    ? theme.palette.background.paper
                    : theme.palette.primary.dark,
            fontWeight: "500"
        },
        folderNameNotSelected: {
            color: theme.palette.text.secondary
        },
        folderName: {
            // marginTop: "15px",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            marginRight: "20px"
        },
        preview: {
            overflow: "hidden",
            height: "150px",
            width: "100%",
            borderRadius: "6px 6px 0 0",
            backgroundColor: theme.palette.background.default
        },
        previewIcon: {
            overflow: "hidden",
            height: "149px",
            width: "100%",
            borderRadius: "5px 5px 0 0",
            backgroundColor: theme.palette.background.paper,
            paddingTop: "50px"
        },
        iconBig: {
            fontSize: 50
        },
        picPreview: {
            objectFit: "cover",
            width: "100%",
            height: "100%"
        },
        fileInfo: {
            height: "50px",
            display: "flex",
            alignItems: "center",
        },
        icon: {
            margin: "10px 10px 10px 16px",
            height: "30px",
            minWidth: "30px",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "90%",
            // paddingTop: "2px",
            color: theme.palette.text.secondary,
        },
        hide: {
            display: "none"
        },
        loadingAnimation: {
            borderRadius: "6px 6px 0 0",
            height: "100%",
            width: "100%"
        },
        shareFix: {
            marginLeft: "20px"
        }
    }
))
const FileIcon = (props) => {
    const classes = useStyles()
    let [isSelected, setIsSelected] = React.useState(false);
    const handleClick = (e) => {
        setIsSelected(!isSelected)
        props.onClick()
    }
    const handleDoubleClick = (e) => {
        props.onDoubleClick()
    }
    return (
        <div className={classes.container}>
            <ButtonBase
                focusRipple
                className={classNames(
                    {
                        [classes.selected]: isSelected,
                        [classes.notSelected]: !isSelected
                    },
                    classes.button
                )}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
            >
                {props.file.isDir === 1 && (
                    <React.Fragment>
                        {/*文件有预览图显示图片*/}
                        {/*<div className={classes.preview}>*/}
                        {/*    /!*图片懒加载*!/*/}
                        {/*    <LazyLoadImage*/}
                        {/*        className={classNames(classes.picPreview)}*/}
                        {/*        src={'http://www.xikcloud.com:8181/group1/M00/00/00/wKgACl6g---AQoNNAAEaheNx18A470.jpg'}*/}
                        {/*        afterLoad={() => {}}*/}
                        {/*        beforeLoad={() => {}}*/}
                        {/*        onError={() => {}}*/}
                        {/*    />*/}
                        {/*    /!*加载占位组件*!/*/}
                        {/*    <ContentLoader*/}
                        {/*        height={150}*/}
                        {/*        width={170}*/}
                        {/*        className={classNames(classes.loadingAnimation)}*/}
                        {/*    >*/}
                        {/*        <rect*/}
                        {/*            x="0"*/}
                        {/*            y="0"*/}
                        {/*            width="100%"*/}
                        {/*            height="150"*/}
                        {/*        />*/}
                        {/*    </ContentLoader>*/}
                        {/*</div>*/}
                        {/*文件没有预览图显示图标*/}
                        <div className={classes.previewIcon}>
                            <MySvgIcon name={fileIcoFilter(props.file.fileType)} className={classes.iconBig}/>
                        </div>
                        <Divider />
                    </React.Fragment>
                )}
                <div className={classes.fileInfo}>
                    <div
                        className={classNames(classes.icon)}
                    >
                        <MySvgIcon name={fileIcoFilter(props.file.fileType)} height={'30px'} width={'30px'}/>
                    </div>
                    <Tooltip
                        title={props.file.fileName}
                        aria-label={props.file.fileName}
                    >
                        <Typography
                            variant="body2"
                            className={classNames(classes.folderName, {
                                [classes.folderNameSelected]: isSelected,
                                [classes.folderNameNotSelected]: !isSelected
                            })}
                        >
                            {props.file.fileName}
                        </Typography>
                    </Tooltip>
                </div>
            </ButtonBase>
        </div>
    )
}

FileIcon.propTypes = {
    file: PropTypes.shape({
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
        fileType: PropTypes.number
    }).isRequired,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func
}

export default FileIcon
