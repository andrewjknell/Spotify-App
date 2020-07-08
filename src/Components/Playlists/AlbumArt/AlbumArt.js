import React from 'react'
import classes from './AlbumArt.module.css';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';



const albumArt = (props) => (
    <div className={classes.albumArtCover}>
        <div className={classes.playButton}>
            <PlayCircleFilledIcon
                onClick={props.playSelectedPlaylist} style={{ marginRight: 4, fontSize: "60px" }}
            />
        </div>

        {props.covers.map(song => {
            return (

                <div
                    className={classes.container}
                    onClick={() => props.clicked(song)}
                    key={song.uri}
                >
                    <img
                        // className={classes.images}
                        src={song.album.images[0].url}
                        alt='album'
                    />
                    <div className={classes.middle}>
                        <div className={classes.text}>
                            <p>{song.name}</p>
                            <p><b>-</b> {song.artists[0].name}</p>
                        </div>
                    </div>
                </div>
            )
        })}
    </div>

)

export default albumArt;
