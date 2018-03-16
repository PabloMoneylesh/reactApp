import React, {Component} from 'react';
import './App.css';
import Amplify, { API } from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';

import UserProfile from './components/UserProfile'
import Header from './components/Header'

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
                endpoint: "https://0r4dohcks0.execute-api.eu-central-1.amazonaws.com/dev"
            }
        ]
    }
});

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        this.gitProfile();
    }

    gitProfile(){
        const self = this;
        let path = '/getprofile';
        let options  = { // OPTIONAL
            headers: {Authorization: this.props.authData.signInUserSession.idToken.jwtToken}, // OPTIONAL
            response: true // OPTIONAL (return entire response object instead of response.data)
        };
        console.log(options);
        API.get("ProfileApi", path, options )
            .then(response => {
            console.log("response:");
            console.log(response);
            self.setState({userProfile : response.data});
        })
            .catch(p1 => {
                console.log(p1);
                self.setState({userProfile : "error"});
            });
    }

    render() {
        return (
            <div className="App">
                <Header logOutHandler = {this.props.onStateChange}/>
                <UserProfile auth={{authState: this.props.authState, authData: this.props.authData}} userProfile={this.state.userProfile}/>
            </div>
        );
    }
}

export default withAuthenticator(App);
