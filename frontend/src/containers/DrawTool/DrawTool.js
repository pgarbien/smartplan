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

const DrawTool = (props) => {
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

        const query = window.location.search
        const params = new URLSearchParams(query); 
        const token = params.get('token');
        if(token != null) {
            localStorage.setItem('token', token);
        }

        axios.get('/locations/32bhsbbf7f6s6/1',
            {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(JSON.stringify(response.data))
                creator.setBackgroundImage("https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg");
                creator.setRooms(response.data.levels[0].rooms);
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