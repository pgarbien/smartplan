import React, { useState, useEffect } from 'react';
import './new_css/app_css/App.css';
import './new_css/main_page_css/MainPage.css';
import Login from './containers/Login/Login';
import DrawTool from './containers/DrawTool/DrawTool';
import AboutUs from './components/About/AboutUs';
import Layout from './containers/Layout/Layout';
import Locations from './containers/Locations/Locations';
import Auth from './containers/Auth/Auth';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [language, setLanguage] = useState('pl');

  useEffect(() => {
    setLoggedIn(localStorage['token'])
  }, []);

  return [
    <BrowserRouter>
      <Layout loggedIn={loggedIn} setLoggedIn={setLoggedIn} language={language} setLanguage={setLanguage}>
          <Switch>
            <Route path="/locations">
              <Locations/>
            </Route>
            <Route path="/draw">
              <DrawTool language={language}/>
            </Route>
            <Route path="/auth">
              <Auth setLoggedIn={setLoggedIn}/>
            </Route>
            <Route path="/about_us">
              <AboutUs/>
            </Route>
            <Route path="/">
              <Login setLoggedIn={setLoggedIn}/>
            </Route>
          </Switch>
      </Layout>
    </BrowserRouter>
  ];
};

export default App;
