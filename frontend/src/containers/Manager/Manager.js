import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Devices from '../../components/Devices/Devices';
import FullscreenButton from '../../components/Fullscreen/Fullscreen'
import '../../new_css/app_css/App.css';
import '../../new_css/tool_css/Tool.css';
import '../../new_css/manager_css/Manager.css';
import LevelsList from '../../components/Levels/LevelsList';
import { Commands } from '../../tool/commands/Commands';
import ManageDeviceModal from '../../components/Devices/ManageDeviceModal';
import mAxios from '../../utils/API';
import { DeviceState } from '../../tool/model/NewDevice';
import {useTranslation} from 'react-i18next';

const Manager = ({ location, activeDevices, changeDisplayedLevel, setupCreator, creator }) => {
    const {t, i18n} = useTranslation('main');
    const creationCanvas = useRef(null);
    const [device, setDevice] = useState(null);
    const [activeLevel, setActiveLevel] = useState(0);
    const [deviceState, setDeviceState] = useState([]);
    const [fullscreen, setFullscreen] = useState(false);
    const [showManageDeviceModal, setShowManageDeviceModal] = useState(false);

    const fetchDevices = () => {
        mAxios.get('/devices?levelId=' + location.levels[activeLevel].id)
            .then(response => fetchDevicesStates(response.data))
            .catch(error => console.log(error));
    }

    const fetchDevicesStates = (devices) => {
        devices.forEach(device => {
            //TODO Czemu tu było if(device.defaultAction)
            fetchDeviceState(device)
        })
    }

    const fetchDeviceState = (device) => {
        mAxios.get(`/devices/details/${device.id}`)
            .then(response => setDeviceDetails(device, response.data), 1000)
    }

    const onMouseClick = (device) => {
        if(device.defaultAction) manageDefaultDeviceAction(device)
        else manageDevice(device)
    }

    const manageDevice = (device) => {
        setDevice(device);
        setTimeout(() => mAxios.get(`/devices/details/${device.id}`)
            .then(response => {
                setDeviceDetails(device, response.data);
                setDeviceState(response.data);
                setShowManageDeviceModal(true);
            })
            .catch(error => console.log(error)), 100)
    }

    const manageDefaultDeviceAction = (device) => {
        mAxios.post(`/devices/actions/${device.id}`, { "actionType": device.defaultAction })
            .then(() => {
                setTimeout(() => mAxios.get(`/devices/details/${device.id}`)
                        .then(response => setDeviceDetails(device, response.data))
                        .catch(error => console.log(error)), 100)
                }
            )
            .catch(error => console.log(error))
    }

    const setDeviceDetails = (device, deviceDetails) => {
        const deviceVisualState = deviceDetails.possibleVisualStates.find(state => state == (deviceDetails.state.on ? "on" : "off"));
        device.deviceState = deviceDetails.state.connected ? deviceDetails.state.on ? DeviceState.ACTIVE : DeviceState.NOT_ACTIVE : DeviceState.DISABLED
        device.activeIconId = deviceDetails.possibleVisualStates.indexOf(deviceVisualState)

        let displayedState = "";
        Object.keys(deviceDetails.state).map((field, index) => {
            if(deviceDetails.stateDetails && deviceDetails.stateDetails[field]?.quickView) {
                if(displayedState.length > 0) displayedState += ", "
                displayedState += deviceDetails.state[field] + "" + deviceDetails.stateDetails[field]?.unit
            }
        });
        device.displayedState = displayedState;

        creator.changeDevice(device);
        creator.refresh();
    }

    useEffect(() => {
        fetchDevices()
        const interval = setInterval(() => fetchDevicesStates(creator.getAddedDevices()), process.env.REACT_APP_DEVICES_STATE_SYNC_INTERVAL_TIME);
        return () => clearInterval(interval);
    }, [activeLevel]);

    useEffect(() => {
        if(creationCanvas) setupCreator(creationCanvas.current)     
    }, [creationCanvas]);

    useEffect(() => {
        if(creator) {
            creator.setCommand(Commands.MANAGE);
            creator.setCallback('click', onMouseClick);
            creator.setCallback('rightclick', manageDevice);
            creator.setCallback('down', manageDevice)
        }
    }, [creator]);

    return(
        <Fragment>
            <div class="body-container manager-page">
                <div class="localization-header">
                    <div class="left-header-wrapper">
                        <h2>{t('managePage.manageDevsBeginning')}<span class="primary_color">{location ? location.name : "your"}</span> {t('managePage.manageDevsEnding')}</h2>
                        <LevelsList location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel} />
                    </div>
                </div>
                <div className="manager-page-layout">
                    <div className="left-container"></div>
                    <div className={"drawing-area" + (fullscreen ? " fullscreen" : "")} style={{position: "relative"}}>
                        <canvas ref={creationCanvas} class="canvas" id="managerCanvas"/>
                        <FullscreenButton setFullscreen={setFullscreen} fullscreen={fullscreen} location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel}/>
                    </div>
                    <div className="right-container">
                        <div class="manager-devices-list">
                            <Devices location={location} activeLevel={activeLevel} activeDevices={activeDevices} manageDevice={manageDevice} creator={creator} />
                        </div>
                        <div className="right-container-buttons">
                            <Link class="directional-button-link" to={location ? "/draw?locationId=" + location.id : "#"}>
                                <div className="directional-button">{t('tool.editLocation')} &nbsp;&gt;</div>
                            </Link>
                            <Link class="directional-button-link" to={location ? "/draw/devices?locationId=" + location.id : "#"}>
                                <div className="directional-button">{t('tool.addDevices')} &nbsp;&gt;</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            { showManageDeviceModal ? <ManageDeviceModal device={device} manageDevice={manageDevice} deviceState={deviceState} setShowModal={setShowManageDeviceModal} canClose={true}/> : null}
        </Fragment>
    );
}

export default Manager;