import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Rooms } from './tool/data/rooms'
import Creator from './tool/Creator'
import Desc from './Desc'
import {Link} from 'react-router-dom'

const Tool = () => {
  const creationCanvas = useRef(null);
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    const creator = new Creator(creationCanvas.current);
    setCreator(creator);

    creator.setBackgroundImage("https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg");
    creator.setRooms(Rooms);
    creator.drawCanvas();
  }, []);

  return (
    <div className="tool-container" style={{display: "grid", gridTemplateColumns: "0.4fr 1.5fr 1fr", gridTemplateRows: "repeat(2, 350px)", justifyItems: "left", marginTop: "2%", marginLeft: "5%", marginRight: "10%"}}>
        <div className="tools" style={{display: "grid", gridColumn: 1, gridRow: 1}}>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.toggleBackgroundImage()}>Toggle image</button>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.draw()}>Draw</button>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.moveRooms()}>Move rooms</button>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.addDeviceCommand()}>Add device</button>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.moveDeviceCommand()}>Move devices</button>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.undoCommand()}>Undo</button>
            <button style={{border: "1px solid #00d051", borderRadius: "15px", height: "70px", width: "70px", backgroundColor: "#ffffff", marginBottom: 10, marginTop: 10}} onClick={() => creator.redoCommand()}>Redo</button>
        </div>
        <div className="drawingArea" style={{display: "grid", gridColumn: 2, gridRow: 1}}>
          <canvas ref={creationCanvas} id="mainCanvas" width="600" height="600" style={{border: "1px solid #00d051", borderRadius: "25px"}}></canvas>
        </div>
        <Desc></Desc>
        <div style={{display: "grid", gridRow: 3, gridColumn: 4}}>
          <Link to="/devices" className="btn btn-primary" style={{color: "#00d051"}}>Add devices...</Link>
        </div>
      </div>
  );
}

export default Tool;
