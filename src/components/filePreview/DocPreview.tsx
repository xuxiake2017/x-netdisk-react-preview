import React, { memo, useEffect, useRef, useState } from 'react'
import { AnnotationEditorType, GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'
import { EventBus, PDFLinkService, PDFViewer } from 'pdfjs-dist/web/pdf_viewer.mjs'
import type { GenericL10n } from 'pdfjs-dist/web/pdf_viewer.mjs'
import 'pdfjs-dist/web/pdf_viewer.css'
import { useDispatch, useSelector } from 'react-redux'
import { changePdfCurrentNumPage, changePdfScale, drawerToggleAction, setPdfViewer } from '../../actions'
import type Reducers from '../../reducers'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { KeyboardArrowUp, KeyboardArrowDown, ViewArray, ZoomIn, ZoomOut } from '@material-ui/icons'
import Loading from '../common/Loading'

GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString()

const MIN_SCALE = 0.1
const MAX_SCALE = 10
const initialViewer = {
    isPreview: false,
    scale: 1,
    fileName: '',
    numPages: 0,
    currentNumPage: 1,
    scrollTop: 0
}

const useStyles = makeStyles(theme => ({
    container: {
        height: 'calc(100% - 64px)',
        display: 'flex',
        flexDirection: 'column',
        background: '#3e3e3e',
        color: '#eee',
        overflow: 'hidden',
        [theme.breakpoints.down('xs')]: {
            height: 'calc(100% - 56px)'
        },
        '@media (max-width: 599.95px) and (orientation: landscape)': {
            height: 'calc(100% - 48px)'
        }
    },
    toolbar: {
        display: 'flex',
        flexWrap: 'wrap',
        flexShrink: 0,
        alignItems: 'center',
        gap: 8,
        minHeight: 48,
        padding: '7px 12px',
        background: '#292929',
        borderBottom: '1px solid #151515',
        '& .MuiIconButton-root': {
            color: '#eee',
            width: 32,
            height: 32,
            borderRadius: 4,
            '&:hover': { background: '#424242' },
            '&.Mui-focusVisible': { outline: '2px solid #80bdff' }
        },
        '& .Mui-disabled': { color: '#777' },
        [theme.breakpoints.down('xs')]: { gap: 4, padding: '7px 8px' }
    },
    toolbarGroup: {
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        gap: 4
    },
    toolbarDivider: {
        width: 1,
        height: 24,
        margin: '0 4px',
        background: '#505050',
        [theme.breakpoints.down('xs')]: { display: 'none' }
    },
    toolbarField: {
        height: 32,
        color: '#eee',
        background: '#424242',
        border: '1px solid #666',
        borderRadius: 4,
        padding: '4px 8px',
        fontFamily: 'inherit',
        fontSize: 13,
        '&:focus-visible': { outline: '2px solid #80bdff', outlineOffset: 1 },
        '&:disabled': { color: '#777', borderColor: '#505050' }
    },
    pageInput: { width: 48, textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
    pageCount: { color: '#bbb', fontSize: 13, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' },
    scaleSelect: { maxWidth: 140, [theme.breakpoints.down('xs')]: { maxWidth: 104 } },
    hint: {
        flex: 1,
        color: '#bbb',
        fontSize: 12,
        whiteSpace: 'nowrap',
        [theme.breakpoints.down('sm')]: { display: 'none' }
    },
    sidebarToggle: { marginLeft: 'auto' },
    content: { position: 'relative', flex: 1, minHeight: 0, display: 'flex' },
    main: { position: 'relative', flex: 1, minWidth: 0 },
    viewerContainer: {
        position: 'absolute',
        inset: 0,
        overflow: 'auto',
        overscrollBehavior: 'contain',
        overflowAnchor: 'none',
        '& .pdfViewer': { padding: '16px 0' },
        '& .pdfViewer .page': { marginBottom: 16, boxSizing: 'content-box' }
    },
    status: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
        background: '#3e3e3e',
        zIndex: 2
    },
    sidebar: {
        width: 184,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#292929',
        borderRight: '1px solid #151515',
        [theme.breakpoints.down('xs')]: { width: 148 }
    },
    sidebarTitle: { padding: '12px 16px', fontSize: 13, borderBottom: '1px solid #444' },
    thumbnails: {
        position: 'relative',
        flex: 1,
        minHeight: 0,
        overflow: 'auto',
        overscrollBehavior: 'contain',
        padding: '12px 8px'
    },
    thumbnail: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: '100%',
        height: 184,
        marginBottom: 12,
        padding: 6,
        border: '2px solid transparent',
        borderRadius: 4,
        color: '#ddd',
        background: 'transparent',
        cursor: 'pointer',
        '&:hover': { background: '#414141' },
        '&:focus-visible': { outline: '2px solid #a8d5ff', outlineOffset: -2 },
        '&[aria-current="page"]': { borderColor: '#80bdff', background: '#394d63', color: '#fff' }
    },
    thumbnailImage: {
        width: 112,
        height: 144,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        '& canvas': { maxWidth: '100%', maxHeight: '100%', boxShadow: '0 2px 6px #111' }
    }
}))

const Thumbnail = memo(function Thumbnail({ pdf, pageNumber, visible, selected, onSelect }: {
    pdf: PDFDocumentProxy
    pageNumber: number
    visible: boolean
    selected: boolean
    onSelect: (page: number) => void
}) {
    const classes = useStyles()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        if (!visible) return
        let cancelled = false
        let renderTask: RenderTask | undefined
        const canvas = canvasRef.current!
        setFailed(false)
        const render = async () => {
            try {
                const page = await pdf.getPage(pageNumber)
                if (cancelled) return
                const original = page.getViewport({ scale: 1 })
                const scale = Math.min(112 / original.width, 144 / original.height)
                const viewport = page.getViewport({ scale })
                const ratio = Math.min(window.devicePixelRatio || 1, 2)
                canvas.width = Math.ceil(viewport.width * ratio)
                canvas.height = Math.ceil(viewport.height * ratio)
                canvas.style.width = `${viewport.width}px`
                canvas.style.height = `${viewport.height}px`
                renderTask = page.render({
                    canvas,
                    viewport,
                    transform: [ratio, 0, 0, ratio, 0, 0]
                })
                await renderTask.promise
            } catch (error) {
                if (!cancelled) setFailed(true)
            }
        }
        void render()
        return () => {
            cancelled = true
            renderTask?.cancel()
            canvas.width = 0
            canvas.height = 0
        }
    }, [pdf, pageNumber, visible])

    return (
        <button
            className={classes.thumbnail}
            data-page-number={pageNumber}
            aria-label={`第 ${pageNumber} 页`}
            aria-current={selected ? 'page' : undefined}
            onClick={() => onSelect(pageNumber)}
            type="button"
        >
            <span className={classes.thumbnailImage}>
                <canvas ref={canvasRef} width={0} height={0} hidden={failed} aria-hidden="true" />
                {failed && '缩略图加载失败'}
            </span>
            <span>{pageNumber}</span>
        </button>
    )
})

const DocPreview = ({ file }: { file: { previewUrl: string; fileName: string } }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const pdfState = useSelector((state: ReturnType<typeof Reducers>) => state.appInfo.pdfViewer)
    const containerRef = useRef<HTMLDivElement>(null)
    const pagesRef = useRef<HTMLDivElement>(null)
    const sidebarRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<PDFViewer | null>(null)
    const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [visibleThumbnails, setVisibleThumbnails] = useState<Set<number>>(new Set())
    const [scalePreset, setScalePreset] = useState('auto')
    const [pageInput, setPageInput] = useState(String(pdfState.currentNumPage))

    useEffect(() => setPageInput(String(pdfState.currentNumPage)), [pdfState.currentNumPage])

    useEffect(() => {
        const container = containerRef.current!
        const abortController = new AbortController()
        const eventBus = new EventBus()
        const linkService = new PDFLinkService({ eventBus, externalLinkTarget: 2 })
        const options = {
            container,
            viewer: pagesRef.current!,
            eventBus,
            linkService,
            annotationEditorMode: AnnotationEditorType.DISABLE,
            abortSignal: abortController.signal
        }
        const viewer = new PDFViewer(options)
        linkService.setViewer(viewer)
        viewerRef.current = viewer
        setLoading(true)
        setErrorMessage('')
        setPdf(null)
        setVisibleThumbnails(new Set())
        dispatch(drawerToggleAction(false))
        dispatch(setPdfViewer(initialViewer))

        const onPagesInit = () => {
            const document = viewer.pdfDocument!
            dispatch(setPdfViewer({
                ...initialViewer,
                isPreview: true,
                fileName: file.fileName,
                numPages: document.numPages
            }))
            viewer.currentScaleValue = 'auto'
            setPdf(document)
            setLoading(false)
        }
        const onPageChanging = ({ pageNumber }: { pageNumber: number }) => {
            dispatch(changePdfCurrentNumPage(pageNumber))
        }
        const onScaleChanging = ({ scale, presetValue }: { scale: number; presetValue?: string }) => {
            dispatch(changePdfScale(scale))
            setScalePreset(presetValue || '')
        }
        eventBus.on('pagesinit', onPagesInit)
        eventBus.on('pagechanging', onPageChanging)
        eventBus.on('scalechanging', onScaleChanging)

        const onWheel = (event: WheelEvent) => {
            if (!event.ctrlKey && !event.metaKey) return
            event.preventDefault()
            if (!viewer.pagesCount || !event.deltaY) return
            const unit = event.deltaMode === 1 ? 30 : event.deltaMode === 2 ? container.clientHeight : 1
            const delta = Math.max(-100, Math.min(100, event.deltaY * unit))
            viewer.updateScale({
                scaleFactor: Math.exp(-delta * 0.002),
                origin: [event.clientX, event.clientY],
                drawingDelay: 150
            })
        }
        container.addEventListener('wheel', onWheel, { passive: false })
        const resizeObserver = new ResizeObserver(() => {
            if (!viewer.pagesCount) return
            if (['auto', 'page-fit', 'page-width'].includes(viewer.currentScaleValue)) {
                viewer.currentScaleValue = viewer.currentScaleValue
            }
            viewer.update()
        })
        resizeObserver.observe(container)

        const task = getDocument({
            url: file.previewUrl,
            // 避免连续阅读和缩略图触发整文件预取，保留按需 Range 请求。
            disableRange: false,
            disableStream: true,
            disableAutoFetch: true,
            rangeChunkSize: 256 * 1024
        })
        const onLoadError = (error: unknown) => {
            if (abortController.signal.aborted) return
            console.error('PDF preview failed', error)
            setLoading(false)
            setErrorMessage('PDF 加载失败，请确认预览文件已生成，并且文件服务支持跨域与 HTTP Range 请求。')
        }
        task.promise.then(document => {
            if (abortController.signal.aborted) return
            linkService.setDocument(document)
            viewer.setDocument(document)
            viewer.pagesPromise.catch(onLoadError)
        }).catch(onLoadError)

        return () => {
            abortController.abort()
            resizeObserver.disconnect()
            container.removeEventListener('wheel', onWheel)
            eventBus.off('pagesinit', onPagesInit)
            eventBus.off('pagechanging', onPageChanging)
            eventBus.off('scalechanging', onScaleChanging)
            viewer.setDocument(null)
            linkService.setDocument(null)
            void (viewer.l10n as GenericL10n).destroy()
            viewerRef.current = null
            void task.destroy()
            dispatch(setPdfViewer(initialViewer))
        }
    }, [dispatch, file.previewUrl, file.fileName])

    useEffect(() => {
        const viewer = viewerRef.current
        if (viewer?.pagesCount && viewer.currentPageNumber !== pdfState.currentNumPage) {
            viewer.currentPageNumber = pdfState.currentNumPage
        }
    }, [pdfState.currentNumPage])

    useEffect(() => {
        const sidebar = sidebarRef.current
        if (!sidebar || !pdf || !sidebarOpen) return
        const observer = new IntersectionObserver(entries => {
            setVisibleThumbnails(previous => {
                const next = new Set(previous)
                for (const entry of entries) {
                    const page = Number((entry.target as HTMLElement).dataset.pageNumber)
                    if (entry.isIntersecting) next.add(page)
                    else next.delete(page)
                }
                return next
            })
        }, { root: sidebar, rootMargin: '180px 0px' })
        sidebar.querySelectorAll('[data-page-number]').forEach(element => observer.observe(element))
        return () => observer.disconnect()
    }, [pdf, sidebarOpen])

    useEffect(() => {
        const sidebar = sidebarRef.current
        const selected = sidebar?.querySelector<HTMLElement>(`[data-page-number="${pdfState.currentNumPage}"]`)
        if (!sidebar || !selected) return
        const top = selected.offsetTop
        const bottom = top + selected.offsetHeight
        if (top < sidebar.scrollTop) sidebar.scrollTop = top
        else if (bottom > sidebar.scrollTop + sidebar.clientHeight) sidebar.scrollTop = bottom - sidebar.clientHeight
    }, [pdfState.currentNumPage, sidebarOpen, pdf])

    const goToPage = React.useCallback((page: number) => {
        if (viewerRef.current?.pagesCount) viewerRef.current.currentPageNumber = page
    }, [])
    const commitPage = () => {
        const page = Number(pageInput)
        if (!pageInput.trim() || !Number.isInteger(page) || page < 1 || page > pdfState.numPages) {
            setPageInput(String(pdfState.currentNumPage))
            return
        }
        goToPage(page)
        setPageInput(String(page))
    }
    const ready = !!pdf && !loading && !errorMessage
    const scaleValue = scalePreset || String(pdfState.scale)
    const fixedScales = ['0.5', '0.75', '1', '1.25', '1.5', '2', '3', '4']

    return (
        <div className={classes.container}>
            <div className={classes.toolbar} role="toolbar" aria-label="PDF 阅读工具">
                <div className={classes.toolbarGroup} role="group" aria-label="页面导航">
                    <IconButton size="small" aria-label="上一页" title="上一页" disabled={!ready || pdfState.currentNumPage <= 1} onClick={() => viewerRef.current?.previousPage()}>
                        <KeyboardArrowUp />
                    </IconButton>
                    <input
                        className={`${classes.toolbarField} ${classes.pageInput}`}
                        aria-label="页码"
                        inputMode="numeric"
                        value={ready ? pageInput : ''}
                        placeholder="—"
                        disabled={!ready}
                        onChange={event => setPageInput(event.target.value)}
                        onFocus={event => event.target.select()}
                        onBlur={commitPage}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                event.preventDefault()
                                commitPage()
                            } else if (event.key === 'Escape') {
                                setPageInput(String(pdfState.currentNumPage))
                            }
                        }}
                    />
                    <Typography component="span" className={classes.pageCount} aria-label={`共 ${pdfState.numPages} 页`}>/ {pdfState.numPages}</Typography>
                    <IconButton size="small" aria-label="下一页" title="下一页" disabled={!ready || pdfState.currentNumPage >= pdfState.numPages} onClick={() => viewerRef.current?.nextPage()}>
                        <KeyboardArrowDown />
                    </IconButton>
                </div>
                <div className={classes.toolbarDivider} aria-hidden="true" />
                <div className={classes.toolbarGroup} role="group" aria-label="缩放控制">
                    <IconButton size="small" aria-label="缩小" title="缩小" disabled={!ready || pdfState.scale <= MIN_SCALE} onClick={() => viewerRef.current?.decreaseScale()}>
                        <ZoomOut />
                    </IconButton>
                    <select
                        className={`${classes.toolbarField} ${classes.scaleSelect}`}
                        aria-label="缩放比例"
                        value={scaleValue}
                        disabled={!ready}
                        onChange={event => { if (viewerRef.current) viewerRef.current.currentScaleValue = event.target.value }}
                    >
                        <option value="auto">自动缩放</option>
                        <option value="page-width">适合页宽</option>
                        <option value="page-fit">适合整页</option>
                        {!scalePreset && !fixedScales.includes(scaleValue) && <option value={scaleValue}>{Math.round(pdfState.scale * 100)}%</option>}
                        {fixedScales.map(scale => <option key={scale} value={scale}>{Number(scale) * 100}%</option>)}
                    </select>
                    <IconButton size="small" aria-label="放大" title="放大" disabled={!ready || pdfState.scale >= MAX_SCALE} onClick={() => viewerRef.current?.increaseScale()}>
                        <ZoomIn />
                    </IconButton>
                </div>
                <Typography className={classes.hint}>连续滚动浏览 · Ctrl + 滚轮缩放</Typography>
                <IconButton className={classes.sidebarToggle} size="small" aria-label={sidebarOpen ? '隐藏缩略图' : '显示缩略图'} title={sidebarOpen ? '隐藏缩略图' : '显示缩略图'} aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(open => !open)}>
                    <ViewArray />
                </IconButton>
            </div>
            <div className={classes.content}>
                {sidebarOpen && (
                    <aside className={classes.sidebar} aria-label="页面缩略图">
                        <Typography className={classes.sidebarTitle}>缩略图{pdf ? ` · ${pdf.numPages} 页` : ''}</Typography>
                        <div ref={sidebarRef} className={classes.thumbnails}>
                            {pdf && Array.from({ length: pdf.numPages }, (_, index) => (
                                <Thumbnail key={`${file.previewUrl}-${index}`} pdf={pdf} pageNumber={index + 1} visible={visibleThumbnails.has(index + 1)} selected={pdfState.currentNumPage === index + 1} onSelect={goToPage} />
                            ))}
                        </div>
                    </aside>
                )}
                <div className={classes.main}>
                    <div ref={containerRef} className={classes.viewerContainer} tabIndex={0} role="region" aria-label="PDF 文档" aria-busy={loading}>
                        <div ref={pagesRef} className="pdfViewer" />
                    </div>
                    {(loading || errorMessage) && (
                        <div className={classes.status} role={errorMessage ? 'alert' : 'status'}>
                            {errorMessage ? <Typography>{errorMessage}</Typography> : <><Loading type="DualRing" size={50} /><span>正在加载 PDF…</span></>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DocPreview
