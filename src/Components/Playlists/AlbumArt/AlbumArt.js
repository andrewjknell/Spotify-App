import React from 'react'
import classes from './AlbumArt.module.css';



const albumArt = (props) => (
    <div className={classes.albumArtCover}>
        {props.covers.map(song => {
            return (
                <img
                    onClick={() => props.clicked(song)}
                    src={song.album.images[0].url}
                    alt='album'
                    key={song.uri}
                />
            )
        })}
    </div>

)

export default albumArt;
