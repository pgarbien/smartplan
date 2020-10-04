import React from 'react';
import Command from '../../tool/commands/Command';
import { Commands, commandsDescription } from '../../tool/commands/Commands';
import '../Locations/NewLocationModal.css';

const ToolButton = ({ toolInfo, persistent, setToolInfo, setHoverToolInfo, creator, command, children }) => {
    const buttonClass = "tool-button" + (persistent && toolInfo && toolInfo.type === command ? " tool-button-active" : "")

    return (
        <button className={buttonClass}
            onClick={() => { 
                if(command === Commands.TOGGLE) {
                    creator.toggleBackgroundImage();
                } else if(command === Commands.UNDO) {
                    creator.undoCommand();
                } else if(command === Commands.REDO) {
                    creator.redoCommand();
                } else if(persistent) {
                    creator.setCommand(command); 
                    setToolInfo(commandsDescription[command]) 
                }
            }}
            onMouseEnter={() => setHoverToolInfo(commandsDescription[command])}
            onMouseLeave={() => setHoverToolInfo(null)}>{children}</button>
    )
}

export default ToolButton;