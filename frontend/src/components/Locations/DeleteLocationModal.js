import React, { Fragment, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import mAxios from '../../utils/API';
import '../../new_css/modal_css/Modal.css';

const DeleteLocationModal = (props) => {

    const handleDeleteModal = () => {
        console.log(props.location.id);
        mAxios.get('/devices').then(response => {
            response.data
            .filter(device => device.locationId == props.location.id)
            .map(device => {
                props.creator.removeDevice(device)
            });
            mAxios.delete('/locations/' + props.location.id)
            .catch(error => console.log(error));
            window.location.href='/locations';
        });
    }

    const handleCloseModal = () => {
        props.setShowModal(false);
    }

    const modalContent =
        <Fragment>
            <div>
                Are you sure you want to delete current location?
            </div>
            <br/>
            <br/>
            <button className="delete-button-modal" onClick={ handleDeleteModal }>DELETE</button>
            <button className="cancel-button" onClick={ handleCloseModal }>CANCEL</button>
        </Fragment>

return( <Modal title="Delete location" canClose={true} onCloseModal={ handleCloseModal }>{modalContent}</Modal> );
}

export default DeleteLocationModal;