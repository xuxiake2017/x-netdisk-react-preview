const FILE_TYPE = {
    'FILE_IS_DIR': 0,
    'FILE_IS_NOT_DIR': 1,
    'FILE_TYPE_OF_DIR': 0,
    'FILE_TYPE_OF_TXT': 1,
    'FILE_TYPE_OF_WORD': 11,
    'FILE_TYPE_OF_EXCEL': 12,
    'FILE_TYPE_OF_POWERPOINT': 13,
    'FILE_TYPE_OF_PDF': 14,
    'FILE_TYPE_OF_PIC': 2,
    'FILE_TYPE_OF_MUSIC': 3,
    'FILE_TYPE_OF_VIDEO': 4,
    'FILE_TYPE_OF_ZIP': 5,
    'FILE_TYPE_OF_APK': 6,
    'FILE_TYPE_OF_OTHER': 9,
    'USER_STATUS_NORMAL': 0,
    'USER_STATUS_VIP': 2,
    'USER_STATUS_NOT_VERIFY': 9
}

const fileIcoFilter = (fileType) => {
    switch (fileType) {
        case FILE_TYPE.FILE_TYPE_OF_TXT :
            return '#icon-file_txt'
        case FILE_TYPE.FILE_TYPE_OF_WORD :
            return '#icon-file_word_office'
        case FILE_TYPE.FILE_TYPE_OF_EXCEL :
            return '#icon-file_excel_office'
        case FILE_TYPE.FILE_TYPE_OF_POWERPOINT :
            return '#icon-file_ppt_office'
        case FILE_TYPE.FILE_TYPE_OF_PDF :
            return '#icon-file_pdf'
        case FILE_TYPE.FILE_TYPE_OF_PIC :
            return '#icon-file_pic'
        case FILE_TYPE.FILE_TYPE_OF_MUSIC :
            return '#icon-file_music'
        case FILE_TYPE.FILE_TYPE_OF_VIDEO :
            return '#icon-file_video'
        case FILE_TYPE.FILE_TYPE_OF_ZIP :
            return '#icon-file_zip'
        case FILE_TYPE.FILE_TYPE_OF_APK :
            return '#icon-file_unknown'
        case FILE_TYPE.FILE_TYPE_OF_OTHER :
            return '#icon-file_unknown'
        case FILE_TYPE.FILE_IS_DIR :
            return '#icon-file_dir'
    }
}

export default fileIcoFilter
