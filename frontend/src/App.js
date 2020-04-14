import React, { useEffect } from 'react';
import './App.css';
import { Rooms } from './tool/rooms'
import Tool from './Tool'
import { Creator, start, setHighlighted, removeRoom, reset, toggleImage, changeBlueprintImage } from './tool/Creator'

const App = () => {
  useEffect(() => {
    const c = document.getElementsByTagName("canvas");
    const ctx = c[0].getContext("2d");
    const stx = c[1].getContext("2d");
    const img = document.getElementById("bp");

    console.log(Rooms);
    start(c, ctx, stx, img);
  }, []);

  return (
    <div>
      <div className="tool-container">

          <canvas id="mainCanvas" width="600" height="600" style={{border: "1px solid #ccc"}}></canvas>
          <canvas id="secCanvas" width="600" height="600" style={{border: "1px solid #ccc"}}></canvas>

          <br/>
          <button onClick={() => toggleImage()}>Toggle image</button>
          <span id="name"></span>
          <input id="image" value="https://i.pinimg.com/originals/84/f9/71/84f9710dbdc09789ac2534369939a2f3.jpg"/>
          <button onClick={() => changeBlueprintImage()}>Change image</button>
          <button onClick={() => reset()}>Reset</button>
          <div id="list"></div>
          <img id="bp" src="https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg" alt="blueprint" style={{display: "none"}} />
      </div>
      <br/>
      <Tool/>
    </div>
  );
}

export default App;
