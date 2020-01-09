/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,
    {
        Component
    }
from 'react';

import {
    Image,
    FlatList,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';

const obd2 = require('react-native-obd2');
obd2.ready();

var stringJson = "";
obd2.getBluetoothDeviceNameList()
     .then((nameList) => 
           {
                stringJson = JSON.stringify(nameList);
            })
      .catch((e) =>
             {
                console.log('Get device name error : ' + e);
            }
);

export default class Home extends Component {
  render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
        <FlatList data={JSON.parse(stringJson)} keyExtractor={(item, index) => index.toString()} renderItem={({item, index}) => <Text>{item.name}{item.address}</Text>} />
        
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

