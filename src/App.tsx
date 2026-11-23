// @ts-nocheck -- Legacy module pending typed refactor.
import React, { lazy, Suspense, useEffect, useState } from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import Login from "./components/login/Login";
import { useDispatch, useSelector } from "react-redux"
import { setClientHeight, setClientWidth } from "./actions";
import { CircularProgress, CssBaseline, createMuiTheme, ThemeProvider } from "@material-ui/core";
import { GlobalStyle } from "./style/GlobalStyle";
import { useHistory } from "react-router-dom";
import Notification from "./components/common/Notification";
import AuthRoute from "./components/route/AuthRoute";
import ImageView from "./components/filePreview/ImageView";

const Home = lazy(() => import("./components/Home"));
const Register = lazy(() => import("./components/login/Register"));
const MediaPreview = lazy(() => import("./components/filePreview/MediaPreview"));
const SharePage = lazy(() => import("./components/share/SharePage"));
const ShareManage = lazy(() => import("./components/share/ShareManage"));
const RecycleBin = lazy(() => import("./components/recycle/RecycleBin"));
const UserInfo = lazy(() => import("./components/user/UserInfo"));

export default function App(props) {

    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        // Update the document title using the browser API
        let clientHeight = `${document.documentElement.clientHeight}`
        let clientWidth = `${document.documentElement.clientWidth}`
        setClientHeightHandler(clientHeight)
        setClientWidthHandler(clientWidth)
        window.addEventListener('resize', () => {
            clientHeight = `${document.documentElement.clientHeight}`
            clientWidth = `${document.documentElement.clientWidth}`
            setClientHeightHandler(clientHeight)
            setClientWidthHandler(clientWidth)
        })
    }, [])

    const setClientHeightHandler = (clientHeight) => {
        dispatch(setClientHeight(clientHeight))
    }
    const setClientWidthHandler = (clientWidth) => {
        dispatch(setClientWidth(clientWidth))
    }

    const themeType = useSelector(({ appInfo }) => {
        return appInfo.palette.type
    })

    const theme = createMuiTheme({
        palette: {
            type: themeType
        },
    })

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <GlobalStyle/>
                <CssBaseline/>
                <Notification/>
                <ImageView/>
                <div>
                    <Suspense fallback={
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
                            <CircularProgress/>
                        </div>
                    }>
                        <Switch>
                        <AuthRoute exact path="/">
                            <Login/>
                        </AuthRoute>
                        <AuthRoute path="/login">
                            <Login/>
                        </AuthRoute>
                        <AuthRoute path="/home">
                            <Home/>
                        </AuthRoute>
                        <AuthRoute path="/register">
                            <Register/>
                        </AuthRoute>
                        <AuthRoute path="/mediaPreview/:fileKey">
                            <MediaPreview/>
                        </AuthRoute>
                        <AuthRoute path="/share">
                            <ShareManage/>
                        </AuthRoute>
                        <AuthRoute path="/recycle">
                            <RecycleBin/>
                        </AuthRoute>
                        <AuthRoute path="/userInfo">
                            <UserInfo/>
                        </AuthRoute>
                        <Route path="/s/:shareId">
                            <SharePage/>
                        </Route>
                        </Switch>
                    </Suspense>
                </div>
            </ThemeProvider>
        </React.Fragment>
    )
}
