import React from 'react';
import '../../new_css/fullscreen_button_css/FullscreenButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpand, faCompress, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

const Fullscreen = ({ fullscreen, setFullscreen, location, activeLevel, setActiveLevel, changeDisplayedLevel }) => {

    const isNextLevel = () => activeLevel + 1 <= location.levels.length - 1

    const isPrevLevel = () => activeLevel - 1 >= 0

    const nextFloor = () => {
        const nextLevel = Math.min((activeLevel + 1), location.levels.length - 1);
        if(activeLevel != nextLevel) {
            setActiveLevel(nextLevel);
            changeDisplayedLevel(location.levels[nextLevel]);
        }
    }

    const prevFloor = () => {
        const prevLevel = Math.max((activeLevel - 1), 0);
        if(activeLevel != prevLevel) {
            setActiveLevel(prevLevel);
            changeDisplayedLevel(location.levels[prevLevel]);
        }
    }

    return(
        <div>
            { (fullscreen && location) ? <div className="fullscreen_level_name">{location.levels[activeLevel].name}</div> : "" }
            <div className={(fullscreen && location) ? "fullscreen_buttons_opened" : "fullscreen_buttons_closed"}>
                { (fullscreen && location) ? <div className="fullscreen_button" onClick={() => prevFloor()}>
                    <FontAwesomeIcon icon={faChevronDown} style={{opacity: isPrevLevel() ? 1 : .5}} />
                </div> : "" }
                { (fullscreen && location) ? <div className="fullscreen_button" onClick={() => nextFloor()}>
                    <FontAwesomeIcon icon={faChevronUp} style={{opacity: isNextLevel() ? 1 : .5}} />
                </div> : "" }
                <div className="fullscreen_button" onClick={() => setFullscreen(!fullscreen)}>
                    <FontAwesomeIcon icon={(fullscreen && location) ? faCompress : faExpand} />
                </div>
            </div>
        </div>
    );
}

export default Fullscreen;