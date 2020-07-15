import {
    Route,
    Redirect
} from 'react-router-dom';
import React from "react";
import { getToken } from '../../utils/auth'
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GetInfo } from "../../api/user";
import { setUserInfo } from "../../actions";

const whiteList = ['/login', '/register', '/404', '/home/s', '/home/verify'] // 不重定向白名单

const AuthRoute = (props) => {

    const next = () => {
        return (
            <Route {...props} />
        )
    }
    const redirectRoute = (pathname) => {
        return (
            <Redirect to={pathname} />
        )
    }
    const token = getToken()
    const history = useHistory()
    const pathname = history.location.pathname
    const dispatch = useDispatch()

    const user = useSelector(state => {
        return state.userInfo
    })
    if (token) {
        if (pathname === '/login' || pathname === '/') {
            return redirectRoute('/home')
        } else {
            if (user) {
                return next()
            } else {
                GetInfo().then(res => {
                    dispatch(setUserInfo(res.data))
                })
                return next()
            }
        }
    } else {
        let flag = false
        whiteList.forEach((item, index) => {
            if (pathname.indexOf(item) !== -1) {
                flag = true
            }
        })
        if (flag) {
            return next()
        } else {
            return redirectRoute('/login')
        }
    }
}

export default AuthRoute
