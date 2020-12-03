import React, { Component, useEffect, useState } from 'react';
import mAxios from '../../utils/API';
import '../../new_css/levels_list_css/LevelsList.css';
import '../../new_css/devices_css/Devices.css';
import {useTranslation} from 'react-i18next';

const Devices = ({ location, activeLevel, activeDevices, manageDevice, creator }) => {
    const {t, i18n} = useTranslation('main');
    const [devices, setDevices] = useState(activeDevices);

    useEffect(() => {
        const levelId = location.levels[activeLevel].id
        mAxios.get('/devices?levelId=' + levelId)
            .then(response => {
                setDevices(response.data.filter(dev => dev.locationId == location.id));
            });
    }, [activeLevel]);

    return (
        <div>
            <h3 className="devices_header"> </h3>
            <div class="dropdown">
                <button class="drop-btn"> {t('tool.all')} <span class="caret"/> </button>
                <div class="dropdown-content active-devices">
                    {  devices && devices.length > 0 ? devices.map(device => (
                        <div className="level" key={device.name} 
                            onClick={() => { manageDevice(device) }}
                            onMouseEnter={() => { creator.highlightedDevice = device.id; creator.drawCanvas() }}
                            onMouseLeave={() => { creator.highlightedDevice = null; creator.drawCanvas() }}>
                            {device.name}
                        </div>
                    )) : <div className="level">{t('tool.noDevices')}</div> }
                </div>
            </div>
        </div>
    );
};

export default Devices;
