export const drawerToggleAction = drawerOpen => {
    return {
        type: "DRAWER_TOGGLE",
        drawerOpen
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

export const openWarningNotification = message => {
    return {
        type: "OPEN_WARNING_NOTIFICATION",
        message
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

export const storeFile = (file) => {
    return {
        type: "STORE_FILE",
        file
    };
};

export const delFile = (uid) => {
    return {
        type: "DEL_FILE",
        uid
    };
};

export const clearFile = () => {
    return {
        type: "CLEAR_FILE"
    };
};

export const openImagePreviewPopover = (images) => {
    return {
        type: "OPEN_IMAGE_PREVIEW_POPOVER",
        images
    };
};

export const closeImagePreviewPopover = () => {
    return {
        type: "CLOSE_IMAGE_PREVIEW_POPOVER"
    };
};

export const setViewMode = (viewMode) => {
    return {
        type: "SET_VIEW_MODE",
        viewMode
    };
};

export const setPdfViewer = (pdfViewer) => {
    return {
        type: "SET_PDF_VIEWER",
        pdfViewer
    };
};

export const changePdfCurrentNumPage = (currentNumPage) => {
    return {
        type: "CHANGE_PDF_CURRENT_NUM_PAGE",
        currentNumPage
    };
};

export const changePdfScale= (scale) => {
    return {
        type: "CHANGE_PDF_SCALE",
        scale
    };
};



