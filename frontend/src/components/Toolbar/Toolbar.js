import React from 'react';
import NavLinks from './NavLinks';
import '../../new_css/app_css/App.css'

const Toolbar = (props) => {
    return (
        <nav className="navbar">
            <NavLinks loggedIn={props.loggedIn} />
        </nav>
    );
}

export default Toolbar;