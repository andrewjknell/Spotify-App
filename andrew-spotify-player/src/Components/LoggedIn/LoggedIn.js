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
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

class LoggedIn extends Component {
    state = {
        id: null,
        name: null,
        href: null,
        imageUrl: null,
        numFollowers: null,
        player: null,
        playerState: {},
        albumImg: null,
        playlist: null,
        playListSelection: null,
        isPlayListOpen: false,
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

    handleUserPlaylists = async () => {
        if (this.state.isPlayListOpen) {
            this.setState({ isPlayListOpen: false });
            return;
        }
        const { items } = await spfetch("/v1/me/playlists");
        console.log(items)
        const newItems = items.map(res => {
            return res
        })
        this.setState({ playListSelection: newItems })
        this.setState({ isPlayListOpen: true })
        // this.state.player.play(newItems.map(({ uri }) => uri));
    };

    handlePlayTopTracks = async () => {
        const { items } = await spfetch('/v1/me/top/tracks');
        // console.log(items, 'top playlist')
        this.setState({ playlist: items })
        this.state.player.play(items.map(({ uri }) => uri));
    };

    handleNewPlaylist = async (id) => {
        console.log(id)
        const { items } = await spfetch('/v1/playlists/' + id + '/tracks');
        const newItems = items.map(song => {
            return song.track
        })
        this.setState({ playlist: newItems })
        this.state.player.play(newItems.map(({ uri }) => uri));
    }

    handlePlayPreviousTrack = () => {
        this.state.player.previousTrack()
    };

    handlePlayNextTrack = () => {
        this.state.player.nextTrack()
    };

    handleResume = () => this.state.player.resume();
    handlePause = () => this.state.player.pause();

    handleClick = async () => {
        await spfetch.logout()
    };

    render() {
        const {
            name,
            imageUrl,
            numFollowers,
            player,
            playerState: {
                paused = true,
                context,
                track_window: { current_track: { name: currentTrackName } = {} } = {},
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
                this.state.playListSelection.map(playlist => {
                    // console.log(playlist)
                    return (
                        <Button
                            className={classes.buttonPlaylist}
                            key={playlist.id}
                            onClick={() => this.handleNewPlaylist(playlist.id)}
                        >
                            {playlist.name}
                        </Button>
                    )
                })
            )
        }

        let pickPlaylist;
        if (this.state.playlist) {
            pickPlaylist = <TrackResultsTable playlist={this.state.playlist} />
        }

        return (
            <div className={classes.App}>
                <CssBaseline />

                <AppBar position="static" style={{ marginBottom: 30 }}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit">
                            {currentTrackName || 'Not playing anything'}
                        </Typography>

                        <div className={classes.grow} />

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
                <div className={classes.jumboTron}>
                    <div className={classes.sideCard}>
                        <div className={classes.Card}>
                            <Card>
                                <CardActionArea>
                                    <CardMedia className={classes.CardMedia} image={imageUrl} title={name} />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {name}
                                        </Typography>
                                        <Typography component="p">Followers: {numFollowers}</Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={this.handlePlayTopTracks}
                                    >
                                        Play Top Tracks</Button>
                                    <Button
                                        size="small"
                                        color="primary"
                                        onClick={this.handleUserPlaylists}
                                    >
                                        {!this.state.isPlayListOpen ? "Show Playlists" : "Hide Playlists"} </Button>
                                </CardActions>
                            </Card>
                        </div>
                        <div className={classes.playLists}>
                            {playListPickFrom}
                        </div>
                    </div>

                    <div className={classes.trackContainer}>
                        {pickPlaylist}
                    </div>
                </div>
            </div>
        );
    }
}

export default LoggedIn;