import React, { Fragment, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import Location from '../../tool/model/Location';
import mAxios from '../../utils/API';
import '../../new_css/modal_css/Modal.css';
import {useTranslation} from 'react-i18next';

const NewLocationModal = (props) => {
    const {t, i18n} = useTranslation('main');
    const [locationName, setLocationName] = useState(null);
    const [locationPhoto, setLocationPhoto] = useState(null);

    const modalContent = <Fragment>
        <label for="location-name">{t('popups.locationName')}</label>
        <input type="text" id="location-name" name="location-name" placeholder={t('popups.defaultLocationName')} onChange={(event) => { setLocationName(event.target.value) }}/>
        <br/>
        <label for="location-photo">{t('popups.locationPhoto')}</label>
        <br/>
        <br/>
        <label for="location-photo" className="upload-button">{locationPhoto ? (t('popups.selectedPhoto')+ locationPhoto.name) : t('popups.uploadPhoto')}</label>
        <input type="file" id="location-photo" name="location-photo" accept="image/png, image/jpeg" onChange={(event) => { setLocationPhoto(event.target.files[0]) }}/>
        <br/>
        <br/>
        {/* <label for="location-color">Location color:</label>
        <input type="color" id="location-color" name="location-color" value="#00d151" /> */}
        <button className="create-button" onClick={() => { locationPhoto ? createNewLocation() : postNewLocation() }} disabled={ locationName == null || locationName === "" }>{t('popups.create')}</button>
    </Fragment>;

    const createNewLocation = () => {
        const locationPhotoFile = new FormData() ;
        locationPhotoFile.append('file', locationPhoto);

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
        const location = new Location(null, locationName, photoUrl, []);

        mAxios.post('/locations', location)
            .then(_ => {
                props.fetchLocations()
                props.setShowModal(false)
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (props.showModal ? <Modal title={t('popups.createNewLocation')} canClose={true} onCloseModal={() => { props.setShowModal(false) }}> {modalContent} </Modal> : null);
}

export default NewLocationModal;