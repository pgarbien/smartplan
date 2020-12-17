import React, { useEffect, useState } from 'react';
import Creator from '../../tool/Creator';
import mAxios from '../../utils/API';
import DevicesPage from '../Devices/DevicesPage';
import Tool from '../Tool/Tool';
import { Route, Switch } from 'react-router-dom';
import Manager from '../Manager/Manager';

const DrawTool = (props) => {
    const [creator, setCreator] = useState(null);
    const [location, setLocation] = useState(null);
    const [isLocationEmpty, setIsLocationEmpty] = useState(true)
    const [activeDevices, setActiveDevices] = useState([]);

    useEffect(() => {
        setIsLocationEmpty(location == null || location.levels.length === 0)
    }, [location])

    const setupCreator = (canvas) => {
        if(creator == null) {
            const creator = new Creator(canvas);
            fetchLocation(creator);
            setCreator(creator);
        } else {
            if(!isLocationEmpty) setCurrentLevel(location.levels[0]);
            creator.setCanvas(canvas);
            creator.refresh();
        }
    }

    const fetchLocation = (creator) => {
        const query = window.location.search;
        const params = new URLSearchParams(query);
        const locationId = params.get('locationId');

        mAxios.get('/locations/' + locationId)
            .then(response => setCurrentLocation(response.data, creator))
            .catch(error => console.log(error));
    }

    const setCurrentLocation = (location, mCreator = creator) => {
        setLocation(location);
        const hasLevels = location.levels && location.levels.length > 0
        if(hasLevels) setCurrentLevel(location.levels[0], mCreator)
    }

    const setCurrentLevel = (level, mCreator = creator) => {
        mCreator.setBackgroundImage(level.blueprintUrl);
        mCreator.setRooms(level.rooms);
        mCreator.setAddedDevices([]);
        mCreator.refresh();
        
        mAxios.get('/devices?levelId=' + level.id)
            .then(response => {
                const placedDevices = response.data.filter(device => device.point);
                setActiveDevices(placedDevices);
                mCreator.setAddedDevices(placedDevices);
                mCreator.refresh();
            })
            .catch(error => console.log(error));
    }

    return (
        <Switch>
            <Route path="/draw/devices">
                { isLocationEmpty ?
                    <Tool location={location} setLocation={setCurrentLocation} changeDisplayedLevel={setCurrentLevel} setupCreator={setupCreator} creator={creator} language={props.language}/> :
                    <DevicesPage location={location} changeDisplayedLevel={setCurrentLevel} setupCreator={setupCreator} creator={creator} language={props.language}/>
                }
            </Route>
            <Route path="/draw/manager">
                { isLocationEmpty ?
                    <Tool location={location} setLocation={setCurrentLocation} changeDisplayedLevel={setCurrentLevel} setupCreator={setupCreator} creator={creator} language={props.language}/> :
                    <Manager location={location} activeDevices={activeDevices} changeDisplayedLevel={setCurrentLevel} setupCreator={setupCreator} creator={creator}/> 
                }
            </Route>
            <Route path="/draw">
                <Tool location={location} setLocation={setCurrentLocation} changeDisplayedLevel={setCurrentLevel} setupCreator={setupCreator} creator={creator} language={props.language}/>
            </Route>
        </Switch>
    );
};

export default DrawTool;