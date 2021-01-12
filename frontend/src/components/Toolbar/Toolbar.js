import React from 'react';
import NavLinks from './NavLinks';
import '../../new_css/app_css/App.css'

const Toolbar = ({loggedIn, setLoggedIn}) => {
    //TODO Move logo outside NavLinks
    return (
        <nav className="navbar">
            <NavLinks loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </nav>
    );
}

export default Toolbar;