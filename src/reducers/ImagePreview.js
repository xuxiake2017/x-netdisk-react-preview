const ImagePreview = (state= {
    images: [],
    visible: false
}, action) => {
    switch (action.type) {
        case 'OPEN_IMAGE_PREVIEW_POPOVER': {
            return {
                images: action.images,
                visible: true
            }
        }
        case 'CLOSE_IMAGE_PREVIEW_POPOVER': {
            return {
                ...state,
                visible: false
            }
        }
        default:
            return state
    }
}

export default ImagePreview
