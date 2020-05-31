import React, { useEffect, Fragment } from 'react'

const Login = () => {

    useEffect(() => {

    }, []);
  
    return (
        <Fragment>
            <a href="https://svr36.supla.org/oauth/v2/auth?client_id=7_1iz810w77xfoko0w4k4c8s88w40gs80w444wcwo404gc8kc8cc&scope=account_r&state=example-state&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fauth">
                <span>Siema</span>
            </a>
        </Fragment>
    );
  }
  
  export default Login;
  