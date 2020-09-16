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
            <div className="drawing_area">
                <canvas ref={creationCanvas} id="managerCanvas" width="600" height="600" style={{border: "1px solid #00d051"}}/>
            </div>
            <button className="device_button" style={{color: "#00d051", textAlign: "center", border: "1px solid #00d051", borderRadius: "15px", height: "50px", width: "120px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10, padding: 10}} onClick={() => creator.manageDevices()}>Manage devices</button>
            <Link to="/draw/devices" className="btn btn-primary" style={{color: "#00d051", textAlign: "center", border: "1px solid #00d051", borderRadius: "15px", height: "50px", width: "120px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10, marginLeft: 10, padding: 10}}>Go back to drawing devices...</Link>
        </div>
    );
}

export default Manager;