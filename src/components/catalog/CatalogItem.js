import React, {Component} from 'react';
import Header from "../Header";
import "../../styles/catalog.css"

import {API} from 'aws-amplify';
import CircularProgress from 'material-ui/CircularProgress';

import {CatalogCard} from "./CatalogCard";

class CatalogItem extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        if (this.props.location && this.props.location.data) {
            this.state = {itemData: this.props.location.data};
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        if (!(this.props.location && this.props.location.data)) {
            console.log("CatalogItem - request ");
            const self = this;
            let path = '/getcatalog?itemId=' + this.props.match.params.itemId;
            let options = { // OPTIONAL
                //headers: {Authorization: this.props.authData.signInUserSession.idToken.jwtToken}, // OPTIONAL
                response: true // OPTIONAL (return entire response object instead of response.data)
            };

            API.get("ProfileApi", path, options)
                .then(response => {
                    // console.log("response: " + JSON.stringify(response));
                    self.setState({itemData: response.data.items[0]});
                })
                .catch(p1 => {
                    console.log(p1);
                    //self.setState({userProfile: "error"});
                });
        }
    }

    renderContent() {
        if (this.state.itemData) {
            return (
                <CatalogCard expanded={true} item={this.state.itemData}
                             button={{label: "Download", path: "/subscribe/" + this.state.itemData.id}}/>
            )
        }
        else {
            return <CircularProgress/>;
        }
    }

    render() {
        console.log(this);
        return (
            <div>
                <Header/>
                {this.renderContent()}
            </div>

        )
    }
}

export default CatalogItem;