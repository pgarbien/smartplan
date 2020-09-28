import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './DevicesPage.css';
import '../../App.css';

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
        <div className="devices-container">
            <div className="tools">
                <h1>Tools</h1>
                <div className="tools">
                    <button className="device_button" onClick={() => setShowAddDeviceModal(true)}>Add device 1</button>
                    <button className="device_button" onClick={() => setShowAddDeviceModal(true)}>Add device 2</button>
                    <button className="device_button" onClick={() => creator.moveDeviceCommand()}>Move devices</button>
                    <button className="device_button" onClick={() => creator.undoCommand()}>Undo</button>
                    <button className="device_button" onClick={() => creator.redoCommand()}>Redo</button>
                </div>
            </div>
            <div className="drawing-area">
                <h2 style={{justifySelf: "center"}}>Kondygnacja numer #01</h2>
                <canvas className="canvas" ref={creationCanvas} id="condignationCanvas" height="600" width="600"></canvas>
            </div>
            <div className="buttons">
                <Link to="/draw" className="directional-button">Go back to drawing...</Link>
                <br/>
                <Link className="directional-button" to="/draw/manager">Manage devices</Link> 
                <a className="directional-button" id="download" download="condignation.png" href="" onClick={() => {
                        const a = document.getElementById("download")
                        var dataURI = document.getElementById('condignationCanvas').toDataURL();
                        a.href = dataURI;
                }}>Save Condignation</a>
            </div>
      </div>
    );
}

export default DevicesPage;