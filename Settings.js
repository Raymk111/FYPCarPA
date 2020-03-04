import React, { Component } from 'react'
const obd2 = require('react-native-obd2');

import {Text, View, Picker, StyleSheet, Map, DeviceEventEmitter} from 'react-native';
import MenuButton from './components/MenuButton';
import NavBar, { NavButton, NavGroup, NavButtonText, NavTitle } from 'react-native-nav';

import { Actions } from 'react-native-router-flux';

export default class Settings extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
            {
                bluetoothDevices: [],
                loading: true,
                selectedAddress: 0
            }
    }

    componentDidMount() {
        obd2.getBluetoothDeviceNameList()
            .then((nameList) => {
                 this.setState({
                  bluetoothDevices : nameList,
                  loading: false
                });
        })
            .catch((e) => {
            console.log('Get device name error : ' + e)
        });
    }
    
    render()
    {   
        if(this.state.loading)
        {
            return(
                <View> 
                <NavBar>
                <NavGroup style={{marginLeft: 5, flex:0}}>
                    <NavButton>
                        <MenuButton navigation={this.props.navigation} />
                    </NavButton>
                </NavGroup>
                <NavTitle style={{marginTop: 5}}>
                  Settings
                </NavTitle>
                <Text style={styles.bodyContainer}>loading...</Text>
                </NavBar>
                </View>
            );
        }
        else
        {
            return(
            <>
                <View style={{flex: 1}}> 
                <NavBar>
                <NavGroup style={{marginLeft: 5, flex:0}}>
                    <NavButton>
                        <MenuButton navigation={this.props.navigation} />
                    </NavButton>
                </NavGroup>
                <NavTitle style={{marginTop: 5, flex:1}}>
                  Settings
                </NavTitle>
                </NavBar>
                <View style={styles.btDeviceContainer}>
                <Text style={styles.bodyContainer}>Bluetooth Adaptor Device:</Text>
                <Picker
                  mode='dropdown'
                  style={{backgroundColor: '#aaaaaa'}}
                  selectedValue={this.state.selectedAddress}
                  onValueChange={(itemValue, itemIndex) => this.setDeviceAddress(itemValue) }
                >
                <Picker.Item
                    label='Select Bluetooth ELM327 Adapter' 
                    value='0'/>
                {this.state.bluetoothDevices.map((item, key) => <Picker.Item label={item.name} value={item.address}/>)}
                </Picker>
                </View>
                </View>
            </>
            );
        }
    }

    setDeviceAddress(aDeviceAddress)
    {
        this.setState({selectedAddress : aDeviceAddress});
        DeviceEventEmitter.emit('setBTDeviceAddress', aDeviceAddress);
    }
}

const styles = StyleSheet.create({
  bodyContainer: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 25,
    color: '#000000'
  },
  btDeviceContainer: {
    backgroundColor: '#999999'
  }
});