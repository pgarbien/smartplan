import React from 'react';
import NavLinks from './NavLinks';
import '../../new_css/app_css/App.css'

const Toolbar = (props) => {
    //TODO Move logo outside NavLinks
    return (
        <nav className="navbar">
            <NavLinks loggedIn={props.loggedIn} />
        </nav>
    );
}

export default Toolbar;