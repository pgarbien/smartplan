import React from 'react';
import '../Locations/NewLocationModal.css';

const ToolDescription = ({toolInfo, hoverToolInfo}) => {
    const descriptionWidth = hoverToolInfo ? { width: "200%" } : {}
    const toolName = toolInfo ? hoverToolInfo ? hoverToolInfo.name : toolInfo.name : ""
    const toolDescription = toolInfo ? hoverToolInfo ? hoverToolInfo.description : toolInfo.description : ""

    return (
        <div className="description" style={descriptionWidth}>
            <h3>{toolName} tool</h3>
            <p dangerouslySetInnerHTML={{ __html: toolDescription }} />
        </div>
    )
}

export default ToolDescription;