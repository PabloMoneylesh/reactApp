import React, {Component} from 'react';
import {Link} from "react-router-dom";

class CatalogItem extends Component {
    seeItem = () => {
        alert(this.props.item.id);
    }

    render() {
        return (
            <tr>
                <td>{this.props.item.id}</td>
                <td>{this.props.item.name}</td>
                <td>{this.props.item.description}</td>
                <td>{this.props.item.type}</td>
                <td>{this.props.item.version}</td>
                <td>{this.props.item.isPaid}</td>
                <td><Link to={`/catalog/${ this.props.item.id }`}>Read More</Link></td>
            </tr>
        )
    }
}
export default CatalogItem;
