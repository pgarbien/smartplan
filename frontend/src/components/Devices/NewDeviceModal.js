import React, {Fragment, useState} from 'react';
import Modal from '../../components/Modal/Modal';
import '../../new_css/modal_css/Modal.css';

const NewDeviceModal = (props) => {
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0); 

    const styless = {width: "max-content", transition: "ease .5s", transform: "translateX(" + scrollPosition * -50 + "%" }
    
    const mappedDevices = props.devices.map(device => {
        const deviceClass = selectedDevice && selectedDevice.id === device.id ? "device selected-device" : "device";
        return <div className={ deviceClass } onClick={() => { setSelectedDevice(device) }}>
            <p class="model-button">{device.name}</p>
        </div>
    });

    const modalContent = 
        <Fragment>
            <div style={{ width: "5%", display: "inline-block", verticalAlign: "middle" }} onClick={() => { if(scrollPosition > 0) setScrollPosition(scrollPosition - 1) }}>
                <img style={{ width: "100%", opacity: .2, cursor: "pointer" }} src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-arrow-back-512.png"></img>   
            </div>
            <div style={{ width: "90%", display: "inline-block", verticalAlign: "middle", overflowX: "hidden", overflowY: "hidden" }}>
                <div style={ styless }>
                        {mappedDevices}
                </div>
            </div>
            <div style={{ width: "5%", display: "inline-block", verticalAlign: "middle" }} onClick={() => { setScrollPosition(scrollPosition + 1) }}>
                <img style={{ width: "100%", transform: "rotate(180deg)", opacity: .2, cursor: "pointer" }} src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-arrow-back-512.png"></img>   
            </div>
            <br/>
            <br/>
            <button className="create-button" onClick={() => { props.addNewDevice(selectedDevice)} } disabled={!selectedDevice}>Add</button>
        </Fragment>;

    return <Modal title="Add new device" canClose={props.canClose} onCloseModal={() => {props.setShowModal(false)}}> {modalContent} </Modal>;
}

export default NewDeviceModal;