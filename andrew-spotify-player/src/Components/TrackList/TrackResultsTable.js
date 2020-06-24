import React, { Component } from 'react';
// import fetchPlayer from '../../fetchPlayer';
// import spfetch from '../../spfetch';

import classes from './TrackResultsTable.module.css';

import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TableContainer } from '@material-ui/core';



class TrackResultsTable extends Component {

    render() {
        return (
            <TableContainer component={Paper}>
                <Table padding="none">
                    <TableHead>
                        <TableRow >
                            <TableCell align="left" className={classes.tableHeaders}></TableCell>
                            <TableCell align="left" className={classes.tableHeaders}>Song</TableCell>
                            <TableCell align="left" className={classes.tableHeaders}>Artist</TableCell>
                            <TableCell align="left" className={classes.tableHeaders}>Artist</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {this.props.playlist.map(song => {
                            return (
                                <TableRow key={song.name} hover>
                                    <TableCell align='center' ><button onClick={() => this.props.clicked(song)}><PlayCircleFilledIcon /></button></TableCell>
                                    <TableCell className={classes.tableImg}><img src={song.album.images[0].url} alt='album' /></TableCell>
                                    <TableCell>{song.name}</TableCell>
                                    <TableCell>{song.artists[0].name}</TableCell>
                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

}

export default TrackResultsTable;
