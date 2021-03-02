import React, { Fragment, useState, useRef, useEffect } from 'react';
import Modal from '../../components/Modal/Modal';
import mAxios from '../../utils/API';
import {useTranslation} from 'react-i18next';

const NewLevelModal = ({setShowModal, canClose, addNewLevel, setShowDeleteLevelModal, editedLevel}) => {
    const imageRef = useRef(null);
    const nameRef = useRef(null);

    const {t, i18n} = useTranslation('main');
    const [levelName, setLevelName] = useState(null);
    const [levelBlueprint, setLevelBlueprint] = useState(null);

    useEffect(() => {
        if(editedLevel) {
            const editedLevelName = editedLevel.name
            const editedLevelBlueprint = editedLevel.blueprintUrl

            setLevelName(editedLevelName)
            nameRef.current.value = editedLevelName
            if(editedLevel.blueprintUrl) imageRef.current.src = editedLevelBlueprint
        } else {
            nameRef.current.value = ""
            imageRef.current.src = ""
        }
    }, [editedLevel]);

    const modalContent = <Fragment>
        <div style={{display: "inline-block", width: "50%", verticalAlign: "middle"}}>
            <label for="level-name">{t('popups.levelName')}</label>
            <input ref={nameRef} type="text" id="level-name" name="level-name" placeholder={t('popups.defaultLevel')} onChange={(event) => { setLevelName(event.target.value) }} />
            <br/>
            <label for="level-blueprint">{t('popups.levelBlueprint')}</label>
            <br/>
            <br/>
            <label for="level-blueprint" className="upload-button">{levelBlueprint ? ("Selected blueprint: " + levelBlueprint.name) : t('popups.uploadBlueprint')}</label>
            <input type="file" id="level-blueprint" name="level-blueprint" accept="image/png, image/jpeg" onChange={(event) => { 
                setLevelBlueprint(event.target.files[0]);
                imageRef.current.src = URL.createObjectURL(event.target.files[0]);
            }}/>
            <br/>
            <br/>
            <button className="create-button" onClick={() => { levelBlueprint ? createNewLevel() : addNewLevel(levelName, null, editedLevel) }} disabled={ levelName == null || levelName === "" }>{editedLevel ? t('popups.update') : t('popups.create')}</button>
            {editedLevel ? <button className="delete-button-modal" onClick={() => setShowDeleteLevelModal(true)} >{t('popups.delete')}</button> : null }
        </div>
        <div style={{display: "inline-block", width: "45%", verticalAlign: "middle", border: "1px dashed #777777", marginLeft: "5%", height: 200, position: "relative"}}>
            <p style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: -1}}>{t('popups.imageNotUploaded')}</p>
            <img style={{ maxWidth: "100%", maxHeight: "100%", marginLeft: "50%", transform: "translateX(-50%)", padding: 10 }} ref={imageRef} />
        </div>
    </Fragment>;

    const createNewLevel = () => {
        const blueprintFile = new FormData();
        blueprintFile.append('file', levelBlueprint);

        mAxios.post('/file/upload', blueprintFile)
            .then(response => {
                const blueprintUrl = response.data.photoUrl
                addNewLevel(levelName, blueprintUrl, editedLevel)
            })
            .catch(error => console.log(error));
    }

    return <Modal title={editedLevel ? t('popups.editLevel') : t('popups.addLevel')} onCloseModal={() => { setShowModal(!canClose) }} canClose={canClose}> {modalContent} </Modal>;
}

export default NewLevelModal;