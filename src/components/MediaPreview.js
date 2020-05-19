import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { GetFileMediaInfo } from "../api/file";
import { useParams } from "react-router";
import Player from 'griffith'
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FILE_TYPE from "../utils/FileUtils";
import MusicPlayer from "./MusicPlayer";

const useStyles = makeStyles((theme) => ({
    root: {
        width: 'auto',
        marginTop: 30,
        marginLeft: 24,
        marginRight: 24,
        marginBottom: 50,
        height: '100%',
        [theme.breakpoints.up('lg')]: {
            width: 1100,
            marginLeft: 'auto',
            marginRight: 'auto'
        },
    },
    player: {
        height: '50%',
        borderRadius: 10
    }
}))

const MediaPreview = (props) => {

    const classes = useStyles()
    const { fileKey } = useParams()
    const [playerProps, setPlayerProps] = React.useState(null)
    const [mediaFile, setMediaFile] = React.useState(null)
    const [audio, setAudio] = React.useState(null)
    useEffect(() => {
        if (fileKey) {
            GetFileMediaInfo({ fileKey }).then(res => {
                const data = res.data
                setMediaFile(data)
                if (data.fileOrigin.fileType === FILE_TYPE.FILE_TYPE_OF_VIDEO) {
                    setPlayerProps({
                        id: fileKey,
                        title: data.fileName,
                        cover: data.fileMedia.thumbnailUrl,
                        duration: data.fileMedia.videoDuration,
                        sources: {
                            sd: {
                                play_url: data.fileOrigin.previewUrl,
                                bitrate: 0,
                                duration: data.fileMedia.videoDuration,
                                size: data.fileOrigin.fileSize,
                                format: "mp4",
                                width: data.fileMedia.videoWidth,
                                height: data.fileMedia.videoHeight
                            }
                        },
                        src: data.fileOrigin.previewUrl
                    })
                }
                if (data.fileOrigin.fileType === FILE_TYPE.FILE_TYPE_OF_MUSIC) {
                    setAudio([{
                        name: data.fileName,
                        artist: data.fileMedia.musicArtist,
                        url: data.fileOrigin.previewUrl,
                        cover: data.fileMedia.musicPoster
                    }])
                }
            })
        }
    }, [])
    return (
        <React.Fragment>
            <NavBar>
                <div className={classes.root}>
                    {
                        mediaFile && (
                            <Typography variant="h6" gutterBottom>
                                {mediaFile.fileName}
                            </Typography>
                        )
                    }
                    {
                        playerProps && (
                            <React.Fragment>
                                <div className={classes.player}>
                                    <Player {...playerProps} />
                                </div>
                            </React.Fragment>
                        )
                    }
                    {
                        audio && (
                            <MusicPlayer audio={audio}></MusicPlayer>
                        )
                    }
                </div>
            </NavBar>
        </React.Fragment>
    )
}

export default MediaPreview
