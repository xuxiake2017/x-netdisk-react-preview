import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';
import React from "react";
import PropTypes from 'prop-types'

const MusicPlayer = (props) => {

    const aplayerRef = React.useRef(null)
    React.useEffect(() => {
        const options = {
            container: aplayerRef.current,
            audio: props.audio
        }
        new APlayer(options);
    }, [aplayerRef])
    return (
        <React.Fragment>
            <div id="aplayer" ref={el => (aplayerRef.current = el)}></div>
        </React.Fragment>
    )
}

MusicPlayer.propTypes = {
    audio: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            artist: PropTypes.string,
            url: PropTypes.string,
            cover: PropTypes.string
        })
    )
}

export default MusicPlayer
