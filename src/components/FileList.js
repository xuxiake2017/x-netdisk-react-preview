import React, { useEffect } from "react";
import {Grid, Typography} from "@material-ui/core";
import FileIcon from "./FileIcon";
import { makeStyles } from "@material-ui/core/styles";
import { GetFileList } from "../api/file";

const useStyles = makeStyles((theme) => ({
    typeHeader: {
        margin: "10px 25px",
        color: "#6b6b6b",
        fontWeight: "500"
    }
}))

const FileList = () => {
    const classes = useStyles()
    useEffect(() => {
        getFileList()
    })
    const getFileList = () => {
        const params = {}
        GetFileList(params).then(res => {
            console.log(res)
        })
    }
    return (
        <React.Fragment>
            <div>
                <Typography
                    variant="body2"
                    className={classes.typeHeader}
                >
                    文件夹
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
                        <FileIcon isDir/>
                    </Grid>
                </Grid>
            </div>
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
                        <FileIcon/>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        md={3}
                        sm={4}
                        lg={2}
                    >
                        <FileIcon/>
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>
    )
}

export default FileList
