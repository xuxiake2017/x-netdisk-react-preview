import React from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
    Button,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core'
import {
    Delete as DeleteIcon,
    FileCopy as FileCopyIcon,
    GetApp as GetAppIcon,
    OpenInNew as OpenInNewIcon,
    Search as SearchIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import NavBar from '../NavBar'
import MySvgIcon from '../common/SvgIcon'
import Loading from '../common/Loading'
import ConfirmDialog from '../common/ConfirmDialog'
import { DeleteMyShare, GetMyShares } from '../../api/share'
import { fileIcoFilter, formatFileSize } from '../../utils/FileUtils'
import {
    buildShareUrl,
    copyText,
    downloadShareFile,
    formatShareTime,
    isShareExpired,
    shareErrorText
} from '../../utils/share'
import { drawerToggleAction, openErrNotification, openSuccessNotification } from '../../actions'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        boxSizing: 'border-box'
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: theme.spacing(2)
    },
    search: {
        width: 260,
        marginRight: theme.spacing(2)
    },
    summary: {
        color: theme.palette.text.secondary
    },
    tableWrap: {
        flex: 1,
        minHeight: 0,
        overflow: 'auto'
    },
    nameCell: {
        display: 'flex',
        alignItems: 'center'
    },
    fileIcon: {
        fontSize: 24,
        marginRight: theme.spacing(1),
        flex: 'none'
    },
    nameText: {
        wordBreak: 'break-all'
    },
    pwdCode: {
        fontFamily: 'monospace',
        letterSpacing: 1
    },
    empty: {
        textAlign: 'center',
        padding: theme.spacing(6, 2),
        color: theme.palette.text.secondary
    },
    actions: {
        whiteSpace: 'nowrap'
    }
}))

const DEFAULT_PAGE_SIZE = 10

const ShareManage = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const [shares, setShares] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [loaded, setLoaded] = React.useState(false)
    const [keyword, setKeyword] = React.useState('')
    const [query, setQuery] = React.useState('')
    const [pagination, setPagination] = React.useState({ total: 0, page: 0, rowsPerPage: DEFAULT_PAGE_SIZE })
    const [deleteTarget, setDeleteTarget] = React.useState(null)
    const pageSizeRef = React.useRef(DEFAULT_PAGE_SIZE)
    const requestId = React.useRef(0)

    React.useEffect(() => {
        dispatch(drawerToggleAction(true))
    }, [])

    const load = (page, pageSize, fileRealName) => {
        const current = ++requestId.current
        setLoading(true)
        GetMyShares({ pageNum: page, pageSize, fileRealName: fileRealName || undefined }).then(res => {
            if (current !== requestId.current) {
                return
            }
            const pageInfo = res.data.pageInfo
            setShares((pageInfo && pageInfo.list) || [])
            setPagination({
                total: (pageInfo && pageInfo.total) || 0,
                page: Math.max(((pageInfo && pageInfo.pageNum) || 1) - 1, 0),
                rowsPerPage: (pageInfo && pageInfo.pageSize) || pageSize
            })
            setLoaded(true)
        }).catch(() => {
            if (current === requestId.current) {
                setLoaded(true)
            }
        }).finally(() => {
            if (current === requestId.current) {
                setLoading(false)
            }
        })
    }

    React.useEffect(() => {
        load(1, pageSizeRef.current, query)
    }, [query])

    const handleSearch = (event) => {
        event.preventDefault()
        setQuery(keyword.trim())
    }

    const handleCopy = async (text, label) => {
        const copied = await copyText(text)
        dispatch(copied ? openSuccessNotification(`${label}已复制`) : openErrNotification('复制失败，请手动复制'))
    }

    const handleOpen = (share) => {
        history.push('/s/' + encodeURIComponent(share.shareId))
    }

    const handleDownload = (share) => {
        downloadShareFile(share.shareId, share.sharePwd, share.fileId)
    }

    const handleDelete = () => {
        if (!deleteTarget) {
            return
        }
        const target = deleteTarget
        DeleteMyShare(target.id).then(() => {
            dispatch(openSuccessNotification('已取消分享'))
            setDeleteTarget(null)
            load(pagination.page + 1, pageSizeRef.current, query)
        }).catch((error) => {
            const data = error && error.response && error.response.data
            dispatch(openErrNotification(shareErrorText(data && data.code, data && data.msg)))
        })
    }

    const renderExpire = (share) => {
        if (!share.overTime) {
            return '永久有效'
        }
        return isShareExpired(share.overTime)
            ? <Typography variant="body2" color="error">已过期</Typography>
            : formatShareTime(share.overTime)
    }

    return (
        <div className={classes.root}>
            <NavBar>
                <form className={classes.toolbar} onSubmit={handleSearch}>
                    <TextField
                        className={classes.search}
                        variant="outlined"
                        size="small"
                        placeholder="搜索分享的文件名"
                        value={keyword}
                        onChange={event => setKeyword(event.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="搜索分享" type="submit" edge="end">
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button type="submit" color="primary" variant="outlined">搜索</Button>
                    <div style={{flex: 1}}/>
                    <Typography className={classes.summary}>共 {pagination.total} 个分享</Typography>
                </form>
                <div className={classes.tableWrap}>
                    {loading && shares.length === 0 && <Loading type="DualRing" size={60}/>}
                    {!loading && loaded && shares.length === 0 && (
                        <Card className={classes.empty} elevation={0}>
                            <CardContent>
                                <Typography>还没有分享记录，在文件列表右键即可创建分享。</Typography>
                            </CardContent>
                        </Card>
                    )}
                    {shares.length > 0 && (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>文件名</TableCell>
                                        <TableCell>分享方式</TableCell>
                                        <TableCell>提取码</TableCell>
                                        <TableCell>创建时间</TableCell>
                                        <TableCell>有效期至</TableCell>
                                        <TableCell align="right">访问 / 下载 / 保存</TableCell>
                                        <TableCell align="right">操作</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shares.map(share => (
                                        <TableRow key={share.id} hover>
                                            <TableCell>
                                                <div className={classes.nameCell}>
                                                    <MySvgIcon
                                                        name={fileIcoFilter(share.fileType)}
                                                        className={classes.fileIcon}
                                                        width={'24px'}
                                                        height={'24px'}
                                                    />
                                                    <div>
                                                        <Typography className={classes.nameText} variant="body2">
                                                            {share.fileName}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            {share.isDir === 0 ? '文件夹' : formatFileSize(share.fileSize)}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {share.isPublic === 1
                                                    ? '公开'
                                                    : share.isPublic === 0 ? '私密' : (share.sharePwd ? '私密' : '公开')}
                                            </TableCell>
                                            <TableCell>
                                                {share.sharePwd ? (
                                                    <span className={classes.pwdCode}>{share.sharePwd}</span>
                                                ) : (
                                                    <Typography variant="caption" color="textSecondary">无需提取码</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>{formatShareTime(share.shareTime)}</TableCell>
                                            <TableCell>{renderExpire(share)}</TableCell>
                                            <TableCell align="right">
                                                {`${share.accessTimes || 0} / ${share.downloadTimes || 0} / ${share.saveTimes || 0}`}
                                            </TableCell>
                                            <TableCell align="right" className={classes.actions}>
                                                <Tooltip title="复制链接">
                                                    <IconButton
                                                        size="small"
                                                        aria-label="复制分享链接"
                                                        onClick={() => handleCopy(buildShareUrl(share.shareId), '链接')}
                                                    >
                                                        <FileCopyIcon fontSize="small"/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="打开分享页">
                                                    <IconButton size="small" aria-label="打开分享页" onClick={() => handleOpen(share)}>
                                                        <OpenInNewIcon fontSize="small"/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="下载文件">
                                                    <IconButton size="small" aria-label="下载分享文件" onClick={() => handleDownload(share)}>
                                                        <GetAppIcon fontSize="small"/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="取消分享">
                                                    <IconButton
                                                        size="small"
                                                        aria-label="取消分享"
                                                        onClick={() => setDeleteTarget(share)}
                                                    >
                                                        <DeleteIcon fontSize="small"/>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </div>
                {pagination.total > 0 && (
                    <TablePagination
                        component="div"
                        count={pagination.total}
                        page={pagination.page}
                        rowsPerPage={pagination.rowsPerPage}
                        rowsPerPageOptions={[5, 10, 20]}
                        onPageChange={(event, page) => load(page + 1, pageSizeRef.current, query)}
                        onRowsPerPageChange={(event) => {
                            const size = Number(event.target.value)
                            pageSizeRef.current = size
                            load(1, size, query)
                        }}
                    />
                )}
            </NavBar>
            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title="取消分享"
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            >
                {deleteTarget ? `确定取消分享“${deleteTarget.fileName}”吗？取消后分享链接将立即失效。` : ''}
            </ConfirmDialog>
        </div>
    )
}

export default ShareManage
