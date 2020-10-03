import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import mAxios from '../../utils/API';

import LevelsList from '../../components/Levels/LevelsList';
import '../../App.css';
import './Tool.css';

const toolsInfos = {
  "toggle": {
    name: "Toggle",
    description: "Toggles background blueprint visibility (if any photo uploaded)."
  },
  "draw": {
    name: "Draw",
    description: "LPM: Add new room point <br/>LPM (on begining point): Finish room <br/>RPM (on room): Delete selected room <br/> RPM (while building): Remove added room point <br/>"
  },
  "move": {
    name: "Move",
    description: "LPM drag (on room): Move selected room <br/>LPM drag (on wall): Move selected wall <br/>LPM drag (on point): Move selected point <br/>"
  },
  "undo": {
    name: "Undo",
    description: "Undoes the last performed action."
  },
  "redo": {
    name: "Redo",
    description: "Redoes the last performed action."
  }
}

const Tool = ({location, setShowAddLevelModal, change, creationCanvas, parentCreator}) => {
  const creator = parentCreator;
  
  const history = useHistory();
  const [activeLevel, setActiveLevel] = useState(0);
  const [toolInfo, setToolInfo] = useState(toolsInfos['draw']);
  const [tmpToolInfo, setTmpToolInfo] = useState(null);
  
  const changeDisplayedLevel = (level) => {
    location.levels.find(level => level.order === activeLevel).rooms = creator.getRooms();
    creator.setBackgroundImage(level.blueprintUrl);
    creator.setRooms(level.rooms); 
    creator.drawCanvas(); 
    setActiveLevel(level.order) 
  }

  const put = () => {
      console.log(location);
      mAxios.post('/locations', location)
          .then(response => {
              console.log("aaaa")
          })
          .catch(error => {
              console.log(error);
          });
  }

  const remove = () => {
      mAxios.delete('/locations/' + location.id)
          .then(response => {
              history.push('locations')
          })
          .catch(error => {
              console.log(error);
          });
  }

  useEffect(() => {
    if(parentCreator != null) {
      parentCreator.setCanvas(creationCanvas.current);
      change(parentCreator);
    }
  }, []);

  return (
    <Fragment>
      <h2>Edit <span className='color-primary'>{location ? location.name : "your"}</span> location:</h2>
      <div className="tool-container">
          <div className="left-container">
            <div className="tools">
                <button className="tool-button" 
                  onClick={() => creator.toggleBackgroundImage() }
                  onMouseEnter={() => setTmpToolInfo(toolsInfos['toggle'])}
                  onMouseLeave={() => setTmpToolInfo(null)}>Toggle image</button>
                <button className={"tool-button" + (toolInfo ? toolInfo.name === 'Draw' ? " tool-button-active" : "" : "")} 
                  onClick={() => { creator.draw(); setToolInfo(toolsInfos['draw']) }}
                  onMouseEnter={() => setTmpToolInfo(toolsInfos['draw'])}
                  onMouseLeave={() => setTmpToolInfo(null)}>Draw</button>
                <button className={"tool-button" + (toolInfo ? toolInfo.name === 'Move' ? " tool-button-active" : "" : "")}
                  onClick={() => { creator.moveRooms(); setToolInfo(toolsInfos['move']) }}
                  onMouseEnter={() => setTmpToolInfo(toolsInfos['move'])}
                  onMouseLeave={() => setTmpToolInfo(null)}>Move rooms</button>
                <button className="tool-button" 
                  onClick={() => creator.undoCommand()}
                  onMouseEnter={() => setTmpToolInfo(toolsInfos['undo'])}
                  onMouseLeave={() => setTmpToolInfo(null)}>Undo</button>
                <button className="tool-button" 
                  onClick={() => creator.redoCommand()}
                  onMouseEnter={() => setTmpToolInfo(toolsInfos['redo'])}
                  onMouseLeave={() => setTmpToolInfo(null)}>Redo</button>
            </div>
            <LevelsList location={location} activeLevel={activeLevel} changeDisplayedLevel={changeDisplayedLevel} setShowAddLevelModal={setShowAddLevelModal} />
          </div>
          <div className="drawing-area">
            <canvas ref={creationCanvas} id="mainCanvas" className="canvas" width="600" height="600"></canvas>
          </div>
          <div className="right-container">
            <div className="description" style={ tmpToolInfo ? {width: "200%"} : {}}>
              <h3>{toolInfo ? tmpToolInfo ? tmpToolInfo.name : toolInfo.name : ""} tool</h3>
              <p dangerouslySetInnerHTML={{ __html: toolInfo ? tmpToolInfo ? tmpToolInfo.description : toolInfo.description : "" }} >
              </p>
            </div>
            <div className="buttons">
              <div className="directional-button" onClick={() => { put() }}>Save</div>
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
      </Fragment>
  );
}

export default Tool;
