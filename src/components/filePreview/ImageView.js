import * as React from "react";
import { PhotoSlider } from "react-photo-view";
import { useSelector, useDispatch } from "react-redux";
import { closeImagePreviewPopover } from "../../actions";
import 'react-photo-view/dist/index.css';

const ImageView = (props) => {

    const dispatch = useDispatch()
    const imagePreview = useSelector(({ imagePreview }) => {
        return imagePreview
    })
    const [photoIndex, setPhotoIndex] = React.useState(0);

    const handleClose = () => {
        dispatch(closeImagePreviewPopover())
    }
    return (
        <div>
            <PhotoSlider
                images={imagePreview.images}
                visible={imagePreview.visible}
                onClose={handleClose}
                index={photoIndex}
                onIndexChange={setPhotoIndex}
            />
        </div>
    );
}

export default ImageView
