import React, {Fragment, useState} from 'react';
import Modal from '../../components/Modal/Modal';
import '../Locations/NewLocationModal.css';

const NewDeviceModal = (props) => {
    const [deviceName, setDeviceName] = useState(null);
    const [deviceColor, setDeviceColor] = useState(null);

    const modalContent = <Fragment>
        <label for="device-name">Device name: </label>
        <input type="text" id="device-name" name="device-name" placeholder="Device #1" onChange={(event) => { setDeviceName(event.target.value)}}/>
        <input type="text" id="device-name" name="device-name" placeholder="rgba(0, 128,128,128)" onChange={(event) => {setDeviceColor(event.target.value)}}/>
        <br/>
        <button onClick={() => {props.addNewDevice(deviceName, deviceColor)}} disabled={deviceName == null || deviceName === ""}>CREATE</button>
    </Fragment>;

    return (props.showModal ? <Modal title="Add new device" onCloseModal={() => {props.setShowModal(false)}}> {modalContent} </Modal> : null)
}

export default NewDeviceModal;