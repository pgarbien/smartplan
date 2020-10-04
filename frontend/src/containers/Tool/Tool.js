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

const Tool = ({location, setLocation, changeDisplayedLevel, setupCreator, parentCreator}) => {
  const creator = parentCreator;
  const creationCanvas = useRef(null);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  
  const [toolInfo, setToolInfo] = useState(commandsDescription['draw']);
  const [hoverToolInfo, setHoverToolInfo] = useState(null);

  const post = () => {
    mAxios.post('/locations', location)
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
  }

  useEffect(() => {
    if(creationCanvas) setupCreator(creationCanvas.current)
  }, [creationCanvas]);

  useEffect(() => {
    if(location && location.levels.length === 0) setShowAddLevelModal(true);
  }, [location]);

  useEffect(() => {
    if(parentCreator)  parentCreator.setCommand(Commands.DRAW);
  }, [parentCreator]);

  return (
    <Fragment>
      <h2>Edit <span className='color-primary'>{location ? location.name : "your"}</span> location:</h2>
      <div className="tool-container">
          <div className="left-container">
            <div className="tools">
                <button className="tool-button" 
                  onClick={() => creator.toggleBackgroundImage() }
                  onMouseEnter={() => setHoverToolInfo(commandsDescription['toggle'])}
                  onMouseLeave={() => setHoverToolInfo(null)}>Toggle image</button>
                <button className={"tool-button" + (toolInfo ? toolInfo.name === 'Draw' ? " tool-button-active" : "" : "")} 
                  onClick={() => { creator.setCommand(Commands.DRAW); setToolInfo(commandsDescription['draw']) }}
                  onMouseEnter={() => setHoverToolInfo(commandsDescription['draw'])}
                  onMouseLeave={() => setHoverToolInfo(null)}>Draw</button>
                <button className={"tool-button" + (toolInfo ? toolInfo.name === 'Move' ? " tool-button-active" : "" : "")}
                  onClick={() => { creator.setCommand(Commands.MOVE_ROOMS); setToolInfo(commandsDescription['move']) }}
                  onMouseEnter={() => setHoverToolInfo(commandsDescription['move'])}
                  onMouseLeave={() => setHoverToolInfo(null)}>Move rooms</button>
                <button className="tool-button" 
                  onClick={() => creator.undoCommand()}
                  onMouseEnter={() => setHoverToolInfo(commandsDescription['undo'])}
                  onMouseLeave={() => setHoverToolInfo(null)}>Undo</button>
                <button className="tool-button" 
                  onClick={() => creator.redoCommand()}
                  onMouseEnter={() => setHoverToolInfo(commandsDescription['redo'])}
                  onMouseLeave={() => setHoverToolInfo(null)}>Redo</button>
            </div>
            <LevelsList location={location} changeDisplayedLevel={changeDisplayedLevel} setShowAddLevelModal={setShowAddLevelModal} />
          </div>
          <div className="drawing-area">
            <canvas ref={creationCanvas} id="mainCanvas" className="canvas" width="600" height="600"></canvas>
          </div>
          <div className="right-container">
            <ToolDescription toolInfo={toolInfo} hoverToolInfo={hoverToolInfo}/>
            <div className="buttons">
              <div className="directional-button" onClick={() => { post() }}>Save</div>
              <div className="directional-button" onClick={() => { remove() }}>Delete</div>
              <div className="directional-button">
                <Link className="devices-link" to={location ? "/draw/devices?locationId=" + location.id : "#"}>Add devices &nbsp;&gt;</Link>
              </div>
              <div className="directional-button">
                  <Link className="directional-button" to={location ? "/draw/manager?locationId=" + location.id : "#"}>Manage devices &nbsp;&gt;</Link> 
              </div>
            </div>
          </div>
        </div>
        { showAddLevelModal ? <NewLevelModal addNewLevel={addNewLevel} setShowModal={setShowAddLevelModal} canClose={location.levels.length > 0} /> : null }
      </Fragment>
  );
}

export default Tool;
