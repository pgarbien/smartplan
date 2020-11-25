import React, { useEffect, useState } from 'react';
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
    const [isLocationEmpty, setIsLocationEmpty] = useState(true)
    const [devices, setDevices] = useState([]);
    const [activeDevices, setActiveDevices] = useState([]);

    useEffect(() => {
        setIsLocationEmpty(location == null || location.levels.length === 0)
    }, [location])

    const setCurrentLocation = (location) => {
        setLocation(location)
        setIsLocationEmpty(location == null || location.levels.length === 0)
    }
    
    const changeDisplayedLevel = (level) => {
        creator.setBackgroundImage(level.blueprintUrl);
        creator.setRooms(level.rooms); 
        creator.setAddedDevices([]);
        creator.refresh(); 
    }

    const setupCreator = (canvas) => {
        if(creator == null) {
            const creator = new Creator(canvas);
            fetchLocation(creator);
            setCreator(creator);
        } else {
            if(!isLocationEmpty) changeDisplayedLevel(location.levels[0]);
            creator.setCanvas(canvas);
            creator.refresh();
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
                    creator.refresh();
                    
                    mAxios.get('/devices')
                        .then(response => {
                            const devices = response.data.filter(device => !device.point)
                            const activeDevices = response.data.filter(device => device.point && device.levelId == 0 && device.locationId == locationId)
                            setDevices(devices);
                            setActiveDevices(activeDevices);
                            creator.setDevices(devices);
                            creator.setAddedDevices(activeDevices);
                            creator.refresh();
                        })
                        .catch(error => console.log(error));
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
                { isLocationEmpty ?
                    <Tool location={location} setLocation={setCurrentLocation} changeDisplayedLevel={changeDisplayedLevel} setupCreator={setupCreator} parentCreator={creator}/> :
                    <DevicesPage location={location} devices={devices} setDevices={setDevices} changeDisplayedLevel={changeDisplayedLevel} setupCreator={setupCreator} parentCreator={creator}/>
                }
            </Route>
            <Route path="/draw/manager">
                { isLocationEmpty ?
                    <Tool location={location} setLocation={setCurrentLocation} changeDisplayedLevel={changeDisplayedLevel} setupCreator={setupCreator} parentCreator={creator}/> :
                    <Manager location={location} activeDevices={activeDevices} changeDisplayedLevel={changeDisplayedLevel} setupCreator={setupCreator} parentCreator={creator}/> 
                }
            </Route>
            <Route path="/draw">
                <Tool location={location} setLocation={setCurrentLocation} changeDisplayedLevel={changeDisplayedLevel} setupCreator={setupCreator} parentCreator={creator}/>
            </Route>
        </Switch>
    );
};

export default DrawTool;