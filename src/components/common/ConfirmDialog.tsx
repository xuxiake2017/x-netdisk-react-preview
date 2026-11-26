// @ts-nocheck -- Legacy module pending typed refactor.
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import PropTypes from 'prop-types'
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => (
    {
        paper: {
            width: props => props.width,
            maxWidth: 520,
            [theme.breakpoints.down('sm')]: {
                width: 'calc(100% - 48px)',
                maxWidth: 520,
                margin: theme.spacing(3)
            },
            [theme.breakpoints.down('xs')]: {
                width: 'calc(100% - 32px)',
                maxWidth: 'calc(100% - 32px)',
                margin: theme.spacing(2)
            }
        }
    }
))

const ConfirmDialog = ({ open, onClose, onConfirm, title, ...rest }) => {
    const classes = useStyles(rest)
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
                    {
                        typeof rest.children === 'string' ? (
                            <DialogContentText id="alert-dialog-description">
                                {rest.children}
                            </DialogContentText>
                        ) : (
                            rest.children
                        )
                    }
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

ConfirmDialog.defaultProps = {
    width: '420px'
}

ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    width: PropTypes.string,
}

export default ConfirmDialog
