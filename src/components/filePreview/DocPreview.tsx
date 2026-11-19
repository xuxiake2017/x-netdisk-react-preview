// @ts-nocheck -- Legacy Redux state pending typed refactor.
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { changePdfScale, drawerToggleAction, setPdfViewer } from '../../actions'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import MySvgIcon from '../common/SvgIcon'
import Loading from '../common/Loading'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString()

const useStyles = makeStyles(() => ({
    container: {
        height: 'calc(100% - 64px)',
        background: '#3e3e3e',
        position: 'relative',
        overflow: 'hidden'
    },
    viewerContainer: {
        position: 'absolute',
        inset: 0,
        overflow: 'auto'
    },
    document: {
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '16px'
    },
    page: {
        boxShadow: '0 2px 12px rgba(0, 0, 0, .45)'
    },
    status: {
        minHeight: 240,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
    },
    pdfJsToolbar: {
        display: 'flex',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 40,
        pointerEvents: 'none',
        '& > *': {
            width: 220,
            height: 50,
            background: 'rgba(0, 0, 0, 1)',
            opacity: .8,
            pointerEvents: 'auto'
        }
    },
    paperRoot: {
        display: 'flex',
        justifyContent: 'space-around',
        fontSize: '1.5em'
    },
    btn: {
        color: '#d5d5d5'
    }
}))

const DocPreview = ({ file }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const pdfViewer = useSelector(state => state.appInfo.pdfViewer)
    const [errorMessage, setErrorMessage] = useState('')
    const [toolBarVisible, setToolBarVisible] = useState(false)
    const [opacity, setOpacity] = useState(8)

    const source = useMemo(() => ({
        url: file.previewUrl,
        // 关闭整文件流和自动预取，仅按页面解析所需区间读取。
        // 初始 200 请求只用于确认文件大小及 Range 能力，读取响应头后会立即取消。
        disableRange: false,
        disableStream: true,
        disableAutoFetch: true,
        rangeChunkSize: 256 * 1024
    }), [file.previewUrl])

    useEffect(() => {
        dispatch(drawerToggleAction(false))

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
    }, [dispatch])

    const handleLoadSuccess = useCallback(({ numPages }) => {
        setErrorMessage('')
        dispatch(setPdfViewer({
            ...pdfViewer,
            isPreview: true,
            fileName: file.fileName,
            numPages,
            currentNumPage: 1
        }))
    }, [dispatch, file.fileName, pdfViewer])

    const handleLoadError = useCallback((error) => {
        console.error('PDF preview failed', error)
        setErrorMessage('PDF 加载失败，请确认预览文件已生成，并且文件服务支持跨域与 HTTP Range 请求。')
    }, [])

    const handleMouseMove = () => {
        if (toolBarVisible || !pdfViewer.isPreview) {
            return
        }
        setOpacity(8)
        setToolBarVisible(true)
        window.setTimeout(() => {
            const id = window.setInterval(() => {
                setOpacity(previous => {
                    if (previous > 0) {
                        return previous - 1
                    }
                    window.clearInterval(id)
                    setToolBarVisible(false)
                    return 0
                })
            }, 50)
        }, 3000)
    }

    const handleZoomIn = () => {
        if (pdfViewer.scale < 2) {
            dispatch(changePdfScale(Number((pdfViewer.scale + 0.1).toFixed(1))))
        }
    }

    const handleZoomOut = () => {
        if (pdfViewer.scale > 0.4) {
            dispatch(changePdfScale(Number((pdfViewer.scale - 0.1).toFixed(1))))
        }
    }

    return (
        <div className={classes.container}>
            <div className={classes.viewerContainer} onMouseMove={handleMouseMove}>
                <Document
                    className={classes.document}
                    file={source}
                    loading={<div className={classes.status}><Loading type="DualRing" size={50} /></div>}
                    error={<div className={classes.status}><Typography>{errorMessage || 'PDF 加载失败'}</Typography></div>}
                    onLoadSuccess={handleLoadSuccess}
                    onLoadError={handleLoadError}
                >
                    <Page
                        className={classes.page}
                        pageNumber={pdfViewer.currentNumPage}
                        scale={pdfViewer.scale}
                        renderAnnotationLayer
                        renderTextLayer
                    />
                </Document>
            </div>
            {toolBarVisible && pdfViewer.isPreview && (
                <div className={classes.pdfJsToolbar} style={{ opacity: opacity / 10 }}>
                    <Paper elevation={3} classes={{ root: classes.paperRoot }}>
                        <IconButton aria-label="放大" onClick={handleZoomIn} className={classes.btn}>
                            <MySvgIcon name="#icon-plus_circle" />
                        </IconButton>
                        <IconButton aria-label="缩小" onClick={handleZoomOut} className={classes.btn}>
                            <MySvgIcon name="#icon-minus_circle" />
                        </IconButton>
                    </Paper>
                </div>
            )}
        </div>
    )
}

DocPreview.propTypes = {
    file: PropTypes.shape({
        previewUrl: PropTypes.string.isRequired,
        fileName: PropTypes.string.isRequired
    }).isRequired
}

export default DocPreview
