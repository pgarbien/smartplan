import React, { useEffect, Fragment } from 'react';
import './Login.css';

const Login = (props) => {
    useEffect(() => { props.setLoggedIn(localStorage['token']) });
  
    return (
        <Fragment>
            <div style={{position: "fixed", width: "100vw", height: "100vh", left: 0, top: 0, backgroundImage: 'url("https://www.supla.org/assets/img/home.jpg")', backgroundSize: "cover", zIndex: "-9999", backgroundSize: "50%", backgroundRepeat: "no-repeat", backgroundPositionX: "center", backgroundPositionY: "center", marginTop: 80}}></div>    
        </Fragment>
    );
  }
  
  export default Login;
