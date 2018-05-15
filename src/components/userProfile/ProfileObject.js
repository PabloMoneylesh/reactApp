import React, {Component} from 'react';
import Amplify, { API } from 'aws-amplify';
import {withAuthenticator} from 'aws-amplify-react';

import APIConfig from '../../configuration/APIConfig'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import ReactHtmlParser from 'react-html-parser';

import '../../styles/profileObjest.css'

Amplify.configure({
    API: APIConfig.apiConfig
});




class ProfileData extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.downloadLink = "";
        this.state.downloadLinkClass = "download-link-hidden";
        this.state.cardExpanded = false;

    }

    getPresignedUrl = () => {
        let path = '/getlink?id='+ this.props.profile.object.id;
        let options  = {
            headers: {Authorization: this.props.authData.signInUserSession.idToken.jwtToken},
            response: true
        };
        const self = this;
        API.get("ProfileApi", path, options )
            .then(response => {
                console.log("response: " + JSON.stringify(response));
                //alert(response.data.url);
                //self.setState({downloadLinkClass :"download-link", downloadLink: response.data.url});
                self.setState({downloadLink: response.data.url, downloadLinkClass:"download-link", cardExpanded:true});
            })
            .catch(p1 => {
                console.log("error while building download link");
                console.log(p1);
                alert("Something went wrong... Refresh the page and try one more time.");
            });

    }

    onExpandChange = () =>{
        this.setState({cardExpanded:!this.state.cardExpanded});
    }

render() {
        console.log(this);
    return (
        <Card
            className="catalog-card"
            expanded={this.state.cardExpanded}
            expandable={true}
            onExpandChange={this.onExpandChange}
        >
            <CardHeader
                title={this.props.profile.object.name}
                subtitle={this.props.catalogItem.type + " v." + this.props.catalogItem.version}
                actAsExpander={true}
                showExpandableButton={true}
                className="catalog-card-header"
            />
            <CardActions>
                <FlatButton label="Get Link"
                            onClick={this.getPresignedUrl} />}

                />
            </CardActions>
            <CardText expandable={true}>
                <div className="catalog-item-description">
                { ReactHtmlParser(this.props.catalogItem.description) }
                </div>
                <p>Is Paid: {this.props.catalogItem.isPaid ? "Yes" : "No"}</p>
                <p>Valid from: {new Date(this.props.profile.object.startDate).toLocaleDateString()}</p>
                <p>Valid to: {new Date(this.props.profile.object.endDate).toLocaleDateString() }</p>

                <Paper zDepth={3}v className={this.state.downloadLinkClass}>
                    <p>Your download link:</p>
                    <a href={this.state.downloadLink} target="_blank">Download</a>
                    <p>This link is walid for 5 minutes.</p>
                </Paper>

            </CardText>
        </Card>
    )
}
}
export default withAuthenticator(ProfileData);
