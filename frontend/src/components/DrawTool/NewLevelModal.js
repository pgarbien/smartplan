import React, { Fragment, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import mAxios from '../../utils/API';
import '../Locations/NewLocationModal.css';

const NewLevelModal = (props) => {
    const [levelName, setLevelName] = useState(null);
    const [levelBlueprint, setLevelBlueprint] = useState(null);

    const modalContent = <Fragment>
        <label for="level-name">Level name:</label>
        <input type="text" id="level-name" name="level-name" placeholder="Level #1" onChange={(event) => { setLevelName(event.target.value) }} />
        <br/>
        <label for="level-blueprint">Level blueprint:</label>
        <br/>
        <br/>
        <label for="level-blueprint" className="upload-button">{levelBlueprint ? ("Selected blueprint: " + levelBlueprint.name) : "Upload level blueprint"}</label>
        <input type="file" id="level-blueprint" name="level-blueprint" accept="image/png, image/jpeg" onChange={(event) => { setLevelBlueprint(event.target.files[0]) }}/>
        <br/>
        <br/>
        {/* <label for="level-color">Level color:</label>
        <input type="color" id="level-color" name="level-color" value="#00d151" /> */}
        <button className="create-button" onClick={() => { levelBlueprint ? createNewLevel() : props.addNewLevel(levelName, null) }} disabled={ levelName == null || levelName === "" }>CREATE</button>
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

    return <Modal title="Add new level" onCloseModal={() => { props.setShowModal(!props.canClose) }} canClose={props.canClose}> {modalContent} </Modal>;
}

export default NewLevelModal;