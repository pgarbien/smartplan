import React from 'react';
import { Commands, commandsDescription } from '../../tool/commands/Commands';

const ToolButton = ({ toolInfo, setToggleImage, persistent, setToolInfo, setHoverToolInfo, creator, language, command, children }) => {
    const buttonClass = "dot" + (persistent && toolInfo && toolInfo.type === command ? " tool-button-active" : " tool-button")

    return (
        <button class={buttonClass}
            onClick={() => {
                if(command === Commands.TOGGLE) {
                    creator.toggleBackgroundImage();
                    setToggleImage(creator.backgorundImageState() ? "/toggleImageOn.svg" : "/toggleImageOff.svg");
                } else if(command === Commands.UNDO) {
                    creator.undoCommand();
                } else if(command === Commands.REDO) {
                    creator.redoCommand();
                } else if(persistent) {
                    creator.setCommand(command); 
                    setToolInfo(commandsDescription[language][command]) 
                }
            }}
            onMouseEnter={() => setHoverToolInfo(commandsDescription[language][command])}
            onMouseLeave={() => setHoverToolInfo(null)}>{children}</button>
    )
}

export default ToolButton;