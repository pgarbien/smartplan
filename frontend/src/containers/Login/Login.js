import React, { useEffect, Fragment } from 'react'

const Login = () => {

    useEffect(() => {

    }, []);
  
    return (
        <Fragment>
            <a href="https://svr36.supla.org/oauth/v2/auth?client_id=7_1iz810w77xfoko0w4k4c8s88w40gs80w444wcwo404gc8kc8cc&scope=account_r&state=example-state&response_type=code&redirect_uri=http%3A%2F%2F192.168.0.115%3A4000%2Fauth%2Fsupla%2Fcallback">
                <span>Siema</span>
            </a>
            <div style={{position: "fixed",width: "100vw",height: "100vh",left: 0,top: 0,backgroundImage: "url('https://www.searchpng.com/wp-content/uploads/2019/02/Dot-background-PNG-Image.png')",backgroundSize: 90,zIndex: -99,opacity: .2}}></div>
            <video className="video" width="1920" height="1080" autoPlay muted loop controls>
                <source src="http://localhost:3000/video.mp4" type="video/mp4"/>
            </video> 
            <p style={{position: "absolute", left: "50%", top: "35%", transform: "translate(-50%, -50%)", fontSize: 100, color: "#fff"}}>Feel your emotions</p>
            <p style={{position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", fontSize: 65, color: "#fff"}}>Always be yourself</p>
        </Fragment>
    );
  }
  
  export default Login;
