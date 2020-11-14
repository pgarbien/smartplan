import React from 'react';
import '../Locations/NewLocationModal.css';

const ToolDescription = ({toolInfo, hoverToolInfo}) => {
    const descriptionWidth = hoverToolInfo ? { width: "200%" } : {}
    const toolName = toolInfo ? hoverToolInfo ? hoverToolInfo.name : toolInfo.name : ""
    const toolDescription = toolInfo ? hoverToolInfo ? hoverToolInfo.description : toolInfo.description : ""

    return (
        <div className="description">
            <div class="description-content">
                <i class="custom-icon pe-7s-home"/>
                <h3 class="tool-name">{toolName} tool</h3>
            </div>
            <p class="description-hovered" dangerouslySetInnerHTML={{ __html: toolDescription }} />
        </div>
    )
}

export default ToolDescription;