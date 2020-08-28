import React from 'react';
import './App.css';
import Login from './containers/Login/Login'
import DrawTool from './containers/DrawTool/DrawTool'
import Layout from './containers/Layout/Layout'
import Locations from './containers/Locations/Locations';
import { BrowserRouter, Route, Switch } from 'react-router-dom'

const App = () => {
  const loggedIn = true

  return [
    <BrowserRouter>
      <Layout loggedIn={loggedIn}>
          <Switch>
            <Route path="/locations">
              <Locations/>
            </Route>
            <Route path="/draw">
              <DrawTool/>
            </Route>
            <Route path="/">
              <Login/>
            </Route>
          </Switch>
      </Layout>
    </BrowserRouter>
  ];
};

export default App;
