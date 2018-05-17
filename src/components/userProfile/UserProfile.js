import React, {Component} from 'react';
import ProfileObject from './ProfileObject';

import '../../styles/userProfile.css'

import {withAuthenticator} from 'aws-amplify-react';

import APIConfig from '../../configuration/APIConfig'

import Header from '../Header'
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import axios from 'axios';


class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.gitProfile();
        this.loadCatalogData();
    }

    gitProfile() {
        console.log("UserProfile -gitProfile");
        let path = '/getprofile';
        let options = { // OPTIONAL
            headers: {Authorization: this.props.authData.signInUserSession.idToken.jwtToken}
        };

        axios.get(APIConfig.apiConfig.apiEndpoint + path, options)
            .then(response => {
                console.log("response: " + JSON.stringify(response));
                this.setState({userProfile: response.data});
            })
    }

    loadCatalogData() {
        console.log("UserProfile -loadCatalogData");
        let path = '/getcatalog';

        axios.get(APIConfig.apiConfig.apiEndpoint + path)
            .then(response => {
                console.log("response: " + JSON.stringify(response));
                this.setState({catalogItems: response.data.items});
            })
    }

    getUserName = () => {
        if (this.props.authState === "signedIn")
            return this.props.authData.signInUserSession.idToken.payload.email;
        return "";
    }

    renderProfileContent() {
        if (this.state.userProfile && this.state.catalogItems) {
            return this.state.userProfile.objects.map(object => {
                let catalogItem = this.findCatalogItem(object.itemId);
                if (catalogItem) {
                    object.name = catalogItem.name;
                }
                return <ListItem>
                    <ProfileObject profile={{"object": object}} catalogItem={catalogItem}/>
                </ListItem>
            })
        }
        return <CircularProgress/>
    }

    findCatalogItem(id) {
        var obj;
        for (let item of this.state.catalogItems) {
            if (item.id == id) {
                obj = item;
                break;
            }
        }
        return obj;
    }

    render() {
        console.log(this);
        return (
            <div>
                <Header logOutHandler={this.props.onStateChange} authState={this.props.authState}/>
                <Paper zDepth={3} className="profile-user-details">
                    <p>Your account details:</p>
                    <p>User email: {this.getUserName()}</p>
                </Paper>

                <List>
                    <Subheader>Active subscriptions:</Subheader>
                    {this.renderProfileContent()}
                </List>

            </div>
        );
    }
}

export default withAuthenticator(UserProfile);