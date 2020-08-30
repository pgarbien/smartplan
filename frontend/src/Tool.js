import React, { useEffect, useState } from 'react';
import './App.css';
import Desc from './Desc'
import {Link} from 'react-router-dom'
import mAxios from './utils/API'
import { useHistory } from "react-router-dom";

const Tool = ({location, setShowAddLevelModal, change, creationCanvas, parentCreator}) => {

  const creator = parentCreator;
  
  const history = useHistory();
  const [activeLevel, setActiveLevel] = useState(0)

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
  }) : null

  const put = () => {
    mAxios.put('/locations', location,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
          console.log("aaaa")
        })
        .catch(error => {
            console.log(error);
        });
  }

  const remove = () => {
    mAxios.delete('/locations/' + location.id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
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
    <div className="tool-container" style={{display: "grid", gridTemplateColumns: "0.4fr 1.5fr 1fr", justifyItems: "left"}}>
        <div className="tools" style={{display: "grid", gridColumn: 1, gridRow: 1}}>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.toggleBackgroundImage()}>Toggle image</button>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.draw()}>Draw</button>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.moveRooms()}>Move rooms</button>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.undoCommand()}>Undo</button>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.redoCommand()}>Redo</button>
        </div>
        <div style={{width: "40vw"}}>
          <div className="drawingArea" style={{display: "grid", gridColumn: 2, gridRow: 1, display: "inline-block"}}>
            <canvas ref={creationCanvas} id="mainCanvas" width="600" height="600" style={{border: "1px solid #00d051"}}></canvas>
          </div>
          <div style={{display: "inline-block", marginBottom: 4, verticalAlign: "bottom", marginLeft: -1}}>
            <div className="level" onClick={() => { setShowAddLevelModal(true) }}>+</div>
            {levelsMapped}
          </div>
        </div>
        <Desc/>
        <div style={{display: "grid", gridRow: 3, gridColumn: 4}}>
          <Link to="/draw/devices" className="btn btn-primary" style={{color: "#00d051"}}>Add devices...</Link>
        </div>
        <div onClick={() => put()}>aaa</div>
        <div onClick={() => remove()}>bbb</div>
      </div>
  );
}

export default Tool;