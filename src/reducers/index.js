import { combineReducers } from "redux"
import appInfo from "./AppInfo";
import userInfo from "./UserInfo";
import files from './files'

const Reducers = combineReducers({
    appInfo,
    userInfo,
    files,
})

export default Reducers
