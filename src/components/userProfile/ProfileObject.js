import React, {Component} from 'react';

class ProfileData extends Component {
    constructor(props) {
        super(props);

    }

    getPresignedUrl = () => {
        var bucket = this.props.profile.object.bucket;
        var objKey = this.props.profile.object.key;
        alert(bucket + " " + objKey);
    }

render() {
    return (
        <tr>
            <td>{this.props.profile.id}</td>
            <td>{this.props.profile.startDate}</td>
            <td>{this.props.profile.endDate}</td>
            <td>{this.props.profile.object.name}</td>
            <td><button  onClick={this.getPresignedUrl}>get</button></td>
        </tr>
    )
}
}
export default ProfileData;
