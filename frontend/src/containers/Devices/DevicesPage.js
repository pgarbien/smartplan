import React, { Fragment, useState, useEffect, useRef, createRef } from 'react';
import { Link } from 'react-router-dom';
import '../../new_css/app_css/App.css';
import '../../new_css/tool_css/Tool.css';
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

    const addNewDevice = (device) => {
        device.point = position;
        device.locationId = location.id;
        device.levelId = activeLevel;
        device.roomId = setRoomId(position);
        creator.addDevice(device.name, device.id, position, device.roomId, device.locationId, device.levelId);
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
        save();
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
            <div class="container tool-page">
                <div class="localization-header">
                    <div class="left-header-wrapper">
                        <h2 class="no-margin-top">Add devices to <span className='color-primary'>{location ? location.name : "your"}</span> location:</h2>
                        <LevelsList creator={creator} location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel} />
                    </div>
                    <div class="button-header no-margin-top">
                        <button class="btn save-button" onClick={() => { save(); }}>Zapisz zmiany</button>
                    </div>
                </div>
                <div class="tool-page-layout">
                    <div className="left-container">
                        <div class="tools-col">
                            <div class="dots-route shown">
                                <ToolButton command={Commands.ADD_DEVICE} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>AD</ToolButton>
                                <ToolButton command={Commands.MOVE_DEVICE} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>MD</ToolButton>
                                <ToolButton command={Commands.TOGGLE} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>TI</ToolButton>
                                <ToolButton command={Commands.UNDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>U</ToolButton>
                                <ToolButton command={Commands.REDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>R</ToolButton>
                            </div>
                        </div>
                    </div>
                    <div class="drawing-area">
                        <canvas ref={creationCanvas} class="canvas" id="condignationCanvas"></canvas>
                    </div>
                    <div class="right-container">
                        <ToolDescription toolInfo={toolInfo} hoverToolInfo={hoverToolInfo}/>
                        <div className="right-container-buttons">
                            <Link class="directional-button-link" to={location ? "/draw?locationId=" + location.id : "#"}>
                                <div className="directional-button">Edit location &nbsp;&gt;</div>
                            </Link>
                            <Link class="directional-button-link" to={location ? "/draw/manager?locationId=" + location.id : "#"}>
                                <div className="directional-button">Manage devices &nbsp;&gt;</div>
                            </Link> 
                        </div>
                    </div>
                </div>
            </div>
        { showAddDeviceModal ? <NewDeviceModal devices={devices} addNewDevice={addNewDevice} setShowModal={setShowAddDeviceModal} canClose={true}/> : null}
      </Fragment>
    );
}

export default DevicesPage;