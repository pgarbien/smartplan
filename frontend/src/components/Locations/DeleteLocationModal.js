import React, { Fragment, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import './NewLocationModal.css';
import mAxios from '../../utils/API';
import '../../new_css/modal_css/Modal.css';

const DeleteLocationModal = (props) => {

    const handleDeleteModal = () => {
        mAxios.delete('/locations/' + props.location.id)
                .catch(error => console.log(error));
        window.location.href='/locations';
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