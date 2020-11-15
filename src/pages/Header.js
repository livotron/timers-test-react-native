import React, { Component } from "react";
import { signout } from '../services/auth';
import { Button, View } from 'react-native';

export default class Header extends Component {

    handleSignOut() {
        console.log("Sign outing")
        signout();
    }
    render() {
       return <View>
           <Button title="Sign Out" onPress={()=> this.handleSignOut()}></Button>
       </View>

    };
}