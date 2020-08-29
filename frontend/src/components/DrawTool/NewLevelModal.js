import React, { Fragment } from 'react';
import Modal from '../../components/Modal/Modal';
import '../Locations/NewLocationModal.css'

const NewLevelModal = (props) => {

    const modalContent = <Fragment>
        <label for="location-name">Level name:</label>
        <input type="text" id="location-name" name="location-name" placeholder="Level #1" />
        {/* <br/>
        <label for="location-photo">Location photo:</label> */}
        <br/>
        <label for="location-photo">Level blueprint:</label>
        <input type="file" id="location-photo" name="location-photo" accept="image/png, image/jpeg"/>
        <br/>
        {/* <label for="location-color">Level color:</label>
        <input type="color" id="location-color" name="location-color" value="#00d151" /> */}
        <button onClick={() => { props.onSaveButtonClick() }}>aaa</button>
    </Fragment>

    return (
            <Fragment>
                { props.showModal ? <Modal title="Add new level" onCloseModal={() => { props.setShowModal(false) }}> {modalContent} </Modal> : null }
            </Fragment>
    );
}

export default NewLevelModal;