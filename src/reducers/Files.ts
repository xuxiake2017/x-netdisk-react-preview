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
            return state.filter(file => file.uid !== uid)
        }
        case 'CLEAR_FILE': {
            return []
        }
        default:
            return state
    }
}

export default Files
