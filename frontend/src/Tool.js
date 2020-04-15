import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Rooms } from './tool/data/rooms'
import Creator from './tool/Creator'

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
    <div className="tool-container">
        <canvas ref={creationCanvas} id="mainCanvas" width="600" height="600" style={{border: "1px solid #ccc"}}></canvas>
        <canvas id="secCanvas" width="600" height="600" style={{border: "1px solid #ccc"}}></canvas>

        <br/>

        <button onClick={() => creator.toggleBackgroundImage()}>Toggle image</button>
        <button onClick={() => creator.undoCommand()}>Undo</button>
        <button onClick={() => creator.redoCommand()}>Redo</button>
    </div>
  );
}

export default Tool;
