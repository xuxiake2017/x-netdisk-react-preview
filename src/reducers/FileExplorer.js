const FileExplorer = (state= {
    viewMode: 'GRID_OF_PREVIEW'
}, action) => {
    switch (action.type) {
        case 'SET_VIEW_MODE': {
            return {
                ...state,
                viewMode: action.viewMode
            }
        }
        default:
            return state
    }
}

export default FileExplorer
