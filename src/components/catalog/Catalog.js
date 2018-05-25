import React, {Component} from 'react';
import Header from "../Header";

import "../../styles/catalog.css"
import CircularProgress from 'material-ui/CircularProgress';

import {CatalogCard} from "./CatalogCard";

import axios from 'axios';
import APIConfig from '../../configuration/APIConfig'
import MetaTags from 'react-meta-tags';

class Catalog extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        let path = '/getcatalog';
        axios.get(APIConfig.apiConfig.apiEndpoint + path)
            .then(response => {
                //console.log("response: " + JSON.stringify(response));
                this.setState({catalogItems: response.data.items.sort((a, b) => a.id - b.id)});
            })
    }

    renderItems() {
        if (this.state.catalogItems) {
            return (
                this.state.catalogItems.map(object => {
                    return <CatalogCard key={object.id} item={object}
                                        button={{label: "Read More", path: "/catalog/" + object.id}}/>
                })
            )
        }
        else {
            return <CircularProgress/>
        }
    }

    renderMeta() {
        return (
            <MetaTags>
                <title>Product Catalog</title>
                <meta name="description" content="Joomla plugins catalog. Download plugins for Joomla CMS"/>
                <meta property="og:title" content="Product Catalog"/>
            </MetaTags>
        )
    }

    render() {
        //console.log(this)
        return (
            <div>
                {this.renderMeta()}
                <Header logOutHandler={this.props.onStateChange} authState={this.props.authState}/>
                {this.renderItems()}
            </div>
        );
    }
}

export default Catalog;
