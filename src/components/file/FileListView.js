import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {useSelector} from "react-redux";
import PropTypes from "prop-types";
import { formatDate, formatFileSize, fileIcoFilter } from "../../utils/FileUtils";
import MySvgIcon from "../common/SvgIcon";
import Pagination from "@material-ui/lab/Pagination";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListFinishedText from "./ListFinishedText";

const useStyles = makeStyles(theme => (
    {
        root: {
            width: '100%',
        },
        container: {
            maxHeight: 440,
        },
        tableRow: {
            cursor: "pointer"
        },
        pagination: {
            display: "flex",
            alignItems: "center",
        },
        paginationNav: {
            height: 52,
            display: "flex",
            alignItems: "center",
            width: "auto",
            marginRight: 20
        },
        formControl: {
            minWidth: 50,
        },
    }
));

const columns = [
    {
        id: 'fileType',
        label: '',
        width: 5,
        format: (value) => {
            return (
                <MySvgIcon name={fileIcoFilter(value)} width={'2em'} height={'2em'}/>
            )
        }
    },
    { id: 'fileName', label: '文件名', minWidth: 170 },
    {
        id: 'fileSize',
        label: '文件大小',
        minWidth: 100,
        format: (value) => formatFileSize(value)
    },
    {
        id: 'updateTime',
        label: '修改时间',
        minWidth: 170,
        align: 'right',
        format: (value) => formatDate(new Date(value), 'yyyy-MM-dd hh:mm:ss')
    },
];

const rowsPerPages = [
    20, 30, 40
]

const FileListView = (props) => {
    const classes = useStyles();

    const clientHeight = useSelector(state => {
        return state.appInfo.clientHeight
    })

    const handleDoubleClick = (row) => {
        props.onFileDoubleClick(row)
    }

    const handleClick = (row) => {
        props.onFileClick(row)
    }

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container} style={{maxHeight: `${clientHeight - 185}px`}}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, width: column.width }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.fileList.map(row => (
                                <TableRow hover className={classes.tableRow} role="checkbox" tabIndex={-1} key={row.key} onClick={() => {
                                    handleClick(row)
                                }} onDoubleClick={() => {
                                    handleDoubleClick(row)
                                }} onContextMenu={(e) => {
                                    props.onContextMenu(e, row)
                                }}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {
                props.fileList.length === 0 && (
                    <ListFinishedText/>
                )
            }
            <div className={classes.pagination}>
                <Pagination className={classes.paginationNav} count={props.count} page={props.page} onChange={(e, page) => {
                    props.onChangePage(e, page)
                }} />
                <FormControl className={classes.formControl}>
                    <Select
                        value={props.rowsPerPage}
                        onChange={props.onChangeRowsPerPage}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        style={{textAlign: 'center'}}
                    >
                        <MenuItem value="" disabled>
                            分页大小
                        </MenuItem>
                        {
                            rowsPerPages.map(item => (
                                <MenuItem key={item} value={item}>{item}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </div>
        </Paper>
    );
}

FileListView.defaultProps = {
    onFileClick: () => {},
    onFileDoubleClick: () => {},
}

FileListView.propTypes = {
    fileList: PropTypes.arrayOf(
        PropTypes.shape({
            isDir: PropTypes.number,
            fileName: PropTypes.string,
            filePath: PropTypes.string,
            userId: PropTypes.number,
            parentId: PropTypes.number,
            key: PropTypes.string,
            createTime: PropTypes.number,
            updateTime: PropTypes.number,
            fileExtName: PropTypes.string,
            fileSize: PropTypes.number,
            fileType: PropTypes.number,
            thumbnailUrl: PropTypes.string,
            musicPoster: PropTypes.string
        })
    ).isRequired,
    onFileClick: PropTypes.func,
    onFileDoubleClick: PropTypes.func,
    count: PropTypes.number,
    rowsPerPage: PropTypes.number,
    page: PropTypes.number,
    onChangePage: PropTypes.func,
    onChangeRowsPerPage: PropTypes.func,
    onContextMenu: PropTypes.func,
}

export default FileListView
