import React, {useState} from 'react'
import NavLinks from './NavLinks'

const Toolbar = (props) => {
    return (
        <div className="navbar">
            <div className="tool-bar__container">
                <h1 className="logo_text">supla</h1>
            </div>
            <NavLinks loggedIn={props.loggedIn} />
        </div>
    );
}

export default Toolbar;