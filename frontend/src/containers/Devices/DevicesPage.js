import React, { Fragment, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './DevicesPage.css';
import '../../App.css';
import LevelsList from '../../components/Levels/LevelsList';
import { Commands } from '../../tool/commands/Commands';

const DevicesPage = ({location, changeDisplayedLevel, setShowAddDeviceModal, setupCreator, parentCreator}) => {
    const creator = parentCreator;
    const creationCanvas = useRef(null);

    const downloadImage = () => {
        const a = document.getElementById("download")
        var dataURI = document.getElementById('condignationCanvas').toDataURL();
        a.href = dataURI;
    }

    const addDevice = (position) => {
        setShowAddDeviceModal(true)
    }

    useEffect(() => {
        if(parentCreator) {
            if(creationCanvas) setupCreator(creationCanvas.current);
            parentCreator.setCallback('click', addDevice);
        }
    }, [creationCanvas, parentCreator]);

    return(
        <Fragment>
        <h2>Add devices to <span className='color-primary'>{location ? location.name : "your"}</span> location:</h2>
        <div className="devices-container">
            <div className="left-container">
                <div className="tools">
                    <button className="tool-button" onClick={() => creator.setCommand(Commands.ADD_DEVICE)}>Add device</button>
                    <button className="tool-button" onClick={() => creator.setCommand(Commands.ADD_DEVICE)}>Move devices</button>
                    <button className="tool-button" onClick={() => creator.undoCommand()}>Undo</button>
                    <button className="tool-button" onClick={() => creator.redoCommand()}>Redo</button>
                </div>
                <LevelsList location={location} changeDisplayedLevel={changeDisplayedLevel} />
            </div>
            <div className="drawing-area">
                <canvas ref={creationCanvas} className="canvas" id="condignationCanvas" height="600" width="600"></canvas>
            </div>
            <div className="right-container">
                <div className="buttons">
                    <div className="directional-button">
                        <a className="directional-button" id="download" download="condignation.png" href="" onClick={() => { downloadImage() }}>Save Condignation</a>
                    </div>
                    <div className="directional-button">
                        <Link to={location ? "/draw?locationId=" + location.id : "#"} className="directional-button">Edit location &nbsp;&gt;</Link>
                    </div>
                    <div className="directional-button">
                        <Link className="directional-button" to={location ? "/draw/manager?locationId=" + location.id : "#"}>Manage devices &nbsp;&gt;</Link> 
                    </div>
                </div>
            </div>
      </div>
      </Fragment>
    );
}

export default DevicesPage;