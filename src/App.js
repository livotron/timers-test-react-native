/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { auth, db } from './services/firebase';
import firebase from 'firebase';
import { PublicRoute, PrivateRoute } from './services/auth';
import {
  Route,
  NativeRouter as Router,
  Switch,
  Redirect,
} from "react-router-native";

import Clock from './pages/Clock';
import Login from './pages/Login.js';
import Signup from './pages/Signup';
import Header from './pages/Header'
import { createBrowserHistory } from "history";

class App extends Component {

  constructor() {
    super();
    this.state = {
      authenticated: false,
      loading: true
    };
  }


  componentDidMount() {
    console.log("component did mount")
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
        });
        db.goOnline();
        let userStatusDatabaseRef = db.ref('/statusMobile/' + user.uid);



        db.ref('.info/connected').on('value', (snapshot) => {
          console.log("Try to connect", snapshot.val())
          if (snapshot.val() == false) {
            return;
          };
          let timeNow = + Date.now();
          try {
            userStatusDatabaseRef.once('value', snapshot => {
              let lastStatus = snapshot.val() || { total_time: 0,
                last_leave: timeNow,
                last_entry: timeNow,
                last_changed: timeNow,
                isOnline: false };
              console.log("Got Last status ", lastStatus);
              if (lastStatus.isOnline) {
                return;
              }
              let isOfflineForDatabase = {
                isOnline: false,
                last_changed: firebase.database.ServerValue.TIMESTAMP,
                total_time: lastStatus.total_time + lastStatus.last_leave - lastStatus.last_entry,
                last_entry: + Date.now(),
                last_leave: firebase.database.ServerValue.TIMESTAMP,
              };
              let isOnlineForDatabase = {
                isOnline: true,
                last_changed: firebase.database.ServerValue.TIMESTAMP,
                total_time: (lastStatus.total_time || 0) + lastStatus.last_leave - lastStatus.last_entry,
                last_entry: + Date.now(),
                last_leave: lastStatus.last_leave || firebase.database.ServerValue.TIMESTAMP,
              };
              console.log("set on disconnect")
              userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(() => {

                userStatusDatabaseRef.set(isOnlineForDatabase)
              })
            })
          } catch (error) {
            this.setState({ readError: error.message });
          }
          db.ref('.info/connected').off();
        })

      } else {

        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    })
  }

  render() {
    return (
      <>
        <Header></Header>
        {/* <StatusBar barStyle="dark-content" /> */}
        {this.state.loading === true ? <Text>Loading...</Text> :
          <Router>
            <Switch>
              <Route exact path="/"><Redirect to="/login" /></Route>
                 <PrivateRoute path="/clock" authenticated={this.state.authenticated} component={Clock}></PrivateRoute>
                 <PublicRoute path="/signup" authenticated={this.state.authenticated} component={Signup}></PublicRoute>
                 <PublicRoute path="/login" authenticated={this.state.authenticated} component={Login}></PublicRoute>
              <Text>Inside switch</Text>
            </Switch>
          </Router>}
        {/* <Text>Logged</Text>} */}
      </>
    );
  }

};


export default App;
