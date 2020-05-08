import Navbar from "./NavBar";
import React from "react";
import {
    makeStyles, Breadcrumbs, Divider, Button, Grid, Typography
} from "@material-ui/core";
import FileList from "./FileList";
import { useDispatch } from "react-redux";
import { openNotification } from "../actions";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    breadcrumb: {
        display: 'flex',
        height: '48px',
        padding: '8px 16px',
        alignItems: 'center',
    },
    breadcrumbsButton: {
        fontSize: '1rem'
    },
    fileList: {
        padding: 10
    }
}))

const Home = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const handleClick = (e) => {
        console.log(e)
        dispatch(openNotification({
            autoHideDuration: 3000,
            severity: 'success',
            message: '这是一条通知'
        }))
    }
    return (
        <div className={classes.root}>
            <Navbar>
                <div className={classes.breadcrumb}>
                    <Breadcrumbs aria-label="breadcrumb" separator={'/'}>
                        <Button classes={{root: classes.breadcrumbsButton}} onClick={handleClick}>根目录</Button>
                        <Button classes={{root: classes.breadcrumbsButton}} onClick={handleClick}>2019</Button>
                        <Button classes={{root: classes.breadcrumbsButton}} onClick={handleClick}>图片</Button>
                        <Button classes={{root: classes.breadcrumbsButton}} onClick={handleClick}>杨幂</Button>
                    </Breadcrumbs>
                </div>
                <Divider/>
                <div className={classes.fileList}>
                    <FileList/>
                </div>
            </Navbar>
        </div>
    )
}

export default Home
