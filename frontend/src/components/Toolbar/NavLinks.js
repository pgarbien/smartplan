import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import mAxios from '../../utils/API';
import '../../new_css/app_css/App.css';
import '../../pe-icon-7-stroke/css/pe-icon-7-stroke.css';
import '../../pe-icon-7-stroke/css/helper.css';

const NavLinks = ({loggedIn}) => {
    const [authUrl, setAuthUrl] = useState("");

    useEffect(() => fetchAuthLink, []);

    const fetchAuthLink = mAxios.get('/auth/link')
        .then(response => {
            setAuthUrl(response.data.authUrl)
        })
        .catch(error => {
            console.log(error);
        });

    const suplaLogo = <NavLink class="tool-bar_supla" activeClassName="tool-bar_link--active" to="/"> 2D Home </NavLink>

    const loggedInNav = <div class="container">
        {suplaLogo}
        <ul class="navbar-nav">
            <li>
                <a className="tool-bar_link" href="https://supla.org"><i class="pe-7s-share"></i>Strona SUPLA</a>
            </li>
            <li>
                <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/locations"><i class="pe-7s-home"></i>Lokalizacje</NavLink>
            </li>
            <li>
                <NavLink className="tool-bar_link" to="/about_us"><i class="pe-7s-info"></i>O Nas</NavLink>
            </li>
            <li>
                <a className="tool-bar_link" href={process.env.REACT_APP_SERVER_URL+"api_docs"}><i class="pe-7s-help2"></i>Dokumentacja API</a>
            </li>
            <li>
                <NavLink exact className="tool-bar_link" to="/" onClick={()=> {localStorage.removeItem('token')}}><i class="pe-7s-user"></i>Wyloguj</NavLink>
            </li>
        </ul>
    </div>

    const loggedOutNav = <div class="container">
        {suplaLogo}
        <ul class="navbar-nav">
            <li><a className="tool-bar_link" href="https://supla.org"><i class="pe-7s-share"></i>Strona SUPLA</a></li>
            <li><NavLink className="tool-bar_link" to="/about_us"><i class="pe-7s-info"></i>O Nas</NavLink></li>
            <li><a className="tool-bar_link" href={process.env.REACT_APP_SERVER_URL+"api_docs"}><i class="pe-7s-help2"></i>Dokumentacja API</a></li>
            <li><a className="tool-bar_link" href={authUrl}><i class="pe-7s-user"></i>Zaloguj</a></li>
        </ul>
    </div>;

    return loggedIn ? loggedInNav : loggedOutNav;
}

export default NavLinks;
