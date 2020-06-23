import Button from '@material-ui/core/Button';

import React, { Component } from 'react';
import classes from './App.module.css';
import spfetch from './spfetch';
import LoggedIn from './Components/LoggedIn/LoggedIn';

class App extends Component {
  // We might be logged in on load if the token could be extracted from the url hash
  state = { isLoggedIn: spfetch.isLoggedIn() };

  handleLoginClick = async () => {
    this.setState({
      isLoggedIn: await spfetch.login()
    });
  };

  render() {
    const { isLoggedIn } = this.state;
    return isLoggedIn ? (
      <LoggedIn />
    ) : (
      <div className={classes.login}>
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
