import React, { useEffect, Fragment } from 'react'
import { useHistory } from "react-router-dom";

const Auth = (props) => {
    const history = useHistory();

    useEffect(() => saveAuthToken());

    const saveAuthToken = () => {
      const query = window.location.search;
      const params = new URLSearchParams(query); 
      const token = params.get('token');

      if(token != null) {
          localStorage.setItem('token', token);
      }
  
      props.setLoggedIn(localStorage['token']);
      history.push('/locations');
    }
  
    return (<Fragment/>);
  }
  
  export default Auth;
