import React from "react";
import {Breadcrumbs, Button, makeStyles, Fade} from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    breadcrumbsButton: {
        fontSize: '1rem'
    }
}))
const FileBreadcrumbs = (props) => {
    const classes = useStyles()
    const handleClick = (parentId, index) => {
        props.onClick(parentId, index)
    }
    return (
        <React.Fragment>
            <Breadcrumbs aria-label="breadcrumb" separator={'/'}>
                {props.pathStore.map((item, index) => (
                    <Fade key={item.parentId} in={Boolean(item)}>
                        <Button key={item.parentId} classes={{root: classes.breadcrumbsButton}} onClick={() => {
                            handleClick(item.parentId, index)
                        }}>{item.fileRealName}</Button>
                    </Fade>
                ))}
            </Breadcrumbs>
        </React.Fragment>
    )
}

FileBreadcrumbs.propTypes = {
    pathStore: PropTypes.arrayOf(
        PropTypes.shape({
            parentId: PropTypes.number,
            fileRealName: PropTypes.string
        })
    ).isRequired,
    onClick: PropTypes.func.isRequired
}

export default FileBreadcrumbs
