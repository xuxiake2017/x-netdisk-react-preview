const AppInfo = (state= {
    open: false,
    clientHeight: null,
    clientWidth: null
}, action) => {
    switch (action.type) {
        case 'DRAWER_TOGGLE': {
            return {
                ...state,
                open: action.open
            }
        }
        case 'SET_CLIENT_HEIGHT': {
            return {
                ...state,
                clientHeight: action.clientHeight
            }
        }
        case 'SET_CLIENT_WIDTH': {
            return {
                ...state,
                clientWidth: action.clientWidth
            }
        }
        default:
            return state
    }
}

export default AppInfo
