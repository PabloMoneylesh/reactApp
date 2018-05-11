import React, {Component} from 'react';
import Header from "../Header";

import "../../styles/catalog.css"
import { API } from 'aws-amplify';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import {Link} from "react-router-dom";


class Catalog extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        const self = this;
        let path = '/getcatalog';
        let options  = { // OPTIONAL
            response: true // OPTIONAL (return entire response object instead of response.data)
        };

        API.get("ProfileApi", path, options )
            .then(response => {
                //console.log("response: " + JSON.stringify(response));
                self.setState({catalogItems :response.data.items});
            })
            .catch(p1 => {
                console.log(p1);
                //self.setState({userProfile : "error"});
            });

    }

    renderItems() {
        //console.log(this);
        if (this.state.catalogItems) {
            return (
                    this.state.catalogItems.map(object => {return <CatalogCard item={object}/>})
            )
        }
        else {
            return <CircularProgress />
        }
    }

    render() {
        console.log(this);
        return (
            <div>
                <Header/>
                {this.renderItems()}
            </div>
        );
    }
}

const CatalogCard = props => (

    <Card
        fullWidth={true}
        className="catalog-card"
    >
        <CardHeader
            title={props.item.name}
            subtitle = { "v." + props.item.version}
            actAsExpander={true}
            showExpandableButton={true}
            className="catalog-card-header"
        />
        <CardActions>
            <FlatButton label="ReadMore"
//                        containerElement={<Link to={"/catalog/" + props.item.id} params={{ data: props.item }} />}
                        containerElement={<Link to={
                                {
                                    pathname: "/catalog/" + props.item.id,
                                    data: props.item
                                }
                        } />}

            />
        </CardActions>
        <CardText expandable={true}>
            <p>{props.item.description}</p>
            <p>{props.item.type}</p>
            <p>{props.item.version}</p>
            <p>{props.item.isPaid}</p>
        </CardText>
    </Card>
);

export default Catalog;
