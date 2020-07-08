import React from 'react'
import classes from './PlaylistSelection.module.css';
// import Button from '@material-ui/core/Button';


const playlistSelection = (props) => (
    <div>
        {props.playlists ? (props.playlists.map(playlist => {
            return (
                <div key={playlist.id} className={classes.buttonPlaylist}>
                    <span onClick={() => props.handlePickedPlaylistAlbumArt(playlist.id, playlist.name)}>
                        {playlist.name}
                    </span>
                </div>
            )
        })
        ) : null
        }

    </div>


)

export default playlistSelection;