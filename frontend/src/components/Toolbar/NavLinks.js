import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import mAxios from '../../utils/API';
import '../../new_css/app_css/App.css';
import '../../pe-icon-7-stroke/css/pe-icon-7-stroke.css';
import '../../pe-icon-7-stroke/css/helper.css';
import {useTranslation} from "react-i18next";

const NavLinks = ({loggedIn, setLoggedIn}) => {
    const {t, i18n} = useTranslation('main');
    const [authUrl, setAuthUrl] = useState("javascript:void(0)");

    useEffect(() => fetchAuthLink, []);

    const fetchAuthLink = mAxios.get('/auth/link')
        .then(response => {
            setAuthUrl(response.data.authUrl)
        })
        .catch(error => {
            console.log(error);
        });

    const suplaLogo = <NavLink class="tool-bar_supla" activeClassName="tool-bar_link--active" to="/"> <img src="/smartplan.png" style={{height: "100%"}}/> </NavLink>

        // To be refactored ...

    const loggedInNav = <div className="container" style={{padding: "0 10%", maxWidth: "100%", height: 80}}>
        {suplaLogo}
        <ul class="navbar-nav" style={{paddingLeft: "60%", height: 80}}>
            {/* <li><a className="tool-bar_link" href="https://supla.org"><i class="pe-7s-share"></i>{t('navBar.website')}</a></li> */}
            <li><NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/locations"><i class="pe-7s-home"></i>{t('navBar.localization')}</NavLink></li>
            {/* <li><NavLink className="tool-bar_link" to="/about_us"><i class="pe-7s-info"></i>{t('navBar.aboutUs')}</NavLink></li> */}
            <li><a className="tool-bar_link" href={process.env.REACT_APP_SERVER_URL+"/api_docs/"}><i class="pe-7s-help2"></i>{t('navBar.documentation')}</a></li>
            <li><NavLink exact className="tool-bar_link" to="/" onClick={()=> {localStorage.removeItem('token'); setLoggedIn(false)}}><i class="pe-7s-user"></i>{t('navBar.logOut')}</NavLink></li>
        </ul>
    </div>

    const loggedOutNav = <div class="container" style={{padding: "0 10%", maxWidth: "100%", height: 80}}>
        {suplaLogo}
        <ul class="navbar-nav" style={{paddingLeft: "60%"}}>
            <li><a className="tool-bar_link" href="https://supla.org"><i class="pe-7s-share"></i>{t('navBar.website')}</a></li>
            {/* <li><NavLink className="tool-bar_link" to="/about_us"><i class="pe-7s-info"></i>{t('navBar.aboutUs')}</NavLink></li> */}
            <li><a className="tool-bar_link" href={process.env.REACT_APP_SERVER_URL+"/api_docs/"}><i class="pe-7s-help2"></i>{t('navBar.documentation')}</a></li>
            <li><a className="tool-bar_link" href={authUrl}><i class="pe-7s-user"></i>{t('navBar.logIn')}</a></li>
        </ul>
    </div>;

    return loggedIn ? loggedInNav : loggedOutNav;
}

export default NavLinks;
