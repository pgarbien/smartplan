import React from 'react';

const ToolDescription = ({activeImage, hoverImage, toolInfo, hoverToolInfo}) => {
    const descriptionClass = hoverToolInfo ? "description active" : "description"
    const toolName = toolInfo ? hoverToolInfo ? hoverToolInfo.name : toolInfo.name : ""
    const toolDescription = toolInfo ? hoverToolInfo ? hoverToolInfo.description : toolInfo.description : ""
    const image = toolInfo ? hoverToolInfo ? hoverToolInfo.image : toolInfo.image : ""

    return (
        <div class={descriptionClass}>
            <div class="description-content">
                <img src={image} style={{height: "6em"}}/>
                <h3 class="tool-name">{toolName} tool</h3>
            </div>
            <p class="description-hovered" dangerouslySetInnerHTML={{ __html: toolDescription }} />
        </div>
    )
}

export default ToolDescription;