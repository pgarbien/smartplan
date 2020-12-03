import React, { Fragment, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import mAxios from '../../utils/API';
import {useTranslation} from 'react-i18next';

const NewLevelModal = (props) => {
    const {t, i18n} = useTranslation('main');
    const [levelName, setLevelName] = useState(null);
    const [levelBlueprint, setLevelBlueprint] = useState(null);

    const modalContent = <Fragment>
        <label for="level-name">{t('popups.levelName')}</label>
        <input type="text" id="level-name" name="level-name" placeholder={t('popups.defaultLevel')} onChange={(event) => { setLevelName(event.target.value) }} />
        <br/>
        <label for="level-blueprint">{t('popups.levelBlueprint')}</label>
        <br/>
        <br/>
        <label for="level-blueprint" className="upload-button">{levelBlueprint ? ("Selected blueprint: " + levelBlueprint.name) : t('popups.uploadBlueprint')}</label>
        <input type="file" id="level-blueprint" name="level-blueprint" accept="image/png, image/jpeg" onChange={(event) => { setLevelBlueprint(event.target.files[0]) }}/>
        <br/>
        <br/>
        <button className="create-button" onClick={() => { levelBlueprint ? createNewLevel() : props.addNewLevel(levelName, null) }} disabled={ levelName == null || levelName === "" }>{t('popups.create')}</button>
    </Fragment>;

    const createNewLevel = () => {
        const blueprintFile = new FormData() ;
        blueprintFile.append('file', levelBlueprint);

        mAxios.post('/file/upload', blueprintFile)
            .then(response => {
                const blueprintUrl = response.data.photoUrl
                props.addNewLevel(levelName, blueprintUrl)
            })
            .catch(error => {
                console.log(error);
            });
    }

    return <Modal title={t('popups.addLevel')} onCloseModal={() => { props.setShowModal(!props.canClose) }} canClose={props.canClose}> {modalContent} </Modal>;
}

export default NewLevelModal;