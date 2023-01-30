import React from 'react';

import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import {Login} from '../Login';

const RootStack = createSharedElementStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator 
    screenOptions={{
        useNativeDriver: true,
        headerShown: false
      }}
      initialRouteName={'Login'}
      detachInactiveScreens={false}
    >
        <RootStack.Screen name="Login" component={Login}/>
    </RootStack.Navigator>
);

export default RootStackScreen;