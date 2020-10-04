import React, {Fragment, useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Modal from '../../components/Modal/Modal';
import '../Locations/NewLocationModal.css';
import mAxios from '../../utils/API';

const NewDeviceModal = (props) => {
    const [deviceName, setDeviceName] = useState(null);
    const [deviceColor, setDeviceColor] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [deviceActions, setDeviceActions] = useState([]);
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        mAxios.get('/channels', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            setDevices(response.data)
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    const setDeviceParameters = (event) => {
        let parameters = event.target.value.split(',');
        setDeviceName(parameters[1]);
        setDeviceId(parameters[0]);
        for(var i=0; i<devices.length; i++) {
            if(devices[i].id == parameters[0]) {
                setDeviceActions(devices[i].function.possibleActions)
            }
        }
    }

    const modalContent = 
        <Fragment>
            <select onChange={(event) => {setDeviceParameters(event)}}>
                {devices.map(device => (
                    <option>
                        {device.id},{device.caption}
                    </option>
                ))}
            </select>
            <br/>
            <input type="text" id="device-name" name="device-name" placeholder="rgba(0, 128, 128, 128)" onChange={(event) => {setDeviceColor(event.target.value)}}></input>
            <button className="create-button" onClick={() => {props.addNewDevice(deviceName, deviceColor, deviceId, deviceActions)}}>CREATE</button>
        </Fragment>;

    return (props.showModal ? <Modal title="Add new device" canClose={props.canClose} onCloseModal={() => {props.setShowModal(false)}}> {modalContent} </Modal> : null)
}

export default NewDeviceModal;