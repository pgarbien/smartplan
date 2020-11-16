
import React, { Fragment } from 'react';
import Modal from '../Modal/Modal';
import mAxios from '../../utils/API';
import '../../new_css/modal_css/Modal.css';

const ManageDeviceModal = (props) => {

    function handleAction(action) {
        mAxios.post(`/devices/actions/${props.device.id}`, { "actionType": action.name })
            .then(response => {
                props.changeDeviceColor(props.device, action.caption == "On");
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
            <p>Connection: {props.deviceState.state.connected ? <span style={{color: "#00d151"}}>connected</span> : <span style={{color: "red"}}>disconnected</span>}</p>
            <p>State: {props.deviceState.state.on ? <span style={{color: "#00d151"}}>on</span> : <span style={{color: "red"}}>off</span>}</p>
            <br/>
            {mappedActions}
        </Fragment>;

    return <Modal title={ "Manage " + props.device.name } canClose={props.canClose} onCloseModal={() => {props.setShowModal(false)}}> {modalContent} </Modal>
}

export default ManageDeviceModal;