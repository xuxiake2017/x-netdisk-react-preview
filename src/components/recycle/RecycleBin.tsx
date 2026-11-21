// @ts-nocheck -- Legacy module pending typed refactor.
import React from 'react'
import { useDispatch } from 'react-redux'
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
    DeleteForever as DeleteForeverIcon,
    Restore as RestoreIcon,
    Search as SearchIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import NavBar from '../NavBar'
import MySvgIcon from '../common/SvgIcon'
import Loading from '../common/Loading'
import ConfirmDialog from '../common/ConfirmDialog'
import { DeleteRecycleFile, GetRecycleList, RebackRecycleFile } from '../../api/recycle'
import { GetInfo } from '../../api/user'
import { fileIcoFilter, formatDate, formatFileSize } from '../../utils/FileUtils'
import {
    drawerToggleAction,
    openSuccessNotification,
    openWarningNotification,
    setUserInfo
} from '../../actions'

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
    hint: {
        color: theme.palette.text.secondary,
        fontSize: 12
    },
    grow: {
        flex: 1
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
    expireText: {
        color: theme.palette.text.secondary
    },
    expireSoon: {
        color: theme.palette.error.main
    },
    actions: {
        whiteSpace: 'nowrap'
    },
    empty: {
        textAlign: 'center',
        padding: theme.spacing(6, 2),
        color: theme.palette.text.secondary
    }
}))

const DEFAULT_PAGE_SIZE = 10
const DAY_MS = 86400000

const formatTime = (value) => {
    if (!value) {
        return '--'
    }
    const date = new Date(value)
    return isNaN(date.getTime()) ? '--' : formatDate(date, 'yyyy-MM-dd hh:mm')
}

const renderRemaining = (overTime, classes) => {
    if (!overTime) {
        return <Typography variant="body2" className={classes.expireText}>--</Typography>
    }
    const time = new Date(overTime).getTime()
    if (isNaN(time)) {
        return <Typography variant="body2" className={classes.expireText}>--</Typography>
    }
    const daysLeft = Math.ceil((time - Date.now()) / DAY_MS)
    if (daysLeft <= 0) {
        return <Typography variant="body2" className={classes.expireSoon}>即将清理</Typography>
    }
    return (
        <Typography variant="body2" className={daysLeft <= 1 ? classes.expireSoon : classes.expireText}>
            {daysLeft} 天后自动清理
        </Typography>
    )
}

const RecycleBin = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [items, setItems] = React.useState([])
    const [loading, setLoading] = React.useState(false)
    const [loaded, setLoaded] = React.useState(false)
    const [keyword, setKeyword] = React.useState('')
    const [query, setQuery] = React.useState('')
    const [pagination, setPagination] = React.useState({ total: 0, page: 0, rowsPerPage: DEFAULT_PAGE_SIZE })
    const [deleteTarget, setDeleteTarget] = React.useState(null)
    const [busyId, setBusyId] = React.useState(null)
    const pageSizeRef = React.useRef(DEFAULT_PAGE_SIZE)
    const requestId = React.useRef(0)

    React.useEffect(() => {
        dispatch(drawerToggleAction(true))
    }, [])

    const refreshUserInfo = () => {
        GetInfo().then(res => {
            dispatch(setUserInfo(res.data))
        }).catch(() => {})
    }

    const load = (page, pageSize, fileRealName) => {
        const current = ++requestId.current
        setLoading(true)
        GetRecycleList({ pageNum: page, pageSize, fileRealName: fileRealName || undefined }).then(res => {
            if (current !== requestId.current) {
                return
            }
            const pageInfo = res.data
            const list = (pageInfo && pageInfo.list) || []
            if (list.length === 0 && pageInfo && pageInfo.total > 0 && page > 1) {
                load(page - 1, pageSize, fileRealName)
                return
            }
            setItems(list)
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

    const reload = () => {
        load(pagination.page + 1, pageSizeRef.current, query)
    }

    const handleSearch = (event) => {
        event.preventDefault()
        setQuery(keyword.trim())
    }

    const handleRestore = (item) => {
        if (busyId !== null) {
            return
        }
        setBusyId(item.recycleId)
        RebackRecycleFile({ recycleId: item.recycleId, fileKey: item.key }).then(res => {
            if (res.data === 20122) {
                dispatch(openWarningNotification(res.msg || '父目录不存在，文件已被恢复到“我的资源”文件夹'))
            } else {
                dispatch(openSuccessNotification('文件已恢复'))
            }
            refreshUserInfo()
            reload()
        }).catch(() => {
            reload()
        }).finally(() => {
            setBusyId(null)
        })
    }

    const handleDelete = () => {
        if (!deleteTarget || busyId !== null) {
            return
        }
        const target = deleteTarget
        setDeleteTarget(null)
        setBusyId(target.recycleId)
        DeleteRecycleFile(target.recycleId).then(() => {
            dispatch(openSuccessNotification('文件已彻底删除'))
            refreshUserInfo()
            reload()
        }).catch(() => {
            reload()
        }).finally(() => {
            setBusyId(null)
        })
    }

    return (
        <div className={classes.root}>
            <NavBar>
                <form className={classes.toolbar} onSubmit={handleSearch}>
                    <TextField
                        className={classes.search}
                        variant="outlined"
                        size="small"
                        placeholder="搜索回收站文件名"
                        value={keyword}
                        onChange={event => setKeyword(event.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton aria-label="搜索回收站" type="submit" edge="end">
                                        <SearchIcon/>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button type="submit" color="primary" variant="outlined">搜索</Button>
                    <div className={classes.grow}/>
                    <div style={{textAlign: 'right'}}>
                        <Typography variant="body2">共 {pagination.total} 个文件</Typography>
                        <Typography className={classes.hint}>到期文件会被自动清理，彻底删除后将无法找回</Typography>
                    </div>
                </form>
                <div className={classes.tableWrap}>
                    {loading && items.length === 0 && <Loading type="DualRing" size={60}/>}
                    {!loading && loaded && items.length === 0 && (
                        <Card className={classes.empty} elevation={0}>
                            <CardContent>
                                <Typography>{query ? '没有找到匹配的文件' : '回收站是空的'}</Typography>
                            </CardContent>
                        </Card>
                    )}
                    {items.length > 0 && (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>文件名</TableCell>
                                        <TableCell>大小</TableCell>
                                        <TableCell>删除时间</TableCell>
                                        <TableCell>剩余保留</TableCell>
                                        <TableCell align="right">操作</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map(item => (
                                        <TableRow key={item.recycleId} hover>
                                            <TableCell>
                                                <div className={classes.nameCell}>
                                                    <MySvgIcon
                                                        name={fileIcoFilter(item.fileType)}
                                                        className={classes.fileIcon}
                                                        width={'24px'}
                                                        height={'24px'}
                                                    />
                                                    <Typography className={classes.nameText} variant="body2">
                                                        {item.fileName}
                                                    </Typography>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {item.isDir === 0 ? '文件夹' : (item.fileSize == null ? '--' : formatFileSize(item.fileSize))}
                                            </TableCell>
                                            <TableCell>{formatTime(item.deleteTime)}</TableCell>
                                            <TableCell>{renderRemaining(item.overTime, classes)}</TableCell>
                                            <TableCell align="right" className={classes.actions}>
                                                <Tooltip title="恢复到原目录">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            aria-label={`恢复 ${item.fileName}`}
                                                            disabled={busyId === item.recycleId}
                                                            onClick={() => handleRestore(item)}
                                                        >
                                                            <RestoreIcon fontSize="small"/>
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="彻底删除">
                                                    <span>
                                                        <IconButton
                                                            size="small"
                                                            aria-label={`彻底删除 ${item.fileName}`}
                                                            disabled={busyId === item.recycleId}
                                                            onClick={() => setDeleteTarget(item)}
                                                        >
                                                            <DeleteForeverIcon fontSize="small"/>
                                                        </IconButton>
                                                    </span>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    {loading && items.length > 0 && <Loading type="DualRing" size={40}/>}
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
                title="彻底删除"
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
            >
                {deleteTarget ? `确定彻底删除“${deleteTarget.fileName}”吗？删除后将无法找回。` : ''}
            </ConfirmDialog>
        </div>
    )
}

export default RecycleBin
