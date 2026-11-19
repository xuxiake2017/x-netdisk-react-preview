const AppInfo = (state= {
    drawerOpen: true,
    clientHeight: null,
    clientWidth: null,
    palette: {
        type: 'light'
    },
    notification: {
        open: false,
        autoHideDuration: 3000,
        severity: 'info',
        message: '通知'
    },
    pdfViewer: {
        isPreview: false,
        scale: 1,
        fileName: '',
        numPages: 0,
        currentNumPage: 1,
        scrollTop: 0
    }
}, action) => {
    switch (action.type) {
        case 'DRAWER_TOGGLE': {
            return {
                ...state,
                drawerOpen: action.drawerOpen
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
        case 'OPEN_NOTIFICATION': {
            return {
                ...state,
                notification: {
                    ...action.notification,
                    open: true
                }
            }
        }
        case 'OPEN_WARNING_NOTIFICATION': {
            return {
                ...state,
                notification: {
                    ...state.notification,
                    open: true,
                    severity: 'warning',
                    message: action.message
                }
            }
        }
        case 'OPEN_SUCCESS_NOTIFICATION': {
            return {
                ...state,
                notification: {
                    ...state.notification,
                    open: true,
                    severity: 'success',
                    message: action.message
                }
            }
        }
        case 'OPEN_ERR_NOTIFICATION': {
            return {
                ...state,
                notification: {
                    ...state.notification,
                    open: true,
                    severity: 'error',
                    message: action.message
                }
            }
        }
        case 'CLOSE_NOTIFICATION': {
            return {
                ...state,
                notification: {
                    ...state.notification,
                    open: false
                }
            }
        }
        case 'SET_PDF_VIEWER': {
            return {
                ...state,
                pdfViewer: action.pdfViewer
            }
        }
        case 'CHANGE_PDF_CURRENT_NUM_PAGE': {
            return {
                ...state,
                pdfViewer: {
                    ...state.pdfViewer,
                    currentNumPage: action.currentNumPage
                }
            }
        }
        case 'CHANGE_PDF_SCALE': {
            return {
                ...state,
                pdfViewer: {
                    ...state.pdfViewer,
                    scale: action.scale
                }
            }
        }
        default:
            return state
    }
}

export default AppInfo
