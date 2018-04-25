import React, {Component} from 'react';

import '../../styles/subscribe.css'

import Amplify, { API } from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';

import AuthConfig from '../../configuration/AuthConfig'
import APIConfig from '../../configuration/APIConfig'

import Header from '../Header'
import Data from "../data/CatalogData"

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

Amplify.configure({
    Auth: AuthConfig.auth,
    API: APIConfig.apiConfig
});


class Subscribe extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.itemData = {};
        this.loadData();
    }

    findById(item) {
        return item.id == this.props.match.params.itemId;
    }

    loadData() {
        this.itemData = Data.catalogData.items.find(this.findById, this);
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
        API.post("ProfileApi", path, options )
            .then(response => {
                this.props.history.push('/profile')
            })
            .catch(error => {
                console.log(error);
                alert("something went wrong...<br>refresh the page and try one more time.");
            });
    }



    render() {
        console.log(this);
        return (
            <div>
                <Header logOutHandler={this.props.onStateChange} authState = {this.props.authState}/>
                <Paper zDepth={3} className="subscribe-user-details">
                    <p>Your account details:</p>
                    <p>email: {this.getUserName()}</p>
                </Paper>
                <Paper zDepth={2} className="subscribe-item-details">
                    <p>You are about to get:</p>
                    <p>{this.itemData.name}</p>
                </Paper>

                <RaisedButton  label="Get It!"
                            onClick={this.subsribe}
                            primary={true}
                />

            </div>
        );
    }
}

export default withAuthenticator(Subscribe);