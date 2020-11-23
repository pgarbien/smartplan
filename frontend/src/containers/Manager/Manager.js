import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Devices from '../../components/Devices/Devices';
import '../../new_css/app_css/App.css';
import '../../new_css/tool_css/Tool.css';
import '../../new_css/manager_css/Manager.css';
import LevelsList from '../../components/Levels/LevelsList';
import { Commands } from '../../tool/commands/Commands';
import ManageDeviceModal from '../../components/Devices/ManageDeviceModal';
import mAxios from '../../utils/API';

const Manager = ({location, activeDevices, changeDisplayedLevel, setupCreator, parentCreator}) => {
    const creator = parentCreator;
    const creationCanvas = useRef(null);

    const [showManageDeviceModal, setShowManageDeviceModal] = useState(false);
    const [activeLevel, setActiveLevel] = useState(0);
    const [deviceState, setDeviceState] = useState([]);
    const [device, setDevice] = useState(null);

    const handleMouseClick = (device) => {
        if(device.defaultAction) {
            manageDefaultDeviceAction(device)
        } else {
            manageDevice(device)
        }
    }

    const manageDevice = (device, actionCaption) => {
        if(actionCaption) {
            device.activeIconId = device.possibleVisualStates.indexOf(device.possibleVisualStates.filter(state => state == actionCaption.toLowerCase())[0]);
            creator.changeDevice(device);
        }
        setDevice(device);
        mAxios.get(`/devices/details/${device.id}`)
            .then(response => {
                setDeviceState(response.data);
                setShowManageDeviceModal(true);
            })
            .catch(error => console.log(error));
    }

    const manageDefaultDeviceAction = (device) => {
        setDevice(device);
        if(device.defaultAction) {
            mAxios.post(`/devices/actions/${device.id}`, { "actionType": device.defaultAction })
                .then(mAxios.get(`/devices/details/${device.id}`)
                    .then(response => {
                        device.activeIconId = response.data.possibleVisualStates.indexOf(response.data.possibleVisualStates.filter(state => state == (response.data.state.on ? "on" : "off"))[0])
                        creator.changeDevice(device);
                    }))
        }
    }

    useEffect(() => {
        if(creationCanvas) setupCreator(creationCanvas.current)  
    }, [creationCanvas]);

    useEffect(() => {
    if(parentCreator) {
        parentCreator.setCommand(Commands.MANAGE);
        parentCreator.setCallback('click', handleMouseClick);
        parentCreator.setCallback('rightclick', manageDevice);
        parentCreator.setCallback('down', manageDevice)
    }
    }, [parentCreator]);

    return(
        <Fragment>
            <div class="container manager-page">
                <div class="manager-localization-header">
                    <div class="left-header-wrapper">
                        <h2>Manage <span className='color-primary'>{location ? location.name : "your"}</span> devices:</h2>
                        <LevelsList creator={creator} location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel} />
                    </div>
                </div>
                <div className="manager-page-layout">
                    <div className="drawing-area">
                    <canvas ref={creationCanvas} class="canvas" id="managerCanvas"/>
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