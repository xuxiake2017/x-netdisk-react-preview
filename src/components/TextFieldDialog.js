import React from "react";
import PropTypes from 'prop-types'
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => (
    {
        paper: {
            width: '30%'
        }
    }
))
const TextFieldDialog = (props) => {
    const classes = useStyles()
    const [value, setValue] = React.useState('')
    const handleChange = (e) => {
        setValue(e.target.value)
    }
    return (
        <React.Fragment>
            <Dialog open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title" classes={{paper: classes.paper}}>
                <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.contentText}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onClose} color="primary">
                        取消
                    </Button>
                    <Button onClick={() => {
                        props.onConfirm(value)
                    }} color="primary">
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

TextFieldDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    contentText: PropTypes.string.isRequired,
}

export default TextFieldDialog
