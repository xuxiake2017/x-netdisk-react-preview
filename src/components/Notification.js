import {
    Snackbar
} from "@material-ui/core";
import React from "react";
import MuiAlert from '@material-ui/lab/Alert'
import { useDispatch, useSelector } from "react-redux"
import { closeNotification } from "../actions";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}

const Notification = (props) => {

    const notification = useSelector(({ appInfo }) => {
        return appInfo.notification
    })
    const dispatch = useDispatch()

    const handleClose = () => {
        dispatch(closeNotification())
    }
    // const open = notification.open
    return (
        <Snackbar open={notification.open} autoHideDuration={notification.autoHideDuration} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <Alert onClose={handleClose} severity={notification.severity}>
                {`${notification.message}`}
            </Alert>
        </Snackbar>
    )
}
export default Notification
