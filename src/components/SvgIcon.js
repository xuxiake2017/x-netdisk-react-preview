import PropTypes from 'prop-types'
import {Box} from "@material-ui/core";
import React from "react";
const MySvgIcon = (props) => {

    return (
        <Box>
            <svg className={`icon ${props.className}`} aria-hidden="true" style={{width: props.width, height: props.height}}>
                <use xlinkHref={`${props.name}`}></use>
            </svg>
        </Box>
    )
}

// 设置默认值
MySvgIcon.defaultProps = {
    width: '1em',
    height: '1em'
}

// 设置类型
MySvgIcon.propTypes = {
    name: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    className: PropTypes.string
}


export default MySvgIcon
