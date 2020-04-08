'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    DeviceEventEmitter,
    ScrollView,
    SafeAreaView,
    StatusBar
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import MenuButton from './components/MenuButton';
import { NavButton, NavGroup, NavButtonText, NavTitle } from 'react-native-nav';
import AsyncStorage from '@react-native-community/async-storage';
import { Themes } from './utils/Theme.js';
import { DbKeys } from './utils/DbKeys';

const obd2 = require('react-native-obd2');
const Color = require('./utils/Color');

export default class statsDash extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
          speed: '0km/h',
          rpm: '0RPM',
          engineRunTime: '00:00:00',
          isStartLiveData: false,
          gpsState: '-',
          btStatus : '-',
          btDeviceList: [],
          btSelectedDeviceAddress: '',
          obdStatus: 'disconnected',
          debug : '-',
          obd2Data : { } 
        };

        this.btStatus = this.btStatus.bind(this);
        this.obdStatus = this.obdStatus.bind(this);
        this.obdLiveData = this.obdLiveData.bind(this);
    }

    btStatus(data)
    {
        if(this.state.btSelectedDeviceAddress == "")
        {
            this.setState({btStatus : "Not Set"});
        }
        else if(this.state.btStatus != data.status)
        {
            this.setState({btStatus : data.status});
        }
    }

    obdStatus(data)
    {
        if(this.state.obdStatus != data.status)
        {
            this.setState({obdStatus : data.status});
        }
    }

    obdLiveData(data)
    {
        var stateUpdateObj = {};
        var haveData = false;
        
        let copyData = JSON.parse(JSON.stringify(this.state.obd2Data));
        if(copyData[data.cmdID] && data.cmdResult != "NODATA" && copyData[data.cmdID].cmdResult != data.cmdResult)
        {
            copyData[data.cmdID] = data;
            stateUpdateObj["obd2Data"] = copyData;
            haveData = true;
        }
        else if(copyData[data.cmdID] == null && data.cmdResult != "NODATA")
        {
            copyData[data.cmdID] = data;
            stateUpdateObj["obd2Data"] = copyData;
            haveData = true;
        }

        if (data.cmdID === 'ENGINE_RPM')
        {
            stateUpdateObj['rpm'] = data.cmdResult;
            haveData = true;
        }

        if (data.cmdID === 'SPEED')
        {
            stateUpdateObj['speed'] = data.cmdResult;
            haveData = true;
        }
        
        if(haveData)
        {
            this.setState(stateUpdateObj);
        }
    }

    componentDidMount()
    {
        this.btStatusListener = DeviceEventEmitter.addListener('obd2BluetoothStatus', this.btStatus);
        this.obdStatusListener = DeviceEventEmitter.addListener('obd2Status', this.obdStatus);

        this.setDeviceAddressListener = DeviceEventEmitter.addListener('setBTDeviceAddress', this.setDeviceAddress.bind(this));
        this.readBTDeviceFromStorage();

        this.onReady();
    }

    componentWillUnmount()
    {
        this.stopLiveData();
        this.btStatusListener.remove();
        this.obdStatusListener.remove();
    }

    onReady()
    {
        obd2.ready();
    }

    startLiveData()
    {
        
        this.obdLiveDataListener = DeviceEventEmitter.addListener('obd2LiveData', this.obdLiveData);
        obd2.setMockUpMode(false);
        obd2.startLiveData(this.state.btSelectedDeviceAddress);
        this.setState({isStartLiveData: true});
    }

    stopLiveData()
    {
        this.setState({
            isStartLiveData: false,
            direction: '-',
            bluetoothStatus: '-',
        });
        
        this.obdLiveDataListener && this.obdLiveDataListener.remove();
        obd2.stopLiveData();
        
        this.writeKnownKeys();
    }
    
    writeKnownKeys = async () => {
        try
        {
            var readKeysString = await AsyncStorage.getItem(DbKeys.STORAGE_KEY_READKEYS);
            var readKeys = JSON.parse(readKeysString);
            if(readKeys && readKeys != "" && this.state.obd2Data && this.state.btSelectedDeviceAddress != "")
            {
                readKeys[this.state.btSelectedDeviceAddress] = this.state.obd2Data;
                console.log('write 1', readKeys);
                await AsyncStorage.setItem(DbKeys.STORAGE_KEY_READKEYS, JSON.stringify(readKeys));
            }
            else if(this.state.obd2Data && this.state.btSelectedDeviceAddress != "")
            {
                var newAdaptorReadKeysObj = {};
                newAdaptorReadKeysObj[this.state.btSelectedDeviceAddress] = this.state.obd2Data;
                console.log('write all', newAdaptorReadKeysObj);
                await AsyncStorage.setItem(DbKeys.STORAGE_KEY_READKEYS, JSON.stringify(newAdaptorReadKeysObj));
            }
        }
        catch(e)
        {
            console.log(e);
        }
    }

    setDeviceAddress(aDeviceAddress)
    {
        console.log('Setting btSelectedDeviceAddress :' + aDeviceAddress);
        this.setState({
            btSelectedDeviceAddress : aDeviceAddress
        });
    }

    runMenu(value)
    {
        switch(value) {
          case 1 : 
            this.startLiveData();
            break;
          case 2 :
            this.stopLiveData();
            break;
          default :
            break;
        }
    }
    
    readBTDeviceFromStorage = async () => {
        
        try
        {
            var item = await AsyncStorage.getItem(DbKeys.STORAGE_KEY_BTADDR);
            if(item != "0")
            {
                console.log('set', item);
                this.setState({btSelectedDeviceAddress : item});
            }
        }
        catch (e) 
        {
            console.log(e);
        }
    }

    render()
    {
        let startLiveColor = this.state.isStartLiveData || this.state.btSelectedDeviceAddress == "" ? Color.DISABLED_COLOR : Color.BLACK;
        let stopLiveColor = this.state.isStartLiveData ? Color.BLACK : Color.DISABLED_COLOR;
        let originData = this.state.obd2Data;
        let cmdKeys = Object.keys(this.state.obd2Data);
        let cmdData = cmdKeys.map(function(key) { return originData[key]; });
        
        return(
            <MenuProvider style={{flex: 1, backgroundColor: "#aaaaaa"}}  skipInstancesCheck>
            <View style={{flex: 1}}>
            <StatusBar backgroundColor={Themes.navBar.backgroundColor}/>
            <SafeAreaView style={Themes.navBar} forceInset={{top: 'always'}}>
                <NavGroup style={{marginLeft: 5, flex:1, alignItems:'center'}}>
                    <NavButton>
                        <MenuButton navigation={this.props.navigation} />
                    </NavButton>
                    <Text style={Themes.navBarTitle}>
                        Dashboard
                    </Text>
                    <NavButton>
                        <Menu onSelect={this.runMenu.bind(this)}>
                            <MenuTrigger>
                                <Text style={Themes.navBarRightButton}>
                                    &#8942;
                                </Text>
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption disabled={this.state.isStartLiveData || this.state.btSelectedDeviceAddress == ""} value={1}>
                                    <Text style={[styles.menuOptionText, {color: startLiveColor}]} >Start Live Data</Text>
                                </MenuOption>
                                <MenuOption disabled={!this.state.isStartLiveData} value={2}>
                                    <Text style={[styles.menuOptionText, {color: stopLiveColor}]}>Stop Live Data</Text>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </NavButton>
                </NavGroup>
                </SafeAreaView>
                <View style={styles.bodyContainer}>
                    <View style={{flex: .1, flexDirection:'row', justifyContent: 'space-around'}}>
                        <Text style={{fontSize:30}}>{this.state.speed}</Text>
                        <Text style={{fontSize:30}}>{this.state.rpm}</Text>
                    </View>
                    <View style={{flex: .7}}>
                        <Text style={{fontSize:30, textAlign:'center'}}>Data Observed:</Text>
                        <ScrollView style={{borderWidth:1}}>
                            {
                                cmdData.map((item, index) => (
                                    <View style={{flexDirection:'row', alignItems: 'center'}} key={index}>
                                    <Text style={{flex: .6, textAlign:'right'}}>{item.cmdID}</Text>
                                    <Text style={{flex: .4}}>: {item.cmdResult}</Text>
                                    </View>
                                ))
                            }
                        </ScrollView>
                    </View>
                    <View style={{flex: .1, flexDirection:'row', justifyContent: 'space-around'}}>
                        <View>
                            <Text style={{fontSize:20, textAlign: 'center'}}>Bluetooth</Text>
                            <Text style={{fontSize:20, textAlign: 'center', textTransform: 'capitalize'}}>{this.state.btStatus}</Text>
                        </View>
                        <View>
                            <Text style={{fontSize:20, textAlign: 'center'}}>OBD</Text>
                            <Text style={{fontSize:20, textAlign: 'center', textTransform: 'capitalize'}}>{this.state.obdStatus}</Text>
                        </View>
                    </View>
                </View>
            </View>
            </MenuProvider>
        );
    }
}

const styles = StyleSheet.create({
    bodyContainer:
    {
        padding: 5,
        flex: .9,
        backgroundColor: "#aaaaaa"
    },
    menuOptionText:
    {
        fontSize: 18,
        padding: 5,
        color: Color.BLACK
    }
});

