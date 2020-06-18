import React, { Component } from 'react';
import './App.css';

import Button from '@material-ui/core/Button';
import spfetch from './spfetch';
import LoggedInScreen from './components/LoggedInScreen';


class App extends Component {
  // We might be logged in on load if the token could be extracted from the url hash
  state = { isLoggedIn: spfetch.isLoggedIn() };
  

  handleLoginClick = async () => {
    // console.log(this.state.isLoggedIn, 'here'); 
    this.setState({
      isLoggedIn: await spfetch.login()
    });
    console.log(this.state, 'the state current');
  };

  render() {
    const { isLoggedIn } = this.state;
    return isLoggedIn ? (
      <LoggedInScreen />
    ) : (
      <div className="login">
        <Button
          variant="contained"
          color="primary"
          className={''}
          onClick={this.handleLoginClick}
        >
          Log In With Spotify
        </Button>
      </div>
    );
  }
}

export default App;
