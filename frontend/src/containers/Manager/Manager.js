import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Devices from '../../components/Devices/Devices';
import FullscreenButton from '../../components/Fullscreen/FullscreenButton'
import '../../new_css/app_css/App.css';
import '../../new_css/tool_css/Tool.css';
import '../../new_css/manager_css/Manager.css';
import LevelsList from '../../components/Levels/LevelsList';
import { Commands } from '../../tool/commands/Commands';
import ManageDeviceModal from '../../components/Devices/ManageDeviceModal';
import mAxios from '../../utils/API';
import { DeviceState } from '../../tool/model/NewDevice'

const Manager = ({ location, activeDevices, changeDisplayedLevel, setupCreator, creator }) => {
    const creationCanvas = useRef(null);
    const [device, setDevice] = useState(null);
    const [activeLevel, setActiveLevel] = useState(0);
    const [deviceState, setDeviceState] = useState([]);
    const [fullscreen, setFullscreen] = useState(false);
    const [showManageDeviceModal, setShowManageDeviceModal] = useState(false);

    const fetchDevices = () => {
        mAxios.get('/devices?levelId=' + location.levels[activeLevel].id)
            .then(response => fetchDevicesStates(response.data))
            .catch(error => console.log(error));
    }

    const fetchDevicesStates = (devices) => {
        devices.forEach(device => {
            if(device.defaultAction) fetchDeviceState(device)
        })
    }

    const fetchDeviceState = (device) => {
        mAxios.get(`/devices/details/${device.id}`)
            .then(response => setDeviceDetails(device, response.data), 1000)
    }

    const onMouseClick = (device) => {
        if(device.defaultAction) manageDefaultDeviceAction(device)
        else manageDevice(device)
    }

    const manageDevice = (device) => {
        setDevice(device);
        setTimeout(() => mAxios.get(`/devices/details/${device.id}`)
            .then(response => {
                setDeviceDetails(device, response.data);
                setDeviceState(response.data);
                setShowManageDeviceModal(true);
            })
            .catch(error => console.log(error)), 100)
    }

    const manageDefaultDeviceAction = (device) => {
        mAxios.post(`/devices/actions/${device.id}`, { "actionType": device.defaultAction })
            .then(() => {
                setTimeout(() => mAxios.get(`/devices/details/${device.id}`)
                        .then(response => setDeviceDetails(device, response.data))
                        .catch(error => console.log(error)), 100)
                }
            )
            .catch(error => console.log(error))
    }

    const setDeviceDetails = (device, deviceDetails) => {
        const deviceVisualState = deviceDetails.possibleVisualStates.find(state => state == (deviceDetails.state.on ? "on" : "off"));
        device.deviceState = deviceDetails.state.connected ? deviceDetails.state.on ? DeviceState.ACTIVE : DeviceState.NOT_ACTIVE : DeviceState.DISABLED
        device.activeIconId = deviceDetails.possibleVisualStates.indexOf(deviceVisualState)
        creator.changeDevice(device);
        creator.refresh();
    }

    useEffect(() => {
        fetchDevices()
        const interval = setInterval(() => fetchDevicesStates(creator.getAddedDevices()), 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(creationCanvas) setupCreator(creationCanvas.current)     
    }, [creationCanvas]);

    useEffect(() => {
        if(creator) {
            creator.setCommand(Commands.MANAGE);
            creator.setCallback('click', onMouseClick);
            creator.setCallback('rightclick', manageDevice);
            creator.setCallback('down', manageDevice)
        }
    }, [creator]);

    return(
        <Fragment>
            <div class="container manager-page">
                <div class="localization-header">
                    <div class="left-header-wrapper">
                        <h2>Manage <span class="primary_color">{location ? location.name : "your"}</span> devices:</h2>
                        <LevelsList creator={creator} location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel} />
                    </div>
                </div>
                <div className="manager-page-layout">
                    <div className="left-container"></div>
                    <div className={"drawing-area" + (fullscreen ? " fullscreen" : "")} style={{position: "relative"}}>
                        <canvas ref={creationCanvas} class="canvas" id="managerCanvas"/>
                        <FullscreenButton setFullscreen={setFullscreen} fullscreen={fullscreen} />
                    </div>
                    <div className="right-container">
                        <div class="manager-devices-list">
                            <Devices location={location} activeLevel={activeLevel} activeDevices={activeDevices} manageDevice={manageDevice} creator={creator} />
                        </div>
                        <div className="right-container-buttons">
                            <Link class="directional-button-link" to={location ? "/draw?locationId=" + location.id : "#"}>
                                <div className="directional-button">Edit location &nbsp;&gt;</div>
                            </Link>
                            <Link class="directional-button-link" to={location ? "/draw/devices?locationId=" + location.id : "#"}>
                                <div className="directional-button">Add devices &nbsp;&gt;</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            { showManageDeviceModal ? <ManageDeviceModal device={device} manageDevice={manageDevice} deviceState={deviceState} setShowModal={setShowManageDeviceModal} canClose={true}/> : null}
        </Fragment>
    );
}

export default Manager;