import Navbar from "./NavBar";
import React from "react";
import {
    makeStyles, Breadcrumbs, Divider, Button
} from "@material-ui/core";

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
    button: {
        fontSize: '1rem'
    }
}))

const Home = () => {
    const classes = useStyles()
    const handleClick = (e) => {
        console.log(e)
    }
    return (
        <div className={classes.root}>
            <Navbar>
                <div className={classes.breadcrumb}>
                    <Breadcrumbs aria-label="breadcrumb" separator={'/'}>
                        <Button classes={{root: classes.button}} onClick={handleClick}>根目录</Button>
                        <Button classes={{root: classes.button}} onClick={handleClick}>2019</Button>
                        <Button classes={{root: classes.button}} onClick={handleClick}>图片</Button>
                        <Button classes={{root: classes.button}} onClick={handleClick}>杨幂</Button>
                    </Breadcrumbs>
                </div>
                <Divider/>
            </Navbar>
        </div>
    )
}

export default Home
