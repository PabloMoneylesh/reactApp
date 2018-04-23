import React, {Component} from 'react';
import ProfileData from './ProfileData'

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



class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        // console.log("UserProfile");
        //console.log(this.state);
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
                console.log("response: " + JSON.stringify(response));
                self.setState({userProfile :response.data});
            })
            .catch(p1 => {
                console.log(p1);
                self.setState({userProfile : "error"});
            });
    }

    getUserName = () => {
        if (this.state.authState === "signedIn")
            return this.state.authData.signInUserSession.idToken.payload.email;
        return "";
    }

    getUserId = () => {
        if (this.state.authState === "signedIn")
            return this.state.authData.signInUserSession.idToken.payload.sub;
        return "";
    }

    getProfile = () => {
        if (this.state.userProfile) {
            return <ProfileData profile={this.state.userProfile}/>;
        }

        return <p>loading...</p>
    }

    render() {
        console.log(this);
        return (
            <div>
                <Header logOutHandler={this.props.onStateChange} authState = {this.props.authState}/>
                <div className="user-profile">
                    <p>User email: {this.getUserName()}</p>
                    <p>User id: {this.getUserId()}</p>
                </div>
                <div>
                    {this.getProfile()}
                </div>
            </div>
        );
    }
}

export default withAuthenticator(UserProfile);