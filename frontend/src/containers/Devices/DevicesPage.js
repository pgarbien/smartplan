import React, { Fragment, useState, useEffect, useRef, createRef } from 'react';
import { Link } from 'react-router-dom';
import './DevicesPage.css';
import '../../App.css';
import LevelsList from '../../components/Levels/LevelsList';
import { Commands, commandsDescription } from '../../tool/commands/Commands';
import NewDeviceModal from '../../components/Devices/NewDeviceModal';
import ToolDescription from '../../components/ToolDescription/ToolDescription';
import ToolButton from '../../components/ToolButton/ToolButton';
import mAxios from '../../utils/API';

const DevicesPage = ({location, devices, setDevices, changeDisplayedLevel, setupCreator, parentCreator}) => {
    const creator = parentCreator;
    const creationCanvas = useRef(null);
    const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
    const [position, setPosition] = useState(null);
    const [activeLevel, setActiveLevel] = useState(0);
    const [toolInfo, setToolInfo] = useState(commandsDescription[Commands.ADD_DEVICE]);
    const [hoverToolInfo, setHoverToolInfo] = useState(null);

    const save = () => {
        devices = setDevices(creator.getDevices());
        const addedDevices = creator.getAddedDevices();
        mAxios.put('/devices', addedDevices)
            .catch(error => console.log(error));
    }

    const addNewDevice = (device, color) => {
        device.point = position;
        device.color = color;
        device.locationId = location.id;
        device.levelId = activeLevel;
        device.roomId = setRoomId(position);
        creator.addDevice(device.name, color, device.id, position, device.roomId, device.locationId, device.levelId);
        setShowAddDeviceModal(false);
    }

    function setRoomId(position) {
        let roomId = null;
        let activeLvl = null
        location.levels.map(level => {
            if(activeLevel == level.order) {
                activeLvl = level;
            }
        });
        if (activeLvl.rooms) {
            activeLvl.rooms.map(room => {
                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                room.points.map(point => {
                    minX = point.x < minX ? point.x : minX;
                    maxX = point.x > maxX ? point.x : maxX;
                    minY = point.y < minY ? point.y : minY;
                    maxY = point.y > maxY ? point.y : maxY;
                
                });
                if(position.x > minX && position.x < maxX && position.y > minY && position.y < maxY){
                    roomId = room.id;
                }
            });
        }

        return roomId;
    }

    const addDevice = (position) => {
        setPosition(position);
        setShowAddDeviceModal(true);
    }

    useEffect(() => {
        if(creationCanvas) setupCreator(creationCanvas.current)
    }, [creationCanvas]);

    useEffect(() => {
        if(parentCreator) {
            parentCreator.setCommand(Commands.ADD_DEVICE);
            parentCreator.setCallback('click', addDevice);
        }
    }, [parentCreator]);

    return(
        <Fragment>
            <h2>Add devices to <span className='color-primary'>{location ? location.name : "your"}</span> location:</h2>
            <div className="devices-container">
                <div className="left-container">
                    <div className="tools">
                        <ToolButton command={Commands.TOGGLE} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>Toggle image</ToolButton>
                        <ToolButton command={Commands.ADD_DEVICE} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>Add device</ToolButton>
                        <ToolButton command={Commands.MOVE_DEVICE} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>Move devices</ToolButton>
                        <ToolButton command={Commands.UNDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>Undo</ToolButton>
                        <ToolButton command={Commands.REDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>Redo</ToolButton>
                    </div>
                    <LevelsList location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel} />
                </div>
                <div className="drawing-area">
                    <canvas ref={creationCanvas} className="canvas" id="condignationCanvas" height="600" width="600"></canvas>
                </div>
                <div className="right-container">
                    <ToolDescription toolInfo={toolInfo} hoverToolInfo={hoverToolInfo}/>
                    <div className="buttons">
                        <div className="directional-button">
                            <a onClick={() => { save() }}>Save Condignation</a>
                        </div>
                        <div className="directional-button">
                            <Link to={location ? "/draw?locationId=" + location.id : "#"}>Edit location &nbsp;&gt;</Link>
                        </div>
                        <div className="directional-button">
                            <Link to={location ? "/draw/manager?locationId=" + location.id : "#"}>Manage devices &nbsp;&gt;</Link> 
                        </div>
                    </div>
                </div>
        </div>
        { showAddDeviceModal ? <NewDeviceModal devices={devices} addNewDevice={addNewDevice} setShowModal={setShowAddDeviceModal} canClose={true}/> : null}
      </Fragment>
    );
}

export default DevicesPage;