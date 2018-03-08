import React, {Component} from 'react';
import './App.css';
import Amplify, { API } from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';

import UserProfile from './components/UserProfile'

//Amplify.Logger.LOG_LEVEL = 'DEBUG';
//window.LOG_LEVEL = 'DEBUG';

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
    },
    API: {
        endpoints: [
            {
                name: "ProfileApi",
                endpoint: "https://0r4dohcks0.execute-api.eu-central-1.amazonaws.com/dev/getprofile"
            }
        ]
    }
});

/*Auth.signIn("beaviss@ukr.net", "Password1!")
    .then(user => console.log("user loggg in -- " + user))
    .catch(err => console.log(err));*/


class App extends Component {
    constructor(props) {
        super(props);
    }

    gitProfile(){
        let path = '';
        let myInit = { // OPTIONAL
            headers: {}, // OPTIONAL
            response: true // OPTIONAL (return entire response object instead of response.data)
        };
        API.get("ProfileApi", path, myInit)
            .then(response => {
            console.log("response:");
            console.log(response);
        })
            .catch(p1 => {console.log(p1);});
    }

    render() {
        console.log(this);
        this.gitProfile();
        return (
            <div className="App">
                <UserProfile auth={{authState: this.props.authState, authData: this.props.authData}}/>
            </div>
        );
    }
}

export default withAuthenticator(App, true);
