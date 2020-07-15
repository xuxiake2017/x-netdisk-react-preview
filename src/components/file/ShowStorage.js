import React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import { formatFileSize } from "../../utils/FileUtils";

const useStyle = makeStyles((theme) => ({
    'aside-absolute-container': {
        position: 'absolute',
        width: '100%',
        height: '100px',
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    'remainingSpaceUi': {
        height: '8px',
        width: '155px',
        background: 'rgba(0,0,0,.1)',
        lineHeight: 0,
        borderRadius: '10px',
    },
    'remainingSpaceUi_span': {
        height: '8px',
        lineHeight: 0,
        display: 'block',
        borderRadius: '10px',
        transitionProperty: 'width',
        transitionDelay: '.3s',
        transitionTimingFunction: 'linear',
    },
    'remaining-space': {
        padding: '10px 0'
    }
}))

// 展示储存空间信息
const ShowStorage = (props) => {

    const classes = useStyle()

    const userInfo  = useSelector(state => {
        return state.userInfo
    })
    const [width, setWidth] = React.useState(0);

    React.useEffect(() => {
        if (userInfo) {
            const {
                totalMemory,
                usedMemory
            } = userInfo
            let width_ = usedMemory / totalMemory
            width_ = width_.toFixed(4) * 100
            setWidth(width_)
            console.log('储存空间占用: ', `${width_}%`)

        }
    }, [userInfo])
    return (
        <React.Fragment>
            <div className={classes["aside-absolute-container"]}>
                <Divider/>
                <div>
                    <div className={classes.remainingSpaceUi}>
                            <span className={classes['remainingSpaceUi_span']} style={
                                {
                                    background: 'rgb(255, 216, 33)',
                                    transitionDuration: '1.27228s',
                                    width: `${width}%`
                                }
                            }/>
                    </div>
                    <div className={classes["remaining-space"]}>
                        {
                            userInfo ? (
                                <React.Fragment>
                                    <span>
                                        {
                                            formatFileSize(userInfo.usedMemory)
                                        }
                                    </span>
                                    /
                                    <span>
                                        {
                                            formatFileSize(userInfo.totalMemory)
                                        }
                                    </span>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <span>--</span>
                                    /
                                    <span>--</span>
                                </React.Fragment>
                            )
                        }

                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ShowStorage
