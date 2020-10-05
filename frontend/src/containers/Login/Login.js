import React, { useEffect, Fragment } from 'react';
import './Login.css';

const Login = (props) => {
    useEffect(() => { props.setLoggedIn(localStorage['token']) });
  
    return (
        <Fragment>
            <div style={{ position: "fixed", width: "100vw", height: "100vh", left: 0, top: 0, backgroundImage: "url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9ad8fbc8-aee8-4e92-a04b-6abf7a036a51/das27fi-8c2ad927-671d-4474-8927-72fb1220a57c.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvOWFkOGZiYzgtYWVlOC00ZTkyLWEwNGItNmFiZjdhMDM2YTUxXC9kYXMyN2ZpLThjMmFkOTI3LTY3MWQtNDQ3NC04OTI3LTcyZmIxMjIwYTU3Yy5qcGcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.g0cV42RsVPlT9nMHiSALSnNxW_ySLL557qzHnYb8cGA')", backgroundSize: "cover", zIndex: -9999, backgroundPositionY: 80 }}></div>
            <div className="dotted-background"></div>
            <p className="motivational-quote motivational-main-quote">Feel your emotions</p>
            <p className="motivational-quote motivational-secondary-quote">Always be yourself</p>
        </Fragment>
    );
  }
  
  export default Login;
