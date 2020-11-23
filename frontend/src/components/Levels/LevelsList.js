import React, { useEffect, useState } from 'react';
import mAxios from '../../utils/API';
import '../../new_css/levels_list_css/LevelsList.css';

const LevelsList = ({creator, location, activeLevel, setActiveLevel, changeDisplayedLevel, setShowAddLevelModal, setShowDeleteLevelModal}) => {
  const [activeLevelName, setActiveLevelName] = useState("Wszystkie poziomy")

  const levels = location ? location.levels.slice(0).map(level => {
    return <div class="level" key={level.order} onClick={() => { 
      changeDisplayedLevel(level);
      setActiveLevel(level.order);
      setActiveLevelName(level.name);
      mAxios.get('/devices?levelId=' + level.order)
        .then(response => {
            creator.setAddedDevices(response.data.filter(device => device.locationId == location.id));
            creator.refresh();
        })
        .catch(error => console.log(error));
     }} 
     onContextMenu={(event) => {
       if(setShowDeleteLevelModal) {
          event.preventDefault();
          setShowDeleteLevelModal(true)
       }
     }}>{level.name}</div>
  }) : null;

  useEffect(() => {
    if(levels && location.levels.length > 0) {
      setActiveLevelName(location.levels[activeLevel].name);
    }
  }, [location]);

  const levelsMapped = <div class="dropdown">
    <button class="drop-btn">{activeLevelName}<span class="caret"/></button>
    <div class="dropdown-content">
      {levels}
      {setShowAddLevelModal ? <div className="level add-level" onClick={() => { setShowAddLevelModal(true) }}>DODAJ POZIOM</div> : null}
    </div>
  </div>

  return (
    <div className="levels">
        {levelsMapped}
    </div>
  );
}

export default LevelsList;
