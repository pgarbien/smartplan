import React, { useEffect, Fragment } from 'react';
import './Login.css';

const Login = (props) => {
    useEffect(() => { props.setLoggedIn(localStorage['token']) });
  
    return (
        <Fragment>
            <div className="dotted-background"></div>
            <p className="motivational-quote motivational-main-quote">Feel your emotions</p>
            <p className="motivational-quote motivational-secondary-quote">Always be yourself</p>
        </Fragment>
    );
  }
  
  export default Login;
