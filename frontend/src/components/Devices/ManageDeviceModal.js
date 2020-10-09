
import React, {Fragment, useState, useEffect} from 'react';
import Modal from '../Modal/Modal';
import '../../App.css'
import mAxios from '../../utils/API';

const ManageDeviceModal = (props) => {
    const styless = {width: "max-content", transition: "ease .5s" }

    function handleAction(action) {
        console.log(props.device.name);
        mAxios.post(`/devices/actions/${props.device.id}`, { "actionType": action.name})
        .then(response => {
            console.log(response.data);
        })
        .catch(error => console.log(error));
    }

    const mappedActions = props.actions.map(action => {
    return <div className = "action" onClick={() => {handleAction(action)}}>
            <p style={{marginTop: "50%", transform: "translateY(-50%)"}}>{action.caption}</p>
        </div>
    })

    const modalContent =
        <Fragment>
            <div style={{ width: "5%", display: "inline-block", verticalAlign: "middle" }}>
                <img style={{ width: "100%", transform: "rotate(180deg)", opacity: .2, cursor: "pointer" }} src="https://lh3.googleusercontent.com/proxy/5aOgaQYAT75gA71As6qI9l8aYbdkekzpOGnqIXiEvxeqU2mWAhtkLVwV86QuPwgevpVwY_QNAgamC7-uIoj9LN7VMNVabJny8uO0hbl37oRrhQ6xXA"></img>   
            </div>
            <div style={{ width: "90%", display: "inline-block", verticalAlign: "middle", overflowX: "hidden", overflowY: "hidden" }}>
                <div style = { styless }>
                    {mappedActions}
                </div>
            </div>
            <div style={{ width: "5%", display: "inline-block", verticalAlign: "middle" }}>
                <img style={{ width: "100%", transform: "rotate(180deg)", opacity: .2, cursor: "pointer" }} src="https://lh3.googleusercontent.com/proxy/5aOgaQYAT75gA71As6qI9l8aYbdkekzpOGnqIXiEvxeqU2mWAhtkLVwV86QuPwgevpVwY_QNAgamC7-uIoj9LN7VMNVabJny8uO0hbl37oRrhQ6xXA"></img>   
            </div>
            <br/>
            <br/>
            <button className="create-button" onClick={() => {props.manageDevices()}}>CLOSE</button>
        </Fragment>;

return <Modal title="Manage device" canClose={props.canClose} onCloseModal={() => {props.setShowModal(false)}}> {modalContent} </Modal>
}

export default ManageDeviceModal;