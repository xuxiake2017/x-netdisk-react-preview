import React, { useEffect, useState } from 'react';
import {
    Switch,
    Route
} from 'react-router-dom';
import Login from "./components/Login";
import { useDispatch, useSelector } from "react-redux"
import { setClientHeight, setClientWidth } from "./actions";
import { CssBaseline, createMuiTheme, ThemeProvider } from "@material-ui/core";
import Home from "./components/Home";
import { GlobalStyle } from "./style/GlobalStyle";
import { useHistory } from "react-router-dom";
import Notification from "./components/Notification";
import AuthRoute from "./components/AuthRoute";
import Register from "./components/Register";
import ImageView from "./components/ImageView";
import MediaPreview from "./components/MediaPreview";

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
                    </Switch>
                </div>
            </ThemeProvider>
        </React.Fragment>
    )
}
