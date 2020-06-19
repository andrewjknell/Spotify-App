import React, { Component } from 'react';
import logo from './logo.svg';
import classes from './app.module.css';
import Spotify from 'spotify-web-api-js';
import LoggedIn from './Components/LoggedIn';

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
                ) : <LoggedIn />}


                <div>
                    <img src={this.state.nowPlaying.image} style={{ width: '100px' }} />
                </div>
                <button onClick={this.getNowPlaying}>Get Now PLaying</button>
            </div>
        );
    }
}

export default App;
