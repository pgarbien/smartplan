import React from 'react';

const Devices = ({ activeDevices, manageDevice, creator }) => {

    function handleDeviceInListClick(event) {
        console.log(event.target.innerHTML);
    }

    return (
        <div>
            <h2>Your devices: </h2>
            <ul className="active-devices" onClick={handleDeviceInListClick}>
                { activeDevices.map(device => (
                    <li className="active-device" key={device.name} 
                        onClick={() => { manageDevice(device) }}
                        onMouseEnter={() => { creator.highlightedDevice = device.id; creator.drawCanvas() }}
                        onMouseLeave={() => { creator.highlightedDevice = null; creator.drawCanvas() }}>
                        {device.name}
                    </li>
                )) }
            </ul>
        </div>
    );
};

export default Devices;
