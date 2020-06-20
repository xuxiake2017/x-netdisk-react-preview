const baseUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'http://www.xikcloud.com:8181/netdisk'
    } else if (process.env.NODE_ENV === 'production') {
        return 'http://www.xikcloud.com:8181/netdisk'
    }
}

const AppConf = { baseUrl }

export default AppConf
