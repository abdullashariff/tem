import React, { useState, useEffect } from 'react';
import MyTextField from '../../shared/ui-components/textfield';
import { Paper, Grid, FormControlLabel, Button, withStyles, Container, Typography, IconButton, Switch, TextareaAutosize, Checkbox } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons'
import styles from './../../shared/layout/my-styles';
import { addUserDtls } from './../../reducers/user-reducer';
import { connect, useDispatch, useSelector } from 'react-redux';
import UserReducer from './../../reducers/user-reducer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ABDSelector from '../../shared/ui-components/ab-selector';
import { currentDate } from '../../shared/date-utils';
import { CLEANING_COMPANIES, workClassList, priorityList, fogPercentageList, volumeList, waterSourceList, trapList, trapListSize, activitytypeList } from './work-order-constants';

const WorkOrderView = props => {


    const userDetails = useSelector(state => state.userDetails);
    const axios = require('axios');
    const [workClass, setWorkClass] = useState([]);
    const [priority, setPriority] = useState([]);
    const [greaceTrapSize, setGreaceTrapSize] = useState([]);
    const [ucoCollected, setUCOStatus] = useState(false);
    const [fogPercentage, setFogPercentage] = useState([]);
    const [cleaningStatus, setCleaningStatus] = useState([]);
    const [cleaningCount, setCleaningCount] = useState([]);
    const [gtCompany, setGTCompany] = useState([]);
    const [gtInstalled, setGtInstalled] = useState(1);
    const [waterSource, setWaterSource] = useState([]);
    const [locations, setLocations] = useState([]);

    const initialState = {
        department: '', status: '', organization: '', created: '', createdBy: '', createdDate: currentDate(), plotNumber: '', actualCleanPerMonth: '',
        actualGreaceQty: '', expectedGreaceQty: '', dateReported: currentDate(), assignedTo: '', scheduleStartDate: currentDate(), scheduleEndDate: currentDate(),
        startDate: currentDate(), completedDate: currentDate(), remarks: ''
    };

    const [state, setState] = useState(initialState);
    const [volume, setVolume] = useState([]);
    const ucoIntialStateState = { volume, UCOinvoice: '', remarks: '', ucoCollected };
    const [ucoState, setUcoState] = useState(ucoIntialStateState);
    const imgInitialState = { images: [] };
    // const [imgState, setImgState] = useState(imgInitialState);
    const [activitytype, setActivitytype] = useState([]);
    const businessInitialState = {
        businessName: '', location: '', activitytype, licenseNo: '', rakwaJobCardNo: '', createdBy: 'agent name', customerContactDetails: '', landMark: '', status: 'Awaiting',
        organization: 'gt cleaning company', createdDate: currentDate(), sector: ''
    };
    const [businessState, setBusnissState] = useState(businessInitialState);

    const fetchLocations = async () => {
        const response = await axios({
            method: 'POST',
            url: 'http://localhost:8080/tem/getlocations',
            data: { state: 'RAK', country: 'UAE' },
            headers: {
                'content-type': 'application/json', 'Access-Control-Allow-Origin': "*"
            },
        });

        setLocations(response.data);
    }

    useEffect(() => {
        if (locations.length === 0) {
            fetchLocations();
        }
    }, [locations]);

    useEffect(() => {
        var BreakException = {};
        try {
            if (businessState.location.length > 3) {
                locations && locations.forEach(item => {
                    if (item.area.toUpperCase() === businessState.location.toUpperCase()) {
                        setBusnissState(oldState => { return { ...oldState, sector: item.sector } });
                        throw BreakException;
                    }
                });
            }
        } catch (e) {
            if (e !== BreakException) throw e;
        }
    }, [businessState.location, setBusnissState, locations]);
    // const setDispatch = useDispatch();

    const handleChange = e => {
        const { id, value } = e.target;
        if (!id || !value) return;
        setState(oldState => { return { ...oldState, [id]: value } });
    }

    const handleChangetUCO = e => {
        const { id, value } = e.target;
        setUcoState(oldState => { return { ...oldState, [id]: value } });
    }

    const handleChangeBusiness = e => {
        const { id, value } = e.target;
        if (!id || !value) return;
        setBusnissState(oldState => { return { ...oldState, [id]: value } });
    }

    const handleClick = e => { saveWorkOrder(); }

    const handeTogle = () => { setUCOStatus(!ucoCollected); };

    useEffect(() => {
        let totalQty = 0;
        greaceTrapSize && greaceTrapSize.forEach(trap => {
            totalQty = totalQty + trapListSize[trap];
        });
        setState({ ...state, expectedGreaceQty: totalQty * gtInstalled, actualGreaceQty: totalQty * gtInstalled });
    }, [greaceTrapSize, gtInstalled]);

    const saveWorkOrder = async () => {

        const response = await axios({
            method: 'POST',
            url: 'http://localhost:8080/tem/saveWorkOrder',
            data: {
                ...state, waterSource, workClass, priority, fogPercentage, cleaningStatus, actualCleaningNo: cleaningCount, cleaningComponay: gtCompany,
                uco: { ...ucoState, ucoInvoice: ucoState.UCOinvoice, volume: ucoState.volume.join(), ucoCollected },
                business: businessState, gtInstalled, gtSize: greaceTrapSize.join(), gtInvoice: state.gtInvoiceNo
            },
            headers: {
                'content-type': 'application/json', 'Access-Control-Allow-Origin': "*"
            },
        });

        console.log(response);
    };

    const classes = props.classes;

    return (
        <Container style={{ paddingTop: '32px' }}>
            <Paper className={classes.padding}>
                <div className={classes.margin}>
                    <Typography className={classes.title} align="center" varient="h2">Grease Trap Cleaning Details</Typography>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <Typography className={classes.heading}>Customer Work Order Details</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container style={{ padding: '5px' }}>

                                <Grid item xs={4} style={{ padding: '5px' }}>
                                    <MyTextField
                                        id="businessName"
                                        label="Business Name"
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={businessState.businessName}
                                        onChange={handleChangeBusiness} />

                                    <MyTextField
                                        id="licenseNo"
                                        label="License No"
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={businessState.licenseNo}
                                        onChange={handleChangeBusiness} />

                                    <MyTextField
                                        id="location"
                                        label="Location"
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={businessState.location}
                                        onChange={handleChangeBusiness} />

                                    <MyTextField
                                        id="sector"
                                        label="Sector"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={businessState.sector} />

                                    <ABDSelector {...props} isMulti={false} list={activitytypeList} title={'Activity type'} value={activitytype} setValue={setActivitytype} />

                                    <MyTextField
                                        id="customerContactDetails"
                                        label="Customer Contact Details"
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={businessState.customerContactDetails}
                                        onChange={handleChangeBusiness} />

                                    <MyTextField
                                        id="landMark"
                                        label="Nearest Land Mark"
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={businessState.landMark}
                                        onChange={handleChangeBusiness} />

                                    <MyTextField
                                        id="rakwaJobCardNo"
                                        label="RAKWA Job Card No"
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={businessState.rakwaJobCardNo}
                                        onChange={handleChangeBusiness} />

                                </Grid>

                                <Grid item xs={4} style={{ padding: '5px' }}>
                                    <MyTextField
                                        id="status"
                                        label="status"
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        value={businessState.status}
                                        fullWidth
                                        className={classes.textField}
                                        onChange={handleChange} />

                                </Grid>

                                <Grid item xs={3} style={{ padding: '5px' }}>

                                    <MyTextField
                                        id="organization"
                                        label="Organization"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={userDetails && userDetails.organization} />

                                    <MyTextField
                                        id="createdBy"
                                        label="Created By"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={userDetails && userDetails.createdBy} />


                                    <MyTextField
                                        id="createdDate"
                                        label="Created Date"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={businessState.createdDate}
                                        onChange={handleChange} />
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <Typography className={classes.heading}>Customer Fields</Typography>
                        </ExpansionPanelSummary>

                        <ExpansionPanelDetails>

                            <Grid container row>
                                <Grid item xs={4} style={{ padding: '5px' }}>
                                    <ABDSelector {...props} isMulti={false} list={workClassList} title={'Work Class'} value={workClass} setValue={setWorkClass} />

                                    <ABDSelector {...props} isMulti={false} list={priorityList} title={'Priority'} value={priority} setValue={setPriority} />

                                    <ABDSelector {...props} isMulti={false} list={fogPercentageList} title={'FOG %'} value={fogPercentage} setValue={setFogPercentage} />

                                    <ABDSelector {...props} isMulti={false} list={['Pending', 'Done', 'Customer refuse']} title={'Cleaning Status'} value={cleaningStatus} setValue={setCleaningStatus} />

                                    <MyTextField
                                        id="remarks"
                                        label="Remarks"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={state.remarks}
                                        onChange={handleChange} />
                                </Grid>

                                <Grid iitem xs={4} style={{ padding: '5px' }}>
                                    <ABDSelector {...props} isMulti={false} list={[1, 2, 3, 4]} title={'Actual Clean No per month'} value={cleaningCount} setValue={setCleaningCount} />

                                    <ABDSelector {...props} isMulti={true} list={trapList} title={'Greace Trap Size'} value={greaceTrapSize} setValue={setGreaceTrapSize} />

                                    <ABDSelector {...props} isMulti={false} list={[1, 2, 3, 4]} title={'Greace Tap Installed'} value={gtInstalled} setValue={setGtInstalled} state={state} />

                                    <MyTextField
                                        id="expectedGreaceQty"
                                        label="Expected Greace Qty (GLN)"
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={state.expectedGreaceQty}
                                        onChange={handleChange} />

                                    <MyTextField
                                        id="actualGreaceQty"
                                        label="Actual Greace Qty (GLN)"
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={state.actualGreaceQty}
                                        onChange={handleChange} />

                                    <ABDSelector {...props} isMulti={false}
                                        list={waterSourceList} title={'Water Source'} value={waterSource} setValue={setWaterSource} />


                                    <ABDSelector {...props} isMulti={false}
                                        list={CLEANING_COMPANIES} title={'GT Cleaning Company'} value={gtCompany} setValue={setGTCompany} />

                                    <MyTextField
                                        id="gtInvoiceNo"
                                        label="GT Invoice No."
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={state.gtInvoiceNo}
                                        onChange={handleChange} />

                                </Grid>

                                <Grid item xs={3} style={{ padding: '5px' }}>
                                    <MyTextField
                                        id="dateReported"
                                        label="Date Reported"
                                        type="date"
                                        fullWidth
                                        className={classes.textField}
                                        defaultValue={currentDate()}
                                        onChange={handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }} />

                                    <MyTextField
                                        id="reportedTo"
                                        label="Reported To"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={'TEM'}
                                        onChange={handleChange} />


                                    <MyTextField
                                        id="scheduleStartDate"
                                        label="Schedule Start Date"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={state.scheduleStartDate}
                                        type="date"
                                        onChange={handleChange} />

                                    <MyTextField
                                        id="scheduleEndDate"
                                        label="Schedule End Date"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={state.scheduleEndDate}
                                        type="date"
                                        onChange={handleChange} />

                                    <MyTextField
                                        id="startDate"
                                        label="Start Date"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={state.startDate}
                                        type="date"
                                        onChange={handleChange} />

                                    <MyTextField
                                        id="completedDate"
                                        label="Date Completed"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={state.completedDate}
                                        type="date"
                                        onChange={handleChange} />
                                </Grid>
                                <Grid container style={{ padding: '5px' }}>

                                    <label htmlFor="icon-button-file">
                                        <Grid>
                                            <Typography >GT Before Clean</Typography>
                                            <IconButton color="primary" aria-label="upload picture" component="span">
                                                {/* <PhotoCamera /> */}
                                                <MyTextField
                                                    id="file1"
                                                    label=""
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    fullWidth
                                                    className={classes.textField}
                                                    type="file" />
                                            </IconButton>
                                        </Grid>

                                        <Grid>
                                            <Typography >GT After Clean</Typography>
                                            <IconButton color="primary" aria-label="upload picture" component="span">
                                                 {/* <PhotoCamera /> */}
                                                {/*<Typography style={{ marginLeft: '10px', color: 'Black' }}>Path</Typography> */}
                                                <MyTextField
                                                    id="file1"
                                                    label=""
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    fullWidth
                                                    className={classes.textField}
                                                    type="file" />
                                            </IconButton>
                                        </Grid>
                                    </label>
                                </Grid>
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header">
                            <Typography className={classes.heading}>UCO Details</Typography>
                        </ExpansionPanelSummary>
                        <Grid container style={{ padding: '5px' }}>

                            <Grid container padding='5px' >
                                <Grid container>
                                    <Grid container xs={4} style={{ marginTop: '16px' }}>
                                        <FormControlLabel
                                            label='UCO Collected'
                                            control={<Checkbox checked={ucoCollected} onChange={handeTogle} />}
                                        />
                                    </Grid>

                                    <Grid item xs={4}>
                                        <ABDSelector {...props} isMulti={false} list={volumeList} title={'Volume'} value={volume} setValue={setVolume} />
                                    </Grid>

                                    <Grid item xs={3} >
                                        <MyTextField
                                            id="UCOinvoice"
                                            label="UCO Invoice"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            fullWidth
                                            className={classes.textField}
                                            value={ucoState.UCOinvoice}
                                            onChange={handleChangetUCO} />

                                    </Grid>

                                </Grid>

                            </Grid>
                            <Grid style={{ padding: '10px', marginTop: '16px', paddingTop: '16px', color: 'gray' }} >
                                <TextareaAutosize
                                    rowsMax={4}
                                    rowsMin={4}
                                    aria-label="maximum height"
                                    defaultValue=""
                                    maxLength={250}
                                    placeholder="UTC Dispose Details"
                                    value={ucoState.remarks}
                                    id="remarks"
                                    onChange={handleChangetUCO}
                                />
                            </Grid>
                        </Grid>
                    </ExpansionPanel>
                    <Grid container justify="right" style={{ margin: '10px', padding: '10px' }}>
                        <Button variant="outlined" color="primary" style={{ width: '25%', marginRight: '10px' }}  >Cancel</Button>
                        <Button variant="contained" color="primary" style={{ width: '25%', color: 'white' }} onClick={handleClick} >Save</Button>
                    </Grid>
                </div>
            </Paper>
        </Container>
    );
}

// const mDispatchToProps = dispatch => {
//     return addUserDtls = details => { dispatch(addUserDtls(details)) }
// }

export default withStyles(styles)(WorkOrderView);
