import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import mAxios from '../../utils/API';

import LevelsList from '../../components/Levels/LevelsList';
import '../../App.css';
import './Tool.css';
import { Commands, commandsDescription } from '../../tool/commands/Commands';
import NewLevelModal from '../../components/DrawTool/NewLevelModal';
import Level from '../../tool/model/Level';
import ToolDescription from '../../components/ToolDescription/ToolDescription';
import ToolButton from '../../components/ToolButton/ToolButton';
import DeleteLocationModal from '../../components/Locations/DeleteLocationModal';
import DeleteLevelModal from '../../components/DrawTool/DeleteLevelModal';

const Tool = ({location, setLocation, changeDisplayedLevel, setupCreator, parentCreator}) => {
  const creationCanvas = useRef(null);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [showDeleteLevelModal, setShowDeleteLevelModal] = useState(false);
  const [showDeleteLocationModal, setshowDeleteLocationModal] = useState(false);
  
  const [activeLevel, setActiveLevel] = useState(0);
  const [toolInfo, setToolInfo] = useState(commandsDescription[Commands.DRAW]);
  const [hoverToolInfo, setHoverToolInfo] = useState(null);

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
      preLocation.levels.splice(index,1);

      mAxios.get('/devices?levelId=' + index)
        .then(response => {
          response.data.filter(device => device.levelId == index).map(device => {console.log(device.name); parentCreator.removeDevice(device)})
        });

      preLocation.levels.map(level => level.order = preLocation.levels.indexOf(level))

      setLocation(preLocation);
      setActiveLevel(location.levels[0].order)
      put();
    }
  }

  const updateRooms = () => {
    location.levels[activeLevel].rooms = parentCreator.getRooms();
    put();
  }

  useEffect(() => {
    if(creationCanvas) setupCreator(creationCanvas.current)
  }, [creationCanvas]);

  useEffect(() => {
    if(location && location.levels.length === 0) setShowAddLevelModal(true);
  }, [location]);

  useEffect(() => {
    if(parentCreator) parentCreator.setCommand(Commands.DRAW);
  }, [parentCreator]);

  return (
    <Fragment>
      <h2>Edit <span className='color-primary'>{location ? location.name : "your"}</span> location:</h2>
      <div className="tool-container">
          <div className="left-container">
            <div className="tools">
              <ToolButton command={Commands.TOGGLE} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>Toggle image</ToolButton>
              <ToolButton command={Commands.DRAW} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>Draw rooms</ToolButton>
              <ToolButton command={Commands.MOVE_ROOMS} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>Move rooms</ToolButton>
              <ToolButton command={Commands.UNDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>Undo</ToolButton>
              <ToolButton command={Commands.REDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={parentCreator}>Redo</ToolButton>
            </div>
            <LevelsList 
              creator={parentCreator} location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} 
              changeDisplayedLevel={changeDisplayedLevel} setShowAddLevelModal={setShowAddLevelModal} setShowDeleteLevelModal={setShowDeleteLevelModal}
            />
          </div>
          <div className="drawing-area">
            <canvas ref={creationCanvas} id="mainCanvas" className="canvas" width="600" height="600" onClick={() => { updateRooms() }}></canvas>
          </div>
          <div className="right-container">
            <ToolDescription toolInfo={toolInfo} hoverToolInfo={hoverToolInfo}/>
            <div className="buttons">
              <div className="directional-button" onClick={() => { if(location.id) updateRooms(); else post();  }}>Save</div>
              <div className="directional-button" onClick={() => { setshowDeleteLocationModal(true) }}>Delete</div>
              <Link to={location ? "/draw/devices?locationId=" + location.id : "#"} onClick={updateRooms}>
                <div className="directional-button">Add devices &nbsp;&gt;</div>
              </Link>
              <Link to={location ? "/draw/manager?locationId=" + location.id : "#"} onClick={updateRooms}>
                <div className="directional-button">Manage devices &nbsp;&gt;</div>
              </Link> 
            </div>
          </div>
        </div>
        { showAddLevelModal ? <NewLevelModal addNewLevel={addNewLevel} setShowModal={setShowAddLevelModal} canClose={location.levels.length > 0} /> : null }
        { showDeleteLevelModal ? <DeleteLevelModal deleteLevel={deleteLevel} levelName={window.event.target.innerHTML} setShowModal={setShowDeleteLevelModal} canClose={true}/> : null }
        { showDeleteLocationModal ? <DeleteLocationModal location={location} setShowModal={setshowDeleteLocationModal}/> : null }
      </Fragment>
  );
}

export default Tool;
