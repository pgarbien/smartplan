import React from 'react';
import { Commands, commandsDescription } from '../../tool/commands/Commands';

const ToolButton = ({ toolInfo, persistent, setToolInfo, setHoverToolInfo, creator, command, children }) => {
    const buttonClass = "dot" + (persistent && toolInfo && toolInfo.type === command ? " tool-button-active" : " tool-button")

    return (
        <button class={buttonClass}
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