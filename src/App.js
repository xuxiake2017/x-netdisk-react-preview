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

export default function App(props) {

    const dispatch = useDispatch()

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
    })

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
                <CssBaseline/>
                <div>
                    <Switch>
                        <Route exact path="/">
                            <Login/>
                        </Route>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <Route path="/home">
                            <Home/>
                        </Route>
                    </Switch>
                </div>
            </ThemeProvider>
        </React.Fragment>
    )
}
