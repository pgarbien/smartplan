import React, { useEffect, useState } from 'react';
import './App.css';
import Desc from './Desc';
import {Link} from 'react-router-dom';
import mAxios from './utils/API';
import { useHistory } from "react-router-dom";
import './Tool.css';

const Tool = ({location, setShowAddLevelModal, change, creationCanvas, parentCreator}) => {
  const creator = parentCreator;
  
  const history = useHistory();
  const [activeLevel, setActiveLevel] = useState(0);

  const levelsMapped = location && location.levels ? location.levels.slice(0).reverse().map(level => {
    return <div className={"level " + ((level.order === activeLevel) ? "level-active" : "")} onClick={() => { 
      const prevLevel =location.levels.find(level => level.order === activeLevel)
      prevLevel.rooms = creator.getRooms();
      if(level.blueprintUrl != null) {
          creator.setBackgroundImage(level.blueprintUrl);
      }
      creator.setRooms(level.rooms); 
      creator.drawCanvas(); 
      setActiveLevel(level.order) 
    }}>{level.name}</div>
  }) : null;

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
    <div className="tool-container">
        <div className="tools">
            <button className="tool-button" onClick={() => creator.toggleBackgroundImage()}>Toggle image</button>
            <button className="tool-button" onClick={() => creator.draw()}>Draw</button>
            <button className="tool-button" onClick={() => creator.moveRooms()}>Move rooms</button>
            <button className="tool-button" onClick={() => creator.undoCommand()}>Undo</button>
            <button className="tool-button" onClick={() => creator.redoCommand()}>Redo</button>
        </div>
        <div className="canvas-area">
          <div className="drawing-area">
            <canvas ref={creationCanvas} id="mainCanvas" width="600" height="600" style={{border: "1px solid #00d051"}}></canvas>
          </div>
          <div className="levels">
            <div className="level" onClick={() => { setShowAddLevelModal(true) }}>+</div>
            {levelsMapped}
          </div>
        </div>
        <Desc/>
        <div className="buttons">
          <div className="directional-button" onClick={() => { put() }}>Save</div>
          <div className="directional-button" onClick={() => { remove() }}>Delete</div>
          <div className="directional-button">
          <Link className="devices-link" to="/draw/devices">Add devices...</Link>
          </div>
        </div>
      </div>
  );
}

export default Tool;
