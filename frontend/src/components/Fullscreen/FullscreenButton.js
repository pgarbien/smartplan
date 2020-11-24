import React from 'react';
import '../../new_css/fullscreen_button_css/FullscreenButton.css';

const FullscreenButton = (props) => {
return <div className={"fullscreen_button " + (props.fullscreen ? "fullscreen_button_close" : "fullscreen_button_open")} onClick={() => props.setFullscreen(!props.fullscreen)}>{console.log(">> " + props.fullscreen)}</div>
}

export default FullscreenButton;