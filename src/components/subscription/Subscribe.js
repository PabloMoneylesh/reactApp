import React, {Component} from 'react';

import '../../styles/userProfile.css'

import Amplify, { API } from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';

import AuthConfig from '../../configuration/AuthConfig'
import APIConfig from '../../configuration/APIConfig'

import Header from '../Header'

Amplify.configure({
    Auth: AuthConfig.auth,
    API: APIConfig.apiConfig
});



class Subscribe extends Component {
    constructor(props) {
        super(props);

        this.state = {};

    }

    getUserName = () => {
        if (this.props.authState === "signedIn")
            return this.props.authData.signInUserSession.idToken.payload.email;
        return "";
    }

    getUserId = () => {
        if (this.props.authState === "signedIn")
            return this.props.authData.signInUserSession.idToken.payload.sub;
        return "";
    }

    getSubscriptionButton = () => {
        if (this.props.authState === "signedIn")
            return (<button onClick={this.subsribe}> get It!</button>);
        return "";
    }

    subsribe = () => {
        const self = this;
        let path = '/subscribe';
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
        console.log(this);
        return (
            <div>
                <Header logOutHandler={this.props.onStateChange} authState = {this.props.authState}/>
                <p>Item {this.props.match.params.itemId}</p>
                <div className="user-subscribe">
                    <p>User email: {this.getUserName()}</p>
                    <p>User id: {this.getUserId()}</p>
                    <p>{this.getSubscriptionButton()}</p>
                </div>

            </div>
        );
    }
}

export default withAuthenticator(Subscribe);