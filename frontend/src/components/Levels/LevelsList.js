import React, { useState } from 'react';
import '../../App.css';
import './LevelsList.css';

const LevelsList = ({location, changeDisplayedLevel, setShowAddLevelModal}) => {
  const [activeLevel, setActiveLevel] = useState(0);

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
