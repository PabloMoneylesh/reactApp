import React, {Component} from 'react';
import Amplify from 'aws-amplify';
import '../styles/header.css'
import {Link} from "react-router-dom";

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
            //logger.error(err);_this2.error(err);
        });
    }

    render() {

        return (
            <div class="header">
                <nav className="nav-menu">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/catalog">Catalog</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                    </ul>
                </nav>
                {this.props.authState === "signedIn" ?
                    <div class="greeting">
                        <span>Hello </span>
                        <button onClick={this.signOut}>LogOut</button>
                    </div>
                    :
                    <div class="greeting">
                        <Link to="/profile">Profile</Link>
                    </div>
                }


            </div>
        );
    }
}

export default Header;