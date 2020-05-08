import React from 'react';
import MyTextField from '../shared/ui-components/textfield';
import { Paper, Grid, FormControlLabel, Button, Checkbox, withStyles, Container, Typography } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons'
import styles from '../shared/layout/my-styles';
import UserReducer from './../reducers/user-reducer';
import { connect, useSelector } from 'react-redux';
import RAKTabs from '../shared/layout/rak-tabs';

const Home = (props) => {

    const classes = props.classes;
    const userReducer  = useSelector(state => state['UserReducer']);

    return (
        // <Container maxWidth='sm' style={{ paddingTop: '32px' }}>
            <RAKTabs />
        // </Container>
    );
}

const mStateToProps = state => {
    return { userdetails: state.UserReducer.userDetails }
}

export default connect(mStateToProps)(withStyles(styles)(Home));