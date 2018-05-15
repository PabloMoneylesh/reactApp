import React, {Component} from 'react';
import Header from "../Header";

import "../../styles/catalog.css"
import { API } from 'aws-amplify';
import CircularProgress from 'material-ui/CircularProgress';

import {CatalogCard} from "./CatalogCard";

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
        if (this.state.catalogItems) {
            return (
                    this.state.catalogItems.map(object => {return <CatalogCard item={object} button={{label:"Read More", path: "/catalog/" + object.id}} />})
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

export default Catalog;
