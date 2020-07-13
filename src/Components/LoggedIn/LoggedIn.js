import React, { Component } from 'react';
import fetchPlayer from '../../fetchPlayer';
import spfetch from '../../spfetch';
import PlaylistSelection from '../Playlists/PlaylistSelection/PlaylistSelection';
import classes from './LoggedIn.module.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRandom } from "@fortawesome/free-solid-svg-icons";
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import AlbumArt from '../Playlists/AlbumArt/AlbumArt';
// import { Input } from '@material-ui/core';

class LoggedIn extends Component {
    state = {
        id: null,
        player: null,
        playerState: {},
        albumImg: null,
        playlistTracks: null,
        playlist: null,
        playlistName: null,
        pickedPlaylist: null,
        isPlayListOpen: false,
        albumArt: null,
        // search: '',
        // searchPlaylist: null,
        playlistViewed: {
            id: null,
            name: null,
        },
        shuffle: false,
    };

    async componentDidMount() {
        await this.getMe();
        this.initPlayer();
    }

    async initPlayer() {
        const player = (global.player = await fetchPlayer());
        this.setState({ player });
        player.addListener('player_state_changed', playerState =>
            this.setState({
                playerState
            }),
        );
        this.state.player.setVolume(.5).then(() => { });

    }

    async getMe() {
        const {
            id
        } = await spfetch('/v1/me');
        this.setState({ id });
        return true;
    }

    setVolume = (event) => {
        const vol = event.target.value;
        this.state.player.setVolume(vol / 100).then(() => { });
    }

    toggleShuffle = async () => {
        if (this.state.playerState.track_window) {
            await spfetch("https://api.spotify.com/v1/me/player/shuffle?state=" + !this.state.shuffle, { method: "PUT" });
            this.setState({ shuffle: !this.state.shuffle })
        }
    }

    handlepickedPlaylist = async (playlist) => {
        // if (this.state.isPlayListOpen ) {
        //     this.setState({ isPlayListOpen: false });
        //     return;
        // }

        if (playlist === 'blm') {
            if (this.state.isPlayListOpen && !this.state.pickedPlaylist) {
                this.setState({ isPlayListOpen: false })
                return
            }
            const { playlists } = await spfetch("/v1/search?q=%22black%20lives%22matter&type=playlist&market=US&limit=20");
            const newItems = playlists.items.map(res => {
                return res
            });
            this.setState({ pickedPlaylist: newItems })
            this.setState({ isPlayListOpen: true })

        } else if (playlist === 'me') {
            if (this.state.isPlayListOpen && !this.state.pickedPlaylist) {
                this.setState({ isPlayListOpen: false })
                return
            }
            const { items } = await spfetch("/v1/me/playlists");
            const newItems = items.map(res => {
                return res
            });
            this.setState({ pickedPlaylist: newItems })
            this.setState({ isPlayListOpen: true })

        } else if (playlist === 'workout') {
            if (this.state.isPlayListOpen && !this.state.pickedPlaylist) {
                this.setState({ isPlayListOpen: false })
                return
            }
            const { playlists } = await spfetch("/v1/search?q=%22workout&type=playlist&market=US&limit=20");
            const newItems = playlists.items.map(res => {
                return res
            });
            this.setState({ pickedPlaylist: newItems })
            this.setState({ isPlayListOpen: true })

        }
    };

    handlePlayTopTracks = async () => {
        const { items } = await spfetch('/v1/me/top/tracks');
        // console.log(items, 'top playlist')
        this.setState({ playlist: items })
        this.state.player.play(items.map(({ uri }) => uri));
    };

    handlePickedPlaylistAlbumArt = async (id, name) => {
        const playlist = await spfetch('/v1/playlists/' + id);
        this.setState({
            playlistViewed: {
                id: id,
                name: name,
            }
        })
        const newItems = playlist.tracks.items.map(song => {
            return song.track
        })
        this.setState({ playlistTracks: newItems })
    }

    playSelectedPlaylist = async () => {
        this.setState({ playlistName: this.state.playlistViewed.name });
        const { items } = await spfetch('/v1/playlists/' + this.state.playlistViewed.id + '/tracks');
        const newItems = items.map(song => {
            return song.track
        })
        this.setState({ playlist: newItems })
        this.state.player.play(newItems.map(({ uri }) => uri));
        this.state.player.getCurrentState()
            .then(res => { })
    }

    inputChangeHandler = (event) => {
        // console.log(event.target.value)
        this.setState({ search: event.target.value })
    }

    // handleSearchPlaylist = async () => {
    //     // const newArr = this.state.search.split(" ")
    //     // console.log(newArr)
    //     const { playlists } = await spfetch("/v1/search?q=%20beach&type=playlist&limit=15");
    //     const newItems = playlists.items.map(res => {
    //         return res
    //     });
    //     this.setState({ searchPlaylist: newItems })
    //     console.log(this.state.searchPlaylist, 'search')
    // }

    handleSongSelect = (song) => {
        const newSong = []
        newSong.push(song)
        this.state.player.play(newSong.map(({ uri }) => uri));
        this.setState({ imageUrl: song.album.images[0].url });
    }

    handlePlayPreviousTrack = () => this.state.player.previousTrack();
    handlePlayNextTrack = () => this.state.player.nextTrack();;
    handleResume = () => this.state.player.resume();
    handlePause = () => this.state.player.pause();

    // handleClick = async () => {
    //     await spfetch.logout()
    // };


    render() {
        const {
            player,
            playerState: {
                paused = true,
                context,
                track_window: {
                    current_track: { name: currentTrackName,
                    } = {}
                } = {},
                restrictions: {
                    disallow_pausing_reasons: [pauseRestrictedReason] = [],
                    disallow_skipping_prev_reasons: [skipPreviousRestrictedReason] = [],
                    disallow_skipping_next_reasons: [skipNextRestrictedReason] = []
                } = {}
            }
        } = this.state;
        let albumCover = this.state.playerState.track_window
        if (typeof albumCover !== "undefined") {
            albumCover = this.state.playerState.track_window.current_track.album.images[0].url;
        }


        const hasPlayer = !!player;
        const hasContext = context;

        let playListPickFrom;
        if (this.state.isPlayListOpen) {
            playListPickFrom = (
                <PlaylistSelection
                    playlists={this.state.pickedPlaylist}
                    handlePickedPlaylistAlbumArt={(id, name) => this.handlePickedPlaylistAlbumArt(id, name)}
                />
            )
        }

        // let pickPlaylist;
        let albumArtCover;
        if (this.state.playlistTracks) {
            albumArtCover = (
                <AlbumArt
                    covers={this.state.playlistTracks}
                    clicked={(song) => this.handleSongSelect(song)}
                    playSelectedPlaylist={this.playSelectedPlaylist}
                    picked={this.state.pickedPlaylist}
                />
            )
        }

        return (
            <div className={classes.App}>
                <CssBaseline />

                <AppBar position="static" style={{ marginBottom: 20, backgroundColor: 'black' }}>
                    <Toolbar>
                        {/* <div>{currentAlbum ? currentAlbum.images[0] : null}</div> */}
                        <Typography variant="h6" color="inherit">
                            {currentTrackName || null}
                        </Typography>
                        <div className={classes.grow} />
                        {!this.state.shuffle ? (
                            <FontAwesomeIcon
                                onClick={this.toggleShuffle}
                                className={classes.awesomeButt}
                                icon={faRandom}
                                title='shuffle'
                            />
                        ) : <FontAwesomeIcon
                                onClick={this.toggleShuffle}
                                className={classes.awesomeButt2}
                                icon={faRandom}
                                title='shuffle'

                            />}

                        <input
                            type="range"
                            min="1"
                            max="100"
                            onChange={(event) => this.setVolume(event)}
                        />

                        <IconButton
                            color="inherit"
                            disabled={
                                !hasPlayer || !hasContext || !!skipPreviousRestrictedReason
                            }
                            onClick={this.handlePlayPreviousTrack}
                        >
                            <SkipPreviousIcon />
                        </IconButton>

                        {paused ? (
                            <IconButton
                                color="inherit"
                                disabled={!hasPlayer || !hasContext}
                                onClick={this.handleResume}
                            >
                                <PlayArrowIcon />
                            </IconButton>
                        ) : (
                                <IconButton
                                    color="inherit"
                                    disabled={!hasPlayer || !hasContext || !!pauseRestrictedReason}
                                    onClick={this.handlePause}
                                >
                                    <PauseIcon />
                                </IconButton>
                            )}

                        <IconButton
                            color="inherit"
                            disabled={!hasPlayer || !hasContext || !!skipNextRestrictedReason}
                            onClick={this.handlePlayNextTrack}
                        >
                            <SkipNextIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <div className={classes.body}>
                    <div className={classes.sideCard}>
                        <div className={classes.Card}>
                            <Card>
                                <CardActionArea>
                                    <div className={classes.CardMedia}>
                                        <img alt='album cover' src={albumCover ? albumCover : "https://www.vidyard.com/media/background-music-for-video-1920x1080.jpg"} />
                                    </div>
                                </CardActionArea>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => this.handlepickedPlaylist('blm')}
                                    >
                                        BLM</Button>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => this.handlepickedPlaylist('me')}
                                    >
                                        My Playlists</Button>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => this.handlepickedPlaylist('workout')}
                                    >
                                        Workout</Button>
                                </CardActions>
                            </Card>
                        </div>
                        <div className={classes.playLists}>
                            {playListPickFrom}
                        </div>
                    </div>
                    <div>
                        <div className={classes.allAlbums}>
                            <div>
                                {/* <form onSubmit={this.handleSearchPlaylist}>
                                    <Input
                                        type="text"
                                        onChange={(event) => this.inputChangeHandler(event)}
                                    />
                                    <button type='submit'>pick</button>
                                </form> */}
                                {albumArtCover}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoggedIn;