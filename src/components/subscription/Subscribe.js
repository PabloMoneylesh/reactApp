import React, {Component} from 'react';

import '../../styles/subscribe.css'

import Amplify, {API} from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';

import AuthConfig from '../../configuration/AuthConfig'
import APIConfig from '../../configuration/APIConfig'

import Header from '../Header'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

Amplify.configure({
    Auth: AuthConfig.auth,
    API: APIConfig.apiConfig
});

const subscriptionPeriod = 12;


class Subscribe extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        if (this.props.location && this.props.location.itemData) {
            //console.log(this.props.location.itemData);
            this.itemData = this.props.location.itemData;
        }
    }

    getUserName = () => {
        if (this.props.authState === "signedIn")
            return this.props.authData.signInUserSession.idToken.payload.email;
        return "";
    }

    subsribe = () => {
        let path = '/subscribe';
        let options = { // OPTIONAL
            headers: {Authorization: this.props.authData.signInUserSession.idToken.jwtToken}, // OPTIONAL
            body: { //objectUniqueId, objectId, subscriptionPeriod
                itemId: this.props.match.params.itemId,
                itemUniqueId: Math.random().toString(36).substring(7),
                subscriptionPeriod: subscriptionPeriod
            },
            response: true // OPTIONAL (return entire response object instead of response.data)
        };
        API.post("ProfileApi", path, options)
            .then(response => {
                this.props.history.push('/profile')
            })
            .catch(error => {
                console.log(error);
                alert("something went wrong... refresh the page and try one more time.");
            });
    }

    renderItemDetails() {

        if (this.itemData)
            return (
                <div>
                    <p>You are about to get subscription for:</p>
                    <p>{this.itemData.name}</p>
                    <p>version: {this.itemData.version}</p>
                    <p>Is Paid: {this.itemData.isPaid ? "Yes" : "No"}</p>
                    <p>subscription period is {subscriptionPeriod} months.</p>
                    <RaisedButton label="Get It!"
                                  onClick={this.subsribe}
                                  primary={true}
                    />
                </div>
            )
        else
            return (
                <p>Something went wrong... Try to start subscription process once again.</p>
            )
    }

    render() {
        console.log(this);
        return (
            <div>
                <Header logOutHandler={this.props.onStateChange} authState={this.props.authState}/>
                <Paper zDepth={3} className="subscribe-user-details">
                    <p>Your account details:</p>
                    <p>email: {this.getUserName()}</p>
                </Paper>
                <Paper zDepth={2} className="subscribe-item-details">
                    {this.renderItemDetails()}
                </Paper>
            </div>
        );
    }
}

export default withAuthenticator(Subscribe);