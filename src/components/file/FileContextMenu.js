import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
    Input as OpenDirIcon,
    OpenInNew as OpenFileIcon,
    Delete as DelFileIcon,
    SaveAlt as DownloadFileIcon,
    ControlCamera as MoveFileIcon,
} from '@material-ui/icons';
import PropTypes from 'prop-types'

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
));

const FileContextMenu = (props) => {

    const handleClose = () => {
        props.onClose()
    };

    return (
        <StyledMenu
            keepMounted
            open={props.open}
            onClose={handleClose}
            anchorReference={'anchorPosition'}
            anchorPosition={
                props.mouseY !== null && props.mouseX !== null
                    ? { top: props.mouseY, left: props.mouseX }
                    : undefined
            }
        >
            {
                // 文件夹
                props.file.isDir === 0 && (
                    <div>
                        <MenuItem onClick={props.onOpenDir}>
                            <ListItemIcon>
                                <OpenDirIcon />
                            </ListItemIcon>
                            <ListItemText primary="进入文件夹" />
                        </MenuItem>
                    </div>
                )
            }
            {
                // 文件
                props.file.isDir === 1 && (
                    <div>
                        <MenuItem onClick={props.onOpenFile}>
                            <ListItemIcon>
                                <OpenFileIcon />
                            </ListItemIcon>
                            <ListItemText primary="打开文件" />
                        </MenuItem>
                        <MenuItem onClick={props.onDownloadFile}>
                            <ListItemIcon>
                                <DownloadFileIcon />
                            </ListItemIcon>
                            <ListItemText primary="下载文件" />
                        </MenuItem>
                    </div>
                )
            }
            <MenuItem onClick={props.onDelFile}>
                <ListItemIcon>
                    <DelFileIcon />
                </ListItemIcon>
                <ListItemText primary={`删除文件${props.file.isDir === 0 ? '夹' : ''}`} />
            </MenuItem>
            <MenuItem onClick={props.onMoveFile}>
                <ListItemIcon>
                    <MoveFileIcon />
                </ListItemIcon>
                <ListItemText primary={`移动文件${props.file.isDir === 0 ? '夹' : ''}`} />
            </MenuItem>
        </StyledMenu>
    );
}

FileContextMenu.defaultProps = {
    open: false
}

FileContextMenu.propTypes = {
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
        fileType: PropTypes.number,
        thumbnailUrl: PropTypes.string,
        musicPoster: PropTypes.string
    }),
    open: PropTypes.bool,
    mouseX: PropTypes.number,
    mouseY: PropTypes.number,
    onClose: PropTypes.func,
    onOpenDir: PropTypes.func,
    onOpenFile: PropTypes.func,
    onDelFile: PropTypes.func,
    onDownloadFile: PropTypes.func,
    onMoveFile: PropTypes.func,
}

export default FileContextMenu
