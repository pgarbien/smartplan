import React, { Component, useEffect, useState } from 'react';
import mAxios from '../../utils/API';

const Devices = ({ activeLevel, activeDevices, manageDevice, creator }) => {
    const [devices, setDevices] = useState(activeDevices)

    function handleDeviceInListClick(event) {
        console.log(event.target.innerHTML);
    }

    useEffect(() => {
        mAxios.get('/devices?levelId=' + activeLevel)
            .then(response => {
                setDevices(response.data);
            });
    }, [activeLevel]);

    return (
        <div>
            <h2>Your devices: </h2>
            <ul className="active-devices" onClick={handleDeviceInListClick}>
                {  devices.map(device => (
                    <li className="active-device" key={device.name} 
                        onClick={() => { manageDevice(device) }}
                        onMouseEnter={() => { creator.highlightedDevice = device.id; creator.refresh() }}
                        onMouseLeave={() => { creator.highlightedDevice = null; creator.refresh() }}>
                        {device.name}
                    </li>
                )) }
            </ul>
        </div>
    );
};

export default Devices;
