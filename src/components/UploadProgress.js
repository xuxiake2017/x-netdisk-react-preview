import React from "react";
import {lighten, LinearProgress, withStyles, makeStyles} from "@material-ui/core";
import PropTypes from 'prop-types'
import Paper from "@material-ui/core/Paper";
import Fade from "@material-ui/core/Fade";
import Tooltip from "@material-ui/core/Tooltip";

const BorderLinearProgress = withStyles({
    root: {
        height: 20,
        backgroundColor: lighten('#ff6c5c', 0.5),
        borderRadius: 20,
    },
    bar: {
        borderRadius: 20,
        backgroundColor: '#ff6c5c',
    },
})(LinearProgress);

const useStyles = makeStyles(() => (
    {
        paper: {
            position: "absolute",
            right: 10,
            bottom: 10,
            width: '30%',
            padding: 10,
            minHeight: 100,
            '& * + *': {
                paddingTop: 5
            }
        },
        container: {
            width: '100%',
            display: "flex",
            position: "relative",
            alignItems: "center"
        },
        title: {
          padding: '5px 10px'
        },
        progress: {
            width: '100%'
        },
        fileName: {
            position: "absolute",
            left: 0,
            color: '#FFF',
            fontSize: '100%',
            padding: '0 10px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            width: '100%'
        }
    }
))

const UploadProgress = (props) => {
    const classes = useStyles()
    return (
        <React.Fragment>
            <Fade in={props.open} timeout={{
                exit: 1000
            }}>
                <Paper elevation={3} className={classes.paper}>
                    <div className={classes.title}>
                        上传进度
                    </div>
                    {
                        props.uploadFileList.map(item => (
                            <div key={item.uid} className={classes.container}>
                                <BorderLinearProgress
                                    className={classes.progress}
                                    variant="determinate"
                                    color="secondary"
                                    value={item.percentage}
                                />
                                <Tooltip title={item.name}>
                                    <div className={classes.fileName}>
                                        {item.name}
                                    </div>
                                </Tooltip>
                            </div>
                        ))
                    }
                    {/*<div className={classes.container}>
                        <BorderLinearProgress
                            className={classes.progress}
                            variant="determinate"
                            color="secondary"
                            value={10}
                        />
                        <Tooltip title={'睿智物联工作周报 2020-04-03 徐冠杰.xlsx'}>
                            <div className={classes.fileName}>
                                睿智物联工作周报 2020-04-03 徐冠杰.xlsx
                            </div>
                        </Tooltip>
                    </div>*/}
                </Paper>
            </Fade>
        </React.Fragment>
    )
}

UploadProgress.propTypes = {
    open: PropTypes.bool,
    uploadFileList: PropTypes.array,
}

export default UploadProgress
