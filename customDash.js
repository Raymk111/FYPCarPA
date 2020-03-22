'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  DeviceEventEmitter,
  Dimensions,
  ScrollView
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Col, Row, Grid } from "react-native-easy-grid";
import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import MenuButton from './components/MenuButton';
import NavBar, { NavButton, NavGroup, NavButtonText, NavTitle } from 'react-native-nav';
import SharedPreference from 'react-native-shared-preferences';
import AsyncStorage from '@react-native-community/async-storage';
import Dial from './Dial';
import DigitalInp from './DigitalInp';

const obd2 = require('react-native-obd2');
const ObdUtils = require('./utils/ObdUtils');
const Color = require('./utils/Color');

const STORAGE_KEY = '@screen_setup';
const STORAGE_KEY_SCREENS = '@screens';
const WIDTH = Dimensions.get('window').width 
const HEIGHT = Dimensions.get('window').height 

export default class customDash extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          speed: '0km/h',
          rpm: '0000RPM',
          isStartLiveData: false,
          btStatus : '-',
          btDeviceList: [],
          btSelectedDeviceAddress: '',
          obdStatus: 'disconnected',
          debug : '-',
          obd2Data : { },
          screenSetup : [],
          screens : 0
        };
        
        this.dataSubList = [];
        this.btStatus = this.btStatus.bind(this);
        this.obdStatus = this.obdStatus.bind(this);
        this.obdLiveData = this.obdLiveData.bind(this);
    }

    readScreenSettings = async () => {

        try
        {
            var item = await AsyncStorage.getItem(STORAGE_KEY);
            var screenNumber = await AsyncStorage.getItem(STORAGE_KEY_SCREENS);
            
            if(item != null && item.length > 0)
            {
                var itemJSON = JSON.parse(item);
                var screenSetupArr = [{},{},{},{}];
                var gotSettings = false;
                this.dataSubList = [];
                
                if(screenNumber == 2 || screenNumber == 4)
                {
                    for(var i = 0; i < screenNumber; i++)
                    {
                        if(itemJSON[(i+1).toString()])
                        {
                            screenSetupArr[i] = itemJSON[(i+1).toString()];
                            this.dataSubList.push({data: itemJSON[(i+1).toString()].data, cmdID: itemJSON[(i+1).toString()].cmdID});
                        }
                    }
                    gotSettings = true;
                }
                
                if(gotSettings)
                {
                    this.setState(
                    {
                        screenSetup: screenSetupArr,
                        screens : JSON.parse(screenNumber)
                    });
                }
            }
        }
        catch (e) 
        {
            console.log(e);
            alert('Failed to retrieve screen setup');
        }
    };


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
        for(var i = 0; i < this.dataSubList.length; i++)
        {
            if(data.cmdResult != null && data.cmdID == this.dataSubList[i].cmdID)
            {
                console.log(data);
//                stateUpdateObj[this.dataSubList[i].data] = parseInt(1000*Math.random())+"rpm";
                stateUpdateObj[this.dataSubList[i].data] = data.cmdResult;
                haveData = true;
            }
        }
        
        if(haveData)
        {
            console.log(stateUpdateObj);
            this.setState(stateUpdateObj);
        }
    }

    componentDidMount()
    {
        this.btStatusListener = DeviceEventEmitter.addListener('obd2BluetoothStatus', this.btStatus);
        this.obdStatusListener = DeviceEventEmitter.addListener('obd2Status', this.obdStatus);
        this.setDeviceAddressListener = DeviceEventEmitter.addListener('setBTDeviceAddress', this.setDeviceAddress.bind(this));

        this.onReady();
        this.readScreenSettings();
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
            isStartLiveData: false
        });
        
        this.obdLiveDataListener && this.obdLiveDataListener.remove();
        obd2.stopLiveData();
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
        switch(value)
        {
          case 1 : 
            this.startLiveData();
            break;
          case 2 :
            this.stopLiveData();
            break;
          case 3 :
            this.props.navigation.navigate("widgets");
            break;
          case 4 :
            this.readScreenSettings();
            break;
          default :
            break;
        }
    }

    getWidget(widgetNumber, scale = 2)
    {
        var widgetConfig = this.state.screenSetup[widgetNumber.toString()];
        if(widgetConfig)
        {
            switch (widgetConfig["clockType"])
            {
                case "digital":
                    return(
                        <DigitalInp key={this.state[widgetConfig.data]} title={widgetConfig.data} value={this.state[widgetConfig.data]} format={ObdUtils.dataFormats[widgetConfig.data]} digitStyles={{lineStyle : widgetConfig.ec, fillStyle : widgetConfig.mc}} scale={scale} />
                    );

                case "analog":
                    return(
                        <Dial title={widgetConfig.data} value={this.state[widgetConfig.data]} maxValue={ObdUtils.maxValues[widgetConfig.data]} scale={scale} backColor={widgetConfig.mc}/>
                    );

                default:
                    return(
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>No{"\n"}Gauge{"\n"}Set</Text>
                    );
            }
        }
        
        return(
            <Text>No Gauge Set</Text>
        );
    }

    getWidgets()
    {
        switch(this.state.screens)
        {
            case 2:
                return(
                    <Grid>
                        <Row style={styles.widgetContainer}>
                            {this.getWidget(0)}
                        </Row>
                        <Row style={styles.widgetContainer}>
                            {this.getWidget(1)}
                        </Row>
                    </Grid>
                );
            case 4:
                return(
                    <Grid>
                        <Row>
                            <Col style={styles.widgetContainer}>{this.getWidget(0, 1)}</Col>
                            <Col style={styles.widgetContainer}>{this.getWidget(1, 1)}</Col>
                        </Row>
                        <Row>
                            <Col style={styles.widgetContainer}>{this.getWidget(2, 1)}</Col>
                            <Col style={styles.widgetContainer}>{this.getWidget(3, 1)}</Col>
                        </Row>
                    </Grid>
                );
            default:
                return(
                    <>
                    <Image style={styles.img} source={require('./Images/Gear-512.png')}/>
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Welcome to CarPa</Text>
                        <Text style={{fontSize: 20}}>Set the BT Device from previously connected devices in settings</Text>
                        <Text style={{fontSize: 20}}>To test your adaptor you can go to the Default Dash</Text>
                        <Text style={{fontSize: 20}}>Choose edit add widgets on the top right menu</Text>
                    </>
                );
        }
    }
    
    header()
    {
        let startLiveColor = this.state.isStartLiveData || this.state.btSelectedDeviceAddress == "" ? Color.DISABLED_COLOR : Color.BLACK;
        let stopLiveColor = this.state.isStartLiveData ? Color.BLACK : Color.DISABLED_COLOR;
        
        return(
            <NavBar>
            <NavGroup style={{marginLeft: 5, flex:0}}>
                <MenuButton navigation={this.props.navigation} />
            </NavGroup>
            <NavTitle style={{marginTop: 5, flex:1}}>
              Dashboard
            </NavTitle>
            <NavGroup style={{flex:0}}>
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
                    <MenuOption disabled={this.state.isStartLiveData || this.state.btSelectedDeviceAddress == ""} value={1}>
                      <Text style={[styles.menuOptionText, {color: startLiveColor}]} >Start Live Data</Text>
                    </MenuOption>
                    <MenuOption disabled={!this.state.isStartLiveData} value={2}>
                      <Text style={[styles.menuOptionText, {color: stopLiveColor}]}>Stop Live Data</Text>
                    </MenuOption>
                    <MenuOption value={3}>
                      <Text style={[styles.menuOptionText, {color: '#00ff00'}]}>Edit/Add Widgets</Text>
                    </MenuOption>
                    <MenuOption value={4}>
                      <Text style={[styles.menuOptionText]}>Refresh Screen Setup</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
            </NavButton>
            </NavGroup>
            </NavBar>
        );
    }


    render()
    {
        return(
            <MenuProvider skipInstancesCheck={true}>
                <View style={{flex: 1}}> 
                    {this.header()}

                    <View style={styles.bodyContainer}>
                        {this.getWidgets()}
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
        flex: 1,
        backgroundColor:'#aaaaaa'
    },
    widgetContainer:
    {
        flex:1,
        flexDirection: 'column',
        alignItems:'center',
        justifyContent: 'space-around'
    },
    menuOptionText:
    {
        fontSize: 18,
        padding: 5,
        color: Color.BLACK
    },
    img:
    {
        marginLeft: WIDTH/2 - 100,
        marginTop: HEIGHT/2 - 200,
        height: 200,
        width: 200
	}
});