import React, { useState } from 'react';
import MyTextField from '../shared/ui-components/textfield';
import { Paper, Grid, FormControlLabel, Button, Checkbox, withStyles, Container, Typography, CircularProgress, makeStyles } from '@material-ui/core';
import { Face } from '@material-ui/icons'
import appStyles from './../shared/layout/my-styles';
import { addUserDtls } from './../reducers/user-reducer';
import { useDispatch } from 'react-redux';
import UserLoginDetails from './../reducers/user-reducer';
import Axios from 'axios';
import { SERVER_ID } from '../shared/constants';

const Login = (props) => {

    const useStyles = makeStyles((theme) => ({

        spinner: {
            left: '50%',
            top: '50%',
            zIndex: 2,
            position: 'absolute'
        }, errorMsg: {
            color: 'red'
        }
    }));

    const initialState = {
        username: '',
        password: ''
    };

    const setDispatch = useDispatch();

    const [state, setState] = useState(initialState);
    const [progressBar, setProgressBar] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = e => {
        const { id, value } = e.target;
        if (id === 'username') {
            setState(oldState => { return { ...oldState, username: value } });
        } else if (id === 'password') {
            setState(oldState => { return { ...oldState, password: value } });
        }
    }

    const handleClick = e => {
        // props.addUserDtls({ ...UserReducer, userDetails: state });
        setDispatch(addUserDtls({ ...UserLoginDetails, userDetails: state }));
        validateUser();
    }

    const validateUser = async () => {

        try {
            if (!state.username || !state.password) return;
            setErrorMsg('');
            setProgressBar(true);
            if (state.username === 'demo' && state.password === 'demo123') {
                setDispatch(addUserDtls({ "userId": "abdulla@gmail.com", "userType": "demo", "firstName": "Abdulla", "lastName": "Shariff", "organization": "TEM", "password": "Asd@123" }));
                props.history.push('/home');
                return;
            } else {
                const response = await Axios({
                    method: 'POST',
                    url: SERVER_ID + '/login',
                    data: { ...state, userId: state.username },
                    headers: {
                        'content-type': 'application/json', 'Access-Control-Allow-Origin': "*"
                    },
                });

                if (response && response.data && response.data.firstName) {
                    console.log(response.data);
                    setDispatch(addUserDtls(response.data));
                    props.history.push('/home');
                } else {
                    setErrorMsg('Invalid login details \n please contact abdullashariff21@gmail.com');
                }
            }
            setProgressBar(false);
        } catch (ex) {
            setErrorMsg('Something went wrong \n please contact abdullashariff21@gmail.com');
            setProgressBar(false);
        }
    };

    const classes = useStyles();

    return (
        // maxWidth='sm'
        <>
            {progressBar && <div className={classes.spinner}><CircularProgress /></div>}
            <Container maxWidth='sm' className={classes.loginContainer}>
                <Paper className={classes.padding}>
                    <div style={{ margin: '16px' }}>
                        <Face align='center' style={{ width: '100%' }} />
                        <Typography className={classes.title} align="center" varient="h4">Login to TEM Management</Typography>
                        <Typography className={classes.errorMsg} align="center" varient="h4">{errorMsg}</Typography>
                        <Grid container >
                            <Grid item xs={12}>
                                <MyTextField
                                    id="username"
                                    label="Username"
                                    InputProps={{
                                        readOnly: false,
                                    }}
                                    fullWidth
                                    className={classes.textField}
                                    value={state.username}
                                    onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12}>
                                <MyTextField
                                    id="password"
                                    label="Password"
                                    InputProps={{
                                        readOnly: false,
                                    }}
                                    fullWidth
                                    type="password"
                                    className={classes.textField}
                                    value={state.password}
                                    onChange={handleChange} />
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" justify="space-between">
                            <Grid item>
                                <FormControlLabel control={
                                    <Checkbox
                                        color="primary"
                                    />
                                } label="Remember me" />
                            </Grid>
                            <Grid item>
                                <Button disableFocusRipple disableRipple style={{ textTransform: "none" }} variant="text" color="primary">Forgot password ?</Button>
                            </Grid>
                        </Grid>
                        <Grid container justify="center" style={{ marginTop: '10px', marginBottom: '10px', padding: '8px' }}>
                            <Button variant="contained" color="primary" style={{ width: '50%' }} onClick={handleClick} >Login</Button>
                        </Grid>
                    </div>
                </Paper>
            </Container>
        </>
    );
}

// const mDispatchToProps = dispatch => {
//     return addUserDtls = details => { dispatch(addUserDtls(details)) }
// }

export default withStyles(appStyles)(Login);