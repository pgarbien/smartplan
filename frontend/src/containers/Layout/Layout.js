import React, { Fragment } from 'react';
import Toolbar from '../../components/Toolbar/Toolbar';

const Layout = (props) => {

    return (
        <Fragment>
            <Toolbar loggedIn={props.loggedIn} />
            <div style={{padding: "20px 20% 20px 20%"}}>
                {props.children}
            </div>
        </Fragment>
    );
}

export default Layout;