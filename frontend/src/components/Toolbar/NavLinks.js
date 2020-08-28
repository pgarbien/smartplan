import React from 'react';
import { NavLink } from 'react-router-dom'

const NavLinks = (props) => {
    const loggedInNav = <nav>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/">Home</NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/locations">Locations</NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/draw">Draw</NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/draw/devices"> Draw devices </NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/logout"> Wyloguj</NavLink>
    </nav>

    const loggedOutNav = <nav>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/">Home</NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/locations">Locations</NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/draw">Draw</NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/draw/devices"> Draw devices </NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/logout"> Wyloguj</NavLink>
    </nav>

    return (
        props.loggedIn ? loggedInNav : loggedOutNav 
    );
}

export default NavLinks;