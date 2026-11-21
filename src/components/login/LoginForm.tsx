// @ts-nocheck -- Legacy module pending typed refactor.
import {
    TextField, Grid, Typography, Button, IconButton, InputLabel, FormControl, FormHelperText, Input
} from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LoginLeftBg from '../../assets/login_left_bg.jpg'
import classnames from 'classnames'
// 引入scss测试
import LoginFormStyles from '../../style/LoginForm.module.scss'
import { useHistory, useLocation } from 'react-router-dom'
import { RequestLogin } from "../../api/user";
import AppConf from "../../conf/AppConf";
import InputAdornment from "@material-ui/core/InputAdornment";
import {Visibility, VisibilityOff} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import { useDispatch } from "react-redux";
import { openSuccessNotification, setUserInfo, drawerToggleAction } from "../../actions";
import { setToken } from "../../utils/auth";

const useStyles = makeStyles(theme => (
    {
        container: {
            background: '#eaeefa',
            width: '100%',
            height: `calc(100% - ${56}px)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            [theme.breakpoints.down('xs')]: {
                height: `calc(100% - ${48}px)`,
            },
        },
        wrap: {
            display: "flex",
            width: 900,
            height: 700,
            justifyContent: "center",
            alignItems: "center",
            background: '#eaeefa',
        },
        left: {
            width: 400,
            height: 400,
            background: `url(${LoginLeftBg}) no-repeat center center`,
            backgroundSize: "contain",
            color: "white",
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        leftMask: {
            width: '100%',
            height: '100%',
            // background: theme.palette.type === 'dark' ? 'rgba(43,41,41,0.6)' : 'rgba(1, 42, 255, 0.6)',
            background: theme.palette.type === 'dark' ? 'rgba(0,0,0,0.6)' : 'linear-gradient(to top , rgba(247,167,102,0.5), rgba(1, 42, 255, 0.5))',
            transition: 'background-color .4s'
        },
        typography: {
            padding: theme.spacing(4)
        },
        alignSelf: {
            alignSelf: "start"
        },
        right: {
            width: 390,
            height: 550,
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            '& > * + *': {
                marginTop: theme.spacing(5),
            },
            padding: theme.spacing(5)
        },
        loginBtn: {
            backgroundColor: 'rgba(1, 42, 255, 1)',
            borderRadius: '20px',
            width: '50%'
        },
        formControl: {
            width: '100%',
        }
    }
))
const LoginForm = () => {

    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()
    const dispatch = useDispatch()
    const [loginData, setLoginData] = React.useState({
        username: '',
        password: '',
        captcha: ''
    });
    const [captchaSrc, setCaptchaSrc] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false)
    const [fieldErrors, setFieldErrors] = React.useState({})
    React.useEffect(() => {
        dispatch(drawerToggleAction(false))
        setCaptchaSrc(createImg())
    }, [])

    const changeHandler = (event) => {
        const textFieldName = event.target.name
        setLoginData({
            ...loginData,
            [textFieldName]: event.target.value
        })
        setFieldErrors(previous => ({
            ...previous,
            [textFieldName]: ''
        }))
    }
    const changeCaptcha = () => {
        setCaptchaSrc(createImg())
    }
    const createImg = () => {
        if (import.meta.env.DEV) {
            return `/netdisk/user/createImg?${new Date().getTime()}`
        }
        return `${AppConf.baseUrl()}/user/createImg?${new Date().getTime()}`
    }
    const validate = () => {
        const errors = {}
        if (!loginData.username.trim()) {
            errors.username = '请输入用户名、邮箱或手机号'
        }
        if (!loginData.password) {
            errors.password = '请输入密码'
        }
        if (!loginData.captcha.trim()) {
            errors.captcha = '请输入图形验证码'
        } else if (loginData.captcha.trim().length !== 4) {
            errors.captcha = '请输入 4 位图形验证码'
        }
        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }
    const loginHandler = async event => {
        event.preventDefault()
        if (submitting || !validate()) {
            return
        }
        const params = {
            loginInfo: loginData.username.trim(),
            password: loginData.password,
            imgCode: loginData.captcha.trim(),
        }
        setSubmitting(true)
        try {
            const res = await RequestLogin(params)
            setToken(res.data.token)
            dispatch(setUserInfo(res.data))
            dispatch(openSuccessNotification('登录成功!'))
            const redirect = new URLSearchParams(location.search).get('redirect')
            if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
                history.replace(redirect)
            } else {
                history.replace('/home')
            }
        } finally {
            setSubmitting(false)
        }
    }
    const handleClickShowPassword = (e) => {
        e.preventDefault()
        setShowPassword(!showPassword)
    }
    return (
        <React.Fragment>
            <div className={classes.container}>
                <Grid container className={classes.wrap}>
                    <div className={classes.left}>
                        <div className={`${classes.leftMask}`}>
                            <Typography variant={'h4'} className={classes.typography}>
                                CEASE TO STRUGGLE AND YOU CEASE TO LIVE
                            </Typography>
                        </div>
                    </div>
                    <Grid item component="form" onSubmit={loginHandler} noValidate className={classnames(classes.right, LoginFormStyles.right)} xs={10} md={5}>
                        <Typography variant={'h4'} className={classnames(LoginFormStyles.header, classes.alignSelf)}>
                            登录
                        </Typography>
                        <Grid container justify={'center'}>
                            <TextField
                                name="username"
                                id="username"
                                label="用户名 / 邮箱 / 手机号"
                                fullWidth
                                autoComplete="username"
                                value={loginData.username}
                                onChange={changeHandler}
                                error={Boolean(fieldErrors.username)}
                                helperText={fieldErrors.username}
                                inputProps={{ maxLength: 100 }}
                            />
                        </Grid>
                        <Grid container justify={'center'}>
                            {/*<TextField name={'password'} id={'password'} label={'密码'} fullWidth value={loginData.password} onChange={changeHandler}/>*/}
                            <FormControl className={classes.formControl} error={Boolean(fieldErrors.password)}>
                                <InputLabel htmlFor="filled-adornment-password">密码</InputLabel>
                                <Input
                                    name={'password'}
                                    id="standard-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={loginData.password}
                                    onChange={changeHandler}
                                    autoComplete="current-password"
                                    inputProps={{ maxLength: 128 }}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                type="button"
                                                aria-label="显示或隐藏密码"
                                                onClick={handleClickShowPassword}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {fieldErrors.password && <FormHelperText>{fieldErrors.password}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid container justify={'center'} className={LoginFormStyles.captchaContainer}>
                            <TextField
                                name="captcha"
                                id="captcha"
                                label="验证码"
                                fullWidth
                                value={loginData.captcha}
                                onChange={changeHandler}
                                error={Boolean(fieldErrors.captcha)}
                                helperText={fieldErrors.captcha}
                                inputProps={{ maxLength: 4 }}
                            />
                            <Tooltip title={'点击更换'}>
                                <div className={LoginFormStyles.loginCaptcha}>
                                    <img src={captchaSrc} alt="图形验证码" onClick={changeCaptcha}/>
                                </div>
                            </Tooltip>
                        </Grid>
                        <Button type="submit" variant="contained" color="primary" size="medium" disabled={submitting} className={classnames(classes.margin, classes.alignSelf, classes.loginBtn)}>
                            {submitting ? '登录中…' : '登录'}
                        </Button>
                        <Button type="button" color="primary" className={classes.alignSelf} onClick={() => history.push('/register')}>
                            没有账号？去注册
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>
    )
}

export default LoginForm
