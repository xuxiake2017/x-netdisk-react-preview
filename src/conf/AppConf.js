const baseUrl = () => {
    if (process.env.NODE_ENV === 'development') {
        return 'http://127.0.0.1:8080/netdisk'
    } else if (process.env.NODE_ENV === 'production') {
        return 'http://127.0.0.1:8080/netdisk'
    }
}

const AppConf = { baseUrl }

export default AppConf
