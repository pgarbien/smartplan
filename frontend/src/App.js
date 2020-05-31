import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Tool from './Tool'
import { Rooms } from './tool/data/rooms'
import Creator from './tool/Creator'
import DevicesPage from './DevicesPage'

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

const App = () => {
  const creationCanvas = useRef(null);
  const [creator, setCreator] = useState(null);

  const change = (cr) => {
    creationCanvas.current = cr.canvas;

    const creator = new Creator(creationCanvas.current);

    creator.setBackgroundImage("https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg");
    creator.setRooms(cr.getRooms());
    creator.setDevices(cr.getDevices());
    creator.drawCanvas();
    setCreator(creator);
  };

  useEffect(() => {
    const creator = new Creator(creationCanvas.current);
    setCreator(creator);
    
    creator.setBackgroundImage("https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg");
    creator.setRooms(Rooms);
    creator.drawCanvas();
  }, []);

  return [
    <React.StrictMode>
      <Router>
        <Switch>
          <Route path="/devices">
            <DevicesPage change={change} creationCanvas={creationCanvas} parentCreator={creator}/>
          </Route>
          <Route path="/">
            <Tool change={change} creationCanvas={creationCanvas} parentCreator={creator}/>
          </Route>
        </Switch>
      </Router>
    </React.StrictMode>
  ];
};

export default App;
