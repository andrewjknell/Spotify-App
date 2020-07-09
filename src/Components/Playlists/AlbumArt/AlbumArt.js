import React from 'react'
import classes from './AlbumArt.module.css';
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const albumArt = (props) => (
    <div className={classes.albumArtCover}>
        <FontAwesomeIcon
            onClick={props.playSelectedPlaylist} 
            className={classes.awesomeButt}
            icon={faPlayCircle}
        />

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
