import React, {useRef, useState} from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import {changePdfScale, drawerToggleAction, setPdfViewer} from "../actions";
import { makeStyles } from "@material-ui/core/styles";
import 'pdfjs-dist/web/pdf_viewer.css';
import Loading from "./Loading";
import Paper from "@material-ui/core/Paper";
import MySvgIcon from "./SvgIcon";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
    container: {
        overflowY: "auto",
        height: 'calc(100% - 64px)',
        justifyContent: "center",
        background: '#3e3e3e',
        position: "relative"
    },
    viewerContainer: {
        overflow: 'auto',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    pdfJsToolbar: {
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: '40px',
        "& > *": {
            // width: theme.spacing(16),
            // height: theme.spacing(5),
            width: '220px',
            height: '50px',
            background: 'rgba(0,0,0,1)',
            opacity: .8,
        }
    },
    paperRoot: {
        display: "flex",
        justifyContent: "space-around",
        fontSize: '1.5em'
    },
    btn: {
        color: '#d5d5d5'
    }
}))

/**
 * PDF Viewer(单页面，速度快)
 * @param props
 * @returns {*}
 * @constructor
 */
const DocPreview = (props) => {
    const canvasRef = useRef(null);
    const dispatch = useDispatch()
    const classes = useStyles()

    const pdfViewer = useSelector(state => {
        return state.appInfo.pdfViewer
    })
    const scale = React.useMemo(() => pdfViewer.scale, [pdfViewer])
    const currentNumPage = React.useMemo(() => pdfViewer.currentNumPage, [pdfViewer])

    const canvasOutRef = useRef(null);
    const { pdfDocument, pdfPage } = usePdf({
        workerSrc: `/static/pdfjs/2.2.228/pdf.worker.js`,
        file: props.file.previewUrl,
        page: currentNumPage,
        canvasRef,
        scale,
        onPageLoadSuccess: () => {
            dispatch(setPdfViewer({
                ...pdfViewer,
                numPages: pdfDocument.numPages,
            }))
        },
        onPageRenderSuccess: () => {
            const canvas = canvasRef.current
            const pageDiv = canvasOutRef.current
            pageDiv.setAttribute('style', `position: relative; height: ${canvas.height + 18}px; width: ${canvas.width + 18}px;`);
        }
    });

    React.useEffect(() => {
        dispatch(drawerToggleAction(false))
        dispatch(setPdfViewer({
            ...pdfViewer,
            isPreview: true,
            fileName: props.file.fileName
        }))
        return () => {
            dispatch(setPdfViewer({
                isPreview: false,
                scale: 1,
                fileName: '',
                numPages: 0,
                currentNumPage: 1,
                scrollTop: 0
            }))
        }
    }, [])

    const [toolBarVisiable, setToolBarVisiable] = useState(false)
    const [opacity, setOpacity] = useState(8)

    const handleMouseMove = (e) => {
        if (toolBarVisiable || !pdfDocument) {
            return
        }
        setOpacity(8)
        setToolBarVisiable(true)
        setTimeout(() => {
            const id = setInterval(() => {
                setOpacity(prevState => {
                    if (prevState > 0) {
                        return prevState - 1
                    } else {
                        clearInterval(id)
                        setToolBarVisiable(false)
                        return 0
                    }
                })
            }, 50)
        }, 3000)

    }

    const handleZoomIn = () => {
        if (pdfViewer.scale + 0.1 > 2.0) {
            return
        }
        dispatch(changePdfScale(pdfViewer.scale + 0.1))
    }
    const handleZoomOut = () => {
        if (pdfViewer.scale - 0.1 < 0.4) {
            return
        }
        dispatch(changePdfScale(pdfViewer.scale - 0.1))
    }

    return (
        <div className={classes.container}>
            <div className={classes.viewerContainer} onMouseMove={handleMouseMove}>
                <div className={'pdfViewer'}>
                    <div className={'page'} ref={canvasOutRef}>
                        {!pdfDocument && <Loading type={"DualRing"} size={50} />}
                        <canvas ref={canvasRef} />
                    </div>
                </div>
            </div>
            {
                toolBarVisiable && pdfDocument && (
                    <div className={classes.pdfJsToolbar} style={{opacity: opacity / 10}}>
                        <Paper elevation={3} classes={{root: classes.paperRoot}}>
                            <IconButton aria-label="放大" color="secondary" onClick={handleZoomIn} className={classes.btn}>
                                <MySvgIcon name={'#icon-plus_circle'}/>
                            </IconButton>
                            <IconButton aria-label="缩小" color="secondary" onClick={handleZoomOut} className={classes.btn}>
                                <MySvgIcon name={'#icon-minus_circle'}/>
                            </IconButton>
                        </Paper>
                    </div>
                )
            }
        </div>
    );
};

DocPreview.propTypes = {
    file: PropTypes.object
}

export default DocPreview
