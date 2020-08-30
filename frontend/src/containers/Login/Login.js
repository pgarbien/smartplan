import React, { useEffect, Fragment } from 'react'
import './Login.css'

const Login = (props) => {

    useEffect(() => { props.setLoggedIn(localStorage['token']) });
  
    return (
        <Fragment>
            <div className="dotted-background"></div>
            <video className="video" width="1920" height="1080" autoPlay muted loop controls>
                <source src="https://atomowki.azurewebsites.net/video.mp4" type="video/mp4"/>
            </video> 
            <p className="motivational-quote motivational-main-quote">Feel your emotions</p>
            <p className="motivational-quote motivational-secondary-quote">Always be yourself</p>
        </Fragment>
    );
  }
  
  export default Login;
