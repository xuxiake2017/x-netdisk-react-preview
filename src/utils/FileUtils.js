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

export function fileIcoFilter(fileType) {
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

export function formatFileSize(fileSize) {
    if (fileSize) {
        if (fileSize > 1024 * 1024) {
            fileSize = fileSize / (1024 * 1024);
            return fileSize.toFixed(2) + 'M';
        } else {
            fileSize = fileSize / 1024;
            return fileSize.toFixed(2) + 'KB';
        }
    } else {
        return '--';
    }
}


const SIGN_REGEXP = /([yMdhsm])(\1*)/g;
const DEFAULT_PATTERN = 'yyyy-MM-dd';

function padding (s, len) {
    len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
}

export function formatDate(date, pattern) {
    pattern = pattern || DEFAULT_PATTERN;
    return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
            case 'y': return padding(date.getFullYear(), $0.length);
            case 'M': return padding(date.getMonth() + 1, $0.length);
            case 'd': return padding(date.getDate(), $0.length);
            case 'w': return date.getDay() + 1;
            case 'h': return padding(date.getHours(), $0.length);
            case 'm': return padding(date.getMinutes(), $0.length);
            case 's': return padding(date.getSeconds(), $0.length);
        }
    });
}
export function parseDate(dateString, pattern) {
    const matchs1 = pattern.match(SIGN_REGEXP);
    const matchs2 = dateString.match(/(\d)+/g);
    if (matchs1.length === matchs2.length) {
        const _date = new Date(1970, 0, 1);
        for (let i = 0; i < matchs1.length; i++) {
            const _int = parseInt(matchs2[i]);
            const sign = matchs1[i];
            switch (sign.charAt(0)) {
                case 'y': _date.setFullYear(_int); break;
                case 'M': _date.setMonth(_int - 1); break;
                case 'd': _date.setDate(_int); break;
                case 'h': _date.setHours(_int); break;
                case 'm': _date.setMinutes(_int); break;
                case 's': _date.setSeconds(_int); break;
            }
        }
        return _date;
    }
    return null;
}

export default FILE_TYPE
