import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import DrawerNavigator from './DrawerNavigator'

export default class App extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <DrawerNavigator />
      </View>
    );
  }
}