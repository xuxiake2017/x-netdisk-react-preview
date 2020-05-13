import React from "react";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    avatarUploader: {
        border: '1px dashed #d9d9d9',
        borderRadius: '6px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        width: '100px',
        height: '100px',
        '&:hover': {
            borderColor: '#409EFF'
        }
    },
    avatarUploaderIcon: {
        fontSize: '28px',
        color: '#8c939d',
        width: '100px',
        height: '100px',
        lineHeight: '100px',
        textAlign: 'center'
    },
    avatar: {
        width: '100px',
        height: '100px',
        display: 'block',
        objectFit: "cover"
    }
}))
const Collection = () => {
    let [avatar, setAvatar] = React.useState('');
    return (
        <React.Fragment>
            {/*头像上传*/}
            {/*<Upload action={'http://192.168.3.188/iot-think/userManager/avatarUpload'} className={classes.avatarUploader} onSuccess={(res) => {*/}
            {/*    setAvatar(res.data.url)*/}
            {/*}}>*/}
            {/*    {*/}
            {/*        Boolean(avatar) ? <img src={avatar} className={classes.avatar}/> : <i className={classNames('el-icon-plus', classes.avatarUploaderIcon)}/>*/}
            {/*    }*/}
            {/*</Upload>*/}
        </React.Fragment>
    )
}
