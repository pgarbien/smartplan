import React, {Fragment, useState, useEffect} from 'react';
import Modal from '../../components/Modal/Modal';
import '../../new_css/modal_css/Modal.css';
import mAxios from '../../utils/API';
import {useTranslation} from "react-i18next";

const NewDeviceModal = (props) => {
    const {t, i18n} = useTranslation('main');
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const styless = { width: "max-content", transition: "ease .5s", transform: "translateX(" + scrollPosition * -50 + "%" }

    useEffect(() => fetchDevices(), [])

    const fetchDevices = () => {
        mAxios.get('/devices')
            .then(response => {
                const unbindDevices = response.data.filter(device => !device.point)
                setDevices(unbindDevices);
            })
            .catch(error => console.log(error));
    }
    
    const mappedDevices = devices.map(device => {
        const deviceClass = selectedDevice && selectedDevice.id === device.id ? "device selected-device" : "device";
        return <div className={ deviceClass } onClick={() => { setSelectedDevice(device) }}>
            <img src={"data:image/png;base64, " + device.icons[0]} />
            <p>{device.name}</p>
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
            <button className="create-button" onClick={() => { props.addNewDevice(selectedDevice)} } disabled={!selectedDevice}>{t('popups.add')}</button>
        </Fragment>;

    return <Modal title={t('popups.addNewDevice')} canClose={props.canClose} onCloseModal={() => {props.setShowModal(false)}}> {modalContent} </Modal>;
}

export default NewDeviceModal;