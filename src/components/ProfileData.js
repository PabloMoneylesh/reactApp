import React, {Component} from 'react';
import ProfileObject from './ProfileObject';

class ProfileData extends Component {
    constructor(props) {
        super(props);

        this.state = this.parseProfile(this.props.profile);
    }

    parseProfile = (profileString) =>{
        try {
            return {profile: JSON.parse(profileString)};
        }
        catch (e) {
            console.log(e);
        }

    };


    render() {
        console.log(this);
        console.log(this.state.profile.objects);
        if (this.state.profile.objects) {
            return (
                <table>
                    <tr><td>id</td><td>startDate</td><td>endDate</td><td>object</td></tr>
                    {this.state.profile.objects.map(object =>{return <ProfileObject profile={object} />})}
                </table>
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