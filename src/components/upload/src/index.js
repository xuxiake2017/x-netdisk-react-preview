import PropTypes from 'prop-types'
import React from "react";
import Upload from "./Upload";
import UploadList from "./UploadList";

function noop() {}

class UploadContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uploadFiles: [],
            dragOver: false,
            draging: false,
            uploadDisabled: props.disabled
        }
        this.uploadInnerRef = React.createRef(null)
        this.tempIndex = 1
    }

    componentDidMount() {

        if (this.props.type === 'picture-card' || this.props.type === 'picture') {
            this.setState({
                ...this.state,
                uploadFiles: this.state.uploadFiles.map(file => {
                    if (!file.url && file.raw) {
                        try {
                            file.url = URL.createObjectURL(file.raw);
                        } catch (err) {
                            console.error('[Upload]', err);
                        }
                    }
                    return file;
                })
            })
        }
        this.setState({
            ...this.state,
            uploadFiles: this.props.fileList.map(item => {
                if (item.uid) {
                    item.uid = item.uid
                } else {
                    item.uid = Date.now() + (this.tempIndex++)
                }
                item.status = item.status || 'success';
                return item;
            })
        })
    }

    componentWillUnmount() {
        this.state.uploadFiles.forEach(file => {
            if (file.url && file.url.indexOf('blob:') === 0) {
                URL.revokeObjectURL(file.url);
            }
        });
    }

    handleStart(rawFiles) {

        const files = []
        rawFiles.forEach(rawFile => {
            rawFile.uid = Date.now() + (this.tempIndex++);
            let file = {
                status: 'ready',
                name: rawFile.name,
                size: rawFile.size,
                percentage: 0,
                uid: rawFile.uid,
                raw: rawFile
            };

            if (this.props.listType === 'picture-card' || this.props.listType === 'picture') {
                try {
                    file.url = URL.createObjectURL(rawFile);
                } catch (err) {
                    console.error('[Element Error][Upload]', err);
                    return;
                }
            }
            files.push(file)
            this.props.onChange(file, this.state.uploadFiles);
        })


        this.setState((prevState, props) => {
            return {
                ...prevState,
                uploadFiles: files
            }
        })
    }
    handleProgress(ev, rawFile) {
        const file = this.getFile(rawFile);
        this.props.onProgress(ev, file, this.state.uploadFiles);
        const file_ = Object.assign({}, file)
        file_.status = 'uploading';
        file_.percentage = ev.percent || 0;
        const fileList = Object.assign([], this.state.uploadFiles)
        fileList.splice(fileList.indexOf(file), 1, file_);
        this.setState({
            ...this.state,
            uploadFiles: fileList
        })
    }
    handleSuccess(res, rawFile) {
        const file = this.getFile(rawFile);

        if (file) {
            const file_ = Object.assign({}, file)
            file_.status = 'success';
            file_.response = res;
            const fileList = Object.assign([], this.state.uploadFiles)
            fileList.splice(fileList.indexOf(file), 1, file_);
            this.setState({
                ...this.state,
                uploadFiles: fileList
            })

            this.props.onSuccess(res, file, this.state.uploadFiles);
            this.props.onChange(file, this.state.uploadFiles);
        }
    }
    handleError(err, rawFile) {
        const file = this.getFile(rawFile);

        file.status = 'fail';

        const fileList = Object.assign([], this.state.uploadFiles)
        fileList.splice(fileList.indexOf(file), 1);
        this.setState({
            ...this.state,
            uploadFiles: fileList
        })

        this.props.onError(err, file, this.state.uploadFiles);
        this.props.onChange(file, this.state.uploadFiles);
    }
    handleRemove(file, raw) {
        if (raw) {
            file = this.getFile(raw);
        }
        let doRemove = () => {
            this.abort(file);
            let fileList = Object.assign([], this.state.uploadFiles);
            fileList.splice(fileList.indexOf(file), 1);
            this.setState({
                ...this.state,
                uploadFiles: fileList
            })
            this.props.onRemove(file, fileList);
        };

        if (!this.props.beforeRemove) {
            doRemove();
        } else if (typeof this.props.beforeRemove === 'function') {
            const before = this.props.beforeRemove(file, this.state.uploadFiles);
            if (before && before.then) {
                before.then(() => {
                    doRemove();
                }, noop);
            } else if (before !== false) {
                doRemove();
            }
        }
    }
    getFile(rawFile) {
        let fileList = this.state.uploadFiles;
        let target;
        fileList.every(item => {
            target = rawFile.uid === item.uid ? item : null;
            return !target;
        });
        return target;
    }
    abort(file) {
        this.uploadInnerRef.current.abort(file);
    }
    clearFiles() {
        this.setState({
            ...this.state,
            uploadFiles: []
        })
    }
    submit() {
        this.state.uploadFiles
            .filter(file => file.status === 'ready')
            .forEach(file => {
                this.uploadInnerRef.current.upload(file.raw);
            });
    }

    render() {

        let uploadList;

        if (this.props.showFileList) {
            uploadList = (
                <UploadList
                    disabled={this.state.uploadDisabled}
                    listType={this.props.listType}
                    files={this.state.uploadFiles}
                    onRemove={() => {
                        this.handleRemove()
                    }}
                    handlePreview={() => {
                        this.props.onPreview()
                    }}>
                </UploadList>
            );
        }

        const uploadData = {
            props: {
                type: this.props.type,
                drag: this.props.drag,
                action: this.props.action,
                multiple: this.props.multiple,
                beforeUpload: this.props.beforeUpload,
                withCredentials: this.props.withCredentials,
                headers: this.props.headers,
                name: this.props.name,
                data: this.props.data,
                accept: this.props.accept,
                fileList: this.state.uploadFiles,
                autoUpload: this.props.autoUpload,
                listType: this.props.listType,
                disabled: this.state.uploadDisabled,
                limit: this.props.limit,
                onExceed: this.props.onExceed,
                onStart: (rawFile) => {
                    this.handleStart(rawFile)
                },
                onProgress: (ev, rawFile) => {
                    this.handleProgress(ev, rawFile)
                },
                onSuccess: (res, rawFile) => {
                    this.handleSuccess(res, rawFile)
                },
                onError: (err, rawFile) => {
                    this.handleError(err, rawFile)
                },
                onPreview: this.props.onPreview,
                onRemove: (file, raw) => {
                    this.handleRemove(file, raw)
                },
                httpRequest: this.props.httpRequest
            },
            ref: this.uploadInnerRef
        };

        const trigger = this.props.trigger || this.props.children;
        const uploadComponent = (
            <Upload {...uploadData.props} ref={uploadData.ref}>{trigger}</Upload>
        )

        return (
            <div className={this.props.className}>
                {
                    this.props.listType === 'picture-card' && (
                        uploadList
                    )
                }
                {
                    this.props.trigger ? [{...uploadComponent, key: 'upload'}, {...this.props.children, key: 'children'}] : uploadComponent
                }
                {this.props.tip}
                {
                    this.props.listType !== 'picture-card' && (
                        uploadList
                    )
                }
            </div>
        )
    }
}

UploadContainer.defaultProps = {
    headers: {},
    name: 'file',
    showFileList: true,
    type: 'select',
    onRemove: noop,
    onChange: noop,
    onPreview: noop,
    onSuccess: noop,
    onProgress: noop,
    onError: noop,
    fileList: [],
    autoUpload: true,
    listType: 'text',
    disabled: false,
    onExceed: noop,
}

UploadContainer.propTypes = {
    action: PropTypes.string.isRequired,
    headers: PropTypes.object,
    data: PropTypes.object,
    multiple: PropTypes.bool,
    name: PropTypes.string,
    drag: PropTypes.bool,
    dragger: PropTypes.bool,
    withCredentials: PropTypes.bool,
    showFileList: PropTypes.bool,
    accept: PropTypes.string,
    type: PropTypes.string,
    beforeUpload: PropTypes.func,
    beforeRemove: PropTypes.func,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    onPreview: PropTypes.func,
    onSuccess: PropTypes.func,
    onProgress: PropTypes.func,
    onError: PropTypes.func,
    fileList: PropTypes.array,
    autoUpload: PropTypes.bool,
    // text,picture,picture-card
    listType: PropTypes.string,
    httpRequest: PropTypes.func,
    disabled: PropTypes.bool,
    limit: PropTypes.number,
    onExceed: PropTypes.func,
    trigger: PropTypes.node,
    tip: PropTypes.node,
    className: PropTypes.string
}

export default UploadContainer
