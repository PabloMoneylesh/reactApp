import React, {Component} from 'react';

class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = props.auth;
        console.log("UserProfile");
        //console.log(this.state);
    }

    getUserName = () => {
        if (this.state.authState == "signedIn")
            return this.state.authData.signInUserSession.idToken.payload.email;
        return "";
    }

    getUserId = () => {
        if (this.state.authState == "signedIn")
            return this.state.authData.signInUserSession.idToken.payload.sub;
        return "";
    }

    render() {
        console.log(this);
        return (
            <div>
                <p>User email: {this.getUserName()}</p>
                <p>User id: {this.getUserId()}</p>
            </div>
        );
    }
}

export default UserProfile;