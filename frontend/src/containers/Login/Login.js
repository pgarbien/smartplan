import React, { useEffect, Fragment } from 'react';
import '../../new_css/app_css/App.css';
import ReactPlayer from 'react-player';
import {useTranslation} from 'react-i18next';
const Login = (props) => {
    const {t, i18n} = useTranslation('main');
    useEffect(() => { props.setLoggedIn(localStorage['token']) });
  
    return (
        <Fragment>
            <div class="body-container home-page">
                <div class="main-page-image"></div> 
                <h1 class="video-text">
                    {t('login.howTo')}
                </h1>
                <ReactPlayer class="supla-video" url='https://www.youtube.com/watch?v=nt4ejdr5PRY&feature=youtu.be' /> 
            </div>  
        </Fragment>
    );
  }
  
  export default Login;
