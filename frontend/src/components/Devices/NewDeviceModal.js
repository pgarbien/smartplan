import React, {Fragment, useState} from 'react';
import Modal from '../../components/Modal/Modal';
import '../Locations/NewLocationModal.css';

const NewDeviceModal = (props) => {
    const [deviceColor, setDeviceColor] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0); 

    const styless = {width: "max-content", transition: "ease .5s", transform: "translateX(" + scrollPosition * -50 + "%" }
    
    const mappedDevices = props.devices.map(device => {
        const deviceClass = selectedDevice && selectedDevice.id === device.id ? "device selected-device" : "device";
        return <div className={ deviceClass } onClick={() => { setSelectedDevice(device) }}>
            <p style={{marginTop: "50%", transform: "translateY(-50%)"}}>{device.name}</p>
        </div>
    });

    const modalContent = 
        <Fragment>
            <div style={{ width: "5%", display: "inline-block", verticalAlign: "middle" }} onClick={() => { if(scrollPosition > 0) setScrollPosition(scrollPosition - 1) }}>
                <img style={{ width: "100%", opacity: .2, cursor: "pointer" }} src="https://lh3.googleusercontent.com/proxy/5aOgaQYAT75gA71As6qI9l8aYbdkekzpOGnqIXiEvxeqU2mWAhtkLVwV86QuPwgevpVwY_QNAgamC7-uIoj9LN7VMNVabJny8uO0hbl37oRrhQ6xXA"></img>   
            </div>
            <div style={{ width: "90%", display: "inline-block", verticalAlign: "middle", overflowX: "hidden", overflowY: "hidden" }}>
                <div style={ styless }>
                        {mappedDevices}
                </div>
            </div>
            <div style={{ width: "5%", display: "inline-block", verticalAlign: "middle" }} onClick={() => { setScrollPosition(scrollPosition + 1) }}>
                <img style={{ width: "100%", transform: "rotate(180deg)", opacity: .2, cursor: "pointer" }} src="https://lh3.googleusercontent.com/proxy/5aOgaQYAT75gA71As6qI9l8aYbdkekzpOGnqIXiEvxeqU2mWAhtkLVwV86QuPwgevpVwY_QNAgamC7-uIoj9LN7VMNVabJny8uO0hbl37oRrhQ6xXA"></img>   
            </div>
            <br/>
            <input type="color" value={deviceColor ? deviceColor : "#00d151"} onChange={(event) => { setDeviceColor(event.target.value) }} />
            {/*<select onChange={(event) => {setDeviceColor(event.target.value)}} defaultValue="rgba(0, 128, 128, 128)">
                <option>red</option>
                <option>green</option>
                <option>blue</option>
                <option>yellow</option>
                <option>black</option>
</select>*/}
            <br/>
            <button className="create-button" onClick={() => { props.addNewDevice(selectedDevice, deviceColor)} } disabled={!selectedDevice}>Add</button>
        </Fragment>;

    return <Modal title="Add new device" canClose={props.canClose} onCloseModal={() => {props.setShowModal(false)}}> {modalContent} </Modal>;
}

export default NewDeviceModal;