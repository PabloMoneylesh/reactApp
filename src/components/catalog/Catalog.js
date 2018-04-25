import React, {Component} from 'react';
import Header from "../Header";
import Data from "../data/CatalogData"
import "../../styles/catalog.css"

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
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
        this.setState({catalogItems: Data.catalogData.items});
    }

    renderItems() {
        if (this.state.catalogItems) {
            return (

                    this.state.catalogItems.map(object => {return <CatalogCard item={object}/>})
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
                        containerElement={<Link to={"/catalog/" + props.item.id} />}

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
