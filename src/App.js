import React, {Component} from 'react';
import './App.css';
import Amplify from 'aws-amplify';

import {BrowserRouter, Link, Route} from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";




import AuthConfig from './configuration/AuthConfig'
import APIConfig from './configuration/APIConfig'

import Catalog from './components/catalog/Catalog'
import Item from './components/catalog/Item'

import Subscribe from "./components/subscription/Subscribe";

import UserProfile from "./components/userProfile/UserProfile";

//Amplify.Logger.LOG_LEVEL = 'DEBUG';
//window.LOG_LEVEL = 'DEBUG';

const history = createBrowserHistory();

Amplify.configure({
    Auth: AuthConfig.auth,
    API: APIConfig.apiConfig
});


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }


    render() {
        return (
            <div className="App">

                <BrowserRouter histiry={history}>
                    <div>


                    <Route exact path="/" component={Catalog}/>
                    <Route exact path="/catalog" component={Catalog}/>
                        <Route path="/catalog/:itemId" component={Item}/>
                    <Route path="/subscribe/:itemId" component={Subscribe}/>
                    <Route path="/profile" component={UserProfile}/>
                    </div>
                </BrowserRouter>


            </div>
        );
    }
}

export default App;
