import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types'
import PDFJS from 'pdfjs-dist/build/pdf';
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';
import { drawerToggleAction, setPdfViewer, changePdfCurrentNumPage } from "../actions";
import {useDispatch, useSelector} from "react-redux";
import {Scrollbars} from "react-custom-scrollbars";

PDFJS.GlobalWorkerOptions.workerSrc = `/static/pdfjs/pdf.worker.js`;
// PDFJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker')

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
    }
}))

const DocPreview = (props) => {

    const classes = useStyles()
    const pdfViewer = useSelector(state => {
        return state.appInfo.pdfViewer
    })
    const scale = React.useMemo(() => pdfViewer.scale)
    const canvasRef = React.useRef(null);
    const pdfViewerRef = React.useRef(null);

    const [canvasHeight, setCanvasHeight] = React.useState(0)
    const [currentNumPage, setCurrentNumPage] = React.useState(1)

    const setCurrentNumPage_ = React.useCallback((num) => {
        setCurrentNumPage(num)
        dispatch(changePdfCurrentNumPage(num))
    }, [currentNumPage])

    const dispatch = useDispatch()

    React.useEffect(() => {
        if (pdf) {
            // renderPDF(pdf)
            reRenderPDF(pdf)
            console.log(pdfViewerRef.current.scaleX)
        }
    }, [scale])

    React.useEffect(() => {
        dispatch(drawerToggleAction(false))
        getPDF(props.file.previewUrl)
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

    const [pdf, setPdf] = React.useState(null)

    function getPDF(url) {
        PDFJS.getDocument(url).then((pdf) => {
            setPdf(pdf)
            dispatch(setPdfViewer({
                ...pdfViewer,
                isPreview: true,
                fileName: props.file.fileName,
                numPages: pdf.numPages,
            }))
            renderPDF(pdf)
        })
    }

    function reRenderPDF(pdf) {
        for (let num = 1; num <= pdf.numPages; num++) {
            pdf.getPage(num).then((page) => {
                const viewport = page.getViewport({ scale });
                let pageDiv = document.getElementById('page-' + (page.pageIndex + 1))
                pageDiv.setAttribute('style', `position: relative; height: ${viewport.height + 18}px; width: ${viewport.width + 18}px;`);

                const canvas = pageDiv.firstElementChild
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                setCanvasHeight(canvas.height)

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                // reRenderPage(page, renderContext, pageDiv, viewport)
                page.render(renderContext)
            });
        }
    }

    function reRenderPage(page, renderContext, pageDiv, viewport) {
        page.render(renderContext).then(() => {
            return page.getTextContent();
        }).then((textContent) => {
            const textLayerDiv = pageDiv.children[1];
            textLayerDiv.innerHTML = ''

            // 创建新的TextLayerBuilder实例
            const textLayer = new TextLayerBuilder({
                textLayerDiv: textLayerDiv,
                pageIndex: page.pageIndex,
                viewport: viewport
            });

            textLayer.setTextContent(textContent);

            textLayer.render();
        });
    }

    function renderPDF(pdf) {
        const container = pdfViewerRef.current
        container.innerHTML = ''
        for (let num = 1; num <= pdf.numPages; num++) {
            pdf.getPage(num).then((page) => {
                const viewport = page.getViewport({ scale });
                let pageDiv = document.createElement('div');
                pageDiv = document.createElement('div');
                pageDiv.setAttribute('id', 'page-' + (page.pageIndex + 1));
                pageDiv.setAttribute('style', `position: relative; height: ${viewport.height + 18}px; width: ${viewport.width + 18}px;`);
                pageDiv.setAttribute('class', 'page');
                container.appendChild(pageDiv);

                const canvas = document.createElement('canvas');
                pageDiv.appendChild(canvas);
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                console.log(canvas.height)
                setCanvasHeight(canvas.height)

                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                // renderPage(page, renderContext, pageDiv, viewport)
                page.render(renderContext)
            });
        }
    }

    function renderPage(page, renderContext, pageDiv, viewport) {
        page.render(renderContext).then(() => {
            return page.getTextContent();
        }).then((textContent) => {
            // 创建文本图层div
            const textLayerDiv = document.createElement('div');
            textLayerDiv.setAttribute('class', 'textLayer');
            // 将文本图层div添加至每页pdf的div中
            pageDiv.appendChild(textLayerDiv);

            // 创建新的TextLayerBuilder实例
            const textLayer = new TextLayerBuilder({
                textLayerDiv: textLayerDiv,
                pageIndex: page.pageIndex,
                viewport: viewport
            });

            textLayer.setTextContent(textContent);

            textLayer.render();
        });
    }

    const handleScrollFrame = ({ scrollTop }) => {
        setCurrentNumPage_(parseInt(scrollTop / canvasHeight) + 1)
    }

    return (
        <React.Fragment>
            <div className={classes.container}>
                <div className={classes.viewerContainer}>
                    <Scrollbars onScrollFrame={handleScrollFrame}>
                        <div ref={pdfViewerRef} className={'pdfViewer'}/>
                    </Scrollbars>
                </div>
            </div>
        </React.Fragment>
    );
}

DocPreview.propTypes = {
    file: PropTypes.object
}

export default DocPreview
