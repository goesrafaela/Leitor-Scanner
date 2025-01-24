import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import Login from "../../screens/Login";
import Home from "../../screens/Home";
import Scanner from "../../screens/Scanner";


const {Navigator, Screen} = createNativeStackNavigator()

export default function(){
    return(
        <Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <Screen name="Login" component={Login}/>
            <Screen name="Home" component={Home}/>
            <Screen name="Scanner" component={Scanner}/>
        </Navigator>
    )
}