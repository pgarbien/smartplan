import React, { Component, useEffect, useState } from 'react';
import mAxios from '../../utils/API';
import '../../new_css/levels_list_css/LevelsList.css';
import '../../new_css/devices_css/Devices.css';

const Devices = ({ location, activeLevel, activeDevices, manageDevice, creator }) => {
    const [devices, setDevices] = useState(activeDevices);

    useEffect(() => {
        mAxios.get('/devices?levelId=' + activeLevel)
            .then(response => {
                setDevices(response.data.filter(dev => dev.locationId == location.id));
            });
    }, [activeLevel]);

    return (
        <div>
            <h2>Your devices: </h2>
            <div class="dropdown">
                <button class="drop-btn"> Wszystkie <span class="caret"/> </button>
                <div class="dropdown-content active-devices">
                    {  devices.map(device => (
                        <div className="level" key={device.name} 
                            onClick={() => { manageDevice(device) }}
                            onMouseEnter={() => { creator.highlightedDevice = device.id; creator.drawCanvas() }}
                            onMouseLeave={() => { creator.highlightedDevice = null; creator.drawCanvas() }}>
                            {device.name}
                        </div>
                    )) }
                </div>
            </div>
        </div>
    );
};

export default Devices;
