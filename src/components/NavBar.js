import React, {useCallback} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Menu as MenuIcon,
    Mail as MailIcon,
    AccountCircle,
    MoreVert as MoreIcon,
    Description as DescriptionIcon,
    Share as ShareIcon,
    Image as ImageIcon,
    OndemandVideo as OndemandVideoIcon,
    MusicVideo as MusicVideoIcon,
    ExpandLess,
    ExpandMore,
    FolderShared,
    Delete as DeleteIcon,
    Person as PersonIcon,
    Notifications as NotificationsIcon,
    Brightness4 as DarkThemeTypeIcon,
    Brightness7 as LightThemeTypeIcon
} from '@material-ui/icons';
import {AccountArrowRight, AccountPlus} from "mdi-material-ui";
import {
    useHistory,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { drawerToggleAction, setPaletteThemeType, openSuccessNotification } from '../actions'
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Menu,
    MenuItem,
    Badge,
    Drawer,
    AppBar,
    Toolbar,
    Typography,
    Divider,
    IconButton,
    Tooltip,
    Avatar
} from "@material-ui/core";
import { Logout } from '../api/user'
import { removeToken } from "../utils/auth";
import ConfirmDialog from "./common/ConfirmDialog";
import ShowStorage from "./file/ShowStorage";
import MediaInfoBar from "./filePreview/MediaInfoBar";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 2,
        transition: 'background-color .4s',
        background: theme.palette.type === 'dark' ? 'rgba(0,0,0,1)' : 'linear-gradient(45deg, #7A88FF, #ffd586)'
    },
    appBarTitle: {
        maxWidth: 200
    },
    pdfPreviewAppBar: {
        background: '#000'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    grow: {
        flexGrow: 1
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        position: "relative",
    },
    drawerPaper: {
        width: drawerWidth,
        overflow: "hidden"
    },
    drawerHeader: {
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        overflow: "hidden",
        zIndex: theme.zIndex.drawer + 1,
    },
    contentProps: props => ({
        height: `${props.clientHeight}px`
    }),
    contentShift: {
        marginLeft: 0,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    menuListContainer: {
        height: 'calc(100% - 165px)',
        overflow: 'auto'
    },
    menuList: {
        padding: 0
    },
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
}));

const drawerWidth = 240;
const APP_NAME = 'X-NetDisk';

export default function PersistentDrawerLeft(props) {

    const clientWidth = useSelector(state => {
        return state.appInfo.clientWidth
    })
    const clientHeight = useSelector(state => {
        return state.appInfo.clientHeight
    })
    const [collapseOpen, setCollapseOpen] = React.useState(false);
    const classes = useStyles({ clientWidth, clientHeight });
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const history = useHistory()

    let drawerOpen = useSelector(state => {
        return state.appInfo.drawerOpen
    })
    const dispatch =  useDispatch()

    const toggleDrawerOpen = useCallback(
        (drawerOpen) =>
            dispatch(drawerToggleAction(drawerOpen)),
        [dispatch]
    );
    const toggleCollapseOpen = () => {
        history.push('/home')
        setCollapseOpen(!collapseOpen)
    }

    let themeType = useSelector(({ appInfo }) => {
        return appInfo.palette.type
    })

    const settingThemeType = () => {
        if (themeType === 'dark') {
            dispatch(setPaletteThemeType('light'))
        } else if (themeType === 'light') {
            dispatch(setPaletteThemeType('dark'))
        }
    }

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleLogout = () => {
        setLogoutDialogOpen(true)
        handleMenuClose()
    };

    const userInfo = useSelector(({userInfo}) => {
        return userInfo
    })

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>用户信息</MenuItem>
            <MenuItem onClick={handleLogout}>退出账户</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton aria-label="show 11 new notifications" color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false)
    const handleLogoutDialogClose = () => {
        setLogoutDialogOpen(false)
    }
    const handleLogoutConfirm = () => {
        setLogoutDialogOpen(false)
        Logout().then(res => {
            dispatch(openSuccessNotification('退出登陆成功!'))
            removeToken()
            window.location.reload()
        })
    }

    const pdfViewer = useSelector((state) => {
        return state.appInfo.pdfViewer
    })
    const isPdfPreview = React.useMemo(() => (
        pdfViewer.isPreview
    ))

    return (
        <div className={classes.root}>
            <ConfirmDialog open={logoutDialogOpen} title={'提示'} onClose={handleLogoutDialogClose} onConfirm={handleLogoutConfirm} >你确认退出登陆吗?</ConfirmDialog>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.pdfPreviewAppBar]: isPdfPreview
                })}
                color={themeType === 'dark' ? 'default' : 'primary'}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => {
                            toggleDrawerOpen(!drawerOpen)
                        }}
                        edge="start"
                        className={clsx(classes.menuButton)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.appBarTitle}>
                        {isPdfPreview ? pdfViewer.fileName : APP_NAME}
                    </Typography>
                    {
                        !isPdfPreview && (
                            <React.Fragment>
                                <div className={classes.grow} />
                                <div className={classes.sectionDesktop}>
                                    {themeType === 'dark' ? (
                                        <Tooltip title="切换日间模式">
                                            <IconButton color="inherit" onClick={settingThemeType}>
                                                <LightThemeTypeIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="切换夜间模式">
                                            <IconButton color="inherit" onClick={settingThemeType}>
                                                <DarkThemeTypeIcon/>
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <IconButton aria-label="show 4 new mails" color="inherit">
                                        <Badge badgeContent={4} color="secondary">
                                            <MailIcon />
                                        </Badge>
                                    </IconButton>
                                    <IconButton aria-label="show 17 new notifications" color="inherit">
                                        <Badge badgeContent={17} color="secondary">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="account of current user"
                                        aria-controls={menuId}
                                        aria-haspopup="true"
                                        onClick={handleProfileMenuOpen}
                                        color="inherit"
                                    >
                                        {userInfo ? <Avatar className={classes.avatar} src={userInfo.avatar}/> : <AccountCircle /> }
                                    </IconButton>
                                </div>
                                <div className={classes.sectionMobile}>
                                    <IconButton
                                        aria-label="show more"
                                        aria-controls={mobileMenuId}
                                        aria-haspopup="true"
                                        onClick={handleMobileMenuOpen}
                                        color="inherit"
                                    >
                                        <MoreIcon />
                                    </IconButton>
                                </div>
                            </React.Fragment>
                        )
                    }
                    {
                        isPdfPreview && (
                            <React.Fragment>
                                <MediaInfoBar/>
                            </React.Fragment>
                        )
                    }
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={drawerOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                </div>
                <Divider />
                <div className={classes.menuListContainer}>
                    {!userInfo && (
                        <List>
                            <ListItem
                                button
                                key="登录"
                                onClick={() => history.push("/login")}
                            >
                                <ListItemIcon>
                                    <AccountArrowRight/>
                                </ListItemIcon>
                                <ListItemText primary="登录" />
                            </ListItem>
                            <ListItem
                                button
                                key="注册"
                                onClick={() => history.push("/register")}
                            >
                                <ListItemIcon>
                                    <AccountPlus className={classes.iconFix} />
                                </ListItemIcon>
                                <ListItemText primary="注册" />
                            </ListItem>
                        </List>
                    )
                    }
                    {userInfo && (
                        <List className={classes.menuList}>
                            <ListItem
                                button
                                onClick={toggleCollapseOpen}
                            >
                                <ListItemIcon>
                                    <FolderShared/>
                                </ListItemIcon>
                                <ListItemText primary="文件" />
                                {collapseOpen ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={collapseOpen} timeout="auto">
                                <List component="div" disablePadding className={classes.nested}>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <ImageIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="图片" />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <OndemandVideoIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="视频" />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <MusicVideoIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="音乐" />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <DescriptionIcon/>
                                        </ListItemIcon>
                                        <ListItemText primary="文档" />
                                    </ListItem>
                                </List>
                            </Collapse>
                            <ListItem
                                button
                                onClick={() => history.push("/share")}
                            >
                                <ListItemIcon>
                                    <ShareIcon/>
                                </ListItemIcon>
                                <ListItemText primary="分享" />
                            </ListItem>
                            <ListItem
                                button
                                onClick={() => history.push("/recycle")}
                            >
                                <ListItemIcon>
                                    <DeleteIcon/>
                                </ListItemIcon>
                                <ListItemText primary="回收站" />
                            </ListItem>
                            <ListItem
                                button
                                onClick={() => history.push("/userInfo")}
                            >
                                <ListItemIcon>
                                    <PersonIcon/>
                                </ListItemIcon>
                                <ListItemText primary="个人信息" />
                            </ListItem>
                        </List>
                    )
                    }
                </div>
                {
                    userInfo && (
                        <ShowStorage/>
                    )
                }

            </Drawer>
            <main
                className={clsx(classes.content, classes.contentProps, {
                    [classes.contentShift]: drawerOpen,
                })}
            >
                <div className={classes.drawerHeader} />
                {props.children}
            </main>
        </div>
    );
}
