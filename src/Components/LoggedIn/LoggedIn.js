import React, { Component } from 'react';
import fetchPlayer from '../../fetchPlayer';
import spfetch from '../../spfetch';

import classes from './LoggedIn.module.css'
import TrackResultsTable from '../TrackList/TrackResultsTable';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import AlbumArt from '../Playlists/AlbumArt/AlbumArt';

class LoggedIn extends Component {
    state = {
        id: null,
        href: null,
        imageUrl: null,
        player: null,
        playerState: {},
        albumImg: null,
        playlist: null,
        pickedPlaylist: null,
        isPlayListOpen: false,
        albumArt: null,
    };

    async componentDidMount() {
        await this.getMe();
        this.initPlayer();
    }

    async initPlayer() {
        // Let's fetch a connected player instance and also add it to `window` for debugging purposes
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
            id,
            display_name: name,
            href,
            images: [{ url: imageUrl } = {}] = [],
            followers: { total: numFollowers }
        } = await spfetch('/v1/me');
        this.setState({ id, name, href, imageUrl, numFollowers });
        return true;
    }

    setVolume = (event) => {
        const vol = event.target.value;
        this.state.player.setVolume(vol / 100).then(() => { });
    }

    searchPlaylists = async () => {
        const { playlists } = await spfetch("/v1/browse/categories/blackhistorymonth/playlists");
    }

    handlepickedPlaylist = async (playlist) => {
        if (this.state.isPlayListOpen) {
            this.setState({ isPlayListOpen: false });
            return;
        }

        if (playlist === 'blm') {
            const { playlists } = await spfetch("/v1/search?q=%22black%20lives%20matter&type=playlist&market=US&limit=15");
            const newItems = playlists.items.map(res => {
                return res
            });
            this.setState({ pickedPlaylist: newItems })
            this.setState({ isPlayListOpen: true })

        } else if (playlist === 'me') {
            const { items } = await spfetch("/v1/me/playlists");
            const newItems = items.map(res => {
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

    handleNewPlaylist = async (id) => {
        const { items } = await spfetch('/v1/playlists/' + id + '/tracks');
        const newItems = items.map(song => {
            return song.track
        })
        this.setState({ playlist: newItems })
        // this.state.player.play(newItems.map(({ uri }) => uri));
    }

    handleSelectedPlaylist = async (id) => {
        const { items } = await spfetch('/v1/playlists/' + id + '/tracks');
        const newItems = items.map(song => {
            return song.track
        })
        this.setState({ playlist: newItems })
        this.state.player.play(newItems.map(({ uri }) => uri));
        this.state.player.getCurrentState()
            .then(res => {
                console.log(res)
            })
    }

    handleSongSelect = (song) => {
        const newSong = []
        newSong.push(song)
        this.state.player.play(newSong.map(({ uri }) => uri));
        this.setState({ imageUrl: song.album.images[0].url });
    }

    toggleShuffle = (shuff) => {

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
            name,
            imageUrl,
            player,
            playerState: {
                paused = true,
                context,
                track_window: { 
                    current_track: { name: currentTrackName } = {} } = {},
                restrictions: {
                    disallow_pausing_reasons: [pauseRestrictedReason] = [],
                    disallow_skipping_prev_reasons: [skipPreviousRestrictedReason] = [],
                    disallow_skipping_next_reasons: [skipNextRestrictedReason] = []
                } = {}
            }
        } = this.state;

        const hasPlayer = !!player;
        const hasContext = context;

        let playListPickFrom;
        if (this.state.isPlayListOpen) {
            playListPickFrom = (
                this.state.pickedPlaylist.map(playlist => {
                    // console.log(playlist)
                    return (
                        <div key={playlist.id} className={classes.listPlay}>
                            {/* <button onClick={() => this.handleSelectedPlaylist(playlist.id)}>play</button> */}
                            <Button
                                className={classes.buttonPlaylist}
                                onClick={() => this.handleNewPlaylist(playlist.id)}
                            >
                                {playlist.name}
                            </Button>
                        </div>
                    )
                })
            )
        }

        let pickPlaylist;
        let albumArtCover;
        if (this.state.playlist) {
            pickPlaylist = (
                <TrackResultsTable
                    playlist={this.state.playlist}
                    clicked={(song) => this.handleSongSelect(song)}
                />
            );
            albumArtCover = (
                <AlbumArt
                    covers={this.state.playlist}
                    clicked={(song) => this.handleSongSelect(song)}
                />
            )
        }

        return (
            <div className={classes.App}>
                <CssBaseline />

                <AppBar position="static" style={{ marginBottom: 30, backgroundColor: 'black' }}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            {currentTrackName || 'Not playing anything'}
                        </Typography>
                        <div className={classes.grow} />
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
                                    <CardMedia className={classes.CardMedia} image={imageUrl} title={name} />
                                </CardActionArea>
                                <CardActions>
                                    {/* <Button
                                        size="small"
                                        color="primary"
                                        onClick={this.handlePlayTopTracks}
                                    >
                                        Play Top Tracks</Button> */}
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => this.handlepickedPlaylist('blm')}
                                    >
                                        Black Lives Matter</Button>
                                    {/* <Button
                                        size="small"
                                        color="primary"
                                        onClick={() => this.handlepickedPlaylist('me')}
                                    > */}
                                        {/* {!this.state.isPlayListOpen ? "Show Playlists" : "Hide Playlists"} </Button> */}
                                </CardActions>
                            </Card>
                        </div>
                        <div className={classes.playLists}>
                            {playListPickFrom}
                        </div>
                    </div>
                    <div>
                        <div className={classes.allAlbums}>
                            {albumArtCover}
                        </div>
                        {/* <div className={classes.trackContainer}>
                            {pickPlaylist}
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

export default LoggedIn;