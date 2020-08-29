import React from 'react';
import { NavLink } from 'react-router-dom'

const NavLinks = (props) => {
    const loggedInNav = <nav>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/">Home</NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/locations">Locations</NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/draw">Draw</NavLink>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/draw/devices">Draw devices</NavLink>
        <NavLink exact className="tool-bar_link" to="/" onClick={()=> {localStorage.removeItem('token')}}>Logout</NavLink>
    </nav>

    const loggedOutNav = <nav>
        <NavLink exact className="tool-bar_link" activeClassName="tool-bar_link--active" to="/">Home</NavLink>
        <a className="tool-bar_link" style={{cursor: "pointer"}} href="https://supla.org">Project page</a>
        <a className="tool-bar_link" style={{cursor: "pointer"}} href="https://svr36.supla.org/oauth/v2/auth?client_id=7_1iz810w77xfoko0w4k4c8s88w40gs80w444wcwo404gc8kc8cc&scope=account_r%20channels_r&state=example-state&response_type=code&redirect_uri=http%3A%2F%2F192.168.0.115%3A4000%2Fauth%2Fsupla%2Fcallback">Login</a>
    </nav>


    return (
        props.loggedIn ? loggedInNav : loggedOutNav 
    );
}

export default NavLinks;
