const UserInfo = (state= null, action) => {
    switch (action.type) {
        case 'SET_USER_INFO': {
            return action.userInfo
        }
        default:
            return state
    }
}

export default UserInfo
