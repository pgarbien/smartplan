import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import mAxios from '../../utils/API';
import { Prompt } from 'react-router'

import LevelsList from '../../components/Levels/LevelsList';
import FullscreenButton from '../../components/Fullscreen/Fullscreen'
import { Commands, commandsDescription } from '../../tool/commands/Commands';
import NewLevelModal from '../../components/DrawTool/NewLevelModal';
import Level from '../../tool/model/Level';
import ToolDescription from '../../components/ToolDescription/ToolDescription';
import ToolButton from '../../components/ToolButton/ToolButton';
import DeleteLocationModal from '../../components/Locations/DeleteLocationModal';
import DeleteLevelModal from '../../components/DrawTool/DeleteLevelModal';
import {useTranslation} from 'react-i18next';

import '../../new_css/app_css/App.css';
import '../../new_css/tool_css/Tool.css';

const Tool = ({location, setLocation, changeDisplayedLevel, setupCreator, creator, language}) => {
  const {t, i18n} = useTranslation('main');
  const creationCanvas = useRef(null);
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [showDeleteLevelModal, setShowDeleteLevelModal] = useState(false);
  const [showDeleteLocationModal, setshowDeleteLocationModal] = useState(false);
  
  const [activeLevel, setActiveLevel] = useState(0);
  const [toolInfo, setToolInfo] = useState(commandsDescription[language][Commands.DRAW]);
  const [hoverToolInfo, setHoverToolInfo] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [autosave, setAutosave] = useState(false);
  const [saved, setSaved] = useState(true);
  const [toggleImage, setToggleImage] = useState("/toggleImageOff.svg");
  
  const saveLocation = () => {
    mAxios.post('/locations', location)
        .catch(error => console.log(error));
  }

  const updateLocation = () => {
    mAxios.put(`/locations/${location.id}`, location)
        .catch(error => console.log(error));
  }

  const updateRooms = () => {
    location.levels[activeLevel].rooms = creator.getRooms();
    updateLocation();
  }

  const addNewLevel = (levelName, blueprintUrl) => {
    location.levels.push(new Level(null, levelName, blueprintUrl, [], location.levels.length)); 
    setLocation(location);
    setShowAddLevelModal(false);

    if(autosave) updateLocation();
    else setSaved(false);
  }

  const deleteLevel = (levelName) => {
      let level = location.levels.find(level => level.name == levelName);
      location.levels.splice(level.order, 1);

      mAxios.get('/devices?levelId=' + level.id)
        .then(response => {
          if(response) response.data
            .filter(device => device.levelId == level.id)
            .forEach(device => creator.removeDevice(device))
        });

      location.levels.map(level => level.order = location.levels.indexOf(level))
      setLocation(location);

      if(location.levels.length === 0)setShowAddLevelModal(true)
      else setActiveLevel(location.levels[0].order)

      if(autosave) updateLocation();
      else setSaved(false);
  }

  const onSaveClick = () => {
    setSaved(true);
    if(location.id) updateRooms();
    else saveLocation();
  }

  const onAutosaveClick = () => {
    onSaveClick()
    setAutosave(!autosave)
  }

  useEffect(() => {
    if(creationCanvas) setupCreator(creationCanvas.current)
  }, [creationCanvas]);

  useEffect(() => {
    if(location && location.levels.length === 0) setShowAddLevelModal(true);
  }, [location]);

  useEffect(() => {
    if(creator) creator.setCommand(Commands.DRAW);
  }, [creator]);

  useEffect(() => {
    setToolInfo(commandsDescription[language][toolInfo.type])
  }, [language]);

  return (
    <Fragment>
      <Prompt
        when={!autosave && !saved}
        message='You have unsaved changes, are you sure you want to leave?'
      />
      <div class="body-container tool-page">
        <div class="localization-header">
          <div class="left-header-wrapper">
            <h2>{t('editPage.editLocationBeggining')}<span class="primary_color">{location ? location.name : ""}</span>{t('editPage.editLocationEnding')}</h2>
            <LevelsList 
                location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel} 
                setShowAddLevelModal={setShowAddLevelModal} setShowDeleteLevelModal={setShowDeleteLevelModal}
            />
          </div>
          <div class="button-header">
            <div className="tools-button" onClick={() => onSaveClick()} style={{display: autosave ? "none" : "inline-block"}}>{t('popups.save')}</div>
            <div className="tools-button" onClick={() => setshowDeleteLocationModal(true)}>{t('popups.delete')}</div>
            <div className="tools-button" onClick={() => onAutosaveClick() }>{t('popups.autosave')} &nbsp;<div style={{height: 10, width: 10, background: (autosave ? "#00ff00" : "#ff0000"), borderRadius: 10, display: "inline-block"}}></div></div>
          </div>
        </div>
        <div className="tool-page-layout">
          <div className="left-container">
            <div class="tools-col">
              <div class="dots-route shown">
                <ToolButton command={Commands.DRAW} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator} language={language}>
                  <img src="/drawRoom.svg" style={{display: "block", marginLeft: "-5px", marginRight: "auto", height:"70%"}}/>
                </ToolButton>
                <ToolButton command={Commands.MOVE_ROOMS} persistent={true} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator} language={language}>
                  <img src="/moveRoom.svg" style={{display: "block", marginLeft: "-5px", marginRight: "auto", height: "70%"}}/>
                </ToolButton>
                <ToolButton command={Commands.TOGGLE} setToggleImage={setToggleImage} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator} language={language}>
                  <img 
                    src={toggleImage} 
                    style={{display: "block", marginLeft: "-5px", marginRight: "auto",height: "70%"}}/>
                </ToolButton>
                <ToolButton command={Commands.UNDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator} language={language}>
                  <img src="/undo.svg" style={{display: "block", marginLeft: "-2px", marginRight: "auto", height:"70%"}}/>
                </ToolButton>
                <ToolButton command={Commands.REDO} persistent={false} toolInfo={toolInfo} setToolInfo={setToolInfo} setHoverToolInfo={setHoverToolInfo} creator={creator} language={language}>
                  <img src="/redo.svg" style={{display: "block", marginLeft: "auto", marginRight: "auto", height:"70%"}}/>
                </ToolButton>
              </div>
            </div>
          </div>
          <div className={"drawing-area" + (fullscreen ? " fullscreen" : "")} style={{position: "relative"}}>
              <canvas ref={creationCanvas} id="mainCanvas" class="canvas" onClick={() => { if(autosave) updateRooms(); else setSaved(false); }}></canvas>
              <FullscreenButton setFullscreen={setFullscreen} fullscreen={fullscreen} location={location} activeLevel={activeLevel} setActiveLevel={setActiveLevel} changeDisplayedLevel={changeDisplayedLevel}/>
          </div>
          <div className="right-container">
            <ToolDescription toolInfo={toolInfo} hoverToolInfo={hoverToolInfo}/>
            <div className="right-container-buttons">
              <Link class="directional-button-link" to={location ? "/draw/devices?locationId=" + location.id : "#"} onClick={() => { if(autosave) updateRooms() }}>
                <div className="directional-button">{t('tool.addDevices')} &nbsp;&gt;</div>
              </Link>
              <Link class="directional-button-link" to={location ? "/draw/manager?locationId=" + location.id : "#"} onClick={() => { if(autosave) updateRooms() }}>
                <div className="directional-button">{t('tool.manageDevices')} &nbsp;&gt;</div>
              </Link> 
            </div>
          </div>
        </div>
      </div>
        { showAddLevelModal ? <NewLevelModal addNewLevel={addNewLevel} setShowModal={setShowAddLevelModal} canClose={location.levels.length > 0} /> : null }
        { showDeleteLevelModal ? <DeleteLevelModal deleteLevel={deleteLevel} levelName={location.levels[activeLevel].name} setShowModal={setShowDeleteLevelModal} canClose={true}/> : null }
        { showDeleteLocationModal ? <DeleteLocationModal creator={creator} location={location} setShowModal={setshowDeleteLocationModal}/> : null }
      </Fragment>
  );
}

export default Tool;
