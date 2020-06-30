import React from 'react'
import classes from './AlbumArt.module.css';



const albumArt = (props) => (
    <div className={classes.albumArtCover}>
        {props.covers.map(song => {
            return (
                <div
                    className={classes.container}
                    onClick={() => props.clicked(song)}
                >
                    <img
                        // className={classes.images}
                        src={song.album.images[0].url}
                        alt='album'
                        key={song.uri}
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
