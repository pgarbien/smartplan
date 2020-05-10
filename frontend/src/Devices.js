import React, {useState, useEffect} from 'react';
import axios from './utils/API'

const Devices = () => {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        axios.get('/channels')
            .then(response => {
                setDevices(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <h1>Your devices: </h1>
            <ul>
                {devices.length > 0 ? devices.map(device => (
                    <li>
                        ID{device.id} name: {device.caption}
                    </li>
                )) : "No devices"}
            </ul>
        </div>
    );
};

export default Devices
