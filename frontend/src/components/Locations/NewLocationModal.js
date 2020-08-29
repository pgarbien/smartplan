import React, { Fragment, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import Location from '../../tool/model/Location'
import axios from '../../utils/API'
import './NewLocationModal.css'

const NewLocationModal = (props) => {

    const [locationName, setLocationName] = useState(null)
    const [locationPhoto, setLocationPhoto] = useState(null)

    const modalContent = <Fragment>
        <label for="location-name">Location name:</label>
        <input type="text" id="location-name" name="location-name" placeholder="Beautiful house" onChange={(event) => { setLocationName(event.target.value) }}/>
        {/* <br/>
        <label for="location-photo">Location photo:</label> */}
        <br/>
        <label for="location-photo">Location photo:</label>
        <input type="file" id="location-photo" name="location-photo" accept="image/png, image/jpeg" onChange={(event) => { setLocationPhoto(event.target.files[0]) }}/>
        <br/>
        {/* <label for="location-color">Location color:</label>
        <input type="color" id="location-color" name="location-color" value="#00d151" /> */}
        <button onClick={() => { locationPhoto ? createNewLocation() : postNewLocation() }} disabled={ locationName == null || locationName === "" }>CREATE</button>
    </Fragment>

    const createNewLocation = () => {
        const data = new FormData() 
        data.append('file', locationPhoto)

        axios.post('/file/upload', data,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            const photoUrl = response.data.photoUrl
            postNewLocation(photoUrl)
        })
        .catch(error => {
            console.log(error);
        });
    }

    const postNewLocation = (photoUrl = null) => {
        const location = new Location(null, locationName, photoUrl, [])

        axios.post('/locations', location,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            props.fetchLocations()
            props.setShowModal(false)
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
            <Fragment>
                { props.showModal ? <Modal title="Create new location" onCloseModal={() => { props.setShowModal(false) }}> {modalContent} </Modal> : null }
            </Fragment>
    );
}

export default NewLocationModal;