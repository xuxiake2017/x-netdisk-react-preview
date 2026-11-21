import React from 'react'
import { useDispatch } from 'react-redux'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputAdornment,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
    Typography
} from '@material-ui/core'
import { FileCopy as FileCopyIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import MySvgIcon from '../common/SvgIcon'
import Loading from '../common/Loading'
import { CreateShare } from '../../api/share'
import { fileIcoFilter, formatFileSize } from '../../utils/FileUtils'
import { buildShareUrl, copyText, formatShareTime } from '../../utils/share'
import { openErrNotification, openSuccessNotification } from '../../actions'

const useStyles = makeStyles((theme) => ({
    fileRow: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1.5, 2),
        marginBottom: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 6
    },
    fileIcon: {
        fontSize: 36,
        marginRight: theme.spacing(1.5)
    },
    fileMeta: {
        minWidth: 0,
        flex: 1
    },
    fileName: {
        wordBreak: 'break-all'
    },
    formRow: {
        marginTop: theme.spacing(2)
    },
    option: {
        marginRight: theme.spacing(3)
    },
    expireSelect: {
        minWidth: 160
    },
    hint: {
        color: theme.palette.text.secondary,
        fontSize: 12,
        marginTop: theme.spacing(0.5)
    },
    resultTip: {
        marginBottom: theme.spacing(2)
    },
    resultField: {
        marginTop: theme.spacing(1.5)
    }
}))

const EXPIRE_OPTIONS = [
    { value: 0, label: '永久有效' },
    { value: 1, label: '1 天' },
    { value: 7, label: '7 天' },
    { value: 30, label: '30 天' }
]

const ShareCreateDialog = ({ open, onClose, file }) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [isPublic, setIsPublic] = React.useState(0)
    const [expireDays, setExpireDays] = React.useState(7)
    const [creating, setCreating] = React.useState(false)
    const [result, setResult] = React.useState(null)

    React.useEffect(() => {
        if (open) {
            setIsPublic(0)
            setExpireDays(7)
            setCreating(false)
            setResult(null)
        }
    }, [open])

    const handleCopy = async (text, label) => {
        const copied = await copyText(text)
        dispatch(copied ? openSuccessNotification(`${label}已复制`) : openErrNotification('复制失败，请手动复制'))
    }

    const handleCreate = () => {
        if (creating || !file || !file.key) {
            return
        }
        setCreating(true)
        CreateShare({ fileKey: file.key, isPublic, expireDays }).then(res => {
            const share = res.data.shareFile
            setResult({
                url: buildShareUrl(share.shareId),
                sharePwd: share.sharePwd,
                isPublic: share.isPublic,
                overTime: share.overTime
            })
            dispatch(openSuccessNotification('分享创建成功'))
        }).catch(() => {
        }).finally(() => {
            setCreating(false)
        })
    }

    const validityText = result
        ? (result.overTime ? `${formatShareTime(result.overTime, 'yyyy-MM-dd hh:mm')} 到期` : '永久有效')
        : ''

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth aria-labelledby="share-create-title">
            <DialogTitle id="share-create-title">{result ? '分享创建成功' : '创建分享'}</DialogTitle>
            <DialogContent dividers>
                {file && (
                    <div className={classes.fileRow}>
                        <MySvgIcon name={fileIcoFilter(file.fileType)} className={classes.fileIcon} width={'36px'} height={'36px'}/>
                        <div className={classes.fileMeta}>
                            <Typography className={classes.fileName}>{file.fileName}</Typography>
                            <Typography variant="caption" color="textSecondary">
                                {file.isDir === 0 ? '文件夹' : formatFileSize(file.fileSize)}
                            </Typography>
                        </div>
                    </div>
                )}
                {!result && (
                    <React.Fragment>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">分享方式</FormLabel>
                            <RadioGroup row value={isPublic} onChange={event => setIsPublic(Number(event.target.value))}>
                                <FormControlLabel className={classes.option} value={0} control={<Radio color="primary"/>} label="私密分享（生成提取码）"/>
                                <FormControlLabel value={1} control={<Radio color="primary"/>} label="公开分享（无需提取码）"/>
                            </RadioGroup>
                        </FormControl>
                        <div className={classes.formRow}>
                            <FormControl variant="outlined" size="small">
                                <FormLabel component="legend">有效期</FormLabel>
                                <Select
                                    className={classes.expireSelect}
                                    value={expireDays}
                                    onChange={event => setExpireDays(Number(event.target.value))}
                                >
                                    {EXPIRE_OPTIONS.map(option => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Typography className={classes.hint}>
                                分享链接只能访问当前这一个文件或文件夹，取消分享后立即失效。
                            </Typography>
                        </div>
                    </React.Fragment>
                )}
                {result && (
                    <React.Fragment>
                        <Typography className={classes.resultTip}>
                            把链接{result.isPublic === 1 ? '' : '和提取码'}发给好友，即可查看或下载。
                        </Typography>
                        <TextField
                            className={classes.resultField}
                            label="分享链接"
                            value={result.url}
                            fullWidth
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton aria-label="复制分享链接" onClick={() => handleCopy(result.url, '链接')}>
                                            <FileCopyIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        {result.isPublic === 0 && (
                            <TextField
                                className={classes.resultField}
                                label="提取码"
                                value={result.sharePwd || ''}
                                fullWidth
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton aria-label="复制提取码" onClick={() => handleCopy(result.sharePwd || '', '提取码')}>
                                                <FileCopyIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        )}
                        <Divider className={classes.resultField}/>
                        <Typography className={classes.hint}>{validityText}</Typography>
                    </React.Fragment>
                )}
                {creating && <Loading type="DualRing" size={40}/>}
            </DialogContent>
            <DialogActions>
                {result ? (
                    <Button onClick={onClose} color="primary">完成</Button>
                ) : (
                    <React.Fragment>
                        <Button onClick={onClose} color="primary">取消</Button>
                        <Button onClick={handleCreate} color="primary" variant="contained" disabled={creating || !file}>
                            创建分享
                        </Button>
                    </React.Fragment>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default ShareCreateDialog
