import React, {Component} from 'react';
import Header from "../Header";
import Data from "../data/CatalogData"
import CatalogItem from "./CatalogItem"


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
                <table>
                    <tbody>
                    {this.state.catalogItems.map(object => {return <CatalogItem item={object}/>})}
                    </tbody>
                </table>
            )
        }
        else {
            return (<p>Loading...</p>);
        }
    }

    render() {
        console.log(this);
        return (
            <div className="catalog">
                <Header/>
                {this.renderItems()}
            </div>
        );
    }
}

export default Catalog;
