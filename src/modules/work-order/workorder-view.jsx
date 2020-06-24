import React, { useState, useEffect } from 'react';
import MyTextField from '../../shared/ui-components/textfield';
import { Paper, Grid, FormControlLabel, Button, withStyles, Container, Typography, TextareaAutosize, Checkbox, makeStyles, CircularProgress } from '@material-ui/core';
import appStyles from './../../shared/layout/my-styles';
import { useSelector } from 'react-redux';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ABDSelector from '../../shared/ui-components/ab-selector';
import { currentDate } from '../../shared/date-utils';
import { CLEANING_COMPANIES, workClassList, priorityList, fogPercentageList, volumeList, waterSourceList, trapList, trapListSize, activitytypeList, headers, customerStatusList, cleaningCountList, gtInstalledCountList } from './work-order-constants';
import { APP_HEADERS, SERVER_ID } from '../../shared/constants';
import MyDialog from '../../shared/ui-components/alert-dialog';
import { printLog } from '../../shared/utils';
const axios = require('axios');

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'sticky',
        paddingTop: '32px',
        top: 0
    },
    gtImg: {
        width: '200px',
        height: '300px'
    },
    woButtonRight: {
        width: '25%',
        marginRight: '10px'
    },
    spinner: {
        left: '50%',
        top: '50%',
        zIndex: 2,
        position: 'absolute'
    }
}));

const WorkOrderView = props => {

    // console.log(props);
    const userLoginDetails = useSelector(state => state['UserLoginDetails']);
    const workorder = useSelector(state => state['WorkorderReducer']);
    let workOrder = null;
    if (workorder && workorder.workorderDetails && workorder.workorderDetails.workOrder) {
        workOrder = workorder.workorderDetails.workOrder;
    }

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
    const [progressBar, setProgressBar] = useState(false);
    const [isUpdate, setUpdate] = useState(true);

    const getImageData = (index, workOrder) => {
        printLog(workOrder);
        return workOrder && workOrder.gtImages && workOrder.gtImages[index] ? workOrder.gtImages[index].imageData : '';
    }

    const initialState = {
        workorderId: null, department: '', status: '', organization: '', created: '', createdBy: '',
        plotNumber: '', actualCleanPerMonth: '',
        actualGreaceQty: '', expectedGreaceQty: '', assignedTo: '',
        createdDate: workOrder && workOrder.createdDate ? workOrder.createdDate : currentDate(),
        dateReported: workOrder && workOrder.dateReported ? workOrder.dateReported : currentDate(),
        scheduleStartDate: workOrder && workOrder.scheduleStartDate ? workOrder.scheduleStartDate : currentDate(),
        scheduleEndDate: workOrder && workOrder.scheduleEndDate ? workOrder.scheduleEndDate : currentDate(),
        startDate: workOrder && workOrder.startDate ? workOrder.startDate : currentDate(),
        completedDate: workOrder && workOrder.completedDate ? workOrder.completedDate : currentDate(),
        remarks: '',
        img1: getImageData(0, workOrder),
        img2: getImageData(1, workOrder),
        img3: getImageData(2, workOrder),
        img4: getImageData(3, workOrder)
    };


    const [state, setState] = useState(initialState);
    const [volume, setVolume] = useState([]);
    const ucoIntialStateState = { ucoInvoice: '', remarks: '', ucoCollected };
    const [ucoState, setUcoState] = useState(ucoIntialStateState);
    const [activityType, setActivitytype] = useState([]);
    const businessInitialState = {
        businessName: '', location: '', activityType, licenseNo: '', rakwaJobCardNo: '', createdBy: '', contantNo: '', landMark: '', status: 'Awaiting',
        organization: '', createdDate: currentDate(), sector: ''
    };
    const [businessState, setBusnissState] = useState(businessInitialState);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertMsg, setAlertMsg] = useState({ message: '', title: '' });

    const fetchLocations = async () => {
        if (userLoginDetails.userDetails.userType === 'demo') {
            setProgressBar(false);
            return;
        } else {
            setProgressBar(true);
            const response = await axios({
                method: 'POST',
                url: SERVER_ID+'/getlocations',
                data: { state: 'RAK', country: 'UAE' },
                headers: APP_HEADERS,
            });
            setProgressBar(false);
            setLocations(response.data);
        }
    };

    useEffect(() => {
        if (locations && locations.length === 0) {
            fetchLocations();
        }
    }, [locations]);

    const formatImages = workOrder => {
        return { img1: workOrder.gtImages[0].imageData, img2: workOrder.gtImages[2].imageData, img3: workOrder.gtImages[3].imageData, img4: workOrder.gtImages[4].imageData };
    };

    // to update the record
    useEffect(() => {
        if (isUpdate) {
            setUpdate(false);
            if (workOrder) {
                setState(workOrder => {
                    const img1 = workOrder.gtImages && workOrder.gtImages[0] ? workOrder.gtImages[0].imageData : '';
                    const img2 = workOrder.gtImages && workOrder.gtImages[1] ? workOrder.gtImages[1].imageData : '';
                    const img3 = workOrder.gtImages && workOrder.gtImages[2] ? workOrder.gtImages[2].imageData : '';
                    const img4 = workOrder.gtImages && workOrder.gtImages[3] ? workOrder.gtImages[3].imageData : '';
                    return { ...workOrder, img1, img2, img3, img4 }
                });
                if (workOrder.business) {
                    setBusnissState(workOrder.business);
                    setActivitytype(workOrder.business.activityType);
                }
                if (workOrder.uco) {
                    setVolume(workOrder.uco.volume);
                    setUcoState(workOrder.uco);
                    setUCOStatus(workOrder.uco.ucoCollected);
                }

                setWorkClass(workOrder.workClass);
                setPriority(workOrder.priority);
                if (workOrder.gtSize) {
                    const gtSize = workOrder.gtSize;
                    setGreaceTrapSize(gtSize && gtSize.replace(',', ' ').split(' '));
                }
                setFogPercentage(workOrder.fogPercentage);
                setCleaningCount(workOrder.actualCleaningNo);
                setGTCompany(workOrder.cleaningComponay);
                setGtInstalled(workOrder.gtInstalled);
                setWaterSource(workOrder.waterSource);
                setLocations(workOrder.locations);
                setCleaningStatus(workOrder.cleaningStatus);
            }
        }
    }, [isUpdate, workorder]);

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

    const handleChange = e => {

        const { id, value } = e.target;
        if (!id) return;

        if (id.includes('img')) {
            handleFileSelect(e, id);
            return
        }

        setState(oldState => { return { ...oldState, [id]: value } });
    }

    const handleFileSelect = (evt, id) => {
        var f = evt.target.files[0]; // FileList object
        var reader = new FileReader();
        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                var binaryData = e.target.result;
                var base64String = window.btoa(binaryData);
                setState(oldState => { return { ...oldState, [id]: `data:image/png;base64, ${base64String}` } });
            };
        })(f);
        // Read in the image file as a data URL.
        reader.readAsBinaryString(f);
    }

    const handleChangetUCO = e => {
        const { id, value } = e.target;
        setUcoState(oldState => { return { ...oldState, [id]: value } });
    }

    const handleChangeBusiness = e => {
        const { id, value } = e.target;
        if (!id) return;
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
        if (userLoginDetails.userDetails.userType === 'demo') {
            return;
        } else {
            try {
                setProgressBar(true);
                const response = await axios({
                    method: 'POST',
                    url: SERVER_ID+'/saveWorkOrder',
                    data: {
                        ...state, waterSource, workClass, priority, fogPercentage, cleaningStatus, actualCleaningNo: cleaningCount, cleaningComponay: gtCompany, createdBy: fullName(),
                        workorderId: workorder.workorderDetails && workorder.workorderDetails.workOrder ? workorder.workorderDetails.workOrder.workorderId : null,
                        uco: { ...ucoState, ucoInvoice: ucoState.ucoInvoice, volume, ucoCollected },
                        business: { ...businessState, activityType, contantNo: businessState.contantNo }, gtInstalled, gtSize: greaceTrapSize.join(), gtInvoice: state.gtInvoiceNo,
                        gtImages: [{ imgStatus: true, imageData: state.img1 },
                        { imgStatus: true, imageData: state.img2 }, { imgStatus: false, imageData: state.img3 }, { imgStatus: false, imageData: state.img4 }]
                    },
                    headers: APP_HEADERS,
                });
                setProgressBar(false);
                setShowAlert(true);
                setAlertMsg({ message: 'Work order created successfully', title: 'Success' });
            } catch (e) {
                setProgressBar(false);
                setShowAlert(true);
                setAlertMsg({ message: 'Failed to created work order', title: 'Failed' });
            }
        }
    };

    const classes = useStyles();

    const handleClose = () => {
        setShowAlert(false);
    };

    const fullName = () => {
        return userLoginDetails && userLoginDetails.userDetails && userLoginDetails.userDetails.firstName && userLoginDetails.userDetails.lastName
            && `${userLoginDetails.userDetails.firstName} ${userLoginDetails.userDetails.lastName}`;
    };

    return (
        <div className={classes.root}>
            <Container >
                {progressBar && <div className={classes.spinner}><CircularProgress /></div>}
                {showAlert && <MyDialog showAlert msg={showAlertMsg} handleClose={handleClose} />}
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

                                        <ABDSelector {...props} isMulti={false} list={activitytypeList} title={'Activity type'} value={activityType} setValue={setActivitytype} />

                                        <MyTextField
                                            id="contantNo"
                                            label="Customer Contact Details"
                                            InputProps={{
                                                readOnly: false,
                                            }}
                                            fullWidth
                                            className={classes.textField}
                                            value={businessState.contantNo}
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

                                        {/* <MyTextField
                                        id="rakwaJobCardNo"
                                        label="RAKWA Job Card No"
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        fullWidth
                                        className={classes.textField}
                                        value={businessState.rakwaJobCardNo}
                                        onChange={handleChangeBusiness} /> */}

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
                                            value={userLoginDetails && userLoginDetails.userDetails && userLoginDetails.userDetails.organization} />

                                        <MyTextField
                                            id="createdBy"
                                            label="Created By"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            fullWidth
                                            className={classes.textField}
                                            value={fullName()} />


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

                                <Grid>
                                    <Grid container row>
                                        <Grid item xs={4} style={{ padding: '5px' }}>
                                            <ABDSelector {...props} isMulti={false} list={workClassList} title={'Work Class'} value={workClass} setValue={setWorkClass} />

                                            <ABDSelector {...props} isMulti={false} list={priorityList} title={'Priority'} value={priority} setValue={setPriority} />

                                            <ABDSelector {...props} isMulti={false} list={fogPercentageList} title={'FOG %'} value={fogPercentage} setValue={setFogPercentage} />

                                            <ABDSelector {...props} isMulti={false} list={customerStatusList} title={'Cleaning Status'} value={cleaningStatus} setValue={setCleaningStatus} />

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
                                            <ABDSelector {...props} isMulti={false} list={cleaningCountList} title={'Actual Clean No per month'} value={cleaningCount} setValue={setCleaningCount} />

                                            <ABDSelector {...props} isMulti={true} list={trapList} title={'Greace Trap Size'} value={greaceTrapSize} setValue={setGreaceTrapSize} />

                                            <ABDSelector {...props} isMulti={false} list={gtInstalledCountList} title={'Greace Tap Installed'} value={gtInstalled} setValue={setGtInstalled} state={state} />

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
                                    </Grid>
                                    <Grid container column style={{ padding: '5px' }}>

                                        <label htmlFor="icon-button-file">
                                            <Typography >GT Before Clean</Typography>
                                            <Grid container row >
                                                <Grid item column>
                                                    {/* <IconButton color="primary" aria-label="upload picture" component="span"> */}
                                                    {/* <PhotoCamera /> */}
                                                    <MyTextField
                                                        id="img1"
                                                        label=""
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        fullWidth
                                                        className={classes.textField}
                                                        type="file"
                                                        onChange={handleChange} />
                                                    {/* </IconButton> */}
                                                    {state.img1 && <img src={state.img1} alt="logo" className={classes.gtImg} />}
                                                </Grid>
                                                {state.img1 && <Grid item column>
                                                    {/* <IconButton color="primary" aria-label="upload picture" component="span"> */}
                                                    <MyTextField
                                                        id="img2"
                                                        label=""
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        fullWidth
                                                        className={classes.textField}
                                                        type="file"
                                                        onChange={handleChange} />
                                                    {/* </IconButton> */}
                                                    {state.img2 && <img src={state.img2} alt="logo" className={classes.gtImg} />}
                                                </Grid>}
                                            </Grid>
                                            <Typography >GT After Clean</Typography>

                                            <Grid container row >
                                                <Grid item column>
                                                    {/* <IconButton color="primary" aria-label="upload picture" component="span"> */}
                                                    {/*<Typography style={{ marginLeft: '10px', color: 'Black' }}>Path</Typography> */}
                                                    <MyTextField
                                                        id="img3"
                                                        label=""
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        fullWidth
                                                        className={classes.textField}
                                                        type="file"
                                                        onChange={handleChange} />
                                                    {/* </IconButton> */}
                                                    {state.img3 && <img src={state.img3} alt="logo" className={classes.gtImg} />}
                                                </Grid>

                                                {state.img3 && <Grid item column>
                                                    {/* <IconButton color="primary" aria-label="upload picture" component="span"> */}
                                                    <MyTextField
                                                        id="img4"
                                                        label=""
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        fullWidth
                                                        className={classes.textField}
                                                        type="file"
                                                        onChange={handleChange} />
                                                    {/* </IconButton> */}
                                                    {state.img4 && <img src={state.img4} alt="logo" className={classes.gtImg} />}
                                                </Grid>}
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
                                                id="ucoInvoice"
                                                label="UCO Invoice"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                fullWidth
                                                className={classes.textField}
                                                value={ucoState.ucoInvoice}
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
                            <Button variant="outlined" color="primary" className={classes.woButtonRight}  >Cancel</Button>
                            <Button variant="contained" color="primary" style={{ width: '25%', color: 'white' }} onClick={handleClick} >Save</Button>
                        </Grid>
                    </div>
                </Paper>
            </Container></div>
    );
}

// const mDispatchToProps = dispatch => {
//     return addUserDtls = details => { dispatch(addUserDtls(details)) }
// }

export default withStyles(appStyles)(WorkOrderView);
