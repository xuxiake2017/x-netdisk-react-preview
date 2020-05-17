import React, { useEffect } from "react";
import PropTypes from 'prop-types'
import NavBar from "./NavBar";

import { GetFileMediaInfo } from "../api/file";
import { useParams } from "react-router";

const MediaPreview = (props) => {

    const { fileKey } = useParams()
    useEffect(() => {
        console.log(fileKey)
        // GetFileMediaInfo({ fileKey: props.fileKey }).then(res => {
        //     console.log(res)
        // })
    }, [])
    return (
        <React.Fragment>
            <NavBar>

            </NavBar>
        </React.Fragment>
    )
}

export default MediaPreview
