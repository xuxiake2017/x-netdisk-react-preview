import Navbar from "./NavBar";
import React from "react";
import { makeStyles } from "@material-ui/core";
import LoginForm from "./LoginForm";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    container: {
        paddingTop: '200px'
    }
}))

const Login = () => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <Navbar>
                <LoginForm/>
            </Navbar>
        </div>
    )
}

export default Login
