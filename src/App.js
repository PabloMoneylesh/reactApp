import React, {Component} from 'react';
import './App.css';
import Amplify from 'aws-amplify';

import {HashRouter , Route} from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AuthConfig from './configuration/AuthConfig'

import Catalog from './components/catalog/Catalog'
import CatalogItem from './components/catalog/CatalogItem'

import Subscribe from "./components/subscription/Subscribe";

import UserProfile from "./components/userProfile/UserProfile";
import ReactGA from 'react-ga';
import { ym } from 'react-ym';


const history = createBrowserHistory();

Amplify.configure({
    Auth: AuthConfig.auth
});

ReactGA.initialize('UA-110778284-1');
ReactGA.pageview(window.location.pathname + window.location.search);
ym.initialize('46922397');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }


    render() {
        return (
            <MuiThemeProvider>

            <div className="App">

                <HashRouter history={history}>
                    <div>


                    <Route exact path="/" component={Catalog}/>
                    <Route exact path="/catalog" component={Catalog}/>
                        <Route path="/catalog/:itemId" component={CatalogItem}/>
                    <Route path="/subscribe/:itemId" component={Subscribe}/>
                    <Route path="/profile" component={UserProfile}/>
                    </div>
                </HashRouter>


            </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
