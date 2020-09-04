import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Point from '../../tool/model/Point';
import NewDevice from '../../tool/model/NewDevice';

const Manager = ({change, creationCanvas, parentCreator}) => {
    const creator = parentCreator;

    useEffect(() => {
        if(parentCreator != null) {
            parentCreator.setCanvas(creationCanvas.current);
            change(parentCreator);
        }
    },[]);

    return(
        <div className="manager_container">
            <button className="device_button" onClick={() => creator.manageDevices()}>Manage devices</button>
            <div className="drawing_area">
                <canvas ref={creationCanvas} id="managerCanvas" width="600" height="600" style={{border: "1px solid #00d051"}}/>
                <Link to="/draw/devices" className="btn btn-primary" style={{color: "#00d051"}}>Go back to drawing devices...</Link>
            </div>
        </div>
    );
}

export default Manager;