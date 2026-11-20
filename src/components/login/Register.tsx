// @ts-nocheck -- Legacy Redux state pending typed refactor.
import React, { useEffect, useState } from 'react'
import {
    Button,
    FormControl,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import classnames from 'classnames'
import NavBar from '../NavBar'
import LoginLeftBg from '../../assets/login_left_bg.jpg'
import LoginFormStyles from '../../style/LoginForm.module.scss'
import AppConf from '../../conf/AppConf'
import { RegisterByEmail, SendRegisterEmailCode } from '../../api/user'
import { drawerToggleAction, openSuccessNotification, setUserInfo } from '../../actions'
import { setToken } from '../../utils/auth'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex'
    },
    container: {
        background: '#eaeefa',
        width: '100%',
        height: 'calc(100% - 56px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            height: 'calc(100% - 48px)'
        }
    },
    wrap: {
        display: 'flex',
        width: 900,
        height: 700,
        justifyContent: 'center',
        alignItems: 'center',
        background: '#eaeefa'
    },
    left: {
        width: 400,
        height: 400,
        background: `url(${LoginLeftBg}) no-repeat center center`,
        backgroundSize: 'contain',
        color: '#fff',
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    },
    leftMask: {
        width: '100%',
        height: '100%',
        background: theme.palette.type === 'dark'
            ? 'rgba(0, 0, 0, .6)'
            : 'linear-gradient(to top, rgba(247, 167, 102, .5), rgba(1, 42, 255, .5))',
        transition: 'background-color .4s'
    },
    slogan: {
        padding: theme.spacing(4)
    },
    form: {
        width: 390,
        height: 550,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& > * + *': {
            marginTop: theme.spacing(2)
        },
        padding: theme.spacing(5)
    },
    alignSelf: {
        alignSelf: 'start'
    },
    field: {
        width: '100%'
    },
    inlineField: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: theme.spacing(1)
    },
    codeButton: {
        minWidth: 126,
        whiteSpace: 'nowrap'
    },
    submit: {
        backgroundColor: 'rgba(1, 42, 255, 1)',
        width: '50%',
        borderRadius: 20
    },
    loginLink: {
        alignSelf: 'start'
    }
}))

const Register = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        imgCode: '',
        emailCode: ''
    })
    const [captchaSrc, setCaptchaSrc] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [sending, setSending] = useState(false)
    const [registering, setRegistering] = useState(false)
    const [formError, setFormError] = useState('')

    const refreshCaptcha = () => {
        setCaptchaSrc(`${AppConf.baseUrl()}/user/createImg?${Date.now()}`)
    }

    useEffect(() => {
        dispatch(drawerToggleAction(false))
        refreshCaptcha()
    }, [dispatch])

    useEffect(() => {
        if (countdown <= 0) {
            return undefined
        }
        const timer = window.setTimeout(() => setCountdown(value => value - 1), 1000)
        return () => window.clearTimeout(timer)
    }, [countdown])

    const changeHandler = event => {
        const { name, value } = event.target
        setForm(previous => ({ ...previous, [name]: value }))
        setFormError('')
    }

    const sendEmailCode = async () => {
        const email = form.email.trim().toLowerCase()
        if (!EMAIL_PATTERN.test(email)) {
            setFormError('请输入正确的邮箱地址')
            return
        }
        if (!form.imgCode.trim()) {
            setFormError('请输入图形验证码')
            return
        }

        setSending(true)
        try {
            await SendRegisterEmailCode({ email, imgCode: form.imgCode.trim() })
            setForm(previous => ({ ...previous, email, imgCode: '' }))
            setCountdown(60)
            dispatch(openSuccessNotification('邮箱验证码已发送，请注意查收'))
        } finally {
            setSending(false)
            refreshCaptcha()
        }
    }

    const submitHandler = async event => {
        event.preventDefault()
        const email = form.email.trim().toLowerCase()
        if (!EMAIL_PATTERN.test(email)) {
            setFormError('请输入正确的邮箱地址')
            return
        }
        if (!form.password) {
            setFormError('请输入密码')
            return
        }
        if (form.password !== form.confirmPassword) {
            setFormError('两次输入的密码不一致')
            return
        }
        if (!/^\d{6}$/.test(form.emailCode.trim())) {
            setFormError('请输入 6 位邮箱验证码')
            return
        }

        setRegistering(true)
        try {
            const response = await RegisterByEmail({
                email,
                password: form.password,
                emailCode: form.emailCode.trim()
            })
            setToken(response.data.token)
            dispatch(setUserInfo(response.data))
            dispatch(openSuccessNotification('注册成功'))
            history.replace('/home')
        } finally {
            setRegistering(false)
        }
    }

    return (
        <div className={classes.root}>
            <NavBar>
                <div className={classes.container}>
                    <Grid container className={classes.wrap}>
                        <div className={classes.left}>
                            <div className={classes.leftMask}>
                                <Typography variant="h4" className={classes.slogan}>
                                    CEASE TO STRUGGLE AND YOU CEASE TO LIVE
                                </Typography>
                            </div>
                        </div>
                        <form className={classnames(classes.form, LoginFormStyles.right)} onSubmit={submitHandler}>
                            <Typography variant="h4" className={classnames(LoginFormStyles.header, classes.alignSelf)}>
                                邮箱注册
                            </Typography>
                            <Grid container justify="center">
                                <TextField
                                    name="email"
                                    label="邮箱"
                                    type="email"
                                    fullWidth
                                    value={form.email}
                                    onChange={changeHandler}
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid container justify="center">
                                <FormControl className={classes.field}>
                                    <InputLabel htmlFor="register-password">密码</InputLabel>
                                    <Input
                                        id="register-password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={changeHandler}
                                        autoComplete="new-password"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="显示或隐藏密码"
                                                    onClick={() => setShowPassword(value => !value)}
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid container justify="center">
                                <TextField
                                    name="confirmPassword"
                                    label="确认密码"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    value={form.confirmPassword}
                                    onChange={changeHandler}
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid container justify="center" className={LoginFormStyles.captchaContainer}>
                                <TextField
                                    name="imgCode"
                                    label="图形验证码"
                                    fullWidth
                                    value={form.imgCode}
                                    onChange={changeHandler}
                                    inputProps={{ maxLength: 4 }}
                                />
                                <Tooltip title="点击更换">
                                    <div className={LoginFormStyles.loginCaptcha}>
                                        <img src={captchaSrc} alt="图形验证码" onClick={refreshCaptcha} />
                                    </div>
                                </Tooltip>
                            </Grid>
                            <div className={classes.inlineField}>
                                <TextField
                                    className={classes.field}
                                    name="emailCode"
                                    label="邮箱验证码"
                                    value={form.emailCode}
                                    onChange={changeHandler}
                                    inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                                />
                                <Button
                                    className={classes.codeButton}
                                    type="button"
                                    variant="outlined"
                                    color="primary"
                                    disabled={sending || countdown > 0}
                                    onClick={sendEmailCode}
                                >
                                    {countdown > 0 ? `${countdown} 秒后重发` : sending ? '发送中…' : '发送验证码'}
                                </Button>
                            </div>
                            {formError && <Typography color="error">{formError}</Typography>}
                            <Button
                                className={classnames(classes.alignSelf, classes.submit)}
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={registering}
                            >
                                {registering ? '注册中…' : '注册'}
                            </Button>
                            <Button className={classes.loginLink} type="button" color="primary" onClick={() => history.push('/login')}>
                                已有账号？去登录
                            </Button>
                        </form>
                    </Grid>
                </div>
            </NavBar>
        </div>
    )
}

export default Register
