import React, { useState } from 'react';
import Creator from '../../tool/Creator';
import mAxios from '../../utils/API';
import DevicesPage from '../Devices/DevicesPage';
import Tool from '../Tool/Tool';
import Location from '../../tool/model/Location';
import { Route, Switch } from 'react-router-dom';
import Manager from '../Manager/Manager';

const DrawTool = (props) => {
    const [creator, setCreator] = useState(null);
    const [location, setLocation] = useState(null);
    
    const changeDisplayedLevel = (level) => {
        creator.setBackgroundImage(level.blueprintUrl);
        creator.setRooms(level.rooms); 
        creator.drawCanvas(); 
    }

    const setupCreator = (canvas) => {
        if(creator == null) {
            const creator = new Creator(canvas);
            fetchLocation(creator);
            setCreator(creator);
        } else {
            changeDisplayedLevel(location.levels[0]);
            creator.setCanvas(canvas);
            creator.drawCanvas();
        }
    }

    const fetchLocation = (creator) => {
        const query = window.location.search;
        const params = new URLSearchParams(query);
        const locationId = params.get('locationId');
        if(locationId != null) {
            mAxios.get('/locations/' + locationId)
            .then(response => {
                const location = response.data;
                setLocation(location);
                if(location.levels.length > 0) {
                    creator.setBackgroundImage(location.levels[0].blueprintUrl);
                    creator.setRooms(location.levels[0].rooms);
                    creator.drawCanvas();
                }
            })
            .catch(error => console.log(error));
        } else {
            setLocation(new Location(0, props.locationName ? props.locationName : "Unknown", "", []));
        }
    }

    return (
        <Switch>
            <Route path="/draw/devices">
                <DevicesPage location={location} changeDisplayedLevel={changeDisplayedLevel} setupCreator={setupCreator} parentCreator={creator}/>
            </Route>
            <Route path="/draw/manager">
                <Manager location={location} changeDisplayedLevel={changeDisplayedLevel} setupCreator={setupCreator} parentCreator={creator}/>
            </Route>
            <Route path="/draw">
                <Tool location={location} setLocation={setLocation} changeDisplayedLevel={changeDisplayedLevel} setupCreator={setupCreator} parentCreator={creator}/>
            </Route>
        </Switch>
    );
};

export default DrawTool;