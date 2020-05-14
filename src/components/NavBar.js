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
    useLocation
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
import ConfirmDialog from "./ConfirmDialog";
import ShowStorage from "./ShowStorage";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width: '100%'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: 'background-color .4s'
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
        overflow: "hidden"
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
    menuList: {
        padding: 0
    },
    avatar: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
}));

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
    const location = useLocation()

    let open = useSelector(state => {
        return state.appInfo.open
    })
    const dispatch =  useDispatch()

    const toggleDrawerOpen = useCallback(
        (open) =>
            dispatch(drawerToggleAction(open)),
        [dispatch]
    );
    const toggleCollapseOpen = () => {
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

    return (
        <div className={classes.root}>
            <ConfirmDialog open={logoutDialogOpen} title={'提示'} contentText={'你确认退出登陆吗?'} onClose={handleLogoutDialogClose} onConfirm={handleLogoutConfirm}/>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar)}
                color={themeType === 'dark' ? 'default' : 'primary'}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => {
                            toggleDrawerOpen(!open)
                        }}
                        edge="start"
                        className={clsx(classes.menuButton)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {'X-NetDisk'}
                    </Typography>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        {themeType === 'dark' ? (
                            <Tooltip title="切换日间模式">
                                <IconButton color="inherit" onClick={settingThemeType}>
                                    <DarkThemeTypeIcon/>
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title="切换夜间模式">
                                <IconButton color="inherit" onClick={settingThemeType}>
                                    <LightThemeTypeIcon/>
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
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                </div>
                <Divider />
                {location.pathname !== '/home' && (
                    <div>
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
                    </div>
                )
                }
                {location.pathname === '/home' && (
                    <div>
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
                    </div>
                )
                }
                <ShowStorage/>

            </Drawer>
            <main
                className={clsx(classes.content, classes.contentProps, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                {props.children}
            </main>
        </div>
    );
}
