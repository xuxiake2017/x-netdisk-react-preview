import Navbar from "./NavBar";
import React from "react";
import { makeStyles, Breadcrumbs, Link, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
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
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" href="/" onClick={handleClick}>
                        Material-UI
                    </Link>
                    <Link color="inherit" href="/getting-started/installation/" onClick={handleClick}>
                        Core
                    </Link>
                    <Typography color="textPrimary">Breadcrumb</Typography>
                </Breadcrumbs>
            </Navbar>
        </div>
    )
}

export default Home
