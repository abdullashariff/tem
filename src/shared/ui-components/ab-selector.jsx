import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    formControl: {
        // margin: theme.spacing(1),
        minWidth: 200,
        maxWidth: 500,

    }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ABDSelector = React.memo(props => {

    const classes = useStyles();
    const theme = useTheme();

    const handleChange = (event) => {
        props.setValue(event.target.value);
    };

    const handleChangeMultiple = (event) => {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        props.setValue(value);
    };

    return (
        <><Grid item xs={4} >
            <FormControl className={classes.formControl}style={{marginTop:'5px', height:'45px'}} >
                <InputLabel id="demo-mutiple-checkbox-label" style={{ fontSize: '14px' }}>{props.title}</InputLabel>
                <Select
                    {...props}
                    multiple={props.isMulti}
                    value={props.value ? props.value : (props.state && props.key && props.state[props.key])}
                    onChange={handleChange}
                    input={<Input />}
                    renderValue={props.isMulti ? selected => (selected ? selected.join(', ') : '') : ''}
                    MenuProps={MenuProps}
                    style={{ padding: 0,fontSize: '14px' }}
                >
                    {props.list.map(item => (
                        <MenuItem key={item} value={item}>
                            {props.isMulti && <Checkbox checked={props.value ? props.value.indexOf(item) > -1 : props.state[props.key].indexOf(item) > -1} />}
                            <ListItemText style={{ marginTop: 0, marginBottom: 0 , paddingBottom:0, paddingTop:0}}
                            disableTypography
                            primary={<Typography style={{fontSize: '14px'}}>{item}</Typography>}
                            />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            </Grid>
        </>)

});

export default ABDSelector;
