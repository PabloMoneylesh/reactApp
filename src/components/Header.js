import React, {Component} from 'react';
import Amplify, { API } from 'aws-amplify';

class Header extends Component {
    constructor(props) {
        super(props);
        this.logOutHandler = props.logOutHandler;
        console.log(this);
    }

    signOut = () => {
        var self= this;
       Amplify.Auth.signOut().then(function () {
            console.log("signOutDone");
            self.logOutHandler();
        })['catch'](function (err) {
            console.log(err);
            //logger.error(err);_this2.error(err);
        });
    }

    render() {

        return (
            <div>
                <button onClick={this.signOut}>LogOut</button>
            </div>
        );
    }
}

export default Header;