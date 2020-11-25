import React, { Fragment, useState } from 'react';
import Toolbar from '../../components/Toolbar/Toolbar';
import '../../new_css/app_css/App.css';
import {useTranslation} from "react-i18next";

const Layout = (props) => {
    const [t, i18n] = useTranslation('common');
    const [language, setLanguage] = useState('en');

    return (
        <Fragment>
            <div class="page-content">
                <Toolbar loggedIn={props.loggedIn} />
                <div class="layout-body">
                    <div class="loaded-content">
                        {props.children}
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="container-fluid">
                    <div class="footer-left" onClick={() => { 
                        if(language == "pl") {
                            setLanguage('en')
                            i18n.changeLanguage('pl')
                        } else {
                            setLanguage('pl')
                            i18n.changeLanguage('en')
                        } }}>Polski</div>
                    <div class="footer-right">Made by: atomówki</div>
                    <div class="footer-center">
                    <div class="footer-center">
                        <span class="text-muted">SUPLA 2D Home, extension for </span>
                        <a href="https://www.supla.org" class="brand-nav-link">www.supla.org</a></div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Layout;