import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import Devices from '../../components/Devices/Devices'
import './DevicesPage.css'

const DevicesPage = ({change, creationCanvas, parentCreator}) => {
    const creator = parentCreator;

    useEffect(() => {
        if(parentCreator != null) {
            parentCreator.setCanvas(creationCanvas.current)
            change(parentCreator);
        }
    }, []);

    return(
        <div className="devices_container" style={{display: "grid", gridTemplateColumns: "0.5fr 1.5fr 1fr", gridTemplateRows: "repeat(2, 350px)", justifyItems: "left", marginTop: "2%", marginLeft: "5%", marginRight: "10%"}}>
            <div className="tools" style={{display: "grid", gridColumn: 1, gridRow: 1}}>
                <h1>Tools</h1>
                <div className="devices_list">
                    <button className="device_button" onClick={() => creator.addDeviceCommand()}>Add device 1</button>
                    <button className="device_button" onClick={() => creator.addDeviceCommand()}>Add device 2</button>
                    <button className="device_button" onClick={() => creator.moveDeviceCommand()}>Move devices</button>
                    <button className="device_button" onClick={() => creator.undoCommand()}>Undo</button>
                    <button className="device_button" onClick={() => creator.redoCommand()}>Redo</button>
                </div>
            </div>
            <div className="drawingArea" style={{display: "grid", gridColumn: 2, gridRow: 1}}>
                <h2 style={{justifySelf: "center"}}>Kondygnacja numer #01</h2>
                <canvas ref={creationCanvas} id="condignationCanvas" width="600" height="600" style={{border: "1px solid #00d051", borderRadius: "25px"}}></canvas>
            </div>
            <div className="devicesList" style={{display: "grid", gridColumn: 3, gridRow: 1}}>
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