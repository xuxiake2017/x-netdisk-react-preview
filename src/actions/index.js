export const drawerToggleAction = open => {
    return {
        type: "DRAWER_TOGGLE",
        open
    };
};

export const setClientHeight = clientHeight => {
    return {
        type: "SET_CLIENT_HEIGHT",
        clientHeight
    };
};

export const setClientWidth = clientWidth => {
    return {
        type: "SET_CLIENT_WIDTH",
        clientWidth
    };
};

export const setPalette = palette => {
    return {
        type: "SET_PALETTE",
        palette
    };
};

export const setPaletteThemeType = themeType => {
    return {
        type: "SET_PALETTE_THEME_TYPE",
        themeType
    };
};

export const openNotification = notification => {
    return {
        type: "OPEN_NOTIFICATION",
        notification
    };
};

export const openSuccessNotification = message => {
    return {
        type: "OPEN_SUCCESS_NOTIFICATION",
        message
    };
};

export const openErrNotification = message => {
    return {
        type: "OPEN_ERR_NOTIFICATION",
        message
    };
};

export const closeNotification = () => {
    return {
        type: "CLOSE_NOTIFICATION"
    };
};

export const setUserInfo = (userInfo) => {
    return {
        type: "SET_USER_INFO",
        userInfo
    };
};



