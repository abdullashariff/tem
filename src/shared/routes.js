import React, { Component } from 'react';
// using ES6 modules
import { Router, Route, Switch } from "react-router";
import Login from '../modules/login';
import Home from '../modules/home';
import Loadable from 'react-loadable';
import WorkOrder from '../modules/work-order/work-order';

const LoginLoadable = Loadable({
    loader: () => import('../modules/login'),
    loading: <div>Loading...</div>,
});

const Routers = () =>
    (
        <div>
            <Switch>
                <Route exact path="/home" component={Home} />
                <Route exact path="/workorder" component={WorkOrder} />
            </Switch>
        </div>
    )


export default Routers;