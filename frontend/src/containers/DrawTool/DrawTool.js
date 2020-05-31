import React, { useEffect, useRef, useState } from 'react';
import Creator from '../../tool/Creator'
import { Rooms } from '../../tool/data/rooms'
import DevicesPage from '../../DevicesPage'
import Tool from '../../Tool'

import {
    BrowserRouter as Router,
    Route,
    Switch
  } from 'react-router-dom'

const DrawTool = () => {
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

    return (
        <Switch>
            <Route path="/draw/devices">
            <DevicesPage change={change} creationCanvas={creationCanvas} parentCreator={creator}/>
            </Route>
            <Route path="/draw">
            <Tool change={change} creationCanvas={creationCanvas} parentCreator={creator}/>
            </Route>
        </Switch>
    );
};

export default DrawTool;