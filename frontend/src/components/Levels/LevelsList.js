import React from 'react';
import '../../App.css';
import './LevelsList.css';

const LevelsList = ({location, activeLevel, changeDisplayedLevel, setShowAddLevelModal}) => {
  const levelsMapped = location && location.levels ? location.levels.slice(0).reverse().map(level => {
    return <div className={"level " + ((level.order === activeLevel) ? "level-active" : "")} onClick={() => { changeDisplayedLevel(level) }}>{level.name}</div>
  }) : null;

  return (
    <div className="levels">
        {setShowAddLevelModal ? <div className="level" onClick={() => { setShowAddLevelModal(true) }}>+</div> : null}
        {levelsMapped}
    </div>
  );
}

export default LevelsList;
