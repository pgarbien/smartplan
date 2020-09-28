import React, { useEffect, useState, Fragment, Component } from 'react';
import { Link } from 'react-router-dom';
import Devices from '../../components/Devices/Devices';
import '../../App.css';
import './manager.css';

const Manager = ({change, creationCanvas, parentCreator}) => {
    const creator = parentCreator;

    useEffect(() => {
        if(parentCreator != null) {
            parentCreator.setCanvas(creationCanvas.current);
            change(parentCreator);
        }
    },[]);

    return(
        <div className="manager-container">
            <div className="drawing_area">
                <canvas ref={creationCanvas} id="managerCanvas" width="600" height="600" style={{border: "1px solid #00d051"}}/>
            </div>
            <div className="devices-list">
                <Devices creator={creator}/>
            </div>
            <button className="directional-button" onClick={() => creator.manageDevices()}>Manage devices</button>
            <Link className="back-link" to="/draw/devices">Go back to drawing devices...</Link>
        </div>
    );
}

export default Manager;