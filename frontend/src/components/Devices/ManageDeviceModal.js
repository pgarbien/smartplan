
import React, { Fragment } from 'react';
import Modal from '../Modal/Modal';
import mAxios from '../../utils/API';
import '../../new_css/modal_css/Modal.css';
import {useTranslation} from 'react-i18next';

const ManageDeviceModal = ({device, manageDevice, deviceState, canClose, setShowModal}) => {
    const {t, i18n} = useTranslation('main');

    function handleAction(action) {
        mAxios.post(`/devices/actions/${device.id}`, { "actionType": action.name })
            .then(manageDevice(device, action.caption))
            .catch(error => console.log(error));
    }

    const mappedActions = deviceState.actions.map(action => {
        return (
            <div className = "action" onClick={() => { handleAction(action) }}>
                <p class="model-button">{action.caption}</p>
            </div>
        )})

    const mappedStates = Object.keys(deviceState.state).map((field, index) => {
        const value = typeof deviceState.state[field] === "boolean" ? deviceState.state[field] ? "true" : "false" : deviceState.state[field] ;
        return (
            <div class="state">
                <p class="model-button">
                    <span style={{textTransform: 'capitalize'}}>{field}</span> <br/>
                    <span style={{color: "#00d151", textTransform: "uppercase"}}>{value} {deviceState.stateDetails ? deviceState.stateDetails[field]?.unit : ""}</span>
                </p>
            </div>
        )})

    return (
        <Modal title={t('manageDeviceModal.manage') + device.name} canClose={canClose} onCloseModal={() => {setShowModal(false)}}>
            <h3>{t('manageDeviceModal.states')}</h3>
            <div class="state">
                <img src={"data:image/png;base64, " + device.icons[device.activeIconId > 0 ? device.activeIconId : 0]} />
            </div>
            {mappedStates}
            <br/>
            {deviceState.actions.length > 0 ? <h3 style={{marginTop: 20}}>{t('manageDeviceModal.actions')}</h3> : ""}
            {mappedActions}
        </Modal>
    );
}

export default ManageDeviceModal;