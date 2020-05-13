import * as React from "react";
import PropTypes from 'prop-types'
import classNames from "classnames";

class UploadDragger extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            dragover: false
        }
    }

    onDragover() {
        if (!this.props.disabled) {
            this.setState({
                dragover: true
            })
        }
    }
    onDrop(e) {
        e.preventDefault()
        if (this.props.disabled) return;
        const accept = this.props.accept;
        this.setState({
            dragover: false
        })
        if (!accept) {
            this.props.onFile(e.dataTransfer.files)
            return;
        }
        this.props.onFile(
            [].slice.call(e.dataTransfer.files).filter(file => {
                const { type, name } = file;
                const extension = name.indexOf('.') > -1
                    ? `.${ name.split('.').pop() }`
                    : '';
                const baseType = type.replace(/\/.*$/, '');
                return accept.split(',')
                    .map(type => type.trim())
                    .filter(type => type)
                    .some(acceptedType => {
                        if (/\..+$/.test(acceptedType)) {
                            return extension === acceptedType;
                        }
                        if (/\/\*$/.test(acceptedType)) {
                            return baseType === acceptedType.replace(/\/\*$/, '');
                        }
                        if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
                            return type === acceptedType;
                        }
                        return false;
                    });
            })
        )
    }

    render() {
        return (
            <div className={classNames('el-upload-dragger', {
                'is-dragover': this.state.dragover
            })}
                 onDrop={(e) => {
                     this.onDrop(e)
                 }}
                 onDragOver={(e) => {
                     e.preventDefault()
                     this.onDragover()
                 }}
                 onDragLeave={() => {
                     this.setState({
                         dragover: false
                     })
                 }}
            >
                {this.props.children}
            </div>
        )
    }
}

UploadDragger.propTypes = {
    disabled: PropTypes.bool,
    accept: PropTypes.string,
    onFile: PropTypes.func
}

export default UploadDragger
