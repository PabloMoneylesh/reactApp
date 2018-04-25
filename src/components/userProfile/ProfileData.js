import React, {Component} from 'react';
import ProfileObject from './ProfileObject';
import Data from "../data/CatalogData"
import {withAuthenticator} from 'aws-amplify-react';
import CircularProgress from 'material-ui/CircularProgress';

class ProfileData extends Component {
    constructor(props) {
        super(props);
    }

    enrichProfileObjectData(object){
        var catalogItem = Data.catalogData.getById(object.itemId);
        if (!catalogItem){
             object.object = {"name": ""};
            return object;
        }
        object.object = {"name": catalogItem.name}
        return object;
    }

    render() {
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