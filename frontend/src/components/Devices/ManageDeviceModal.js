
import React, { Fragment } from 'react';
import Modal from '../Modal/Modal';
import mAxios from '../../utils/API';
import '../../new_css/modal_css/Modal.css';
import {useTranslation} from 'react-i18next';

const ManageDeviceModal = (props) => {
    const {t, i18n} = useTranslation('main');

    function handleAction(action) {
        mAxios.post(`/devices/actions/${props.device.id}`, { "actionType": action.name })
            .then(response => {
                props.manageDevice(props.device, action.caption);
            })
            .catch(error => console.log(error));
    }

    const mappedActions = props.deviceState.actions.map(action => {
        return <div className = "action" onClick={() => { handleAction(action) }}>
                <p class="model-button">{action.caption}</p>
            </div>
    })

    const modalContent =
        <Fragment>
            <p>{t('popups.connection')} {props.deviceState.state.connected ? <span style={{color: "#00d151"}}>{t('popups.connected')}</span> : <span style={{color: "red"}}>{t('popups.disconnected')}</span>}</p>
            {props.deviceState.state.on != undefined ? <p>{t('popups.state')} {props.deviceState.state.on ? <span style={{color: "#00d151"}}>{t('popups.on')}</span> : <span style={{color: "red"}}>{t('popups.off')}</span>}</p> : ""}
            {props.deviceState.state.temperature ? <p>{t('popups.temperature')} <span style={{color: "#00d151"}}>{props.deviceState.state['temperature']}ºC</span></p> : ""}
            {console.log(props.deviceState)}
            <br/>
            {mappedActions}
        </Fragment>;

    return <Modal title={ "Manage " + props.device.name } canClose={props.canClose} onCloseModal={() => {props.setShowModal(false)}}> {modalContent} </Modal>
}

export default ManageDeviceModal;