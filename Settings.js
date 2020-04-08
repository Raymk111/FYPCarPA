import React, { Component } from 'react'
const obd2 = require('react-native-obd2');

import {Text, View, ScrollView, Picker, StyleSheet, Map, DeviceEventEmitter, SafeAreaView, StatusBar} from 'react-native';
import MenuButton from './components/MenuButton';
import { NavButton, NavGroup, NavButtonText, NavTitle } from 'react-native-nav';
import AsyncStorage from '@react-native-community/async-storage';

import { Actions } from 'react-native-router-flux';
import { Themes } from './utils/Theme';
import { DbKeys } from './utils/DbKeys';

const Color = require('./utils/Color');

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
        this.readBTDeviceFromStorage();
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
    
    componentDidUpdate()
    {
        this.readBTDeviceFromStorage();
    }
    
    render()
    {   
        if(this.state.loading)
        {
            return(
                <View> 
                    <StatusBar backgroundColor={Themes.navBar.backgroundColor}/>
                <SafeAreaView style={Themes.navBar} forceInset={{top: 'always'}}>
                <NavGroup style={{marginLeft: 5, flex:1, alignItems:'center'}}>
                    <NavButton>
                        <MenuButton navigation={this.props.navigation} />
                    </NavButton>
                    <Text style={[Themes.navBarTitle, {marginRight: 40}]}>
                        Settings
                    </Text>
                </NavGroup>
                </SafeAreaView>
                </View>
            );
        }
        else
        {
            return(
            <>
                <View style={styles.bodyContainer}>
                <StatusBar backgroundColor={Themes.navBar.backgroundColor}/>
                <SafeAreaView style={Themes.navBar} forceInset={{top: 'always'}}>
                <NavGroup style={{marginLeft: 5, flex:1, alignItems:'center'}}>
                    <NavButton>
                        <MenuButton navigation={this.props.navigation} />
                    </NavButton>
                    <Text style={[Themes.navBarTitle, {marginRight: 40}]}>
                        Settings
                    </Text>
                </NavGroup>
                </SafeAreaView>
                <ScrollView>
                <View style={styles.settingContainer}>
                <Text style={styles.headerContainer}>Bluetooth Adaptor Device:</Text>
                <Picker
                  mode='dropdown'
                  style={{backgroundColor: '#aaaaaa'}}
                  selectedValue={this.state.selectedAddress}
                  onValueChange={(itemValue, itemIndex) => this.setDeviceAddress(itemValue) }
                >
                <Picker.Item
                label='Select Bluetooth ELM327 Adapter' 
                value='0'/>
                {this.state.bluetoothDevices.map((item, key) => <Picker.Item label={item.name} value={item.address} key={item.address}/>)}
                </Picker>
                </View>
                <View style={styles.settingContainer}>
                <Text style={styles.headerContainer}>Data Keys Read From Device:</Text>
                <ScrollView style={{height: 160, backgroundColor: '#aaaaaa'}}>
                {this.produceReadKeys()}
                </ScrollView>
                </View>
                </ScrollView>
                </View>
            </>
            );
        }
    }
    
    produceReadKeys()
    {
        if(this.state.adaptorReadKeyMap && this.state.adaptorReadKeyMap[this.state.selectedAddress])
            {
                let cmdAll = this.state.adaptorReadKeyMap[this.state.selectedAddress];
                let cmdKeys = Object.keys(cmdAll);
                let cmdData = cmdKeys.map(function(key) { return cmdAll[key]; });
                return(
                    <>
                    {
                        cmdData.map(
                            (item, key) => 
                                (
                                    <Text style={{fontSize: 15}}>
                                        {item.cmdName} => Last Value {item.cmdResult}
                                    </Text>
                                )
                        )
                    }
                    </>
                );
            }
        else
        {
            return(
                <Text style={{fontSize: 20}}>
                    Data Name => Data Key
                </Text>
            );
            
        }
    }

    setDeviceAddress(aDeviceAddress)
    {
        if(this.state.selectedAddress != aDeviceAddress && aDeviceAddress != "0")
        {
            this.setState({selectedAddress : aDeviceAddress});
            DeviceEventEmitter.emit('setBTDeviceAddress', aDeviceAddress);
            this.writeBTDeviceToStorage(aDeviceAddress);
        }
    }

    readBTDeviceFromStorage = async () => {
        
        try
        {
            var item = await AsyncStorage.getItem(DbKeys.STORAGE_KEY_BTADDR);
            
            var readKeysString = await AsyncStorage.getItem(DbKeys.STORAGE_KEY_READKEYS);
            
            var readKeys = JSON.parse(readKeysString);
            if(this.state.selectedAddress != item || Object.keys(this.state.adaptorReadKeyMap).length != Object.keys(readKeys).length)
            {
                console.log('read', item, readKeys);
                this.setState({selectedAddress : item, adaptorReadKeyMap: readKeys});
            }
        }
        catch (e) 
        {
            console.log(e);
        }
    }

    writeBTDeviceToStorage = async (aDeviceAddress) => {
        
        try
        {
            await AsyncStorage.setItem(DbKeys.STORAGE_KEY_BTADDR, aDeviceAddress);
            console.log('write', aDeviceAddress);
        }
        catch (e) 
        {
            console.log(e);
        }
    }
}

const styles = StyleSheet.create({
    bodyContainer: {
        flex: 1,
        backgroundColor: '#aaaaaa'
    },
    headerContainer: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 25,
        color: '#000000'
    },
    settingContainer: {
        backgroundColor: '#999999',
        borderWidth: 2,
        borderColor: '#555555',
        margin: 4
    }
});