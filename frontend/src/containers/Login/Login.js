import React, { useEffect, Fragment } from 'react';
import '../../new_css/app_css/App.css';

const Login = (props) => {
    useEffect(() => { props.setLoggedIn(localStorage['token']) });
  
    return (
        <Fragment>
            <div class="body-container home-page">
                <div class="main-page-image"></div>  
            </div>  
        </Fragment>
    );
  }
  
  export default Login;
