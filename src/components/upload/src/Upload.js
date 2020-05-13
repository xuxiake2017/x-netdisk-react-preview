import React from "react";
import PropTypes from 'prop-types'
import ajax from "./ajax";
import classNames from "classnames";
import UploadDragger from "./UploadDragger";

class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mouseover: false,
            reqs: {}
        }
        this.inputRef = React.createRef(null)
    }

    isImage(str) {
        return str.indexOf('image') !== -1;
    }
    handleChange(ev) {
        const files = ev.target.files;

        if (!files) return;
        this.uploadFiles(files);
    }
    uploadFiles(files) {
        if (this.props.limit && this.props.fileList.length + files.length > this.props.limit) {
            this.props.onExceed && this.props.onExceed(files, this.props.fileList);
            return;
        }

        let postFiles = Array.prototype.slice.call(files);
        if (!this.props.multiple) { postFiles = postFiles.slice(0, 1); }

        if (postFiles.length === 0) { return; }

        // postFiles.forEach(rawFile => {
        //     this.props.onStart(rawFile);
        //     if (this.props.autoUpload) this.upload(rawFile);
        // });
        this.props.onStart(postFiles);
        postFiles.forEach(rawFile => {
            if (this.props.autoUpload) this.upload(rawFile);
        });
    }
    upload(rawFile) {
        this.inputRef.current.value = null;

        if (!this.props.beforeUpload) {
            return this.post(rawFile);
        }

        const before = this.props.beforeUpload(rawFile);
        if (before && before.then) {
            before.then(processedFile => {
                const fileType = Object.prototype.toString.call(processedFile);

                if (fileType === '[object File]' || fileType === '[object Blob]') {
                    if (fileType === '[object Blob]') {
                        processedFile = new File([processedFile], rawFile.name, {
                            type: rawFile.type
                        });
                    }
                    for (const p in rawFile) {
                        if (rawFile.hasOwnProperty(p)) {
                            processedFile[p] = rawFile[p];
                        }
                    }
                    this.post(processedFile);
                } else {
                    this.post(rawFile);
                }
            }, () => {
                this.props.onRemove(null, rawFile);
            });
        } else if (before !== false) {
            this.post(rawFile);
        } else {
            this.props.onRemove(null, rawFile);
        }
    }
    abort(file) {
        const reqs = this.state.reqs;
        if (file) {
            let uid = file;
            if (file.uid) uid = file.uid;
            if (reqs[uid]) {
                reqs[uid].abort();
            }
        } else {
            Object.keys(reqs).forEach((uid) => {
                if (reqs[uid]) reqs[uid].abort();
                const reqs_ = Object.assign({}, reqs)
                delete reqs_[uid];
                this.setState({
                    ...this.state,
                    reqs: reqs_

                })
            });
        }
    }
    post(rawFile) {
        const { uid } = rawFile;
        const options = {
            headers: this.props.headers,
            withCredentials: this.props.withCredentials,
            file: rawFile,
            data: this.props.data,
            filename: this.props.name,
            action: this.props.action,
            onProgress: e => {
                this.props.onProgress(e, rawFile);
            },
            onSuccess: res => {
                this.props.onSuccess(res, rawFile);
                const reqs_ = Object.assign({}, this.reqs)
                delete reqs_[uid];
                this.setState({
                    ...this.state,
                    reqs: reqs_
                })
            },
            onError: err => {
                this.props.onError(err, rawFile);
                const reqs_ = Object.assign({}, this.reqs)
                delete reqs_[uid];
                this.setState({
                    ...this.state,
                    reqs: reqs_
                })
            }
        };
        const req = this.props.httpRequest(options);
        const reqs_ = Object.assign({}, this.reqs)
        reqs_[uid] = req
        this.setState({
            ...this.state,
            reqs: reqs_
        })
        if (req && req.then) {
            req.then(options.onSuccess, options.onError);
        }
    }
    handleClick() {
        if (!this.props.disabled) {
            this.inputRef.current.value = null;
            this.inputRef.current.click();
        }
    }
    render() {
        const className = {
            'el-upload': true,
        }
        className[`el-upload--${this.props.listType}`] = true;
        const data = {
            className: classNames(className),
            onClick: (e) => {
                this.handleClick()
            },
        };
        return (
            <div {...data} tabIndex="0">
                {/*{this.props.children}*/}
                {
                    this.props.drag ? (
                            <UploadDragger
                                disabled={this.props.disabled}
                                onFile={
                                    (files) => {
                                        this.uploadFiles(files)
                                    }
                                }
                            >
                                {this.props.children}
                            </UploadDragger>
                    ) : (
                        this.props.children
                    )
                }
                <input className="el-upload__input" type="file" ref={this.inputRef} name={this.props.name} onChange={(e) => {
                    this.handleChange(e)
                }} multiple={this.props.multiple} accept={this.props.accept}/>
            </div>
        );
    }
}

Upload.defaultProps = {
    name: 'file',
    onPreview: () => {},
    onRemove: () => {},
    httpRequest: ajax
}

Upload.propTypes = {
    type: PropTypes.string,
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
    drag: PropTypes.bool,
    onPreview: PropTypes.func,
    onRemove: PropTypes.func,
    fileList: PropTypes.array,
    autoUpload: PropTypes.bool,
    listType: PropTypes.string,
    httpRequest: PropTypes.func,
    disabled: PropTypes.bool,
    limit: PropTypes.number,
    onExceed: PropTypes.func
}

export default Upload
