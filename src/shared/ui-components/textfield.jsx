import React from 'react';
import TextField from '@material-ui/core/TextField';
import { withStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    inputRoot: {
        fontSize: '14px'
    },
    labelRoot: {
        fontSize: '14px',
        "&$labelFocused": {
            color: "purple"
        }
    },
    labelFocused: {}
}));

const MyTextField = (props) => {
const classes = useStyles();

    return (<TextField {...props}
        InputProps={{ classes: { root: classes.inputRoot } }}
        InputLabelProps={{
            classes: {
                root: classes.labelRoot,
                focused: classes.labelFocused
            }
        }}
    style={{marginTop:'5px'}}
    />)
}

export default React.memo(MyTextField);
