import React, {Component} from 'react';

class ProfileData extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        console.log(this);
        if (this.props.profile) {
            return (
                <div>
                    <p>{JSON.stringify(this.props.profile)}</p>
                </div>
            )
        }
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }
}

export default ProfileData;