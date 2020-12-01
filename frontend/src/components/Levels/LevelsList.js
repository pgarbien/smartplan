import React, { useEffect, useState } from 'react';
import mAxios from '../../utils/API';
import '../../new_css/levels_list_css/LevelsList.css';

const LevelsList = ({ creator, location, activeLevel, setActiveLevel, changeDisplayedLevel, setShowAddLevelModal, setShowDeleteLevelModal }) => {
  const [activeLevelName, setActiveLevelName] = useState("Wszystkie poziomy")

  const fetchDevices = (level) => {
    mAxios.get('/devices?levelId=' + level.id)
      .then(response => {
        const activeDevices = response.data.filter(device => device.locationId == location.id)
        creator.setAddedDevices(activeDevices);
        creator.refresh();
      })
      .catch(error => console.log(error));
  }

  const onLeftLevelClick = (level) => {
      changeDisplayedLevel(level);
      setActiveLevel(level.order);
      setActiveLevelName(level.name);
      fetchDevices(level)
  }

  const onRightLevelClick = (event) => {
    if(setShowDeleteLevelModal) {
        event.preventDefault();
        setShowDeleteLevelModal(true)
    }
  }

  const levels = location ? location.levels.slice(0).map(level => {
    return <div class="level" 
                key={level.order} 
                onClick={() => onLeftLevelClick(level)} 
                onContextMenu={(event) => onRightLevelClick(event)}>{level.name}</div>
  }) : null;

  useEffect(() => {
    if(levels && location.levels.length > 0) {
      setActiveLevelName(location.levels[activeLevel].name);
    }
  }, [location]);

  return (
    <div className="levels">
        <div class="dropdown">
          <button class="drop-btn">
            {activeLevelName}<span class="caret"/>
          </button>
          <div class="dropdown-content">
            {levels}
            {setShowAddLevelModal ? <div className="level add-level" onClick={() => { setShowAddLevelModal(true) }}>DODAJ POZIOM</div> : null}
          </div>
        </div>
    </div>
  );
}

export default LevelsList;
