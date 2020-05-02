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



