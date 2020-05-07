import Navbar from "./NavBar";
import React from "react";
import {
    makeStyles, Breadcrumbs, Divider, Button, Grid, Typography
} from "@material-ui/core";
import MySvgIcon from "./SvgIcon";
import FileIcon from "./FileIcon";

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
    typeHeader: {
        margin: "10px 25px",
        color: "#6b6b6b",
        fontWeight: "500"
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
                        <Button classes={{root: classes.breadcrumbsButton}} onClick={handleClick}>根目录</Button>
                        <Button classes={{root: classes.breadcrumbsButton}} onClick={handleClick}>2019</Button>
                        <Button classes={{root: classes.breadcrumbsButton}} onClick={handleClick}>图片</Button>
                        <Button classes={{root: classes.breadcrumbsButton}} onClick={handleClick}>杨幂</Button>
                    </Breadcrumbs>
                </div>
                <Divider/>
                {/*<MySvgIcon name={'icon-file_word_office'}/>*/}
                {/*<MySvgIcon name={'icon-file_txt'}/>*/}
                <div>
                    <Typography
                        variant="body2"
                        className={classes.typeHeader}
                    >
                        文件
                    </Typography>
                    <Grid
                        container
                        spacing={0}
                        alignItems="flex-start"
                    >
                        <Grid
                            item
                            xs={6}
                            md={3}
                            sm={4}
                            lg={2}
                        >
                            <div style={{padding: "7px"}}>
                                <div style={{minWidth: 0}}>
                                    <FileIcon/>
                                </div>
                            </div>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            md={3}
                            sm={4}
                            lg={2}
                        >
                            <div style={{padding: "7px"}}>
                                <div style={{minWidth: 0}}>
                                    <FileIcon/>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Navbar>
        </div>
    )
}

export default Home
