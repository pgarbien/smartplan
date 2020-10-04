
import React, {Fragment, useState, useEffect} from 'react';
import Modal from '../../components/Modal/Modal';

const ManageDeviceModal = (props) => {

    const modalContent =
        <Fragment>
            <button onClick={() => {props.manageDevices()}}>CLOSE</button>
        </Fragment>;

return <Modal title="Manage device" canClose={props.canClose} onCloseModal={() => {props.setShowModal(false)}}> {modalContent} </Modal>
}

export default ManageDeviceModal;