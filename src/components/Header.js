import React, {Component} from 'react';
import Amplify from 'aws-amplify';
import '../styles/header.css'
import {Link} from "react-router-dom";

import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const menuButtons = (
    <nav>
        <FlatButton label="Home"
                    containerElement={<Link to="/"/>}
                    />
        <FlatButton label="Catalog"
                    containerElement={<Link to="/catalog"/>}
                    />
        <FlatButton label="Profile"
                    containerElement={<Link to="/profile"/>}
                   />

    </nav>
);

class Header extends Component {
    constructor(props) {
        super(props);
        this.logOutHandler = props.logOutHandler;
        console.log(this);
    }

    signOut = () => {
        var self = this;
        Amplify.Auth.signOut().then(function () {
            console.log("signOutDone");
            self.logOutHandler();
        })['catch'](function (err) {
            console.log(err);
        });
    }

    getRightMenuButton = () =>{
       return this.props.authState === "signedIn" ?
           <FlatButton label="LogOut"
                       onClick = {this.signOut}
                       />
            :
           <FlatButton label="LogIn"
                       containerElement={<Link to="/profile"/>}
                       />

    }
    render() {

        return (
            <AppBar
                iconElementLeft={menuButtons}
                iconElementRight={this.getRightMenuButton()}
            >
            </AppBar>
        );
    }
}

export default Header;