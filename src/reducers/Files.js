const Files = (state= [], action) => {
    switch (action.type) {
        case 'STORE_FILE': {
            return [
                ...state,
                action.file
            ]
        }
        case 'DEL_FILE': {
            const uid = action.uid
            let i = null
            state.forEach((file, index) => {
                if (uid === file.uid) {
                    i = index
                }
            })
            let fileList = Object.assign([], state)
            return fileList.splice(i, 1)
        }
        case 'CLEAR_FILE': {
            return []
        }
        default:
            return state
    }
}

export default Files
