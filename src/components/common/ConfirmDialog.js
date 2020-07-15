import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import PropTypes from 'prop-types'
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => (
    {
        paper: {
            width: '30%'
        }
    }
))

const ConfirmDialog = ({ open, onClose, onConfirm, title, contentText }) => {
    const classes = useStyles()
    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{paper: classes.paper}}
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {contentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={onConfirm} color="primary" autoFocus>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    contentText: PropTypes.string.isRequired,
}

export default ConfirmDialog
