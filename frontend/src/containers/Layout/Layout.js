import React, { Fragment } from 'react';
import Toolbar from '../../components/Toolbar/Toolbar';
import '../../new_css/app_css/App.css';

const Layout = (props) => {
    return (
        <Fragment>
            <div class="page-content">
                <Toolbar loggedIn={props.loggedIn} />
                <div class="layout-body">
                    <div class="loaded-content">
                        {props.children}
                    </div>
                </div>
            </div>
            <div class="footer">
                <div class="container-fluid">
                    <div class="footer-left">Polski</div>
                    <div class="footer-right">Made by: atomówki</div>
                    <div class="footer-center">
                    <div class="footer-center">
                        <span class="text-muted">SUPLA 2D Home, extension for </span>
                        <a href="https://www.supla.org" class="brand-nav-link">www.supla.org</a></div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Layout;