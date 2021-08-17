import PropTypes from 'prop-types'
import React from "react";
import Upload from "./Upload";

function noop() {}

const UploadContainer = React.forwardRef((props, ref) => {

    const uploadFiles = React.useRef([])
    const setUploadFiles = (val) => {
        uploadFiles.current = val
    }
    const tempIndex = React.useRef(1)

    const handleStart = (rawFiles) => {
        const files = []
        rawFiles.forEach(rawFile => {
            rawFile.uid = Date.now() + (tempIndex.current++);
            let file = {
                status: 'ready',
                name: rawFile.name,
                size: rawFile.size,
                percentage: 0,
                uid: rawFile.uid,
                raw: rawFile
            };
            files.push(file)
            props.onChange(file, uploadFiles.current);
        })
        setUploadFiles(files)
    }
    const handleProgress = (ev, rawFile) => {
        const file = getFile(rawFile);
        file.status = 'uploading';
        file.percentage = ev.percent || 0;
        const uploadFiles_ = [ ...uploadFiles.current ]
        uploadFiles_.splice(uploadFiles_.indexOf(file), 1, file);
        setUploadFiles(uploadFiles_)
        props.onProgress(ev, file, uploadFiles.current);
    }
    const handleSuccess = (res, rawFile) => {
        const file = getFile(rawFile);

        const file_ = Object.assign({}, file)
        file_.status = 'success';
        file_.response = res;
        const uploadFiles_ = [ ...uploadFiles.current ]
        uploadFiles_.splice(uploadFiles_.indexOf(file), 1, file_);
        setUploadFiles(uploadFiles_)

        props.onSuccess(res, file, uploadFiles_);
        props.onChange(file, uploadFiles_);
    }
    const handleError = (err, rawFile) => {
        const file = getFile(rawFile);
        file.status = 'fail';
        const uploadFiles_ = [ ...uploadFiles.current ]
        uploadFiles_.splice(uploadFiles_.indexOf(file), 1);
        setUploadFiles(uploadFiles_)

        props.onError(err, file, uploadFiles_);
        props.onChange(file, uploadFiles_);
    }
    const handleRemove = (file, raw) => {
        if (raw) {
            file = getFile(raw);
        }
        let doRemove = () => {
            const uploadFiles_ = [ ...uploadFiles.current ]
            uploadFiles_.splice(uploadFiles_.indexOf(file), 1);
            setUploadFiles(uploadFiles_)
            props.onRemove(file, uploadFiles_);
        };

        if (!props.beforeRemove) {
            doRemove();
        } else if (typeof props.beforeRemove === 'function') {
            const before = props.beforeRemove(file, uploadFiles.current);
            if (before && before.then) {
                before.then(() => {
                    doRemove();
                }, noop);
            } else if (before !== false) {
                doRemove();
            }
        }
    }
    const getFile = (rawFile) => {
        let fileList = uploadFiles.current;
        let target;
        fileList.every(item => {
            target = rawFile.uid === item.uid ? item : null;
            return !target;
        });
        return target;
    }

    const uploadData = {
        props: {
            action: props.action,
            multiple: props.multiple,
            beforeUpload: props.beforeUpload,
            withCredentials: props.withCredentials,
            headers: props.headers,
            name: props.name,
            data: props.data,
            accept: props.accept,
            limit: props.limit,
            onExceed: props.onExceed,
            onStart: (rawFile) => {
                handleStart(rawFile)
            },
            onProgress: (ev, rawFile) => {
                handleProgress(ev, rawFile)
            },
            onSuccess: (res, rawFile) => {
                handleSuccess(res, rawFile)
            },
            onError: (err, rawFile) => {
                handleError(err, rawFile)
            },
            onRemove: (file, raw) => {
                handleRemove(file, raw)
            },
        },
        ref
    };

    return (
        <div className={props.className}>
            <Upload {...uploadData.props} ref={uploadData.ref}></Upload>
        </div>
    )
})

UploadContainer.defaultProps = {
    headers: {},
    name: 'file',
    onChange: noop,
    onRemove: noop,
    onSuccess: noop,
    onProgress: noop,
    onError: noop,
    onExceed: noop,
}

UploadContainer.propTypes = {
    action: PropTypes.string.isRequired,
    headers: PropTypes.object,
    data: PropTypes.object,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    withCredentials: PropTypes.bool,
    accept: PropTypes.string,
    beforeUpload: PropTypes.func,
    beforeRemove: PropTypes.func,
    onChange: PropTypes.func,
    onSuccess: PropTypes.func,
    onProgress: PropTypes.func,
    onError: PropTypes.func,
    limit: PropTypes.number,
    className: PropTypes.string
}

export default UploadContainer
