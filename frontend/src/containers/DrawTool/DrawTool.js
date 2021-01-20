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
    const [activeLevel, setActiveLevel] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        const query = window.location.search;
        const params = new URLSearchParams(query);
        const fullscreenParam = params.get('fullscreen');
        setFullscreen(fullscreenParam === 'true');
    }, [])

    useEffect(() => {
        setIsLocationEmpty(location == null || location.levels.length === 0)
    }, [location])

    useEffect(() => {
        if(creator != null) refreshCanvas()
    }, [fullscreen])

    const refreshCanvas = () => creator.refreshCanvas()

    const setupCreator = (canvas) => {
        if(creator == null) {
            const creator = new Creator(canvas);
            fetchLocation(creator);
            setCreator(creator);
        } else {
            if(!isLocationEmpty) setCurrentLevel(location.levels[activeLevel]);
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
        if(hasLevels) setCurrentLevel(location.levels[activeLevel], mCreator)
    }

    const setCurrentLevel = (level, mCreator = creator) => {
        mCreator.setBackgroundImage(level.blueprintUrl);
        mCreator.setRooms(level.rooms ? level.rooms : []);
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
                <DevicesPage location={location} 
                    activeLevel={activeLevel} 
                    setActiveLevel={setActiveLevel} 
                    changeDisplayedLevel={setCurrentLevel} 
                    setupCreator={setupCreator}
                    fullscreen={fullscreen}
                    setFullscreen={setFullscreen} 
                    creator={creator} 
                    language={props.language}/>
            </Route>
            <Route path="/draw/manager">
                <Manager location={location} 
                    activeLevel={activeLevel} 
                    setActiveLevel={setActiveLevel} 
                    activeDevices={activeDevices} 
                    changeDisplayedLevel={setCurrentLevel} 
                    fullscreen={fullscreen}
                    setFullscreen={setFullscreen} 
                    creator={creator}
                    setupCreator={setupCreator} /> 
            </Route>
            <Route path="/draw">
                <Tool location={location} 
                    setLocation={setLocation} 
                    activeLevel={activeLevel} 
                    setActiveLevel={setActiveLevel} 
                    changeDisplayedLevel={setCurrentLevel} 
                    setupCreator={setupCreator} 
                    fullscreen={fullscreen}
                    setFullscreen={setFullscreen} 
                    creator={creator} 
                    language={props.language}/>
            </Route>
        </Switch>
    );
};

export default DrawTool;