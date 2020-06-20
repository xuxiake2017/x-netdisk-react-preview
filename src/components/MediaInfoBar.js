import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import {
    ZoomIn,
    ZoomOut,
    ArrowDownward,
    ArrowUpward
} from '@material-ui/icons'
import {setPdfViewer, changePdfScale, changePdfCurrentNumPage} from "../actions";
import { useDispatch, useSelector } from "react-redux";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        ...theme.mixins.toolbar,
        position: "absolute",
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        // width: '100%',
        // margin: '0 50px',
        display: "flex",
        alignItems: "center"
    },
    inputPaper: {
        backgroundColor: '#303030',
        width: 40
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        marginLeft: theme.spacing(1),
        color: '#FFF',
        height: 30
    },
    typography: {
        margin: '0 10px'
    },
    btn: {
        color: '#999999'
    }
}))

const MediaInfoBar = (props) => {

    const classes = useStyles()
    const dispatch = useDispatch()
    const pdfViewer = useSelector(state => {
        return state.appInfo.pdfViewer
    })
    const handleZoomIn = () => {
        if (pdfViewer.scale + 0.1 > 4.0) {
            return
        }
        dispatch(changePdfScale(pdfViewer.scale + 0.1))
    }
    const handleZoomOut = () => {
        if (pdfViewer.scale - 0.1 < 0.1) {
            return
        }
        dispatch(changePdfScale(pdfViewer.scale - 0.1))
    }
    const handleChange = (e) => {
        console.log(e)
    }
    const handlePagePrev = () => {
        if (pdfViewer.currentNumPage === 1) {
            return
        }
        dispatch(changePdfCurrentNumPage(pdfViewer.currentNumPage - 1))
    }
    const handlePageNext = (e) => {
        if (pdfViewer.currentNumPage === pdfViewer.numPages) {
            return
        }
        // debugger
        dispatch(changePdfCurrentNumPage(pdfViewer.currentNumPage + 1))
    }
    return (
        <React.Fragment>
            <div className={classes.root}>
                {/*<IconButton aria-label="放大" color="secondary" onClick={handleZoomIn}>*/}
                {/*    <ZoomIn />*/}
                {/*</IconButton>*/}
                {/*<IconButton aria-label="缩小" color="secondary" onClick={handleZoomOut}>*/}
                {/*    <ZoomOut />*/}
                {/*</IconButton>*/}

                <IconButton aria-label="上一页" color="secondary" onClick={handlePagePrev} className={classes.btn}>
                    <ArrowUpward />
                </IconButton>

                <Paper classes={{
                    root: classes.inputPaper
                }}>
                    <InputBase classes={{
                        root: classes.input
                    }} onChange={handleChange} value={pdfViewer.currentNumPage}
                    />
                </Paper>
                <Typography className={classes.typography}>|</Typography>
                <Typography>{pdfViewer.numPages}</Typography>


                <IconButton aria-label="下一页" color="secondary" onClick={handlePageNext} className={classes.btn}>
                    <ArrowDownward />
                </IconButton>
            </div>
        </React.Fragment>
    )
}

export default MediaInfoBar
