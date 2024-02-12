import React from 'react'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import NavBar from './nav-bar'
import Home from './home/home';
import PersonContainer from './person/person-container'
import DeviceContainer from './device/device-container'

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import ClientContainer from "./client/client-container";
import ChatRoom from "./chat/chat-container";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
    }

    setUser = (user) => {
        this.setState({ user }); // Update the user state with the provided user object
        console.log("AAAP:",this.state);
        console.log("AAAP-User:",this.state.user);
    }

    render() {
        return (
            <div className={styles.back}>
            <Router>
                <div>
                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={(props) => <Home {...props} setUser={this.setUser} />}
                        />

                        <Route
                            exact
                            path='/person'
                            render={(props) => <PersonContainer {...props} user={this.state.user} setUser={this.setUser}/>}
                        />

                        <Route
                            exact
                            path='/device'
                            render={(props) => <DeviceContainer {...props} user={this.state.user} setUser={this.setUser}/>}
                        />

                        <Route
                            exact
                            path='/client'
                            render={(props) => <ClientContainer {...props} user={this.state.user} setUser={this.setUser}/>}
                        />

                        <Route
                            exact
                            path='/chat'
                            render={(props) => <ChatRoom {...props} user={this.state.user} setUser={this.setUser}/>}
                        />

                        {/*{this.state.user && this.state.user.role === 'admin' && (*/}
                        {/*    <>*/}
                        {/*        <Route exact path='/person' component={PersonContainer} />*/}
                        {/*        <Route exact path='/device' component={DeviceContainer} />*/}
                        {/*        <Redirect from='/client' to='/' /> /!* Redirect if admin tries to access client route *!/*/}
                        {/*    </>*/}
                        {/*)}*/}

                        {/*{this.state.user && this.state.user.role === 'client' && (*/}
                        {/*    <>*/}
                        {/*        <Route exact path='/client' component={ClientContainer} />*/}
                        {/*        <Redirect from='/person' to='/' /> /!* Redirect if client tries to access person route *!/*/}
                        {/*        <Redirect from='/device' to='/' /> /!* Redirect if client tries to access device route *!/*/}
                        {/*    </>*/}
                        {/*)}*/}

                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                        <Route render={() =><ErrorPage/>} />
                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App
