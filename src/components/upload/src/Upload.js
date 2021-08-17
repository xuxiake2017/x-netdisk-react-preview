import React, { forwardRef } from "react";
import PropTypes from 'prop-types'
import ajax from "./ajax";

const Upload = forwardRef((props, ref) => {

    const reqs = React.useRef({})
    const setReqs = (val) => {
        reqs.current = val
    }
    const inputRef = ref

    const handleChange = (ev) => {
        const files = ev.target.files;

        if (!files) return;
        uploadFiles(files);
    }
    const uploadFiles = (files) => {
        if (props.limit && props.fileList.length + files.length > props.limit) {
            props.onExceed && props.onExceed(files, props.fileList);
            return;
        }

        let postFiles = Array.prototype.slice.call(files);
        if (!props.multiple) { postFiles = postFiles.slice(0, 1); }

        if (postFiles.length === 0) { return; }

        props.onStart(postFiles);
        inputRef.current.value = null;
        for (let index = 0; index < postFiles.length; index++) {
            const rawFile = postFiles[index];
            upload(rawFile)
        }
    }
    const upload = (rawFile) => {
        if (!props.beforeUpload) {
            return post(rawFile);
        }

        const before = props.beforeUpload(rawFile);
        if (before && before.then) {
            before.then((uploadData) => {
                post(rawFile, uploadData);
            }, () => {
                abort(rawFile)
                props.onRemove(null, rawFile);
            });
        } else { // 不返回Promise直接取消上传
            abort(rawFile)
            props.onRemove(null, rawFile);
        }
    }
    const abort = (file) => {
        if (file) {
            let uid = file;
            if (file.uid) uid = file.uid;
            if (reqs.current[uid]) {
                reqs.current[uid].abort();
            }
        } else {
            Object.keys(reqs.current).forEach((uid) => {
                if (reqs.current[uid]) reqs.current[uid].abort();
            });
            setReqs({})
        }
    }
    const post = (rawFile, uploadData = {}) => {
        const { uid } = rawFile;
        const options = {
            headers: props.headers,
            withCredentials: props.withCredentials,
            file: rawFile,
            data: uploadData,
            filename: props.name,
            action: props.action,
            onProgress: e => {
                props.onProgress(e, rawFile);
            },
            onSuccess: res => {
                props.onSuccess(res, rawFile);
                const reqs_ = { ...reqs.current }
                delete reqs_[uid];
                setReqs(reqs_)
            },
            onError: err => {
                props.onError(err, rawFile);
                const reqs_ = { ...reqs.current }
                delete reqs_[uid];
                setReqs(reqs_)
            }
        };
        const req = props.httpRequest(options);
        const reqs_ = { ...reqs.current }
        reqs_[uid] = req
        setReqs(reqs_)
        if (req && req.then) {
            req.then(options.onSuccess, options.onError);
        }
    }
    return (
        <input
            type="file"
            ref={inputRef}
            name={props.name}
            onChange={handleChange}
            multiple={props.multiple}
            accept={props.accept}
        />
    );
})

Upload.defaultProps = {
    name: 'file',
    onPreview: () => {},
    onRemove: () => {},
    httpRequest: ajax
}

Upload.propTypes = {
    action: PropTypes.string.isRequired,
    name: PropTypes.string,
    data: PropTypes.object,
    headers: PropTypes.object,
    withCredentials: PropTypes.bool,
    multiple: PropTypes.bool,
    accept: PropTypes.string,
    onStart: PropTypes.func,
    onProgress: PropTypes.func,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    beforeUpload: PropTypes.func,
    limit: PropTypes.number,
    // 文件超出个数限制时的钩子
    onExceed: PropTypes.func
}

export default Upload
