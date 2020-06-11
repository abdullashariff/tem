import React from 'react';
import logo from './logo.svg';
import './App.css';
import AppRoutes from './shared/routes';
import Routers from './shared/routes';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Loadable from 'react-loadable';
import Login from './modules/login';
import MenuAppBar from './shared/layout/menu';
import { makeStyles } from '@material-ui/core';
import { createHashHistory } from 'history'
const history = createHashHistory();

const LoginLoadable = Loadable({
  loader: () => import('./modules/login'),
  loading: <div>Loading...</div>
});

const useStyles = makeStyles(theme => {
  return (
    {
      // root: { display: 'flex' },
      // content: {
      //   flexGrow: 1,
      //   padding: theme.spacing(0, 1)
      // },
      // toolbar: theme.mixins.toolbar,
      // menuButton: {
      //   marginRight: '16px'
      // },
      // title: { flexGrow: 1 }
    }
  )
});

const App = () => {
  const classes = useStyles();

  return (
    <Router history={history}>
      <Switch>
        <Route path="/" component={Login} exact />
        <div className={classes.root}>
          <MenuAppBar history={history}/>
          <main className={classes.content}>
            <div className={classes.toolbar}>
              <AppRoutes />
            </div>
          </main>
        </div>
      </Switch>
    </Router>
  );
}

export default App;
