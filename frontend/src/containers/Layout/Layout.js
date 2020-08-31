import React, { Fragment } from 'react';
import Toolbar from '../../components/Toolbar/Toolbar';
import './Layout.css';

const Layout = (props) => {
    return (
        <Fragment>
            <Toolbar loggedIn={props.loggedIn} />
            <div className="layout-body">
                {props.children}
            </div>
        </Fragment>
    );
}

export default Layout;