import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Devices from '../../components/Devices/Devices';
import '../../App.css'; 
import './Manager.css';
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

    const manageDevices = () => {
        setShowManageDeviceModal(false);
    }

    const manageDevice = (device) => {
        setDevice(device);
        mAxios.get(`/devices/details/${device.id}`)
            .then(response => {
                setDeviceState(response.data);
                setShowManageDeviceModal(true);
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        if(creationCanvas) setupCreator(creationCanvas.current)  
    }, [creationCanvas]);

    useEffect(() => {
    if(parentCreator) {
        parentCreator.setCommand(Commands.MANAGE);
        parentCreator.setCallback('click', manageDevice);
    }
    }, [parentCreator]);

    return(
        <Fragment>
            <h2>Manage <span className='color-primary'>{location ? location.name : "your"}</span> devices:</h2>
            <div className="manager-container">
                <div className="left-container">
                    <LevelsList location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel} />
                </div>
                <div className="drawing-area">
                    <canvas ref={creationCanvas} className="canvas" id="managerCanvas" width="600" height="600"/>
                </div> 
                <div className="right-container">
                    <div className="devices-list">
                        <Devices activeDevices={activeDevices} manageDevice={manageDevice} creator={creator} />
                    </div>
                    <div className="buttons">
                        <Link to={location ? "/draw?locationId=" + location.id : "#"}>
                            <div className="directional-button">Edit location &nbsp;&gt;</div>
                        </Link>
                        <Link to={location ? "/draw/devices?locationId=" + location.id : "#"}>
                            <div className="directional-button">Add devices &nbsp;&gt;</div>
                        </Link>
                    </div>
                </div>
            </div>
            { showManageDeviceModal ? <ManageDeviceModal device={device} manageDevice={manageDevice} deviceState={deviceState} setShowModal={setShowManageDeviceModal} canClose={true}/> : null}
        </Fragment>
    );
}

export default Manager;