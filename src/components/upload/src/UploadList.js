import * as React from "react";
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types'
import classNames from "classnames";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import './UploadList.css'

class UploadList extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            focusing: false
        }
    }
    parsePercentage(val) {
        return parseInt(val, 10);
    }
    handleClick(file) {
        this.props.handlePreview && this.props.handlePreview(file);
    }
    render() {

        const items = this.props.files.map(file => {
            return (
                <CSSTransition
                    classNames="upload-list"
                    timeout={{ enter: 500, exit: 300 }}
                    key={file.uid}
                >
                    <li
                        className={
                            classNames('el-upload-list__item', 'is-' + file.status, this.state.focusing ? 'focusing' : '')
                        }
                        key={file.uid}
                        tabIndex="0"
                        onClick={() => {
                            this.setState({focusing: false})
                        }}
                        onFocus={() => {
                            this.setState({focusing: true})
                        }}
                        onBlur={() => {
                            this.setState({focusing: false})
                        }}
                    >
                        {
                            file.status !== 'uploading' && ['picture-card', 'picture'].indexOf(this.props.listType) > -1 && (
                                <img className="el-upload-list__item-thumbnail" src={file.url}/>
                            )
                        }
                        <a className="el-upload-list__item-name" onClick={() => { this.handleClick(file) }}>
                            <i className="el-icon-document"/>{file.name}
                        </a>
                        <label className="el-upload-list__item-status-label">
                            <i className={
                                classNames({
                                    'el-icon-upload-success': true,
                                    'el-icon-circle-check': this.props.listType === 'text',
                                    'el-icon-check': ['picture-card', 'picture'].indexOf(this.props.listType) > -1
                                })
                            }/>
                        </label>
                        {
                            !this.props.disabled && (
                                <i className="el-icon-close" onClick={() => {
                                    this.props.onRemove(file)
                                }}/>
                            )
                        }
                        {
                            file.status === 'uploading' && (
                                this.props.listType === 'picture-card' ? (
                                    <CircularProgress variant="determinate" value={this.parsePercentage(file.percentage)} />
                                ) : (
                                    <LinearProgress variant="determinate" value={this.parsePercentage(file.percentage)} />
                                )
                            )
                        }
                        {
                            this.props.listType === 'picture-card' && (
                                <span className="el-upload-list__item-actions">
                                    {
                                        this.props.handlePreview && this.props.listType === 'picture-card' && (
                                            <span className="el-upload-list__item-preview" onClick={() => {
                                                this.props.handlePreview(file)
                                            }}>
                                                <i className="el-icon-zoom-in"/>
                                            </span>
                                        )
                                    }
                                    {
                                        !this.props.disabled && (
                                            <span className="el-upload-list__item-delete" onClick={() => {
                                                this.props.onRemove(file)
                                            }}>
                                                <i className="el-icon-delete"/>
                                            </span>
                                        )
                                    }

                                </span>
                            )
                        }
                    </li>
                </CSSTransition>
            )
        })

        return (
            <ul
                className={classNames('el-upload-list', 'el-upload-list--' + this.props.listType, {
                    'is-disabled': this.props.disabled
                })}
            >
                <TransitionGroup>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }
}

UploadList.defaultProps = {
    files: [],
    disabled: false
}

UploadList.propTypes = {
    files: PropTypes.arrayOf(PropTypes.shape({
        status: PropTypes.string,
        name: PropTypes.string,
        size: PropTypes.number,
        percentage: PropTypes.number,
        uid: PropTypes.number,
        raw: PropTypes.object
    })),
    disabled: PropTypes.bool,
    handlePreview: PropTypes.func,
    listType: PropTypes.string,
    onRemove: PropTypes.func.isRequired
}

export default UploadList
