import React, { useEffect, useRef, useState } from 'react';
import Creator from '../../tool/Creator';
import mAxios from '../../utils/API';
import DevicesPage from '../Devices/DevicesPage';
import Tool from '../Tool/Tool';
import Location from '../../tool/model/Location';
import { Route, Switch } from 'react-router-dom';
import Level from '../../tool/model/Level';
import NewLevelModal from '../../components/DrawTool/NewLevelModal';
import NewDeviceModal from '../../components/Devices/NewDeviceModal';
import Manager from '../Manager/Manager';

const DrawTool = (props) => {
    const [creator, setCreator] = useState(null);
    const [location, setLocation] = useState(null);
    const [showAddLevelModal, setShowAddLevelModal] = useState(false);
    const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);

    const addNewLevel = (levelName, blueprintUrl) => {
        const preLocation = location; 
        preLocation.levels.push(new Level(null, levelName, blueprintUrl, [], preLocation.levels.length)); 
        setLocation(preLocation); 
        setShowAddLevelModal(false)
    }

    const addNewDevice = (deviceName, color, deviceId, deviceActions) => {
        creator.addDeviceCommand(deviceName, color, deviceId, deviceActions);
        setShowAddDeviceModal(false);
    }
    
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
            mAxios.get('/locations/' + locationId, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
            .then(response => {
                const location = response.data;
                setLocation(location);

                if(location.levels.length === 0) {
                    setShowAddLevelModal(true);
                } else {
                    if(location.levels[0].blueprintUrl != null) {
                        creator.setBackgroundImage(location.levels[0].blueprintUrl);
                    }
                    creator.setRooms(location.levels[0].rooms);
                    creator.drawCanvas();
                }
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            setLocation(new Location(0, props.locationName ? props.locationName : "Unknown", []));
            setShowAddLevelModal(true);
        }
    }

    return (
        <Switch>
            <Route path="/draw/devices">
                <DevicesPage location={location} changeDisplayedLevel={changeDisplayedLevel} setShowAddDeviceModal={setShowAddDeviceModal} setupCreator={setupCreator} parentCreator={creator}/>
                { showAddDeviceModal ? <NewDeviceModal addNewDevice={addNewDevice} showModal={showAddDeviceModal} setShowModal={setShowAddDeviceModal} canClose={true}/> : null}
            </Route>
            <Route path="/draw/manager">
                <Manager location={location} changeDisplayedLevel={changeDisplayedLevel} setupCreator={setupCreator} parentCreator={creator}/>
            </Route>
            <Route path="/draw">
                <Tool location={location} changeDisplayedLevel={changeDisplayedLevel} setShowAddLevelModal={setShowAddLevelModal} setupCreator={setupCreator} parentCreator={creator}/>
                { showAddLevelModal ? <NewLevelModal addNewLevel={addNewLevel} showModal={showAddLevelModal} setShowModal={setShowAddLevelModal} canClose={location.levels.length > 0} /> : null }
            </Route>
        </Switch>
    );
};

export default DrawTool;