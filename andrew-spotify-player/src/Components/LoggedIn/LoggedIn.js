import React, { Component } from 'react';
import fetchPlayer from '../../fetchPlayer';
import spfetch from '../../spfetch';
import classes from './LoggedIn.module.css'

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
        name: null,
        href: null,
        imageUrl: null,
        numFollowers: null,
        player: null,
        playerState: {},
        albumImg: null
    };

    async componentDidMount() {
        await this.getMe();
        this.initPlayer();
        // console.log(this.state, 'current state')
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
        console.log(this.state, 'after state')
    }

    async getMe() {
        const {
            display_name: name,
            href,
            images: [{ url: imageUrl } = {}] = [],
            followers: { total: numFollowers }
        } = await spfetch('/v1/me');
        this.setState({ name, href, imageUrl, numFollowers });
        return true;
    }

    handlePlayTopTracks = async () => {
        // const { items } = await spfetch('/v1/me/playlists');
        const { items } = await spfetch('/v1/me/top/tracks');
        console.log(items, 'items')
        this.state.player.play(items.map(({ uri }) => uri));
        // let albumArt = [];
        // for(let img in items){
        //     albumArt.push(items[img].album.images[0].url);
        // };
        // this.setState({albumImg: albumArt})

    };

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

        return (
            <div className={classes.App}>
                <CssBaseline />

                <AppBar position="static">
                    <Toolbar>
                        {/* <div>
                            <img src={imageUrl} />
                        </div> */}
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

                <Card className={classes.Card}>
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
                            Get Top Tracks
                </Button>
                    </CardActions>
                </Card>

                <div className={classes.trackContainer}>
                    <Button onClick={() => this.handleClick()}>Logout</Button>
                </div>
            </div>
        );
    }
}

export default LoggedIn;