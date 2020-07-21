import React from "react";
import ConfirmDialog from "../common/ConfirmDialog";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import PropTypes from 'prop-types'
import SvgIcon from "@material-ui/core/SvgIcon";
import { useSpring, animated } from 'react-spring/web.cjs'
import Collapse from "@material-ui/core/Collapse";
import { fade } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import MySvgIcon from "../common/SvgIcon";
import { ListAllDir, MoveFile } from "../../api/file";
import LoadingGIF from '../../assets/loading.gif'
import { useDispatch } from "react-redux";
import { openWarningNotification, openSuccessNotification, openErrNotification } from "../../actions";

function MinusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
        </SvgIcon>
    );
}

function PlusSquare(props) {
    return (
        <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
        </SvgIcon>
    );
}

function CloseSquare(props) {
    return (
        <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
            {/* tslint:disable-next-line: max-line-length */}
            <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
        </SvgIcon>
    );
}

function TransitionComponent(props) {
    const style = useSpring({
        from: { opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { opacity: props.in ? 1 : 0, transform: `translate3d(${props.in ? 0 : 20}px,0,0)` },
    });

    return (
        <animated.div style={style}>
            <Collapse {...props} />
        </animated.div>
    );
}

TransitionComponent.propTypes = {
    /**
     * Show the component; triggers the enter or exit states
     */
    in: PropTypes.bool,
}

const useTreeItemStyles = makeStyles((theme) => ({
    iconContainer: {
        '& .close': {
            opacity: 0.3,
        },
    },
    group: {
        marginLeft: 7,
        paddingLeft: 18,
        borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
        fontSize: '1.5em'
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
    loadingGIF: {
        width: 20,
        height: 20,
        margin: '0 10px'
    }
}))

const StyledTreeItem = (props) => {
    const classes = useTreeItemStyles()
    const { labelText, loading, ...other } = props;
    return (
        <TreeItem
            label={
                <div className={classes.labelRoot}>
                    <MySvgIcon name={'#icon-file_dir'} className={classes.labelIcon} />
                    <Typography variant="body1" className={classes.labelText}>
                        {labelText}
                    </Typography>
                    {
                        loading && <img src={LoadingGIF} className={classes.loadingGIF} />
                    }
                </div>
            }
            classes={{
                iconContainer: classes.iconContainer,
                group: classes.group,
            }}
            TransitionComponent={TransitionComponent}
            {...other}
        />
    )
}

StyledTreeItem.propTypes = {
    labelText: PropTypes.node,
    loading: PropTypes.bool,
}

/*
* 可递归的TreeItem组件
* */
const RecursionTreeItem = (props) => {
    return (
        props.fileTreeList.map(fileTree => (
            <StyledTreeItem
                key={fileTree.nodeId}
                nodeId={`${fileTree.nodeId}`}
                labelText={fileTree.labelText}
                onIconClick={e => {
                    props.onIconClick(e, fileTree)
                }}
                onLabelClick={e => {
                    props.onLabelClick(e, fileTree)
                }}
                loading={fileTree.loading}
            >
                <RecursionTreeItem fileTreeList={fileTree.children} onIconClick={props.onIconClick} onLabelClick={props.onLabelClick} />
            </StyledTreeItem>
        ))
    )
}

RecursionTreeItem.propTypes = {
    fileTreeList: PropTypes.arrayOf(PropTypes.shape({
        nodeId: PropTypes.number,
        labelText: PropTypes.string,
        children: PropTypes.array,
        loaded: PropTypes.bool,
        loading: PropTypes.bool,
    })).isRequired,
    onIconClick: PropTypes.func,
    onLabelClick: PropTypes.func,
}

const useStyles = makeStyles({
    root: {
        height: 264,
        flexGrow: 1,
    },
});

const MoveFileDialog = (props) => {

    const classes = useStyles();
    const dispatch = useDispatch()
    const handleConfirm = () => {
        mvFile()
    }
    const handleClose = () => {
        props.setMoveFileDialogOpen(false)
    }
    const listAllDir = (fileTreeItem) => {
        fileTreeItem.loading = true
        setFileTreeList(prevState => {
            const newState = Object.assign([], prevState)
            return newState
        })
        // setFileTreeList(fileTreeList)
        ListAllDir({ parentId: fileTreeItem.nodeId }).then(res => {
            const data = res.data
            fileTreeItem.children = data.map(item => {
                return {
                    nodeId: item.id,
                    labelText: item.fileName,
                    children: [],
                    loaded: false,
                    loading: false
                }
            })
            fileTreeItem.loaded = true
            fileTreeItem.loading = false
            setFileTreeList(prevState => {
                const newState = Object.assign([], prevState)
                return newState
            })
            // setFileTreeList(fileTreeList)
        })
    }
    const [fileTreeList, setFileTreeList] = React.useState([
        {
            nodeId: -1,
            labelText: '/',
            children: [],
            loaded: false,
            loading: false
        }
    ])
    React.useEffect(() => {
        if (!props.moveFileDialogOpen) {
            setFileTreeList([
                {
                    nodeId: -1,
                    labelText: '/',
                    children: [],
                    loaded: false,
                    loading: false
                }
            ])
        } else {
            listAllDir(fileTreeList[0])
        }
    }, [props.moveFileDialogOpen])
    // 展开图标点击
    const handleIconClick = (e, fileTree) => {
        if (fileTree.nodeId === -1 || fileTree.loaded) {
            return
        }
        if (fileTree.nodeId === props.selectFile.id) {
            dispatch(openWarningNotification('不能移动文件到自身及其子目录!'))
            return
        }
        listAllDir(fileTree)
    }
    const handleLabelClick = (e, fileTree) => {
        e.preventDefault()
    }
    const [nodeSelect, setNodeSelect] = React.useState(0)
    const handleNodeSelect = (e, value) => {
        setNodeSelect(parseInt(value))
    }
    // 移动文件
    const mvFile = () => {
        let parentId = nodeSelect
        if (!parentId) {
            dispatch(openWarningNotification('请选择文件夹!'))
            return
        }
        if (props.selectFile.id === parentId) {
            dispatch(openWarningNotification('不能移动到自身及其子目录!'))
        } else {
            MoveFile({parentId: parentId, key: props.selectFile.key}).then(res => {
                dispatch(openSuccessNotification('文件移动成功!'))
                props.setMoveFileDialogOpen(false)
                props.onReLoad()
            }).catch(res => {
                dispatch(openErrNotification('文件移动失败!'))
            })
        }
    }
    return (
        <React.Fragment>
            <ConfirmDialog
                onConfirm={handleConfirm}
                title={'移动文件'}
                onClose={handleClose}
                open={props.moveFileDialogOpen}
                width={'45%'}
            >
                <TreeView
                    defaultExpanded={['-1']}
                    className={classes.root}
                    defaultCollapseIcon={<MinusSquare />}
                    defaultExpandIcon={<PlusSquare />}
                    defaultEndIcon={<CloseSquare />}
                    onNodeSelect={handleNodeSelect}
                >
                    <RecursionTreeItem fileTreeList={fileTreeList} onIconClick={handleIconClick} onLabelClick={handleLabelClick} />
                </TreeView>
            </ConfirmDialog>
        </React.Fragment>
    )
}

MoveFileDialog.propTypes = {
    moveFileDialogOpen: PropTypes.bool,
    setMoveFileDialogOpen: PropTypes.func,
    selectFile: PropTypes.shape({
        id: PropTypes.number,
        isDir: PropTypes.number,
        fileName: PropTypes.string,
        parentId: PropTypes.number,
        key: PropTypes.string,
    }),
    onReLoad: PropTypes.func
}

export default MoveFileDialog