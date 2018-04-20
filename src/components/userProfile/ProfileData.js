import React, {Component} from 'react';
import ProfileObject from './ProfileObject';
import Data from "../data/CatalogData"

class ProfileData extends Component {
    constructor(props) {
        super(props);

        this.state = this.parseProfile(this.props.profile);
    }

    parseProfile = (profileString) => {
        try {
            return {profile: JSON.parse(profileString)};
        }
        catch (e) {
            console.log(e);
        }

    };


    enrichProfileObjectData(object){
        var catalogItem = Data.catalogData.getById(object.itemId);
        if (!catalogItem){
             object.object = {
                "name": "",
                "bucket": "",
                "key": ""
            };
            return object;
        }



        object.object = {
            "name": catalogItem.name,
            "bucket": catalogItem.bucket,
            "key": catalogItem.key
        }


        return object;
    }


    render() {
        console.log(this);
        console.log(this.state.profile.objects);
        if (this.state.profile.objects) {
            return (
                <table>
                    <tbody>
                    <tr>
                        <td>id</td>
                        <td>startDate</td>
                        <td>endDate</td>
                        <td>object</td>
                    </tr>
                    {this.state.profile.objects.map(object => {
                        return <ProfileObject profile={this.enrichProfileObjectData(object)}/>
                    })}
                    </tbody>
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