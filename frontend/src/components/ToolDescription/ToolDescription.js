import React from 'react';
import {useTranslation} from 'react-i18next';

const ToolDescription = ({toolInfo, hoverToolInfo}) => {
    const {t, i18n} = useTranslation('main');
    const descriptionClass = hoverToolInfo ? "description active" : "description"
    const toolName = toolInfo ? hoverToolInfo ? hoverToolInfo.name : toolInfo.name : ""
    const toolDescription = toolInfo ? hoverToolInfo ? hoverToolInfo.description : toolInfo.description : ""
    const image = toolInfo ? hoverToolInfo ? hoverToolInfo.image : toolInfo.image : ""

    return (
        <div class={descriptionClass}>
            <div class="description-content">
                <img src={image} style={{height: "6em"}}/>
                <h3 class="tool-name">{t('tool.toolBeginning') + toolName + t('tool.toolEnding')}</h3>
            </div>
            <p class="description-hovered" dangerouslySetInnerHTML={{ __html: toolDescription }} />
        </div>
    )
}

export default ToolDescription;