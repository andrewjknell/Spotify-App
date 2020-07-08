import React from 'react'
import classes from './PlaylistSelection.module.css';
// import Button from '@material-ui/core/Button';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';


const playlistSelection = (props) => (
    <div>
        {props.playlists ? (props.playlists.map(playlist => {
            return (
                <div key={playlist.id} className={classes.container}>
                    <div className={classes.playButton}>
                        <PlayCircleFilledIcon onClick={() => props.handleSelectedPlaylist(playlist.id, playlist.name)} />
                    </div>
                    <div className={classes.buttonPlaylist}>
                        <span onClick={() => props.handleNewPlaylist(playlist.id, playlist.name)}>
                            {playlist.name}
                        </span>
                    </div>

                </div>
            )
        })
        ) : null
        }

    </div>


)

export default playlistSelection;