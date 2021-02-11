import React, { useEffect, Fragment } from "react";
import "../../new_css/app_css/App.css";
import ReactPlayer from "react-player";
import { useTranslation } from "react-i18next";
const Login = (props) => {
  const { t, i18n } = useTranslation("main");
  useEffect(() => {
    props.setLoggedIn(localStorage["token"]);
  });

  return (
    <Fragment>
      <div class="main-page-content">
        <div class="body-container home-page">
          <h1 class="video-text">{t("login.howTo")}</h1>
          <ReactPlayer class="supla-video" url="https://youtu.be/ZN-EkceM9qY" />
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
