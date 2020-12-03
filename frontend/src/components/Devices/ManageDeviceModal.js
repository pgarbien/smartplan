
import React, { Fragment } from 'react';
import Modal from '../Modal/Modal';
import mAxios from '../../utils/API';
import '../../new_css/modal_css/Modal.css';
import {useTranslation} from 'react-i18next';

const ManageDeviceModal = ({device, manageDevice, deviceState, canClose, setShowModal}) => {
    const {t, i18n} = useTranslation('main');

    function handleAction(action) {
        mAxios.post(`/devices/actions/${device.id}`, { "actionType": action.name })
            .then(response => {
                manageDevice(device, action.caption);
            })
            .catch(error => console.log(error));
    }

    const mappedActions = deviceState.actions.map(action => {
        return <div className = "action" onClick={() => { handleAction(action) }}>
                <p class="model-button">{action.caption}</p>
            </div>
    })

    const mappedStates = Object.keys(deviceState.state).map((field, index) => {
        const value = typeof deviceState.state[field] === "boolean" ? deviceState.state[field] ? "true" : "false" : deviceState.state[field] ;
        return <div>
            <span style={{textTransform: 'capitalize'}}>{field}</span>
            <span style={{color: "#00d151"}}>: {value} {deviceState.stateDetails ? deviceState.stateDetails[field]?.unit : ""}</span>
        </div>
    })

    const modalContent =
        <Fragment>
            {mappedStates}
            <br/>
            {mappedActions}
        </Fragment>;

    return <Modal title={ "Manage " + device.name } canClose={canClose} onCloseModal={() => {setShowModal(false)}}> {modalContent} </Modal>
}

export default ManageDeviceModal;