import React from 'react';
import {Switch, Route} from 'react-router-dom';

import './App.css';
import HomePage from "./pages/homepage/homepage.component";
import ShopPage from "./pages/shop/shop.component";
import SignInAndSignOutPage from "./pages/sign-in-and-sign-up/sign-in-and-sign-up.component";
import Header from "./components/header/header.component";
import {auth, createUserProfileDocument} from "./firebase/firebase.utils";


class App extends React.Component {

    unsubscribeFromAuth = null;

    constructor() {
        super();
        this.state = {
            currentUser: null
        }
    }

    componentDidMount() {
        this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
            if(userAuth){
                const userRef = createUserProfileDocument(userAuth);

                (await userRef).onSnapshot(snapshot => {
                    this.setState({
                        currentUser : {
                            id : snapshot.id,
                            ...snapshot.data()
                        }
                    });
                });
            }
            this.setState({
                currentUser : userAuth
            })
        });
    }

    componentWillUnmount() {
        this.unsubscribeFromAuth();
    }

    render() {
        return (
            <div>
                <Header currentUser={this.state.currentUser}/>
                <Switch>
                    <Route exact path='/' component={HomePage}/>
                    <Route exact path='/shop' component={ShopPage}/>
                    <Route exact path='/signin' component={SignInAndSignOutPage}/>
                </Switch>
            </div>
        )
    }
}

export default App;
