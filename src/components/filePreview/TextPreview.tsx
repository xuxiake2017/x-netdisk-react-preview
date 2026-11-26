import React from 'react'
import {
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    makeStyles
} from '@material-ui/core'
import { GetTextPreview, type TextPreviewInfo } from '../../api/file'
import { formatFileSize } from '../../utils/FileUtils'

const CSV_ROW_LIMIT = 5000

const parseCsv = (source: string) => {
    const content = source.replace(/^\uFEFF/, '')
    const rows: string[][] = []
    let row: string[] = []
    let field = ''
    let quoted = false

    const finishField = () => {
        row.push(field)
        field = ''
    }
    const finishRow = () => {
        finishField()
        rows.push(row)
        row = []
    }

    for (let index = 0; index < content.length; index += 1) {
        const character = content[index]
        if (quoted) {
            if (character === '"') {
                if (content[index + 1] === '"') {
                    field += '"'
                    index += 1
                } else {
                    quoted = false
                }
            } else {
                field += character
            }
            continue
        }

        if (character === '"' && field.length === 0) {
            quoted = true
        } else if (character === ',') {
            finishField()
        } else if (character === '\n') {
            finishRow()
        } else if (character === '\r') {
            if (content[index + 1] === '\n') index += 1
            finishRow()
        } else {
            field += character
        }
    }

    if (field.length > 0 || row.length > 0 || content.endsWith(',')) {
        finishRow()
    }
    return rows
}

const useStyles = makeStyles(theme => ({
    root: {
        height: 'calc(100% - 64px)',
        padding: theme.spacing(2),
        background: theme.palette.background.default,
        [theme.breakpoints.down('xs')]: {
            height: 'calc(100% - 56px)',
            padding: theme.spacing(1)
        }
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
    meta: {
        flexShrink: 0,
        padding: theme.spacing(1.5, 2),
        color: theme.palette.text.secondary,
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    content: {
        flex: 1,
        minHeight: 0,
        margin: 0,
        padding: theme.spacing(2),
        overflow: 'auto',
        color: theme.palette.text.primary,
        background: theme.palette.background.paper,
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        fontSize: 14,
        lineHeight: 1.6,
        tabSize: 4
    },
    wrap: {
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere'
    },
    tableWrap: {
        flex: 1,
        minHeight: 0,
        overflow: 'auto'
    },
    table: {
        width: 'max-content',
        minWidth: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
        '& th, & td': {
            minWidth: 120,
            maxWidth: 480,
            padding: theme.spacing(1, 1.5),
            overflowWrap: 'anywhere',
            whiteSpace: 'pre-wrap',
            verticalAlign: 'top',
            borderRight: `1px solid ${theme.palette.divider}`,
            borderBottom: `1px solid ${theme.palette.divider}`
        },
        '& th': {
            position: 'sticky',
            top: 0,
            zIndex: 1,
            fontWeight: theme.typography.fontWeightBold,
            background: theme.palette.background.paper
        }
    },
    rowNumber: {
        position: 'sticky',
        left: 0,
        zIndex: 1,
        minWidth: '64px !important',
        width: 64,
        color: theme.palette.text.secondary,
        textAlign: 'right',
        background: `${theme.palette.background.paper} !important`
    },
    csvNotice: {
        flexShrink: 0,
        padding: theme.spacing(1, 2),
        color: theme.palette.text.secondary,
        borderTop: `1px solid ${theme.palette.divider}`
    },
    status: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing(1),
        padding: theme.spacing(3),
        textAlign: 'center'
    }
}))

const TextPreview = ({ fileKey }: { fileKey: string }) => {
    const classes = useStyles()
    const [preview, setPreview] = React.useState<TextPreviewInfo | null>(null)
    const [errorMessage, setErrorMessage] = React.useState('')

    React.useEffect(() => {
        let cancelled = false
        setPreview(null)
        setErrorMessage('')
        GetTextPreview({ fileKey }).then(res => {
            if (!cancelled) setPreview(res.data)
        }).catch(() => {
            if (!cancelled) setErrorMessage('文本预览加载失败，请稍后重试或下载后查看。')
        })
        return () => {
            cancelled = true
        }
    }, [fileKey])

    const isCsv = preview?.fileExtName.toLowerCase() === 'csv'
    const csvRows = React.useMemo(() => isCsv && preview ? parseCsv(preview.content) : [], [isCsv, preview])
    const csvColumnCount = React.useMemo(() => csvRows.reduce(
        (count, row) => Math.max(count, row.length),
        0
    ), [csvRows])
    const csvHeader = csvRows[0] || []
    const csvBody = csvRows.slice(1, CSV_ROW_LIMIT + 1)
    const csvDataRowCount = Math.max(0, csvRows.length - 1)

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={2}>
                {!preview && !errorMessage && (
                    <div className={classes.status} role="status">
                        <CircularProgress size={28}/>
                        <Typography>正在加载文本内容…</Typography>
                    </div>
                )}
                {errorMessage && (
                    <div className={classes.status} role="alert">
                        <Typography color="error">{errorMessage}</Typography>
                    </div>
                )}
                {preview && (
                    <>
                        <Typography className={classes.meta} variant="body2">
                            {preview.fileExtName.toUpperCase()} · {formatFileSize(preview.fileSize)} · 编码：{preview.encoding || '未知'}
                        </Typography>
                        {isCsv ? (
                            <>
                                <div className={classes.tableWrap}>
                                    {csvRows.length > 0 ? (
                                        <Table className={classes.table} size="small" stickyHeader aria-label={`${preview.fileName} 内容`}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.rowNumber}>#</TableCell>
                                                    {Array.from({ length: csvColumnCount }, (_, index) => (
                                                        <TableCell key={index}>
                                                            {csvHeader[index] || `列 ${index + 1}`}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {csvBody.map((row, rowIndex) => (
                                                    <TableRow key={rowIndex}>
                                                        <TableCell className={classes.rowNumber}>{rowIndex + 1}</TableCell>
                                                        {Array.from({ length: csvColumnCount }, (_, columnIndex) => (
                                                            <TableCell key={columnIndex}>{row[columnIndex] || ''}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className={classes.status}>
                                            <Typography color="textSecondary">CSV 文件内容为空</Typography>
                                        </div>
                                    )}
                                </div>
                                <Typography className={classes.csvNotice} variant="caption">
                                    共 {csvDataRowCount} 行数据
                                    {csvDataRowCount > CSV_ROW_LIMIT ? `，为保证页面流畅仅展示前 ${CSV_ROW_LIMIT} 行` : ''}
                                </Typography>
                            </>
                        ) : (
                            <pre className={`${classes.content} ${classes.wrap}`}>
                                {preview.content}
                            </pre>
                        )}
                    </>
                )}
            </Paper>
        </div>
    )
}

export default TextPreview
