import React, {Component} from 'react';
import Amplify, { API } from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';

import APIConfig from '../../configuration/APIConfig'

import '../../styles/profileObjest.css'

Amplify.configure({
    API: APIConfig.apiConfig
});

class ProfileData extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.state.downloadLinkClass = "download-link-hidden";

    }

    getPresignedUrl = () => {
        var bucket = this.props.profile.object.bucket;
        var objKey = this.props.profile.object.key;
        var objId = this.props.profile.id;

        let path = '/getlink?id='+objId;
        let options  = {
            headers: {Authorization: this.props.authData.signInUserSession.idToken.jwtToken},
            response: true
        };

        const self = this;
        API.get("ProfileApi", path, options )
            .then(response => {
                console.log("response: " + JSON.stringify(response));
                //alert(response.data.url);
                self.setState({downloadLinkClass :"download-link", downloadLink: response.data.url});
            })
            .catch(p1 => {
                console.log(p1);
            });

    }



render() {
        console.log(this);
    return (
        <tr>
            <td>{this.props.profile.id}</td>
            <td>{this.props.profile.startDate}</td>
            <td>{this.props.profile.endDate}</td>
            <td>{this.props.profile.object.name}</td>
            <td><button  onClick={this.getPresignedUrl}>get</button></td>
            <td><a className={this.state.downloadLinkClass} href={this.state.downloadLink} target="_blank">download</a></td>
        </tr>
    )
}
}
export default withAuthenticator(ProfileData);
