import React, {Component} from 'react';
import Header from "../Header";

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Link} from "react-router-dom";
import Data from "../data/CatalogData"

class CatalogItem extends Component {

    constructor(props) {
        super(props);

        this.itemData = {};
        this.loadData();
    }

    findById(item) {
        return item.id == this.props.match.params.itemId;
    }

    loadData() {
        this.itemData = Data.catalogData.items.find(this.findById, this);
    }

    render() {
        return (
            <div>
                <Header/>
                <Card
                    fullWidth={true}
                    className="catalog-card"
                    expandable={false}
                    expanded={true}
                >
                    <CardHeader
                        title={this.itemData.name}
                        subtitle={"v." + this.itemData.version}
                        actAsExpander={true}
                        showExpandableButton={true}
                        className="catalog-card-header"
                    />

                    <CardText expandable={true}>
                        <p>{this.itemData.description}</p>
                        <p>{this.itemData.type}</p>
                        <p>{this.itemData.version}</p>
                        <p>{this.itemData.isPaid}</p>
                    </CardText>
                    <CardActions>
                        <FlatButton label="Get It!"
                                    containerElement={<Link to={"/subscribe/" + this.itemData.id}/>}

                        />
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export default CatalogItem;