import React from "react";
import { Breadcrumbs, Button, makeStyles, Fade, Tooltip } from "@material-ui/core";
import PropTypes from "prop-types";
import MySvgIcon from "./SvgIcon";
import { setViewMode } from "../actions";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    breadcrumbsButton: {
        fontSize: '1rem'
    },
    switchViewMode: () => {
        return {
            position: "absolute",
            right: 20,
            padding: 8,
            fontSize: '1.5rem',
            color: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.54)',
            cursor: "pointer"
        }
    }
}))

const VIEW_MODES = [
    'GRID_OF_PREVIEW',
    'GRID',
    'LIST',
]
const VIEW_MODE_SVGS = [
    '#icon-square_grid_3x2_fill',
    '#icon-list_bullet',
    '#icon-square_grid_2x2_fill',
]
const TOOLTIPS = [
    '切换到小图标模式',
    '切换到列表模式',
    '切换到大图标模式',
]
const FileBreadcrumbs = (props) => {
    const classes = useStyles()
    const handleClick = (parentId, index) => {
        props.onClick(parentId, index)
    }
    const dispatch = useDispatch()
    const viewMode = useSelector(({ fileExplorer }) => {
        return fileExplorer.viewMode
    })
    const switchViewMode = () => {
        const nextViewMode = VIEW_MODES[(VIEW_MODES.indexOf(viewMode) + 1) % 3]
        props.onReLoad(nextViewMode)
        dispatch(setViewMode(nextViewMode))
    }
    return (
        <React.Fragment>
            <Breadcrumbs aria-label="breadcrumb" separator={'/'}>
                {props.pathStore.map((item, index) => (
                    <Fade key={item.parentId} in={Boolean(item)}>
                        <Button classes={{root: classes.breadcrumbsButton}} onClick={() => {
                            handleClick(item.parentId, index)
                        }}>{item.fileRealName}</Button>
                    </Fade>
                ))}
            </Breadcrumbs>
            <div className={classes.switchViewMode} onClick={switchViewMode}>
                <Tooltip title={TOOLTIPS[VIEW_MODES.indexOf(viewMode)]}>
                    <div>
                        <MySvgIcon name={VIEW_MODE_SVGS[VIEW_MODES.indexOf(viewMode)]}/>
                    </div>
                </Tooltip>
            </div>
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
    onClick: PropTypes.func.isRequired,
    onReLoad: PropTypes.func
}

export default FileBreadcrumbs
