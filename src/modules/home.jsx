import React from 'react';
import { useDispatch } from 'react-redux';
import { withStyles, makeStyles, Grid } from '@material-ui/core';
import appStyles from '../shared/layout/my-styles';
//import UserDetails from './../reducers/user-reducer';
import { connect, useSelector } from 'react-redux';
//import RAKTabs from '../shared/layout/work-order';
//import LeftDrawer from './drawer/left-drawer';
import WorkOrder from './work-order/work-order';
import { PieChart } from 'react-minimal-pie-chart';
import OrderTable from '../shared/ui-components/mytable';
import Axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { addWorkOrder, WorkorderReducer } from './../../src/reducers/word-order-reducer';
import { formatPieChartData } from './../modules/work-order/work-order-constants';

const useStyles = makeStyles((theme) => ({
    piechart: {
        maxHeight: '250px',
        maxWidth: '250px',
        //margin: '16px',
        alignContent: 'center',
        margin: '0 auto'
        },
    kpiTitle: {
        margin: '10px',
    },
    kpiSubTitle: {
        marginTop: '10px',
        textAlign: 'center'
    },
    tableHeader: {
        display: 'flex'
    },
    tableColumn: {
        flex: 1
    },
    header: {
        position: 'sticky',
        top: 0
    }
}));

const mockWorkOrders = [
    { title: 'One', value: 10, color: '#E38627' },
    { title: 'Two', value: 15, color: '#C13C37' },
    { title: 'Three', value: 20, color: '#6A2135' },
    { title: 'Fourth', value: 5, color: '#C13C37' },
];

const mockVisits = [
    { title: 'Hotels', value: 10, color: '#E38627' },
    { title: 'Factories', value: 15, color: '#C13C37' },
    { title: 'Kitchens', value: 20, color: '#6A2135' },
    { title: 'Car Wash', value: 5, color: '#C13C37' },
];

const PieCharts = ({ dataMock, isObject, }) => {

    const defaultLabelStyle = {
        fontSize: '5px',
        fontFamily: 'sans-serif',
    };
    const shiftSize = 7;

    return <>
        <PieChart
            data={dataMock}
            label={({ dataEntry }) => dataEntry.title}
            labelStyle={(index) => ({
                fill: dataMock[index].color,
                fontSize: '5px',
                fontFamily: 'sans-serif',
            })}
            radius={42}
            labelPosition={112}
        />
    </>
};


const Home = props => {

    const styles = useStyles();
    const history = useHistory();
    const setDispatch = useDispatch();
    const [state, setState] = useState({ activityTypes: [] });

    const userLoginDetails = useSelector(state => state['UserLoginDetails']);

    const [workOrders, setWorkOrders] = useState([]);
    useEffect(() => {
        if (userLoginDetails && userLoginDetails.userDetails && userLoginDetails.userDetails.firstName) {
            getWorkOrders()
        }
    }, [userLoginDetails]);

    const headers = ['Business Name', 'Location', 'Status', 'Created By', 'Created Date', 'WaterSource'];
    const columns = ['businessName', 'location', 'status', 'createdBy', 'createdDate', 'waterSource'];

    const getWorkOrders = async () => {
        const response = await Axios({
            method: 'POST',
            url: 'http://localhost:8080/tem/workOrders',
            data: { createdBy: userLoginDetails.userDetails.firstName + ' ' + userLoginDetails.userDetails.lastName },
            headers: {
                'content-type': 'application/json', 'Access-Control-Allow-Origin': "*"
            },
        });
        let activityTypes = {};

        if (response && response.data) {
            console.log(response.data);
            let workOrders = response.data;
            if (workOrders) {
                workOrders.forEach((item, index) => {
                    workOrders[index] = {
                        ...workOrders[index],
                        businessName: workOrders[index].business.businessName,
                        location: workOrders[index].business.location
                    }
                    if (activityTypes && workOrders[index].business.activityType) {
                        if (activityTypes[workOrders[index].business.activityType]) {
                            activityTypes[workOrders[index].business.activityType] = activityTypes[workOrders[index].business.activityType] + 1;
                        } else {
                            activityTypes[workOrders[index].business.activityType] = 1;
                        }
                    }
                });
            }

            console.log('activityTypes ', activityTypes)
            setWorkOrders([...workOrders]);
            const temp = await formatPieChartData(activityTypes, 'activityTypes');
            console.log('temptemptemp ',temp);
            setState({ ...state, activityTypes: temp});
        }
    }

    const onTableItemSelect = workOrder => {
        setDispatch(addWorkOrder({ ...WorkorderReducer, workOrder: workOrder }));
        history.push('/workorder');
    };

    return (<>
        <Grid style={{ display: 'flex' }}>

            {state.activityTypes && <Grid style={{ flex: 1 }}>
                <div className={styles.piechart}><PieCharts dataMock={state.activityTypes} isObject={true} /></div>
                <div className={styles.kpiSubTitle}>Activity Types</div>
            </Grid >}
        </Grid>
        <Grid className={styles.tableHeader}>
            {/* <div className={styles.kpiSubTitle}>Work Orders</div> */}

            <OrderTable className={styles.tableColumn} columns={columns} headers={headers} rows={workOrders} actions={{ view: true }} onSelect={onTableItemSelect} />
        </Grid>
    </>);
}

const mStateToProps = state => {
    return { userdetails: state.UserLoginDetails }
}

export default connect(mStateToProps)(Home);