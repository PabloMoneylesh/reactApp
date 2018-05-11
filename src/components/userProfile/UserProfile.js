import React, {Component} from 'react';
import ProfileData from './ProfileData'

import '../../styles/userProfile.css'

import Amplify, { API } from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';

import AuthConfig from '../../configuration/AuthConfig'
import APIConfig from '../../configuration/APIConfig'

import Header from '../Header'
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

Amplify.configure({
    Auth: AuthConfig.auth,
    API: APIConfig.apiConfig
});


class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.gitProfile();
       // this.loadCatalogData();
    }

    gitProfile(){
        console.log("UserProfile -gitProfile");
        const self = this;
        let path = '/getprofile';
        let options  = { // OPTIONAL
            headers: {Authorization: this.props.authData.signInUserSession.idToken.jwtToken}, // OPTIONAL
            response: true // OPTIONAL (return entire response object instead of response.data)
        };

        API.get("ProfileApi", path, options )
            .then(response => {
                console.log("UserProfile -gitProfile - done");
                //console.log("response: " + JSON.stringify(response));
                self.setState({userProfile :response.data});
            })
            .catch(p1 => {
                console.log(p1);
                self.setState({userProfile : "error"});
            });
    }

    loadCatalogData() {
        console.log("UserProfile -loadCatalogData");
        const self = this;
        let path = '/getcatalog';
        let options  = { // OPTIONAL
            //headers: {Authorization: this.props.authData.signInUserSession.idToken.jwtToken}, // OPTIONAL
            response: true // OPTIONAL (return entire response object instead of response.data)
        };

        API.get("ProfileApi", path, options )
            .then(response => {
                console.log("UserProfile -loadCatalogData - done");
                //console.log("response: " + JSON.stringify(response));
                self.setState({catalogItems :response.data.items});
            })
            .catch(p1 => {
                console.log(p1);
            });

    }

    getUserName = () => {
        if (this.props.authState === "signedIn")
            return this.props.authData.signInUserSession.idToken.payload.email;
        return "";
    }

    getProfile () {
        if (this.state.userProfile ) {
            return <ProfileData profile={this.state.userProfile} catalog={this.state.catalogItems}/>;
        }
        return <CircularProgress />
    }

    render() {
        console.log(this);
        return (
            <div>
                <Header logOutHandler={this.props.onStateChange} authState = {this.props.authState}/>
                <Paper zDepth={3} className="profile-user-details">
                    <p>Your account details:</p>
                    <p>User email: {this.getUserName()}</p>
                </Paper>

                <div>
                    {this.getProfile()}
                </div>
            </div>
        );
    }
}

export default withAuthenticator(UserProfile);