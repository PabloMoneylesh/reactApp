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
            body: { //objectUniqueId, objectId, subscriptionPeriod
                itemId: this.props.match.params.itemId,
                itemUniqueId: Math.random().toString(36).substring(7),
                subscriptionPeriod: 12
            },
            response: true // OPTIONAL (return entire response object instead of response.data)
        };
        console.log(options);
        API.post("ProfileApi", path, options )
            .then(response => {
                console.log("response:");
                console.log(response);
                this.props.history.push('/profile')
            })
            .catch(p1 => {
                console.log(p1);
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