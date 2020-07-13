import React, { useRef } from 'react';
import { usePdf } from '@mikecousins/react-pdf';
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { drawerToggleAction, setPdfViewer } from "../actions";
import { makeStyles } from "@material-ui/core/styles";
import 'pdfjs-dist/web/pdf_viewer.css';
import Loading from "./Loading";

const useStyles = makeStyles(() => ({
    container: {
        overflowY: "auto",
        height: 'calc(100% - 64px)',
        justifyContent: "center",
        background: '#3e3e3e',
        position: "relative"
    },
    button: {
        zIndex: 1,
        position: "fixed",
        right: 20,
        bottom: 20
    },
    toolBar: {
        width: '100%',
        height: 32,
        background: '#000',
        position: "fixed",
        top: 0
    },
    viewerContainer: {
        overflow: 'auto',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    loadingSpan: {
        textAlign: "center"
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
            let pageDiv = document.getElementById('canvas-out')
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

    return (
        <div className={classes.container}>
            <div className={classes.viewerContainer}>
                <div className={'pdfViewer'}>
                    <div className={'page'} id={'canvas-out'}>
                        {!pdfDocument && <Loading type={"DualRing"} size={50} />}
                        <canvas ref={canvasRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

DocPreview.propTypes = {
    file: PropTypes.object
}

export default DocPreview
