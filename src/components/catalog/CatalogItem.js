import React, {Component} from 'react';
import Header from "../Header";
import "../../styles/catalog.css"
import APIConfig from '../../configuration/APIConfig'
import CircularProgress from 'material-ui/CircularProgress';
import {CatalogCard} from "./CatalogCard";
import axios from 'axios';

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

            let path = '/getcatalog?itemId=' + this.props.match.params.itemId;

            axios.get(APIConfig.apiConfig.apiEndpoint+path)
                .then(response => {
                    // console.log("response: " + JSON.stringify(response));
                    this.setState({itemData: response.data.items[0]});
                })
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