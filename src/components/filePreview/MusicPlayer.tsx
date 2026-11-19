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
        const ap = new APlayer(options);
        return () => {
            // 销毁播放器
            ap.destroy()
        }
    }, [aplayerRef])
    return (
        <React.Fragment>
            <div id="aplayer" ref={aplayerRef} style={{color: '#000'}}></div>
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
