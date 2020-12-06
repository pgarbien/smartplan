import React, { useEffect, useState } from 'react';
import '../../new_css/levels_list_css/LevelsList.css';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';

const LevelsList = ({ location, activeLevel, setActiveLevel, changeDisplayedLevel, setShowAddLevelModal, setShowDeleteLevelModal }) => {
  const {t, i18n} = useTranslation('main');
  const [activeLevelName, setActiveLevelName] = useState("Wszystkie poziomy")

  const onLeftLevelClick = (level) => {
      changeDisplayedLevel(level);
      setActiveLevel(level.order);
      setActiveLevelName(level.name);
  }

  const onRightLevelClick = () => {
    if(setShowDeleteLevelModal) {
        setShowDeleteLevelModal(true)
    }
  }

  const levels = location ? location.levels.slice(0).map(level => {
    return <div class="level" 
                key={level.order} 
                onClick={() => onLeftLevelClick(level)} 
            >
              {level.name}
              {setShowAddLevelModal ? <FontAwesomeIcon class="trash" onClick={onRightLevelClick} icon={faTrash}/> : null}
            </div>
  }) : null;

  useEffect(() => {
    if(levels && location.levels.length > 0) {
      setActiveLevelName(location.levels[activeLevel].name);
    }
  }, [location]);

  useEffect(() => {
    if(levels && location.levels.length > 0) {
      setActiveLevelName(location.levels[activeLevel].name);
    }
  }, [activeLevel]);

  return (
    <div className="levels">
        <div class="dropdown">
          <button class="drop-btn">
            {activeLevelName}<span class="caret"/>
          </button>
          <div class="dropdown-content">
            {levels}
            {setShowAddLevelModal ? <div className="level add-level" onClick={() => { setShowAddLevelModal(true) }}>{t('tool.addNewLevel')}</div> : null}
          </div>
        </div>
    </div>
  );
}

export default LevelsList;
