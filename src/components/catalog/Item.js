import React, {Component} from 'react';
import Data from "../data/CatalogData"
import Header from "../Header";
import {Link} from "react-router-dom";

class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        this.loadData();
    }

    findById(item) {
        return item.id == this.props.match.params.itemId;
    }

    loadData() {
        this.setState({itemData: Data.catalogData.items.find(this.findById, this)});
    }

    renderContent() {
        if (this.state.itemData) {
            return (
                <div>
                    <p>{this.state.itemData.name}</p>
                    <p>{this.state.itemData.description}</p>
                    <p>{this.state.itemData.type}</p>
                    <p>{this.state.itemData.version}</p>
                    <p>{this.state.itemData.isPaid}</p>
                    <p><Link to={`/subscribe/${ this.props.match.params.itemId }`}>Get It!</Link></p>
                </div>
            )
        }
        else {
            return (<p>Loading...</p>);
        }
    }


    render() {
        console.log(this);
        return (
            <div>
                <Header/>
                <p>Item {this.props.match.params.itemId}</p>
                {this.renderContent()}
            </div>
        )
    }
}

export default Item;

