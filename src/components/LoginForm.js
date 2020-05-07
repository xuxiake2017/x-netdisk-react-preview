import { TextField, Grid, Typography, Button } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CatImg from '../assets/cat1.jpg'
import CaptchaImg from '../assets/captcha.png'
import classnames from 'classnames'
import LoginFormStyles from './LoginForm.module.scss'
import { useHistory } from 'react-router-dom'

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
            background: `url(${CatImg}) no-repeat center center`,
            backgroundSize: "contain",
            color: "white",
            [theme.breakpoints.down('sm')]: {
                display: 'none',
            },
        },
        leftMask: {
            width: '100%',
            height: '100%',
            background: theme.palette.type === 'dark' ? 'rgba(43,41,41,0.6)' : 'rgba(1, 42, 255, 0.6)',
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
    }
))
const LoginForm = () => {

    const classes = useStyles()
    const history = useHistory()
    // const [username, setUsername] = React.useState('');
    // const [password, setPassword] = React.useState('');
    // const [captcha, setCaptcha] = React.useState('');
    const [loginData, setLoginData] = React.useState({
        username: '',
        password: '',
        captcha: ''
    });
    const [captchaSrc, setCaptchaSrc] = React.useState(CaptchaImg);
    const usernameChangeHandler = (event) => {
        // setUsername(event.target.value);
        setLoginData({
            ...loginData,
            username: event.target.value
        })
    }
    const passwordChangeHandler = (event) => {
        // setPassword(event.target.value);
        setLoginData({
            ...loginData,
            password: event.target.value
        })
    }
    const captchaChangeHandler = (event) => {
        // setCaptcha(event.target.value);
        setLoginData({
            ...loginData,
            captcha: event.target.value
        })
    }
    const changeCaptcha = () => {

    }
    const loginHandler = () => {
        history.push('/home')
    }
    return (
        <React.Fragment>
            <div className={classes.container}>
                <Grid container className={classes.wrap}>
                    <div className={classes.left}>
                        <div className={`${classes.leftMask}`}>
                            <Typography variant={'h4'} className={classes.typography}>
                                SEND YOUR CAT TO MARS
                            </Typography>
                        </div>
                    </div>
                    <Grid item className={classnames(classes.right, LoginFormStyles.right)} xs={10} md={5}>
                        <Typography variant={'h4'} className={classnames(LoginFormStyles.header, classes.alignSelf)}>
                            登录
                        </Typography>
                        <Grid container justify={'center'}>
                            <TextField id={'username'} label={'用户名'} fullWidth value={loginData.username} onChange={usernameChangeHandler}/>
                        </Grid>
                        <Grid container justify={'center'}>
                            <TextField id={'password'} label={'密码'} fullWidth value={loginData.password} onChange={passwordChangeHandler}/>
                        </Grid>
                        <Grid container justify={'center'} className={LoginFormStyles.captchaContainer}>
                            <TextField id={'captcha'} label={'验证码'} fullWidth value={loginData.captcha} onChange={captchaChangeHandler}/>
                            <div className={LoginFormStyles.loginCaptcha}>
                                <img src={captchaSrc} onClick={changeCaptcha}/>
                            </div>
                        </Grid>
                        <Button variant="contained" color="primary" size="medium" className={classnames(classes.margin, classes.alignSelf, classes.loginBtn)} onClick={loginHandler}>
                            Start
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>
    )
}

export default LoginForm
