import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Devices from '../../components/Devices/Devices';
import '../../App.css';
import './manager.css';

const Manager = ({location, change, creationCanvas, parentCreator}) => {
    const creator = parentCreator;

    useEffect(() => {
        if(parentCreator != null) {
            parentCreator.setCanvas(creationCanvas.current);
            change(parentCreator);
        }
    },[]);

    return(
        <div className="manager-container">
            <div className="possible-actions-area">
                <h3>Możliwe do wykonania akcje urządzenia.</h3>
            </div>
            <div className="drawing_area">
                <canvas ref={creationCanvas} id="managerCanvas" width="600" height="600" style={{border: "1px solid #00d051"}}/>
            </div>
            <div className="devices-list">
                <Devices creator={creator}/>
            </div>
            <button className="directional-button" onClick={() => creator.manageDevices()}>Manage devices</button>
            <Link className="back-link" to={location ? "/draw?locationId=" + location.id : "#"}>Edit location</Link>
            <Link className="back-link" to={location ? "/draw/devices?locationId=" + location.id : "#"}>Add devices</Link>
        </div>
    );
}

export default Manager;