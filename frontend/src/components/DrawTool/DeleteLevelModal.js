import React, { Fragment } from 'react';
import Modal from '../../components/Modal/Modal';

const DeleteLevelModal = (props) => {

    const handleDeleteModal = () => {
        props.deleteLevel(props.levelName);
        props.setShowModal(false);
    }

    const handleCloseModal = () => {
        props.setShowModal(false);
    }

    const modalContent =
        <Fragment>
            <div>
                Are you sure you want to delete {props.levelName}?
            </div>
            <br/>
            <br/>
            <button className="delete-button" onClick={ handleDeleteModal }>DELETE</button>
            <button className="cancel-button" onClick={ handleCloseModal }>CANCEL</button>
        </Fragment>

return <Modal title="Delete level" canClose={true} onCloseModal={ handleCloseModal }>{modalContent}</Modal>
}

export default DeleteLevelModal;