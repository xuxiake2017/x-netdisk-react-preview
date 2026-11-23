// @ts-nocheck -- Legacy module pending typed refactor.
import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import {
    Avatar,
    Button,
    Card,
    Chip,
    Dialog,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core'
import {
    ArrowBack as ArrowBackIcon,
    CloudUpload as CloudUploadIcon,
    Close as CloseIcon,
    FileCopy as FileCopyIcon,
    FolderOpen as FolderOpenIcon,
    GetApp as GetAppIcon,
    Lock as LockIcon,
    Visibility as PreviewIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import Player from 'griffith'
import FileList from '../file/FileList'
import FileBreadcrumbs from '../file/FileBreadcrumbs'
import DocPreview from '../filePreview/DocPreview'
import MusicPlayer from '../filePreview/MusicPlayer'
import MySvgIcon from '../common/SvgIcon'
import Loading from '../common/Loading'
import {
    CheckSharePwd,
    GetShareInfo,
    GetShareMediaInfo,
    GetShareSubList,
    SaveShareToCloud
} from '../../api/share'
import { GetInfo } from '../../api/user'
import { getToken, removeToken } from '../../utils/auth'
import {
    buildShareUrl,
    copyText,
    downloadShareFile,
    formatShareTime,
    isShareExpired,
    pwdStorageKey,
    shareErrorText,
    SHARE_PWD_LOCKED,
    SHARE_NOT_AUTHENTICATED,
    SHARE_UN_AUTHENTICATED
} from '../../utils/share'
import { fileIcoFilter, formatFileSize } from '../../utils/FileUtils'
import { openErrNotification, openSuccessNotification, setUserInfo } from '../../actions'

const PREVIEWABLE_FILE_TYPES = [1, 2, 3, 4, 11, 12, 13, 14]
const DOC_FILE_TYPES = [1, 11, 12, 13, 14]

const useStyles = makeStyles((theme) => ({
    page: {
        minHeight: '100%',
        background: '#f4f5f7',
        paddingBottom: theme.spacing(6)
    },
    header: {
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 2),
        background: 'linear-gradient(45deg, #7A88FF, #ffd586)',
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10
    },
    headerTitle: {
        flex: 1,
        fontWeight: 600,
        letterSpacing: 1
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1)
    },
    headerButton: {
        color: '#fff',
        borderColor: 'rgba(255,255,255,.7)'
    },
    content: {
        width: '100%',
        maxWidth: 1100,
        margin: '0 auto',
        padding: theme.spacing(3, 2, 0),
        boxSizing: 'border-box'
    },
    center: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
    },
    card: {
        padding: theme.spacing(3),
        borderRadius: 8
    },
    pwdCard: {
        maxWidth: 400,
        padding: theme.spacing(4),
        margin: '0 auto',
        textAlign: 'center'
    },
    pwdIcon: {
        fontSize: 48,
        color: theme.palette.primary.main,
        marginBottom: theme.spacing(1)
    },
    pwdForm: {
        marginTop: theme.spacing(2)
    },
    summary: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    summaryIcon: {
        fontSize: 44,
        marginRight: theme.spacing(2),
        flex: 'none'
    },
    summaryMeta: {
        flex: 1,
        minWidth: 200
    },
    summaryName: {
        fontWeight: 600,
        wordBreak: 'break-all'
    },
    summaryInfo: {
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(0.5)
    },
    summaryActions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(2)
    },
    shareUser: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        color: theme.palette.text.secondary
    },
    shareAvatar: {
        width: 22,
        height: 22,
        marginRight: theme.spacing(1)
    },
    errorIcon: {
        fontSize: 56,
        color: theme.palette.grey[500],
        marginBottom: theme.spacing(2)
    },
    breadcrumb: {
        display: 'flex',
        alignItems: 'center',
        height: 48,
        padding: '8px 4px',
        position: 'relative'
    },
    listCard: {
        padding: theme.spacing(2),
        borderRadius: 8,
        minHeight: 200
    },
    listEmpty: {
        textAlign: 'center',
        padding: theme.spacing(6, 2),
        color: theme.palette.text.secondary
    },
    previewBody: {
        flex: 1,
        minHeight: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#3e3e3e',
        overflow: 'hidden'
    },
    previewImage: {
        maxWidth: '100%',
        maxHeight: '75vh',
        objectFit: 'contain'
    },
    previewVideo: {
        width: '100%',
        height: '100%',
        minHeight: '60vh',
        '& video': {
            maxHeight: '75vh'
        }
    },
    previewMusic: {
        width: '100%',
        maxWidth: 660,
        padding: theme.spacing(4, 2),
        background: '#fff',
        borderRadius: 8
    },
    previewDoc: {
        width: '100%',
        height: '75vh',
        background: '#3e3e3e'
    },
    dialogToolbar: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1, 0.5, 2),
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    dialogTitle: {
        flex: 1,
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    }
}))

const toShareFile = (info) => ({
    id: info.fileId,
    key: info.fileKey,
    fileName: info.fileName,
    fileSize: info.fileSize,
    fileType: info.fileType,
    isDir: info.isDir,
    parentId: -1,
    updateTime: info.shareTime,
    createTime: info.shareTime
})

const canPreview = (file) => file.isDir !== 0 && PREVIEWABLE_FILE_TYPES.includes(file.fileType)

const SharePage = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const { shareId } = useParams()
    const [phase, setPhase] = React.useState('loading')
    const [summary, setSummary] = React.useState(null)
    const [errorText, setErrorText] = React.useState('')
    const [pwd, setPwd] = React.useState('')
    const [pwdInput, setPwdInput] = React.useState('')
    const [pwdError, setPwdError] = React.useState('')
    const [pwdBusy, setPwdBusy] = React.useState(false)
    const [pwdLocked, setPwdLocked] = React.useState(false)
    const [path, setPath] = React.useState([])
    const [folders, setFolders] = React.useState([])
    const [files, setFiles] = React.useState([])
    const [listLoading, setListLoading] = React.useState(false)
    const [listError, setListError] = React.useState('')
    const [menu, setMenu] = React.useState({ open: false, x: null, y: null, file: null })
    const [preview, setPreview] = React.useState({ open: false, file: null, loading: false, data: null, error: '' })
    const [saving, setSaving] = React.useState(false)
    const pwdRef = React.useRef('')
    const summaryRef = React.useRef(null)
    const requestId = React.useRef(0)
    const previewId = React.useRef(0)
    const loggedIn = Boolean(getToken())

    const syncUrl = (nextPath) => {
        const segments = nextPath.slice(1).map(item => `${item.id}-${encodeURIComponent(item.fileName)}`)
        const search = segments.length > 0 ? `?path=${segments.join('/')}` : ''
        history.replace(`/s/${encodeURIComponent(shareId)}${search}`)
    }

    const readPathFromUrl = (root) => {
        const raw = new URLSearchParams(location.search).get('path')
        if (!raw) {
            return [root]
        }
        const parts = []
        raw.split('/').forEach(segment => {
            const index = segment.indexOf('-')
            if (index <= 0) {
                return
            }
            const id = Number(segment.slice(0, index))
            let name = ''
            try {
                name = decodeURIComponent(segment.slice(index + 1))
            } catch (e) {
                name = ''
            }
            if (Number.isFinite(id) && name && id !== root.id) {
                parts.push({ id, fileName: name })
            }
        })
        return [root, ...parts]
    }

    const handleListError = (res) => {
        setListLoading(false)
        if (res.code === 20132 || res.code === 20134 || res.code === 30000) {
            sessionStorage.removeItem(pwdStorageKey(shareId))
            pwdRef.current = ''
            setPwd('')
            setPwdInput('')
            setPwdError(shareErrorText(res.code, res.msg))
            setPwdLocked(res.code === SHARE_PWD_LOCKED)
            setPhase('password')
            return
        }
        setListError(shareErrorText(res.code, res.msg))
    }

    const loadList = (parentId, nextPath) => {
        const current = ++requestId.current
        setListLoading(true)
        setListError('')
        GetShareSubList({
            shareId,
            sharePwd: pwdRef.current || undefined,
            parentId: parentId === null ? undefined : parentId
        }).then(res => {
            if (current !== requestId.current) {
                return
            }
            if (res.code !== 20000 || !res.data) {
                handleListError(res)
                return
            }
            const list = res.data.files || []
            setFolders(list.filter(file => file.isDir === 0))
            setFiles(list.filter(file => file.isDir !== 0))
            setPath(nextPath)
            setPhase('ready')
            syncUrl(nextPath)
            setListLoading(false)
        }).catch(() => {
            if (current === requestId.current) {
                setListLoading(false)
                setListError('获取文件列表失败，请检查网络后重试')
            }
        })
    }

    const enterShare = (info, password) => {
        setSummary(info)
        summaryRef.current = info
        pwdRef.current = password || ''
        setPwd(password || '')
        const root = { id: info.fileId, fileName: info.fileName }
        if (info.isDir !== 0) {
            setFolders([])
            setFiles([toShareFile(info)])
            setPath([root])
            setPhase('ready')
            syncUrl([root])
            return
        }
        const initialPath = readPathFromUrl(root)
        loadList(initialPath[initialPath.length - 1].id, initialPath)
    }

    React.useEffect(() => {
        if (!shareId) {
            setErrorText('分享链接不完整')
            setPhase('error')
            return
        }
        let cancelled = false
        setPhase('loading')
        setPwd('')
        setPwdInput('')
        setPwdError('')
        setPwdLocked(false)
        pwdRef.current = ''
        setFolders([])
        setFiles([])
        setPath([])
        setListError('')
        closePreview()
        GetShareInfo(shareId).then(res => {
            if (cancelled) {
                return
            }
            if (res.code !== 20000 || !res.data) {
                setErrorText(shareErrorText(res.code, res.msg))
                setPhase('error')
                return
            }
            const info = res.data
            if (info.isPublic === 1) {
                enterShare(info, '')
                return
            }
            const cached = sessionStorage.getItem(pwdStorageKey(shareId))
            if (!cached) {
                setSummary(info)
                summaryRef.current = info
                setPhase('password')
                return
            }
            CheckSharePwd({ shareId, sharePwd: cached }).then(checked => {
                if (cancelled) {
                    return
                }
                if (checked.code === 20000) {
                    enterShare(info, cached)
                    return
                }
                sessionStorage.removeItem(pwdStorageKey(shareId))
                setSummary(info)
                summaryRef.current = info
                if (checked.code === SHARE_PWD_LOCKED) {
                    setPwdLocked(true)
                    setPwdError(shareErrorText(checked.code, checked.msg))
                }
                setPhase('password')
            }).catch(() => {
                if (!cancelled) {
                    setSummary(info)
                    summaryRef.current = info
                    setPhase('password')
                }
            })
        }).catch(() => {
            if (!cancelled) {
                setErrorText('分享信息加载失败，请检查网络后重试')
                setPhase('error')
            }
        })
        return () => {
            cancelled = true
        }
    }, [shareId])

    const handleCheckPwd = (event) => {
        event.preventDefault()
        const code = pwdInput.trim()
        if (!code || pwdBusy || pwdLocked) {
            return
        }
        setPwdBusy(true)
        setPwdError('')
        CheckSharePwd({ shareId, sharePwd: code }).then(res => {
            if (res.code === 20000) {
                sessionStorage.setItem(pwdStorageKey(shareId), code)
                enterShare(summaryRef.current, code)
                return
            }
            setPwdError(shareErrorText(res.code, res.msg))
            if (res.code === SHARE_PWD_LOCKED) {
                setPwdLocked(true)
            }
        }).catch(() => {
            setPwdError('网络异常，请重试')
        }).finally(() => {
            setPwdBusy(false)
        })
    }

    const handleDownload = (file) => {
        setMenu(menu => ({ ...menu, open: false }))
        downloadShareFile(shareId, pwdRef.current, file.id)
    }

    const handleSaveToCloud = (file) => {
        setMenu(menu => ({ ...menu, open: false }))
        if (!getToken()) {
            history.push('/login?redirect=' + encodeURIComponent(location.pathname + location.search))
            return
        }
        if (saving) {
            return
        }
        setSaving(true)
        SaveShareToCloud({
            shareId,
            sharePwd: pwdRef.current || undefined,
            fileId: file.id
        }).then(res => {
            if (res.code === 20000) {
                dispatch(openSuccessNotification(res.msg || '文件已保存到“我的资源”！'))
                // 保存文件占用了容量，同步刷新侧边栏的存储空间信息
                GetInfo().then(info => {
                    dispatch(setUserInfo(info.data))
                }).catch(() => {})
                return
            }
            if (res.code === SHARE_NOT_AUTHENTICATED || res.code === SHARE_UN_AUTHENTICATED) {
                // 服务端会话已失效时清除本地 token，否则 AuthRoute 会把登录页重定向回分享页
                removeToken()
                history.push('/login?redirect=' + encodeURIComponent(location.pathname + location.search))
                return
            }
            dispatch(openErrNotification(shareErrorText(res.code, res.msg)))
        }).catch(() => {
            dispatch(openErrNotification('保存失败，请稍后重试'))
        }).finally(() => {
            setSaving(false)
        })
    }

    const handleCopyLink = async () => {
        const copied = await copyText(buildShareUrl(shareId))
        dispatch(copied ? openSuccessNotification('链接已复制') : openErrNotification('复制失败，请手动复制地址栏链接'))
    }

    const openPreview = (file) => {
        setMenu(menu => ({ ...menu, open: false }))
        const current = ++previewId.current
        setPreview({ open: true, file, loading: true, data: null, error: '' })
        GetShareMediaInfo({
            shareId,
            sharePwd: pwdRef.current || undefined,
            fileId: file.id
        }).then(res => {
            if (current !== previewId.current) {
                return
            }
            if (res.code !== 20000 || !res.data || !res.data.fileOrigin) {
                setPreview(preview => ({
                    ...preview,
                    loading: false,
                    error: res.code === 20000 ? '该文件暂不支持预览' : shareErrorText(res.code, res.msg)
                }))
                return
            }
            setPreview(preview => ({ ...preview, loading: false, data: res.data }))
        }).catch(() => {
            if (current === previewId.current) {
                setPreview(preview => ({ ...preview, loading: false, error: '预览加载失败，请稍后重试' }))
            }
        })
    }

    const closePreview = () => {
        previewId.current++
        setPreview({ open: false, file: null, loading: false, data: null, error: '' })
    }

    const handleFileDoubleClick = (file) => {
        if (file.isDir === 0) {
            const nextPath = [...path, { id: file.id, fileName: file.fileName }]
            loadList(file.id, nextPath)
            return
        }
        if (canPreview(file)) {
            openPreview(file)
        }
    }

    const handleBreadcrumbClick = (parentId, index) => {
        if (index >= path.length - 1) {
            return
        }
        const nextPath = path.slice(0, index + 1)
        loadList(nextPath[nextPath.length - 1].id, nextPath)
    }

    const handleContextMenu = (event, file) => {
        event.preventDefault()
        event.stopPropagation()
        setMenu({ open: true, x: event.clientX, y: event.clientY, file })
    }

    const handleMenuClose = () => {
        setMenu(menu => ({ ...menu, open: false }))
    }

    const breadcrumbPath = path.map(item => ({ parentId: item.id, fileRealName: item.fileName }))
    const isFolderShare = summary && summary.isDir === 0

    const renderPassword = () => (
        <div className={classes.center}>
            <Card className={classes.pwdCard} elevation={2}>
                <LockIcon className={classes.pwdIcon}/>
                <Typography variant="h6">请输入提取码</Typography>
                <Typography variant="body2" color="textSecondary">
                    {summary ? `“${summary.fileName}”需要提取码才能访问` : ''}
                </Typography>
                <form className={classes.pwdForm} onSubmit={handleCheckPwd}>
                    <TextField
                        autoFocus
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="提取码"
                        value={pwdInput}
                        error={Boolean(pwdError)}
                        helperText={pwdError || ' '}
                        disabled={pwdLocked || pwdBusy}
                        onChange={event => {
                            setPwdInput(event.target.value)
                            setPwdError('')
                        }}
                        inputProps={{ 'aria-label': '提取码', maxLength: 16 }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={pwdBusy || pwdLocked || !pwdInput.trim()}
                    >
                        {pwdBusy ? '验证中…' : '提取文件'}
                    </Button>
                </form>
            </Card>
        </div>
    )

    const renderError = () => (
        <div className={classes.center}>
            <Card className={classes.pwdCard} elevation={2}>
                <LockIcon className={classes.errorIcon}/>
                <Typography variant="h6" gutterBottom>无法打开分享</Typography>
                <Typography variant="body2" color="textSecondary">{errorText}</Typography>
                <Button
                    className={classes.pwdForm}
                    variant="outlined"
                    color="primary"
                    onClick={() => history.push(loggedIn ? '/home' : '/login')}
                >
                    {loggedIn ? '进入我的网盘' : '去登录'}
                </Button>
            </Card>
        </div>
    )

    const renderSummary = () => (
        <Card className={classes.card} elevation={2}>
            <div className={classes.summary}>
                <MySvgIcon
                    name={fileIcoFilter(summary.fileType)}
                    className={classes.summaryIcon}
                    width={'44px'}
                    height={'44px'}
                />
                <div className={classes.summaryMeta}>
                    <Typography variant="h6" className={classes.summaryName}>{summary.fileName}</Typography>
                    <Typography className={classes.summaryInfo} variant="body2">
                        {summary.isDir === 0 ? '文件夹' : formatFileSize(summary.fileSize)}
                        {' · '}
                        {formatShareTime(summary.shareTime)} 创建
                        {' · '}
                        {summary.overTime ? `${formatShareTime(summary.overTime)} 到期` : '永久有效'}
                    </Typography>
                    <div className={classes.shareUser}>
                        <Avatar className={classes.shareAvatar} src={summary.avatar}/>
                        <Typography variant="body2">来自 {summary.shareUser || '好友'} 的分享</Typography>
                    </div>
                </div>
                <div>
                    {summary.isPublic === 1
                        ? <Chip size="small" label="公开分享" color="primary" variant="outlined"/>
                        : <Chip size="small" icon={<LockIcon/>} label="私密分享" variant="outlined"/>}
                    {isShareExpired(summary.overTime) && (
                        <Chip size="small" label="已过期" color="secondary" style={{marginLeft: 8}}/>
                    )}
                </div>
            </div>
            <div className={classes.summaryActions}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<GetAppIcon/>}
                    onClick={() => handleDownload({ id: summary.fileId })}
                >
                    {isFolderShare ? '打包下载' : '下载文件'}
                </Button>
                {!isFolderShare && canPreview({ isDir: summary.isDir, fileType: summary.fileType }) && (
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<PreviewIcon/>}
                        onClick={() => openPreview({ id: summary.fileId, fileName: summary.fileName })}
                    >
                        预览
                    </Button>
                )}
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<CloudUploadIcon/>}
                    disabled={saving}
                    onClick={() => handleSaveToCloud({ id: summary.fileId })}
                >
                    保存到我的网盘
                </Button>
                <Button variant="text" startIcon={<FileCopyIcon/>} onClick={handleCopyLink}>复制链接</Button>
            </div>
        </Card>
    )

    const renderPreviewContent = () => {
        if (preview.loading) {
            return <Loading type="DualRing" size={60}/>
        }
        if (preview.error) {
            return <Typography style={{color: '#fff'}}>{preview.error}</Typography>
        }
        const data = preview.data
        const fileOrigin = data.fileOrigin
        const fileMedia = data.fileMedia || {}
        if (fileOrigin.fileType === 2) {
            return <img className={classes.previewImage} src={fileOrigin.previewUrl} alt={data.fileName}/>
        }
        if (fileOrigin.fileType === 4) {
            return (
                <div className={classes.previewVideo}>
                    <Player
                        id={String(preview.file.id)}
                        title={data.fileName}
                        cover={fileMedia.thumbnailUrl}
                        duration={fileMedia.videoDuration}
                        sources={{
                            sd: {
                                play_url: fileOrigin.previewUrl,
                                bitrate: 0,
                                duration: fileMedia.videoDuration,
                                size: fileOrigin.fileSize,
                                format: 'mp4',
                                width: fileMedia.videoWidth,
                                height: fileMedia.videoHeight
                            }
                        }}
                        src={fileOrigin.previewUrl}
                    />
                </div>
            )
        }
        if (fileOrigin.fileType === 3) {
            return (
                <div className={classes.previewMusic}>
                    <MusicPlayer audio={[{
                        name: data.fileName,
                        artist: fileMedia.musicArtist || '',
                        url: fileOrigin.previewUrl,
                        cover: fileMedia.musicPoster
                    }]}/>
                </div>
            )
        }
        if (DOC_FILE_TYPES.includes(fileOrigin.fileType)) {
            return (
                <div className={classes.previewDoc}>
                    <DocPreview file={{ previewUrl: fileOrigin.previewUrl, fileName: data.fileName }}/>
                </div>
            )
        }
        return <Typography style={{color: '#fff'}}>该文件暂不支持预览</Typography>
    }

    return (
        <div className={classes.page}>
            <div className={classes.header}>
                <Typography className={classes.headerTitle}>X-NetDisk 分享</Typography>
                <div className={classes.headerActions}>
                    {loggedIn ? (
                        <React.Fragment>
                            <Button size="small" className={classes.headerButton} onClick={() => history.push('/home')}>
                                我的网盘
                            </Button>
                            <Button size="small" className={classes.headerButton} onClick={() => history.push('/share')}>
                                我的分享
                            </Button>
                        </React.Fragment>
                    ) : (
                        <Button
                            size="small"
                            className={classes.headerButton}
                            variant="outlined"
                            onClick={() => history.push('/login?redirect=' + encodeURIComponent(location.pathname + location.search))}
                        >
                            登录 / 注册
                        </Button>
                    )}
                </div>
            </div>
            <div className={classes.content}>
                {phase === 'loading' && (
                    <div className={classes.center}>
                        <Loading type="DualRing" size={70}/>
                    </div>
                )}
                {phase === 'error' && renderError()}
                {phase === 'password' && renderPassword()}
                {phase === 'ready' && summary && (
                    <React.Fragment>
                        {renderSummary()}
                        {isFolderShare && (
                            <React.Fragment>
                                <div className={classes.breadcrumb}>
                                    <FileBreadcrumbs
                                        pathStore={breadcrumbPath}
                                        onClick={handleBreadcrumbClick}
                                        onReLoad={() => {
                                            loadList(path[path.length - 1].id, path)
                                        }}
                                    />
                                </div>
                                <Card className={classes.listCard} elevation={2}>
                                    {listError && (
                                        <div className={classes.listEmpty}>
                                            <Typography color="error">{listError}</Typography>
                                            <Button
                                                color="primary"
                                                onClick={() => loadList(path[path.length - 1].id, path)}
                                            >
                                                重新加载
                                            </Button>
                                        </div>
                                    )}
                                    {!listError && folders.length + files.length === 0 && !listLoading && (
                                        <div className={classes.listEmpty}>这个文件夹是空的</div>
                                    )}
                                    <FileList
                                        dirList={folders}
                                        fileList={files}
                                        loading={listLoading}
                                        count={1}
                                        page={1}
                                        rowsPerPage={20}
                                        onChangePage={() => {}}
                                        onChangeRowsPerPage={() => {}}
                                        setReload={() => {}}
                                        finished={false}
                                        onFileClick={() => {}}
                                        onFileDoubleClick={handleFileDoubleClick}
                                        onFileContextMenu={handleContextMenu}
                                    />
                                </Card>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                )}
            </div>
            <Menu
                keepMounted
                open={menu.open}
                onClose={handleMenuClose}
                anchorReference="anchorPosition"
                anchorPosition={menu.x !== null && menu.y !== null ? { top: menu.y, left: menu.x } : undefined}
            >
                {menu.file && menu.file.isDir === 0 && (
                    <MenuItem onClick={() => {
                        const folder = menu.file
                        handleMenuClose()
                        handleFileDoubleClick(folder)
                    }}>
                        <ListItemIcon><FolderOpenIcon fontSize="small"/></ListItemIcon>
                        <ListItemText primary="打开文件夹"/>
                    </MenuItem>
                )}
                {menu.file && canPreview(menu.file) && (
                    <MenuItem onClick={() => openPreview(menu.file)}>
                        <ListItemIcon><PreviewIcon fontSize="small"/></ListItemIcon>
                        <ListItemText primary="预览"/>
                    </MenuItem>
                )}
                {menu.file && menu.file.isDir !== 0 && (
                    <MenuItem onClick={() => handleDownload(menu.file)}>
                        <ListItemIcon><GetAppIcon fontSize="small"/></ListItemIcon>
                        <ListItemText primary="下载文件"/>
                    </MenuItem>
                )}
                {menu.file && menu.file.isDir === 0 && (
                    <MenuItem onClick={() => handleDownload(menu.file)}>
                        <ListItemIcon><GetAppIcon fontSize="small"/></ListItemIcon>
                        <ListItemText primary="打包下载"/>
                    </MenuItem>
                )}
                <Divider/>
                <MenuItem onClick={() => handleSaveToCloud(menu.file)} disabled={saving}>
                    <ListItemIcon><CloudUploadIcon fontSize="small"/></ListItemIcon>
                    <ListItemText primary="保存到我的网盘"/>
                </MenuItem>
            </Menu>
            <Dialog
                open={preview.open}
                onClose={closePreview}
                maxWidth={false}
                aria-labelledby="share-preview-title"
                fullWidth
                PaperProps={{ style: { maxWidth: 1100, height: '85vh' } }}
            >
                <div className={classes.dialogToolbar}>
                    <Typography id="share-preview-title" className={classes.dialogTitle} variant="subtitle1">
                        {preview.file ? preview.file.fileName : ''}
                    </Typography>
                    {preview.file && (
                        <Tooltip title="下载文件">
                            <IconButton size="small" aria-label="下载预览文件" onClick={() => handleDownload(preview.file)}>
                                <GetAppIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                    {preview.file && (
                        <Tooltip title="保存到我的网盘">
                            <IconButton size="small" aria-label="保存预览文件" disabled={saving} onClick={() => handleSaveToCloud(preview.file)}>
                                <CloudUploadIcon/>
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="关闭">
                        <IconButton size="small" aria-label="关闭预览" onClick={closePreview}>
                            <CloseIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
                <div className={classes.previewBody}>
                    {preview.open && preview.file && renderPreviewContent()}
                </div>
            </Dialog>
        </div>
    )
}

export default SharePage
