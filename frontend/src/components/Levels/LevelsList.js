import React from 'react';
import '../../App.css';
import './LevelsList.css';

const LevelsList = ({location, activeLevel, setActiveLevel, changeDisplayedLevel, setShowAddLevelModal}) => {
  const levelsMapped = location ? location.levels.slice(0).reverse().map(level => {
    return <div className={level.order === activeLevel ? "level level-active" : "level"} onClick={() => { 
      changeDisplayedLevel(level);
      setActiveLevel(level.order);
     }}>{level.name}</div>
  }) : null;

  return (
    <div className="levels">
        {setShowAddLevelModal ? <div className="level" onClick={() => { setShowAddLevelModal(true) }}>+</div> : null}
        {levelsMapped}
    </div>
  );
}

export default LevelsList;
