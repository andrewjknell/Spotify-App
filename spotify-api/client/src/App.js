import React, { Component } from 'react';
import logo from './logo.svg';
import classes from './app.module.css';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify()

class App extends Component {
    constructor() {
        super()
        const params = this.getHashParams();
        this.state = {
            loggedIn: params.access_token ? true : false,
            nowPlaying: {
                artist: '',
                track: '',
                image: ''
            }
        }
        if (params.access_token) {
            spotifyWebApi.setAccessToken(params.access_token);
            this.getNowPlaying();
        }
    }

    getHashParams = () => {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        while (e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }
        return hashParams;
    }

    getNowPlaying = () => {
        spotifyWebApi.getMyCurrentPlaybackState()
            .then(res => {
                console.log(res)
                this.setState({
                    nowPlaying: {
                        artist: res.item.artists[0].name,
                        track: res.item.name,
                        image: res.item.album.images[0].url
                    }
                });
            })
    }

    render() {
        return (
            <div className={classes.App}>
                <header className={classes.header}>
                    <img src={logo} className={classes.logo} alt="logo" />
                </header>
                {!this.state.loggedIn ? (
                    <a href='http://localhost:8888'>
                        <button>Login with Spotify</button>
                    </a>
                ) : null}

                <div>Artist: {this.state.nowPlaying.artist}</div>
                <div>Track: {this.state.nowPlaying.track}</div>

                <div>
                    <img src={this.state.nowPlaying.image} style={{ width: '100px' }} />
                </div>
                <button onClick={this.getNowPlaying}>Get Now PLaying</button>
            </div>
        );
    }
}

export default App;
