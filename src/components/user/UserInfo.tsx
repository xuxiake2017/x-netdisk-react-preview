// @ts-nocheck -- Legacy module pending typed refactor.
import React from 'react'
import { useDispatch } from 'react-redux'
import {
    Avatar,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    LinearProgress,
    MenuItem,
    TextField,
    Typography
} from '@material-ui/core'
import {
    Email as EmailIcon,
    Lock as LockIcon,
    PhoneIphone as PhoneIcon,
    PhotoCamera as PhotoCameraIcon,
    Save as SaveIcon
} from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import NavBar from '../NavBar'
import Loading from '../common/Loading'
import {
    ChangeEmail,
    ChangePhone,
    GetInfo,
    GetUserDetail,
    SendEmailChangeCode,
    SendPhoneChangeCode,
    UpdatePassword,
    UpdateUserProfile,
    UploadAvatar
} from '../../api/user'
import { formatDate, formatFileSize } from '../../utils/FileUtils'
import { rsaEncrypt } from '../../utils/rsa'
import {
    drawerToggleAction,
    openSuccessNotification,
    openWarningNotification,
    setUserInfo
} from '../../actions'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        overflow: 'auto',
        padding: theme.spacing(2),
        boxSizing: 'border-box'
    },
    container: {
        maxWidth: 1080,
        margin: '0 auto'
    },
    pageTitle: {
        marginBottom: theme.spacing(2)
    },
    avatarRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(2)
    },
    avatar: {
        width: 88,
        height: 88,
        marginRight: theme.spacing(2),
        flex: 'none'
    },
    avatarMeta: {
        minWidth: 0
    },
    avatarHint: {
        display: 'block',
        color: theme.palette.text.secondary,
        marginTop: theme.spacing(0.5)
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: theme.spacing(1),
        '& svg': {
            marginRight: theme.spacing(1)
        }
    },
    field: {
        marginBottom: theme.spacing(2)
    },
    saveRow: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    bindRow: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1, 0),
        '& svg': {
            marginRight: theme.spacing(1.5),
            color: theme.palette.text.secondary
        }
    },
    bindMeta: {
        flex: 1,
        minWidth: 0
    },
    bindValue: {
        wordBreak: 'break-all'
    },
    storageRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(0.5)
    },
    storageBar: {
        height: 8,
        borderRadius: 4,
        marginBottom: theme.spacing(1)
    },
    storageHint: {
        color: theme.palette.text.secondary
    },
    codeRow: {
        display: 'flex',
        alignItems: 'flex-end',
        marginTop: theme.spacing(1)
    },
    codeInput: {
        flex: 1,
        marginRight: theme.spacing(1.5)
    },
    dialogHint: {
        display: 'block',
        marginTop: theme.spacing(1),
        color: theme.palette.text.secondary
    }
}))

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^1\d{10}$/

const emptyPassword = {
    oldPassword: '',
    newPassword: '',
    repeatPassword: ''
}

const emptyBindDialog = {
    open: false,
    type: 'email',
    value: '',
    code: '',
    sending: false,
    submitting: false,
    countdown: 0
}

const SexOptions = [
    { value: 0, label: '保密' },
    { value: 1, label: '男' },
    { value: 2, label: '女' }
]

const fillProfile = (user) => ({
    nickName: (user && user.nickName) || '',
    realName: (user && user.realName) || '',
    signature: (user && user.signature) || '',
    sex: user && (user.sex === 1 || user.sex === 2) ? user.sex : 0
})

const UserInfo = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [detail, setDetail] = React.useState(null)
    const [loading, setLoading] = React.useState(true)
    const [profile, setProfile] = React.useState(fillProfile(null))
    const [savingProfile, setSavingProfile] = React.useState(false)
    const [avatarUploading, setAvatarUploading] = React.useState(false)
    const [password, setPassword] = React.useState(emptyPassword)
    const [changingPassword, setChangingPassword] = React.useState(false)
    const [bindDialog, setBindDialog] = React.useState(emptyBindDialog)
    const avatarInputRef = React.useRef(null)

    React.useEffect(() => {
        dispatch(drawerToggleAction(true))
    }, [])

    const refreshUserInfo = () => {
        GetInfo().then(res => {
            dispatch(setUserInfo(res.data))
        }).catch(() => {})
    }

    const loadDetail = () => {
        setLoading(true)
        GetUserDetail().then(res => {
            setDetail(res.data)
            setProfile(fillProfile(res.data))
        }).catch(() => {}).finally(() => setLoading(false))
    }

    React.useEffect(() => {
        loadDetail()
    }, [])

    React.useEffect(() => {
        if (bindDialog.countdown <= 0) {
            return
        }
        const timer = window.setTimeout(() => {
            setBindDialog(prev => ({ ...prev, countdown: prev.countdown - 1 }))
        }, 1000)
        return () => window.clearTimeout(timer)
    }, [bindDialog.countdown])

    const handleAvatarChange = (event) => {
        const file = event.target.files && event.target.files[0]
        event.target.value = ''
        if (!file) {
            return
        }
        if (['image/jpeg', 'image/png', 'image/gif'].indexOf(file.type) === -1) {
            dispatch(openWarningNotification('头像仅支持 JPG、PNG 或 GIF 图片'))
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            dispatch(openWarningNotification('头像大小不能超过 5MB'))
            return
        }
        setAvatarUploading(true)
        UploadAvatar(file).then(res => {
            setDetail(prev => prev ? { ...prev, avatar: res.data } : prev)
            refreshUserInfo()
            dispatch(openSuccessNotification('头像已更新'))
        }).catch(() => {}).finally(() => setAvatarUploading(false))
    }

    const handleProfileSubmit = (event) => {
        event.preventDefault()
        const nickName = profile.nickName.trim()
        const realName = profile.realName.trim()
        const signature = profile.signature.trim()
        if (!nickName) {
            dispatch(openWarningNotification('昵称不能为空'))
            return
        }
        if (nickName.length > 32) {
            dispatch(openWarningNotification('昵称不能超过 32 个字符'))
            return
        }
        if (realName.length > 50) {
            dispatch(openWarningNotification('真实姓名不能超过 50 个字符'))
            return
        }
        if (signature.length > 200) {
            dispatch(openWarningNotification('个性签名不能超过 200 个字符'))
            return
        }
        setSavingProfile(true)
        UpdateUserProfile({
            nickName,
            realName,
            signature,
            sex: profile.sex
        }).then(res => {
            setDetail(res.data)
            setProfile(fillProfile(res.data))
            refreshUserInfo()
            dispatch(openSuccessNotification('个人资料已保存'))
        }).catch(() => {}).finally(() => setSavingProfile(false))
    }

    const handlePasswordSubmit = (event) => {
        event.preventDefault()
        const { oldPassword, newPassword, repeatPassword } = password
        if (!oldPassword) {
            dispatch(openWarningNotification('请输入当前密码'))
            return
        }
        if (newPassword.length < 8 || newPassword.length > 64) {
            dispatch(openWarningNotification('新密码须为 8 至 64 位'))
            return
        }
        if (!/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
            dispatch(openWarningNotification('新密码须同时包含字母和数字'))
            return
        }
        if (newPassword !== repeatPassword) {
            dispatch(openWarningNotification('两次输入的新密码不一致'))
            return
        }
        if (newPassword === oldPassword) {
            dispatch(openWarningNotification('新密码不能与当前密码相同'))
            return
        }
        let encrypted
        try {
            encrypted = {
                oldPassword: rsaEncrypt(oldPassword),
                newPassword: rsaEncrypt(newPassword),
                repeatPassword: rsaEncrypt(repeatPassword)
            }
        } catch (e) {
            dispatch(openWarningNotification('密码加密失败，请刷新页面后重试'))
            return
        }
        setChangingPassword(true)
        UpdatePassword(encrypted).then(() => {
            setPassword(emptyPassword)
            dispatch(openSuccessNotification('密码修改成功'))
        }).catch(() => {}).finally(() => setChangingPassword(false))
    }

    const openBindDialog = (type) => {
        setBindDialog({ ...emptyBindDialog, open: true, type })
    }

    const closeBindDialog = () => {
        setBindDialog(emptyBindDialog)
    }

    const handleSendCode = () => {
        const value = bindDialog.value.trim()
        const isEmail = bindDialog.type === 'email'
        if (isEmail && !EMAIL_PATTERN.test(value)) {
            dispatch(openWarningNotification('请输入正确的邮箱地址'))
            return
        }
        if (!isEmail && !PHONE_PATTERN.test(value)) {
            dispatch(openWarningNotification('请输入正确的手机号'))
            return
        }
        setBindDialog(prev => ({ ...prev, sending: true }))
        const send = isEmail ? SendEmailChangeCode(value) : SendPhoneChangeCode(value)
        send.then(() => {
            dispatch(openSuccessNotification('验证码已发送'))
            setBindDialog(prev => ({ ...prev, countdown: 60 }))
        }).catch(() => {}).finally(() => {
            setBindDialog(prev => ({ ...prev, sending: false }))
        })
    }

    const handleBindSubmit = () => {
        const value = bindDialog.value.trim()
        const code = bindDialog.code.trim()
        const isEmail = bindDialog.type === 'email'
        if (isEmail && !EMAIL_PATTERN.test(value)) {
            dispatch(openWarningNotification('请输入正确的邮箱地址'))
            return
        }
        if (!isEmail && !PHONE_PATTERN.test(value)) {
            dispatch(openWarningNotification('请输入正确的手机号'))
            return
        }
        if (!/^\d{6}$/.test(code)) {
            dispatch(openWarningNotification('请输入 6 位验证码'))
            return
        }
        setBindDialog(prev => ({ ...prev, submitting: true }))
        const change = isEmail
            ? ChangeEmail({ email: value, emailCode: code })
            : ChangePhone({ phone: value, phoneCode: code })
        change.then(res => {
            setDetail(res.data)
            closeBindDialog()
            refreshUserInfo()
            dispatch(openSuccessNotification(isEmail ? '邮箱修改成功' : '手机号修改成功'))
        }).catch(() => {}).finally(() => {
            setBindDialog(prev => ({ ...prev, submitting: false }))
        })
    }

    const renderStorage = () => {
        if (!detail) {
            return null
        }
        const total = detail.totalMemory || 0
        const used = detail.usedMemory || 0
        const available = Math.max(total - used, 0)
        const percent = total > 0 ? Math.min((used / total) * 100, 100) : 0
        return (
            <React.Fragment>
                <div className={classes.storageRow}>
                    <Typography variant="body2">{formatFileSize(used)} / {formatFileSize(total)}</Typography>
                    <Typography variant="body2" className={classes.storageHint}>
                        可用 {formatFileSize(available)}
                    </Typography>
                </div>
                <LinearProgress
                    className={classes.storageBar}
                    variant="determinate"
                    value={percent}
                />
                <Typography variant="caption" className={classes.storageHint}>
                    注册时间：{detail.regTime ? formatDate(new Date(detail.regTime), 'yyyy-MM-dd hh:mm') : '--'}
                </Typography>
            </React.Fragment>
        )
    }

    const isEmailDialog = bindDialog.type === 'email'

    return (
        <div className={classes.root}>
            <NavBar>
                <div className={classes.container}>
                    <Typography variant="h5" className={classes.pageTitle}>个人信息</Typography>
                    {loading && !detail && <Loading type="DualRing" size={60}/>}
                    {detail && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={7}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" className={classes.sectionTitle}>基本资料</Typography>
                                        <div className={classes.avatarRow}>
                                            <Avatar src={detail.avatar} className={classes.avatar}>
                                                {(detail.nickName || detail.username || '?').slice(0, 1)}
                                            </Avatar>
                                            <div className={classes.avatarMeta}>
                                                <Typography variant="subtitle1">{detail.nickName || detail.username}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    用户名：{detail.username}
                                                </Typography>
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    startIcon={<PhotoCameraIcon/>}
                                                    disabled={avatarUploading}
                                                    onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
                                                >
                                                    {avatarUploading ? '上传中...' : '更换头像'}
                                                </Button>
                                                <Typography variant="caption" className={classes.avatarHint}>
                                                    支持 JPG、PNG、GIF，5MB 以内
                                                </Typography>
                                            </div>
                                            <input
                                                ref={avatarInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/gif"
                                                hidden
                                                onChange={handleAvatarChange}
                                            />
                                        </div>
                                        <form onSubmit={handleProfileSubmit}>
                                            <TextField
                                                className={classes.field}
                                                fullWidth
                                                label="昵称"
                                                value={profile.nickName}
                                                inputProps={{ maxLength: 32 }}
                                                onChange={event => setProfile(prev => ({ ...prev, nickName: event.target.value }))}
                                            />
                                            <TextField
                                                className={classes.field}
                                                fullWidth
                                                label="真实姓名"
                                                value={profile.realName}
                                                inputProps={{ maxLength: 50 }}
                                                onChange={event => setProfile(prev => ({ ...prev, realName: event.target.value }))}
                                            />
                                            <TextField
                                                className={classes.field}
                                                fullWidth
                                                select
                                                label="性别"
                                                value={profile.sex}
                                                onChange={event => setProfile(prev => ({ ...prev, sex: Number(event.target.value) }))}
                                            >
                                                {SexOptions.map(option => (
                                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                className={classes.field}
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label="个性签名"
                                                value={profile.signature}
                                                inputProps={{ maxLength: 200 }}
                                                onChange={event => setProfile(prev => ({ ...prev, signature: event.target.value }))}
                                            />
                                            <div className={classes.saveRow}>
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                    variant="contained"
                                                    startIcon={<SaveIcon/>}
                                                    disabled={savingProfile}
                                                >
                                                    {savingProfile ? '保存中...' : '保存修改'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" className={classes.sectionTitle}>存储空间</Typography>
                                        {renderStorage()}
                                    </CardContent>
                                </Card>
                                <Card style={{marginTop: 16}}>
                                    <CardContent>
                                        <Typography variant="h6" className={classes.sectionTitle}>绑定信息</Typography>
                                        <div className={classes.bindRow}>
                                            <EmailIcon/>
                                            <div className={classes.bindMeta}>
                                                <Typography variant="caption" color="textSecondary">邮箱</Typography>
                                                <Typography variant="body2" className={classes.bindValue}>
                                                    {detail.email || '未绑定'}
                                                </Typography>
                                            </div>
                                            <Button size="small" color="primary" onClick={() => openBindDialog('email')}>
                                                {detail.email ? '修改' : '绑定'}
                                            </Button>
                                        </div>
                                        <div className={classes.bindRow}>
                                            <PhoneIcon/>
                                            <div className={classes.bindMeta}>
                                                <Typography variant="caption" color="textSecondary">手机号</Typography>
                                                <Typography variant="body2" className={classes.bindValue}>
                                                    {detail.phone || '未绑定'}
                                                </Typography>
                                            </div>
                                            <Button size="small" color="primary" onClick={() => openBindDialog('phone')}>
                                                {detail.phone ? '修改' : '绑定'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card style={{marginTop: 16}}>
                                    <CardContent>
                                        <Typography variant="h6" className={classes.sectionTitle}>
                                            <LockIcon/>
                                            修改密码
                                        </Typography>
                                        <form onSubmit={handlePasswordSubmit}>
                                            <TextField
                                                className={classes.field}
                                                fullWidth
                                                type="password"
                                                label="当前密码"
                                                autoComplete="current-password"
                                                value={password.oldPassword}
                                                onChange={event => setPassword(prev => ({ ...prev, oldPassword: event.target.value }))}
                                            />
                                            <TextField
                                                className={classes.field}
                                                fullWidth
                                                type="password"
                                                label="新密码（8-64 位，含字母和数字）"
                                                autoComplete="new-password"
                                                value={password.newPassword}
                                                onChange={event => setPassword(prev => ({ ...prev, newPassword: event.target.value }))}
                                            />
                                            <TextField
                                                className={classes.field}
                                                fullWidth
                                                type="password"
                                                label="确认新密码"
                                                autoComplete="new-password"
                                                value={password.repeatPassword}
                                                onChange={event => setPassword(prev => ({ ...prev, repeatPassword: event.target.value }))}
                                            />
                                            <div className={classes.saveRow}>
                                                <Button
                                                    type="submit"
                                                    color="primary"
                                                    variant="outlined"
                                                    disabled={changingPassword}
                                                >
                                                    {changingPassword ? '提交中...' : '修改密码'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </div>
                <Dialog open={bindDialog.open} onClose={closeBindDialog} maxWidth="xs" fullWidth>
                    <DialogTitle>{isEmailDialog ? '修改邮箱' : '修改手机号'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            className={classes.codeInput}
                            fullWidth
                            autoFocus
                            margin="dense"
                            label={isEmailDialog ? '新邮箱' : '新手机号'}
                            value={bindDialog.value}
                            onChange={event => setBindDialog(prev => ({ ...prev, value: event.target.value }))}
                        />
                        <div className={classes.codeRow}>
                            <TextField
                                className={classes.codeInput}
                                margin="dense"
                                label="验证码"
                                value={bindDialog.code}
                                inputProps={{ maxLength: 6 }}
                                onChange={event => setBindDialog(prev => ({ ...prev, code: event.target.value }))}
                            />
                            <Button
                                color="primary"
                                variant="outlined"
                                onClick={handleSendCode}
                                disabled={bindDialog.sending || bindDialog.countdown > 0}
                                style={{marginBottom: 8, whiteSpace: 'nowrap'}}
                            >
                                {bindDialog.countdown > 0
                                    ? `${bindDialog.countdown}s 后重发`
                                    : bindDialog.sending ? '发送中...' : '发送验证码'}
                            </Button>
                        </div>
                        <Typography variant="caption" className={classes.dialogHint}>
                            验证码将发送到新的{isEmailDialog ? '邮箱' : '手机号'}，10 分钟内有效。
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeBindDialog}>取消</Button>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={handleBindSubmit}
                            disabled={bindDialog.submitting}
                        >
                            {bindDialog.submitting ? '提交中...' : '确认修改'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </NavBar>
        </div>
    )
}

export default UserInfo
