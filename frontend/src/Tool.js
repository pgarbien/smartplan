import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Rooms } from './tool/rooms'
import Creator, { start, setHighlighted, removeRoom, reset, toggleImage, changeBlueprintImage } from './tool/Creator'

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
        <span id="name"></span>
        <input id="image" value="https://i.pinimg.com/originals/84/f9/71/84f9710dbdc09789ac2534369939a2f3.jpg"/>
        <button onClick={() => changeBlueprintImage()}>Change image</button>
        <button onClick={() => reset()}>Reset</button>
        <div id="list"></div>
        <img id="bp" src="https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg" alt="blueprint" style={{display: "none"}} />
    </div>
  );
}

export default Tool;
