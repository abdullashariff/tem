import React, { Component } from 'react';
// using ES6 modules
import { Router, Route, Switch } from "react-router";
import Login from '../modules/login';
import home from '../modules/home';
import Loadable from 'react-loadable';

const LoginLoadable = Loadable({
    loader: () => import('../modules/login'),
    loading: <div>Loading...</div>,
});

const Routers = () =>
    (
        <div>
            <Switch>
                <Route path="/home" component={home} exact />
            </Switch>
        </div>
    )


export default Routers;