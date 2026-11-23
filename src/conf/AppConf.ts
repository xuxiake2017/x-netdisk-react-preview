const baseUrl = () => {
    if (import.meta.env.DEV) {
        return '/netdisk'
    }

    return import.meta.env.VITE_API_BASE_URL || '/netdisk'
}

const AppConf = { baseUrl }

export default AppConf
