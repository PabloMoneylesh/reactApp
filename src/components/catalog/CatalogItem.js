import React, {Component} from 'react';

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
                <td><button  onClick={this.seeItem}>get</button></td>
            </tr>
        )
    }
}
export default CatalogItem;
