import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../new_css/app_css/App.css';
import '../../new_css/tool_css/Tool.css';
import FullscreenButton from '../../components/Fullscreen/Fullscreen'
import LevelsList from '../../components/Levels/LevelsList';
import { Commands, commandsDescription } from '../../tool/commands/Commands';
import NewDeviceModal from '../../components/Devices/NewDeviceModal';
import ToolDescription from '../../components/ToolDescription/ToolDescription';
import ToolButton from '../../components/ToolButton/ToolButton';
import mAxios from '../../utils/API';
import {useTranslation} from "react-i18next";

const DevicesPage = ({location, changeDisplayedLevel, setupCreator, creator, language}) => {
    const {t, i18n} = useTranslation('main');
    const creationCanvas = useRef(null);
    const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
    const [position, setPosition] = useState(null);
    const [activeLevel, setActiveLevel] = useState(0);
    const [toolInfo, setToolInfo] = useState(commandsDescription[language][Commands.ADD_DEVICE]);
    const [hoverToolInfo, setHoverToolInfo] = useState(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [toggleImage, setToggleImage] = useState('/toggleImageOff.svg');

    const save = () => {
        const addedDevices = creator.getAddedDevices().map(device => {
            return { id: device.id, point: device.point }
        });
        mAxios.put('/devices', addedDevices)
            .catch(error => console.log(error));
    }

     const addNewDevice = (device) => {
        const levelId = location.levels[activeLevel].id
        device.point = position;
        device.locationId = location.id;
        device.levelId = levelId;
        device.roomId = setRoomId(position);
        creator.addDevice(device.name, device.id, position, device.roomId, device.locationId, device.levelId);
        mAxios.get('/devices?levelId=' + levelId)
            .then(response => {
                creator.setAddedDevices(response.data.filter(device => device.locationId == location.id));
                creator.refresh();
            })
            .catch(error => console.log(error));
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
        if(creator) {
            creator.setCommand(Commands.ADD_DEVICE);
            creator.setCallback('click', addDevice);
        }
    }, [creator]);

    return(
        <Fragment>
            <div class="body-container tool-page">
                <div class="localization-header">
                    <div class="left-header-wrapper">
                        <h2>{t('addDevices.titleBeginning')} <span class="primary_color">{location ? location.name : "your"}</span>{t('addDevices.titleEnding')}</h2>
                        <LevelsList location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel} />
                    </div>
                    <div class="button-header no-margin-top">
                        <div className="tools-button" onClick={() => save()} style={{display: "inline-block"}}>{t('popups.save')}</div>
                        <div className="tools-button" onClick={() => alert("Not available yet!")} style={{opacity: 0.5}}>{t('popups.autosave')} &nbsp;<div style={{height: 10, width: 10, background: "#ff0000", borderRadius: 10, display: "inline-block"}}></div></div>
                    </div>
                </div>
                <div class="tool-page-layout">
                    <div className="left-container">
                        <div class="tools-col">
                            <div class="dots-route shown">
                                <ToolButton command={Commands.ADD_DEVICE} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator} language={language}>
                                    <img src="/addDevice.svg" style={{display: "block", marginLeft: "auto", marginRight: "auto", width:"100%"}}/>
                                </ToolButton>
                                <ToolButton command={Commands.MOVE_DEVICE} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator} language={language}>
                                <img src="/moveDevice.svg" style={{display: "block", marginLeft: "auto", marginRight: "auto", width:"100%"}}/>
                                </ToolButton>
                                <ToolButton command={Commands.TOGGLE} setToggleImage={setToggleImage} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator} language={language}>
                                    <img 
                                        src={toggleImage} 
                                        style={{display: "block", marginLeft: "auto", marginRight: "auto", width:"100%"}}/>
                                </ToolButton>
                                <ToolButton command={Commands.UNDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator} language={language}>
                                    <img src="/undo.svg" style={{display: "block", marginLeft: "auto", marginRight: "auto", height:"70%"}}/>
                                </ToolButton>
                                <ToolButton command={Commands.REDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator} language={language}>
                                    <img src="/redo.svg" style={{display: "block", marginLeft: "auto", marginRight: "auto", height:"70%"}}/>
                                </ToolButton>
                            </div>
                        </div>
                    </div>
                    <div className={"drawing-area" + (fullscreen ? " fullscreen" : "")} style={{position: "relative"}}>
                        <canvas ref={creationCanvas} class="canvas" id="condignationCanvas"></canvas>
                        <FullscreenButton setFullscreen={setFullscreen} fullscreen={fullscreen} location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel}/>
                    </div>
                    <div class="right-container">
                        <ToolDescription toolInfo={toolInfo} hoverToolInfo={hoverToolInfo}/>
                        <div className="right-container-buttons">
                            <Link class="directional-button-link" to={location ? "/draw?locationId=" + location.id : "#"}>
                                <div className="directional-button">{t('tool.editLocation')} &nbsp;&gt;</div>
                            </Link>
                            <Link class="directional-button-link" to={location ? "/draw/manager?locationId=" + location.id : "#"}>
                                <div className="directional-button">{t('tool.manageDevices')} &nbsp;&gt;</div>
                            </Link> 
                        </div>
                    </div>
                </div>
            </div>
        { showAddDeviceModal ? <NewDeviceModal addNewDevice={addNewDevice} setShowModal={setShowAddDeviceModal} canClose={true}/> : null}
      </Fragment>
    );
}

export default DevicesPage;