import React, {Component} from 'react';
import Header from "../Header";

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from "react-router-dom";
import { API } from 'aws-amplify';
import CircularProgress from 'material-ui/CircularProgress';

class CatalogItem extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
//        this.itemData = Data.catalogData.items.find(this.findById, this);
        if(this.props.location && this.props.location.data) {
            console.log(this.props.location.data);
            this.setState({itemData:this.props.location.data});
        }
        else {

                const self = this;
                let path = '/getcatalog?itemId=' + this.props.match.params.itemId;
                let options  = { // OPTIONAL
                    //headers: {Authorization: this.props.authData.signInUserSession.idToken.jwtToken}, // OPTIONAL
                    response: true // OPTIONAL (return entire response object instead of response.data)
                };

                API.get("ProfileApi", path, options )
                    .then(response => {
                        console.log("response: " + JSON.stringify(response));
                        self.setState({itemData :response.data.items[0]});
                    })
                    .catch(p1 => {
                        console.log(p1);
                        self.setState({userProfile : "error"});
                    });


        }
    }

    renderContent(){
        if(this.state.itemData){

        return (
            <Card
                fullWidth={true}
                className="catalog-card"
                expandable={false}
                expanded={true}
            >
                <CardHeader
                    title={this.state.itemData.name}
                    subtitle={"v." + this.state.itemData.version}
                    actAsExpander={true}
                    showExpandableButton={true}
                    className="catalog-card-header"
                />

                <CardText expandable={true}>
                    <p>{this.state.itemData.description}</p>
                    <p>{this.state.itemData.type}</p>
                    <p>{this.state.itemData.version}</p>
                    <p>{this.state.itemData.isPaid}</p>
                    {
                       this.state.itemData.pageLink &&
                        <RaisedButton label="documentation"
                                      linkButton={true}
                                      href={this.state.itemData.pageLink}
                                      target="_blank"
                        />
                    }
                </CardText>
                <CardActions>
                    <RaisedButton  label="Get It!" primary={true}
                                containerElement={<Link to={"/subscribe/" + this.state.itemData.id}/>}

                    />
                </CardActions>
            </Card>)
        }
        else {
            return <CircularProgress />;
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