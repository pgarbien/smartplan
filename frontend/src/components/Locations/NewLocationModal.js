import React, { Fragment, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import Location from '../../tool/model/Location'
import mAxios from '../../utils/API'
import './NewLocationModal.css'

const NewLocationModal = (props) => {
    const [locationName, setLocationName] = useState(null)
    const [locationPhoto, setLocationPhoto] = useState(null)

    const modalContent = <Fragment>
        <label for="location-name">Location name:</label>
        <input type="text" id="location-name" name="location-name" placeholder="Beautiful house" onChange={(event) => { setLocationName(event.target.value) }}/>
        <br/>
        <label for="location-photo">Location photo:</label>
        <br/>
        <br/>
        <label for="location-photo" className="upload-button">{locationPhoto ? ("Selected photo: " + locationPhoto.name) : "Upload location photo"}</label>
        <input type="file" id="location-photo" name="location-photo" accept="image/png, image/jpeg" onChange={(event) => { setLocationPhoto(event.target.files[0]) }}/>
        <br/>
        <br/>
        {/* <label for="location-color">Location color:</label>
        <input type="color" id="location-color" name="location-color" value="#00d151" /> */}
        <button onClick={() => { locationPhoto ? createNewLocation() : postNewLocation() }} disabled={ locationName == null || locationName === "" }>CREATE</button>
    </Fragment>

    const createNewLocation = () => {
        const locationPhotoFile = new FormData() 
        locationPhotoFile.append('file', locationPhoto)

        mAxios.post('/file/upload', locationPhotoFile)
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

        mAxios.post('/locations', location)
            .then(_ => {
                props.fetchLocations()
                props.setShowModal(false)
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (props.showModal ? <Modal title="Create new location" onCloseModal={() => { props.setShowModal(false) }}> {modalContent} </Modal> : null);
}

export default NewLocationModal;