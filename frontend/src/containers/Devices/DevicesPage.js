import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Devices from '../../components/Devices/Devices';
import './DevicesPage.css';

const DevicesPage = ({setShowAddDeviceModal, change, creationCanvas, parentCreator}) => {
    const creator = parentCreator;

    useEffect(() => {
        setShowAddDeviceModal(true);
        if(parentCreator != null) {
            parentCreator.setCanvas(creationCanvas.current);
            change(parentCreator);
        }
    }, []);

    return(
        <div className="devices_container">
            <div className="tools">
                <h1>Tools</h1>
                <div className="devices_list">
                    <button className="device_button" onClick={() => setShowAddDeviceModal(true)}>Add device 1</button>
                    <button className="device_button" onClick={() => setShowAddDeviceModal(true)}>Add device 2</button>
                    <button className="device_button" onClick={() => creator.moveDeviceCommand()}>Move devices</button>
                    <button className="device_button" onClick={() => creator.undoCommand()}>Undo</button>
                    <button className="device_button" onClick={() => creator.redoCommand()}>Redo</button>
                </div>
            </div>
            <div className="drawing-area">
                <h2 style={{justifySelf: "center"}}>Kondygnacja numer #01</h2>
                <canvas ref={creationCanvas} id="condignationCanvas" width="600" height="600" style={{border: "1px solid #00d051"}}></canvas>
            </div>
            <div className="devices-list" style={{display: "grid", gridColumn: 3, gridRow: 1}}>
                <Devices/>
            </div>
            <div style={{display: "grid", gridRow: 3, gridColumn: 1}}>
            <Link to="/draw" className="btn btn-primary" style={{color: "#00d051"}}>Go back to drawing...</Link>
            </div>
            <div style={{display: "grid", gridRow: 3, gridColumn: 3}}>
            <a id="download" download="condignation.png" href="" style={{color: "#00d051"}} onClick={() => {
                    const a = document.getElementById("download")
                    var dataURI = document.getElementById('condignationCanvas').toDataURL();
                    a.href = dataURI;
            }}>Save Condignation</a>
            </div>
      </div>
    );
}

export default DevicesPage;