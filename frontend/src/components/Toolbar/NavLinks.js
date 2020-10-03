import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import mAxios from '../../utils/API';
import './NavLinks.css';

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

    const loggedInNav = <nav>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/">Home</NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/locations">Locations</NavLink>
        <a className="tool-bar_link" href="https://supla.org">Project page</a>
        <a className="tool-bar_link" href="https://supla.org">About us</a>
        <a className="tool-bar_link" href="https://supla.org">Contact</a>
        <NavLink exact className="tool-bar_link" to="/" onClick={()=> {localStorage.removeItem('token')}}>Logout</NavLink>
    </nav>;

    const loggedOutNav = <nav>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/">Home</NavLink>
        <a className="tool-bar_link" href="https://supla.org">Project page</a>
        <a className="tool-bar_link" href="https://supla.org">About us</a>
        <a className="tool-bar_link" href="https://supla.org">Contact</a>
        <a className="tool-bar_link" href={authUrl}>Login</a>
    </nav>;

    return (loggedIn ? loggedInNav : loggedOutNav);
}

export default NavLinks;
