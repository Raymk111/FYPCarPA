'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  DeviceEventEmitter,
  ScrollView
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import MenuButton from './components/MenuButton';
import NavBar, { NavButton, NavGroup, NavButtonText, NavTitle } from 'react-native-nav';
import SharedPreference from 'react-native-shared-preferences';

const obd2 = require('react-native-obd2');

const Color = require('./utils/Color');
const Constant = require('./utils/Constant');

export default class statsDash extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      direction: '-',
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

  btStatus(data) {
    this.setState({btStatus : data.status});
  }

  obdStatus(data) {
    this.setState({obdStatus : data.status});
  }

  obdLiveData(data) {
    let copyData = JSON.parse(JSON.stringify(this.state.obd2Data));
    copyData[data.cmdID] = data;
    this.setState({
      obd2Data : copyData,
    });

    if (data.cmdID === 'ENGINE_RPM') {
      this.setState({
        rpm : data.cmdResult,
      });
    }

    if (data.cmdID === 'SPEED') {
      this.setState({
        speed: data.cmdResult,
      });
    }
  }

  componentDidMount() {
    this.btStatusListener = DeviceEventEmitter.addListener('obd2BluetoothStatus', this.btStatus);
    this.obdStatusListener = DeviceEventEmitter.addListener('obd2Status', this.obdStatus);
    this.obdLiveDataListener = DeviceEventEmitter.addListener('obd2LiveData', this.obdLiveData);
      
    this.setDeviceAddressListener = DeviceEventEmitter.addListener('setBTDeviceAddress', this.setDeviceAddress.bind(this));

    this.onReady();
  }

  componentWillUnmount() {
    this.stopLiveData();
    this.btStatusListener.remove();
    this.obdStatusListener.remove();
  }

  onReady() {
    obd2.ready();
  }

    startLiveData()
    {
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
    }

  setDeviceAddress(aDeviceAddress) {
    console.log('Setting btSelectedDeviceAddress :' + aDeviceAddress);
    this.setState({
        btSelectedDeviceAddress : aDeviceAddress
    });
  }

  runMenu(value) {
    switch(value) {
      case 1 : 
        this.startLiveData();
        break;
      case 2 :
        this.stopLiveData();
        break;
      case 3 :
        this.props.navigation.navigate("widgets");
        break;
      default :
        break;
    }
  }

    render()
    {
        let startLiveColor = this.state.isStartLiveData ? Color.DISABLED_COLOR : Color.BLACK;
        let stopLiveColor = this.state.isStartLiveData ? Color.BLACK : Color.DISABLED_COLOR;
        let originData = this.state.obd2Data;
        let cmdKeys = Object.keys(this.state.obd2Data);
        let cmdData = cmdKeys.map(function(key) { return originData[key]; });
        
        return(
          <MenuProvider style={{flex: 1}}>
          <View style={{flex: 1}}> 
            <NavBar>
            <NavGroup style={{marginLeft: 5, flex:0}}>
                <MenuButton navigation={this.props.navigation} />
            </NavGroup>
            <NavTitle style={{marginTop: 5, flex:1}}>
              Dashboard
            </NavTitle>
            <NavGroup style={{marginTop: 5, flex:0}}>
              <NavButton>
                <Menu onSelect={this.runMenu.bind(this)}>
                  <MenuTrigger>
                    <Text style={{
                      marginRight: 10, 
                      padding: 10, 
                      alignSelf: 'center', 
                      fontSize: 20, 
                      }}>&#8942;</Text>
                  </MenuTrigger> 
                  <MenuOptions>
                    <MenuOption disabled={this.state.isStartLiveData} value={1}>
                      <Text style={[styles.menuOptionText, {color: startLiveColor}]} >Start Live Data</Text>
                    </MenuOption>
                    <MenuOption disabled={!this.state.isStartLiveData} value={2}>
                      <Text style={[styles.menuOptionText, {color: stopLiveColor}]}>Stop Live Data</Text>
                    </MenuOption>
                    <MenuOption value={3}>
                      <Text style={[styles.menuOptionText, {color: '#00ff00'}]}>Edit/Add Widgets</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
            </NavButton>
            </NavGroup>
            </NavBar>
            <View style={styles.bodyContainer}>
              <View style={{flex: .1, flexDirection:'row'}}>
                <Text style={{fontSize:30}}>{this.state.speed}</Text>
                <View style={{flex: 0.8}}/>
                <Text style={{fontSize:30}}>{this.state.direction}</Text>
              </View>
              <View style={{flex: .05, flexDirection:'row', justifyContent: 'space-around'}}>
                <Text style={{fontSize:15}}>{this.state.speed}</Text>
                <Text style={{fontSize:15}}>{this.state.engineRunTime}</Text>
                <Text style={{fontSize:15}}>{this.state.rpm}</Text>
              </View>
              <View style={{flex: .6, borderWidth:1}}>
                <ScrollView>
                  {
                    cmdData.map((item, index) => (
                      <View 
                        style={{flexDirection:'row', alignItems: 'center'}}
                        key={index}
                        >
                        <Text style={{flex: .6, textAlign:'right'}}>{item.cmdName}</Text>
                        <Text style={{flex: .4}}>: {item.cmdResult}</Text>
                      </View>
                    ))
                  }
                </ScrollView>
              </View>
              <View style={{flex: .1, flexDirection:'row', justifyContent: 'space-around'}}>
                <View>
                  <Text style={{fontSize:18}}>Bluetooth</Text>
                  <Text style={{fontSize:15, textAlign: 'center'}}>{this.state.btStatus}</Text>
                </View>
                <View>
                  <Text style={{fontSize:18}}>OBD</Text>
                  <Text style={{fontSize:15, textAlign: 'center'}}>{this.state.obdStatus}</Text>
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
        flex: .9
    },
    menuOptionText:
    {
        fontSize: 18,
        padding: 5,
        color: Color.BLACK
    }
});

