import React, { useEffect, Fragment } from 'react'
import { useHistory } from "react-router-dom";
import mAxios from '../../utils/API';

const Auth = (props) => {
    const history = useHistory();

    useEffect(() => saveAuthToken(), []);

    const saveAuthToken = () => {
      const query = window.location.search;
      const params = new URLSearchParams(query); 
      const token = params.get('token');
      const tokenTimeout = params.get('timeout')

      if(tokenTimeout) {
          setInterval(() => {
            mAxios.get('/auth/refresh')
              .then(response => localStorage.setItem('token', response.data.token))
              .catch(() => props.setLoggedIn(false));
          }, 0.75 * tokenTimeout * 1000);
      }
  
      localStorage.setItem('token', token);
      props.setLoggedIn(localStorage['token']);
      history.push('/locations');
    }
  
    return (<Fragment/>);
  }
  
  export default Auth;
