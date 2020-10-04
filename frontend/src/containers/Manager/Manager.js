import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Devices from '../../components/Devices/Devices';
import '../../App.css'; 
import './Manager.css';
import LevelsList from '../../components/Levels/LevelsList';
import { Commands } from '../../tool/commands/Commands';
import ManageDeviceModal from './ManageDeviceModal';

const Manager = ({location, changeDisplayedLevel, setupCreator, parentCreator}) => {
    const creator = parentCreator;
    const [showManageDeviceModal, setShowManageDeviceModal] = useState(false);
    const creationCanvas = useRef(null);

    const manageDevices = () => {
        setShowManageDeviceModal(false);
    }

    const manageDevice = (position) => {
        setShowManageDeviceModal(true);
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
                    <LevelsList location={location} changeDisplayedLevel={changeDisplayedLevel} />
                </div>
                <div className="drawing-area">
                    <canvas ref={creationCanvas} className="canvas" id="managerCanvas" width="600" height="600"/>
                </div>
                <div className="right-container">
                    <div className="devices-list">
                        <Devices creator={creator}/>
                    </div>
                    <button className="directional-button" onClick={() => creator.setCommand(Commands.MANAGE)}>Manage devices</button>
                    <Link className="back-link" to={location ? "/draw?locationId=" + location.id : "#"}>Edit location</Link>
                    <Link className="back-link" to={location ? "/draw/devices?locationId=" + location.id : "#"}>Add devices</Link>
                    </div>
                </div>
                { showManageDeviceModal ? <ManageDeviceModal manageDevices={manageDevices} setShowModal={setShowManageDeviceModal} canClose={true}/> : null}
        </Fragment>
    );
}

export default Manager;