const AppInfo = (state= {
    open: false,
    clientHeight: null,
    clientWidth: null,
    palette: {
        type: 'light'
    }
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
        case 'SET_PALETTE': {
            return {
                ...state,
                palette: action.palette
            }
        }
        case 'SET_PALETTE_THEME_TYPE': {
            return {
                ...state,
                palette: {
                    ...state.palette,
                    type: action.themeType
                }
            }
        }
        default:
            return state
    }
}

export default AppInfo
