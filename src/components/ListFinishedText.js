import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => (
    {
        'list__finished-text': {
            color: '#969799',
            fontSize: '13px',
            lineHeight: '50px',
            textAlign: 'center',
        }
    }
))

const ListFinishedText = () => {
    const classes = useStyles()
    return (
        <div className={classes["list__finished-text"]}>没有更多了</div>
    )
}

export default ListFinishedText
