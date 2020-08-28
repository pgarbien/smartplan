import React, { useEffect, useRef, useState } from 'react';
import Creator from '../../tool/Creator'
import axios from '../../utils/API'
import DevicesPage from '../Devices/DevicesPage'
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

    /*
    * This method must be created seperately as we cannot save image with background image behind our drawing
    * as it gives us SecurityError (if you want to know in details read about CORS)
    * */
    const changeCondignation = (cr) => {
        creationCanvas.current = cr.canvas;

        const creator = new Creator(creationCanvas.current);

        creator.setRooms(cr.getRooms());
        creator.setDevices(cr.getDevices());
        creator.drawCanvas();
        setCreator(creator);
    };

    useEffect(() => {
        const creator = new Creator(creationCanvas.current);
        setCreator(creator);

        axios.get('/locations')
            .then(response => {
                creator.setBackgroundImage("https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg");
                creator.setRooms(response.data[0].levels[0].rooms);
                creator.drawCanvas();
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <Switch>
            <Route path="/draw/devices">
                <DevicesPage change={changeCondignation} creationCanvas={creationCanvas} parentCreator={creator}/>
            </Route>
            <Route path="/draw">
                <Tool change={change} creationCanvas={creationCanvas} parentCreator={creator}/>
            </Route>
        </Switch>
    );
};

export default DrawTool;