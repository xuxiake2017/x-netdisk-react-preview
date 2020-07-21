import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
    CloudUpload as UploadIcon, CloudDownload as DownloadIcon, CreateNewFolder as CreateNewFolderIcon
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

const ContextMenu = (props) => {

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
            <MenuItem onClick={props.onUpload}>
                <ListItemIcon>
                    <UploadIcon />
                </ListItemIcon>
                <ListItemText primary="上传文件" />
            </MenuItem>
            <MenuItem onClick={props.onMkdir}>
                <ListItemIcon>
                    <CreateNewFolderIcon />
                </ListItemIcon>
                <ListItemText primary="新建文件夹" />
            </MenuItem>
        </StyledMenu>
    );
}

ContextMenu.defaultProps = {
    open: false
}

ContextMenu.propTypes = {
    open: PropTypes.bool,
    mouseX: PropTypes.number,
    mouseY: PropTypes.number,
    onClose: PropTypes.func,
    onUpload: PropTypes.func,
    onMkdir: PropTypes.func,
}

export default ContextMenu
