import React, {Component} from 'react';

class ProfileData extends Component {
    constructor(props) {
        super(props);

    }

    getPresignedUrl = () => {
        alert(1);
    }

render() {
    return (
        <tr>
            <td>{this.props.profile.id}</td>
            <td>{this.props.profile.startDate}</td>
            <td>{this.props.profile.endDate}</td>
            <td>{this.props.profile.object}</td>
            <td><button  onClick={this.getPresignedUrl}>get</button></td>
        </tr>
    )
}
}
export default ProfileData;
