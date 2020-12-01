import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import mAxios from '../../utils/API';
import { Prompt } from 'react-router'

import LevelsList from '../../components/Levels/LevelsList';
import FullscreenButton from '../../components/Fullscreen/FullscreenButton'
import { Commands, commandsDescription } from '../../tool/commands/Commands';
import NewLevelModal from '../../components/DrawTool/NewLevelModal';
import Level from '../../tool/model/Level';
import ToolDescription from '../../components/ToolDescription/ToolDescription';
import ToolButton from '../../components/ToolButton/ToolButton';
import DeleteLocationModal from '../../components/Locations/DeleteLocationModal';
import DeleteLevelModal from '../../components/DrawTool/DeleteLevelModal';

import '../../new_css/app_css/App.css';
import '../../new_css/tool_css/Tool.css';

const Tool = ({location, setLocation, changeDisplayedLevel, setupCreator, creator}) => {
  const creationCanvas = useRef(null);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [showDeleteLevelModal, setShowDeleteLevelModal] = useState(false);
  const [showDeleteLocationModal, setshowDeleteLocationModal] = useState(false);
  
  const [activeLevel, setActiveLevel] = useState(0);
  const [toolInfo, setToolInfo] = useState(commandsDescription[Commands.DRAW]);
  const [hoverToolInfo, setHoverToolInfo] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [saved, setSaved] = useState(true)

  const post = () => {
    mAxios.post('/locations', location)
        .catch(error => console.log(error));
  }

  const put = () => {
    mAxios.put(`/locations/${location.id}`, location)
        .catch(error => console.log(error));
  }

  const remove = () => {
    mAxios.delete('/locations/' + location.id)
        .catch(error => console.log(error));
  }

  const addNewLevel = (levelName, blueprintUrl) => {
    const preLocation = location; 
    preLocation.levels.push(new Level(null, levelName, blueprintUrl, [], preLocation.levels.length)); 
    setLocation(preLocation);
    setShowAddLevelModal(false);
    put();
  }

  const deleteLevel = (levelName) => {
    const preLocation = location;
    
    let index = preLocation.levels.filter(level => level.name == levelName)[0].order;
    if(index > -1) {
      preLocation.levels.splice(index, 1);

      mAxios.get('/devices?levelId=' + index)
        .then(response => {
          if(response) response.data
            .filter(device => device.levelId == index)
            .map(device => creator.removeDevice(device))
        });

      preLocation.levels.map(level => level.order = preLocation.levels.indexOf(level))

      setLocation(preLocation);
      if(location.levels.length === 0) {
        setShowAddLevelModal(true)
      } else {
        setActiveLevel(location.levels[0].order)
      }
      put();
    }
  }

  const updateRooms = () => {
    location.levels[activeLevel].rooms = creator.getRooms();
    put();
  }

  useEffect(() => {
    if(creationCanvas) setupCreator(creationCanvas.current)
  }, [creationCanvas]);

  useEffect(() => {
    if(location && location.levels.length === 0) setShowAddLevelModal(true);
  }, [location]);

  useEffect(() => {
    if(creator) creator.setCommand(Commands.DRAW);
  }, [creator]);

  return (
    <Fragment>
      <Prompt
        when={!saved}
        message='You have unsaved changes, are you sure you want to leave?'
      />
      <div class="container tool-page">
        <div class="localization-header">
          <div class="left-header-wrapper">
            <h2>Edit <span class="primary_color">{location ? location.name : ""}</span> location:</h2>
            <LevelsList 
                creator={creator} location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} 
                changeDisplayedLevel={changeDisplayedLevel} setShowAddLevelModal={setShowAddLevelModal} setShowDeleteLevelModal={setShowDeleteLevelModal}
            />
          </div>
          <div class="button-header">
            <button class="btn save-button" onClick={() => { if(location.id) updateRooms(); else post(); setSaved(true)  }}>Zapisz zmiany</button>
            <button class="btn delete-button"  onClick={() => { setshowDeleteLocationModal(true) }}>Usuń</button>
          </div>
        </div>
        <div className="tool-page-layout">
          <div className="left-container">
            <div class="tools-col">
              <div class="dots-route shown">
                <ToolButton command={Commands.DRAW} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator}>DR</ToolButton>
                <ToolButton command={Commands.MOVE_ROOMS} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator}>MR</ToolButton>
                <ToolButton command={Commands.TOGGLE} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator}>TI</ToolButton>
                <ToolButton command={Commands.UNDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator}>U</ToolButton>
                <ToolButton command={Commands.REDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator}>R</ToolButton>
              </div>
            </div>
          </div>
          <div className={"drawing-area" + (fullscreen ? " fullscreen" : "")} style={{position: "relative"}}>
              <canvas ref={creationCanvas} id="mainCanvas" class="canvas" onClick={() => { setSaved(false); updateRooms() }}></canvas>
              <FullscreenButton setFullscreen={setFullscreen} fullscreen={fullscreen} />
          </div>
          <div className="right-container">
            <ToolDescription toolInfo={toolInfo} hoverToolInfo={hoverToolInfo}/>
            <div className="right-container-buttons">
              <Link class="directional-button-link" to={location ? "/draw/devices?locationId=" + location.id : "#"} onClick={updateRooms}>
                <div className="directional-button">Add devices &nbsp;&gt;</div>
              </Link>
              <Link class="directional-button-link" to={location ? "/draw/manager?locationId=" + location.id : "#"} onClick={updateRooms}>
                <div className="directional-button">Manage devices &nbsp;&gt;</div>
              </Link> 
            </div>
          </div>
        </div>
      </div>
        { showAddLevelModal ? <NewLevelModal addNewLevel={addNewLevel} setShowModal={setShowAddLevelModal} canClose={location.levels.length > 0} /> : null }
        { showDeleteLevelModal ? <DeleteLevelModal deleteLevel={deleteLevel} levelName={window.event.target.innerHTML} setShowModal={setShowDeleteLevelModal} canClose={true}/> : null }
        { showDeleteLocationModal ? <DeleteLocationModal creator={creator} location={location} setShowModal={setshowDeleteLocationModal}/> : null }
      </Fragment>
  );
}

export default Tool;
