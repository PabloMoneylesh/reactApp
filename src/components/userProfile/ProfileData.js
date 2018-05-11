import React, {Component} from 'react';
import ProfileObject from './ProfileObject';
import Data from "../data/CatalogData"
import {withAuthenticator} from 'aws-amplify-react';


class ProfileData extends Component {

    enrichProfileObjectData(object){
      /*  var catalogItem = Data.catalogData.getById(object.itemId);
        if (!catalogItem){
             object.object = {"name": ""};
            return object;
        }
        object.object = {"name": catalogItem.name}
        */

        object.object = {"name": ""};
        return object;
    }


    render() {
        console.log(this);
            return (
                <div>
                    {this.props.profile.objects.map(object => {
                        return <ProfileObject profile={this.enrichProfileObjectData(object)}/>
                    })}
                </div>
            )
    }
}

export default withAuthenticator(ProfileData);