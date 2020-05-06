import React from 'react';
import { Link } from 'react-router-dom'
import Devices from './Devices'

const DevicesPage = () => {
    return(
        <div className="devices-container" style={{display: "grid", gridTemplateColumns: "0.5fr 1.5fr 1fr", gridTemplateRows: "repeat(2, 350px)", justifyItems: "left", marginTop: "2%", marginLeft: "5%", marginRight: "10%"}}>
        <div className="tools" style={{display: "grid", gridColumn: 1, gridRow: 1}}>
            <h1>Tools</h1>
        </div>
        <div className="drawingArea" style={{display: "grid", gridColumn: 2, gridRow: 1}}>
            <h2 style={{justifySelf: "center"}}>Kondygnacja number #01</h2>
            <canvas id="mainCanvas" width="600" height="600" style={{border: "1px solid #00d051", borderRadius: "25px"}}></canvas>
        </div>
        <div className="devicesList" style={{display: "grid", gridColumn: 3, gridRow: 1}}>
            <Devices/>
        </div>
        <div style={{display: "grid", gridRow: 3, gridColumn: 1}}>
          <Link to="/" className="btn btn-primary" style={{color: "#00d051"}}>Go back to drawing...</Link>
        </div>
      </div>
    );
}

export default DevicesPage;