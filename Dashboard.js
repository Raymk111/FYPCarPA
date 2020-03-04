'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  View,
  Alert,
  AppState,
  TouchableOpacity,
  BackAndroid,
  Dimensions,
  DeviceEventEmitter,
  ScrollView
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import NavBar, { NavButton, NavGroup, NavButtonText, NavTitle } from 'react-native-nav';
import SharedPreference from 'react-native-sp';

const obd2 = require('react-native-obd2');

const Color = require('./utils/Color');
const Constant = require('./utils/Constant');

export default class OBDReader extends Component {
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

  startLiveData() {
    SharedPreference.getBoolean(Constant.KEY_ENABLE_MOCKUP)
      .then((isMockUpMode) => {
        if (!isMockUpMode && this.state.btSelectedDeviceAddress.length === 0) {
          Alert.alert(
            'Bluetooth Device',
            'You have to enable Bluetooth and select bluetooth device in Setting menu',
            [
              {text: 'OK', onPress: () => {}},
            ]
          )
          return;
        }

        this.setState({
          isStartLiveData: true,
        });
        
        obd2.setMockUpMode(isMockUpMode);
        obd2.startLiveData(this.state.btSelectedDeviceAddress);
      });
  }

  stopLiveData() {
    this.setState({
      isStartLiveData: false,
      direction: '-',
      bluetoothStatus: '-',
    });
    this.obdLiveDataListener && this.obdLiveDataListener.remove();
    obd2.stopLiveData();
  }

  getDTC() {
  }

  getTrips() {
  }

  setDeviceAddress(aDeviceAddress) {
    console.log('setDeviceAddress : ' + aDeviceAddress);
    this.setState({btSelectedDeviceAddress : aDeviceAddress});
  }

  openSettings() {
    Actions.Settings({
      btSelectedDeviceAddress : this.state.btSelectedDeviceAddress,
    });

    /*
    obd2.getBluetoothDeviceNameList()
      .then((nameList) => {
        console.log('Bluetooth device list : ' + JSON.stringify(nameList));
        this.setState({btDeviceList : nameList});
    
      })
      .catch((e) => {
        console.log('Get device name error : ' + e)
        Actions.Settings({
          btSelectedDeviceAddress : '',
          btDeviceList : []
        });
      });
*/
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
        this.openSettings();
        break;
      default :
        break;
    }
  }

  render() {
    let startLiveColor = this.state.isStartLiveData ? Color.DISABLED_COLOR : Color.BLACK;
    let stopLiveColor = this.state.isStartLiveData ? Color.BLACK : Color.DISABLED_COLOR;

    let originData = this.state.obd2Data;
    let cmdKeys = Object.keys(this.state.obd2Data);
    let cmdData = cmdKeys.map(function(key) { return originData[key]; });

    return (
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
        <View style={styles.bodyContainer}>
        
        </View>
        </>
    );
  }
}

const styles = StyleSheet.create({
  bodyContainer: {
    padding: 5,
    flex: .9
  },
  menuOptionText: {
    fontSize: 18,
    padding: 5,
    color: Color.BLACK
  }
});

