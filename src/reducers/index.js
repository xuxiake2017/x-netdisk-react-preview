import { combineReducers } from "redux"
import appInfo from "./AppInfo";
import userInfo from "./UserInfo";

const Reducers = combineReducers({
    appInfo,
    userInfo
})

export default Reducers
