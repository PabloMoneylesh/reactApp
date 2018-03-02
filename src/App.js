import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

Amplify.Logger.LOG_LEVEL = 'DEBUG';
window.LOG_LEVEL = 'DEBUG';

Amplify.configure({
    Auth: {
        // REQUIRED - Amazon Cognito Identity Pool ID
        identityPoolId: 'eu-central-1:bd014aa9-1c58-4434-bbdb-e119324a77fc',
        // REQUIRED - Amazon Cognito Region
        region: 'eu-central-1',
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'eu-central-1_3VLnIp4hl',
        // OPTIONAL - Amazon Cognito App Client ID
        userPoolWebClientId: '66difu0bi7h31l7q9jlbsdhoi4', // 26-char alphanumeric string
    }
});

/*Auth.signIn("beaviss@ukr.net", "Password1!")
    .then(user => console.log("user loggg in -- " + user))
    .catch(err => console.log(err));*/


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default withAuthenticator(App);
