import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Tool from './Tool'
import Login from './containers/Login/Login'
import DrawTool from './containers/DrawTool/DrawTool'

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

const App = () => {
  return [
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/draw">
            <DrawTool/>
          </Route>
          <Route path="/">
            <Login/>
          </Route>
        </Switch>
      </Router>
    </React.StrictMode>
  ];
};

export default App;
