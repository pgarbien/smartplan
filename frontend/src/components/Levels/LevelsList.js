import React, { useEffect, useState } from 'react';
import '../../new_css/levels_list_css/LevelsList.css';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';

const LevelsList = ({ location, activeLevel, setActiveLevel, changeDisplayedLevel, showLevelModal, setShowDeleteLevelModal }) => {
  const {t, i18n} = useTranslation('main');
  const [activeLevelName, setActiveLevelName] = useState("Wszystkie poziomy")

  const onLeftLevelClick = (level) => {
      changeDisplayedLevel(level);
      setActiveLevel(level.order);
      setActiveLevelName(level.name);
  }

  const onRightLevelClick = (event) => {
    if(setShowDeleteLevelModal) {
      event.preventDefault()
        setShowDeleteLevelModal(true)
    }
  }

  const onEditLevelClick = ( level) => {
    showLevelModal(level);
  }

  const onAddLevelClick = (event) => {
    event.stopPropagation()
    showLevelModal();
  }

  const levels = location ? location.levels.slice(0).map(level => {
    return (
      <div class="level" key={level.order} onClick={() => onLeftLevelClick(level)} onContextMenu={onRightLevelClick}>
        {level.name}
        {showLevelModal ? <FontAwesomeIcon class="edit_level" onClick={() => { onEditLevelClick(level) }} icon={faEdit}/> : null}
      </div>
    )
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
            {showLevelModal ? <div className="level add-level" onClick={onAddLevelClick}>{t('tool.addNewLevel')}</div> : null}
          </div>
        </div>
    </div>
  );
}

export default LevelsList;
