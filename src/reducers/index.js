import { combineReducers } from "redux"
import appInfo from "./AppInfo";
import userInfo from "./UserInfo";
import files from './Files'
import imagePreview from "./ImagePreview";
import fileExplorer from "./FileExplorer";

const Reducers = combineReducers({
    appInfo,
    userInfo,
    files,
    imagePreview,
    fileExplorer,
})

export default Reducers
