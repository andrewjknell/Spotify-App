import React from 'react';
import logo from './logo.svg';
// import './App.css';
import styles from './app.module.css';
import classes from './app.module.css';

function App() {
  return (
    <div className={classes.App}>
      <header className={classes.header}>
        <img src={logo} className={styles.logo} alt="logo" />
      </header>
      <div className={styles.body}>

      </div>
    </div>
  );
}

export default App;