import React, {Component} from 'react';
import ProfileObject from './ProfileObject';
import Data from "../data/CatalogData"
import {withAuthenticator} from 'aws-amplify-react';

class ProfileData extends Component {
    constructor(props) {
        super(props);
        console.log(this);

        this.state = {profile: this.props.profile};
    }

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
       // console.log(this);

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
        else if (this.state.profile.state == "notFound"){
            console.log("profile not Found");
        }
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }
}

export default withAuthenticator(ProfileData);