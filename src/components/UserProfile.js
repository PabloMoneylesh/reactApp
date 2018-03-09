import React, {Component} from 'react';
import ProfileData from './ProfileData'

class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = props.auth;
       // console.log("UserProfile");
        //console.log(this.state);
    }

    getUserName = () => {
        if (this.state.authState === "signedIn")
            return this.state.authData.signInUserSession.idToken.payload.email;
        return "";
    }

    getUserId = () => {
        if (this.state.authState === "signedIn")
            return this.state.authData.signInUserSession.idToken.payload.sub;
        return "";
    }

    getProfile = () => {
        if(this.props.userProfile){
            return <ProfileData profile={this.props.userProfile}/>;
        }

        return <p>loading...</p>
    }

    render() {
        console.log(this);
        return (
            <div>
                <p>User email: {this.getUserName()}</p>
                <p>User id: {this.getUserId()}</p>
                {this.getProfile()}
            </div>
        );
    }
}

export default UserProfile;