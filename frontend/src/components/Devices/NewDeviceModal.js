import React, {Fragment, useState, useEffect, useRef} from 'react';
import Modal from '../../components/Modal/Modal';
import '../../new_css/modal_css/Modal.css';
import mAxios from '../../utils/API';
import {useTranslation} from "react-i18next";

const NewDeviceModal = (props) => {
    const {t, i18n} = useTranslation('main');
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState(devices);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [scrollStep, setScrollStep] = useState(200);
    const devicesWrapper = useRef();
    const devicesList = useRef();

    const horizontalPosition = { transform: "translateX(" + -1 * scrollPosition * scrollStep + "px" }

    useEffect(() => fetchDevices(), [])

    const fetchDevices = () => {
        mAxios.get('/devices')
            .then(response => {
                const unbindDevices = response.data.filter(device => !device.point)
                setDevices(unbindDevices);
                setFilteredDevices(unbindDevices);
            })
            .catch(error => console.log(error));
    }
    
    const mappedDevices = filteredDevices.map(device => {
        const deviceClass = selectedDevice && selectedDevice.id === device.id ? "device selected-device" : "device";
        return (
            <div className={ deviceClass } onClick={() => { setSelectedDevice(device) }}>
                <div>
                    <img src={"data:image/png;base64, " + device.icons[0]} />
                    <p>{device.name}</p>
                </div>
            </div>
        )
    });

    const filterDevices = (event) => {
        const inputValue = event.target.value.toLowerCase();
        let searchResults = [];
        if(selectedDevice) searchResults.push(selectedDevice);
        searchResults = searchResults.concat(devices.filter(device => device.name.toLowerCase().includes(inputValue) && device != selectedDevice ));
        setFilteredDevices(searchResults);
    }

    const onLeftClicked = () => {
        if(scrollPosition > 0) setScrollPosition(scrollPosition - 1)
    }

    const onRightClicked = () => {
        const listWidth = devicesList.current.clientWidth
        const wrapperWidth = devicesWrapper.current.clientWidth
        const maxPosition = Math.floor((listWidth - wrapperWidth) / scrollStep)
        
        if(scrollPosition <= maxPosition) setScrollPosition(scrollPosition + 1) 
    }

    const modalContent = 
        <Fragment>
            <input type="text" placeholder={t('popups.searchForDevices')} style={{ margin: "0 0 30px 0", padding: "5px 0" }} onChange={filterDevices}/>
            {!devices.length || filteredDevices.length ? <div>
                <div className="arrow" onClick={onLeftClicked}>
                    <img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-arrow-back-512.png" />
                </div>
                <div className="devices_wrapper" ref={devicesWrapper}>
                    <div className="devices_list" ref={devicesList} style={horizontalPosition}>
                        {mappedDevices}
                    </div>
                </div>
                <div className="arrow" onClick={onRightClicked}>
                    <img className="arrow_right" src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-arrow-back-512.png" /> 
                </div>
            </div> : <h3>{t('popups.emptySearchResults')}</h3>}
            <br/>
            <button className="create-button" onClick={() => { props.addNewDevice(selectedDevice)} } disabled={!selectedDevice}>{t('popups.add')}</button>
        </Fragment>;

    return <Modal title={t('popups.addNewDevice')} canClose={props.canClose} onCloseModal={() => {props.setShowModal(false)}}> {modalContent} </Modal>;
}

export default NewDeviceModal;