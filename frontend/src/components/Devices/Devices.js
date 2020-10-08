import React, {useState, useEffect} from 'react';
import mAxios from '../../utils/API';

const Devices = ({creator}) => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        if(creator) {
            setDevices(creator.getAddedDevices());
        }
    }, [creator]);

    function handleDeviceInListClick(event) {
        console.log(event.target.innerHTML);
    }

    return (
        <div>
            <h2>Your devices: </h2>
            <ul style={{border: "1px solid #00d051", margin: 15, padding: 10, listStyleType: "none"}} onClick={handleDeviceInListClick}>
                {devices.map(device => (
                    <li key={device.name} style={{margin: 10, padding: 10, borderBottom: "1px solid #00d051"}}>
                        {device.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Devices;
