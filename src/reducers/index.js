import { combineReducers } from "redux"
import appInfo from "./AppInfo";
import userInfo from "./UserInfo";
import files from './Files'
import imagePreview from "./ImagePreview";

const Reducers = combineReducers({
    appInfo,
    userInfo,
    files,
    imagePreview
})

export default Reducers
