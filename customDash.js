'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    SafeAreaView,
    DeviceEventEmitter,
    Dimensions,
    ScrollView,
    StatusBar
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { Orientation } from 'react-native-orientation';
import { Col, Row, Grid } from "react-native-easy-grid";
import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import MenuButton from './components/MenuButton';
import { NavButton, NavGroup, NavButtonText, NavTitle } from 'react-native-nav';
import AsyncStorage from '@react-native-community/async-storage';

import { Button } from 'react-native-elements';
import { Icon } from 'native-base';
import Dial from './Dial';
import DigitalInp from './DigitalInp';
import { Themes } from './utils/Theme';
import { DbKeys } from './utils/DbKeys';

const obd2 = require('react-native-obd2');
const ObdUtils = require('./utils/ObdUtils');
const Color = require('./utils/Color');
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
        this.speed = 0;
        this.fuelCons = 0;
        this.btStatus = this.btStatus.bind(this);
        this.obdStatus = this.obdStatus.bind(this);
        this.obdLiveData = this.obdLiveData.bind(this);
    }

    readScreenSettings = async () => {

        try
        {
            var item = await AsyncStorage.getItem(DbKeys.STORAGE_KEY);
            var screenNumber = await AsyncStorage.getItem(DbKeys.STORAGE_KEY_SCREENS);
            var btAddress = await AsyncStorage.getItem(DbKeys.STORAGE_KEY_BTADDR);
            
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
                    
                    //checkbtAddress
                    if(btAddress == "0")
                    {
                       btAddress = ''; 
                    }
                    
                    gotSettings = true;
                }
                
                if(gotSettings)
                {
                    console.log(screenSetupArr, btAddress, screenNumber);
                    this.setState(
                    {
                        screenSetup: screenSetupArr,
                        btSelectedDeviceAddress: btAddress,
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
        
//        data.cmdResult = parseInt(100*Math.random());
        
        //always need speed and MAF
        if(data.cmdID === ObdUtils.cmdIDMap.speed && this.speed != parseInt(data.cmdResult))
        {
            this.speed = parseInt(data.cmdResult);
        }
        
        if(this.speed > 0 &&
           this.speed < 400 &&
           data.cmdID === ObdUtils.cmdIDMap.maf &&
           parseInt(data.cmdResult) > 0)
        {
            this.fuelCons = (ObdUtils.mpgRatio.diesel * parseInt(this.speed))/parseInt(data.cmdResult);
        }
        
        for(var i = 0; i < this.dataSubList.length; i++)
        {
            if(this.dataSubList[i].cmdID == ObdUtils.cmdIDMap.fuelCons && this.fuelCons != 0)
            {
                stateUpdateObj[this.dataSubList[i].data] = parseInt(this.fuelCons);
                haveData = true;
            }
            else if(data.cmdResult != null && data.cmdID == this.dataSubList[i].cmdID && data.cmdID != ObdUtils.cmdIDMap.fuelCons)
            {
                console.log(data);
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
        
        this.readScreenSettings();
        
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
                        <DigitalInp title={ObdUtils.units[widgetConfig.data]} value={this.state[widgetConfig.data]} format={ObdUtils.dataFormats[widgetConfig.data]} digitStyles={{lineStyle : widgetConfig.ec, fillStyle : widgetConfig.mc}} scale={scale} />
                    );

                case "analog":
                    return(
                        <Dial title={ObdUtils.units[widgetConfig.data]} value={this.state[widgetConfig.data]} maxValue={ObdUtils.maxValues[widgetConfig.data]} scale={scale} backColor={widgetConfig.mc}/>
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

    _orientationDidChange = (orientation) => {
        if (orientation === 'LANDSCAPE') {
          // do something with landscape layout
            console.log(orientation);
        } else {
          // do something with portrait layout
            console.log(orientation);
        }
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
                        <Text style={{fontSize: 32, fontWeight: 'bold', textAlign: 'center'}}>Welcome to CarPA</Text>
                        <Image style={styles.img} source={require('./Images/Gear-512.png')}/>
                        <Text style={{fontSize: 20,  marginTop:20, textAlign:'center'}}>Set the Bluetooth adaptor in settings:</Text>
                            <Button
                                onPress={() => this.props.navigation.navigate("settings")}
                                icon={ <Icon name="bluetooth" size={8} />}
                                buttonStyle={{ backgroundColor:'#00aa00' }}
                                iconLeft
                                title="  Open Settings"
                            />
                        <Text style={{fontSize: 20,  marginTop:20, textAlign:'center'}}>Test your adaptor in the Default Dash:</Text>
                            <Button
                                onPress={() => this.props.navigation.navigate("defaultDash")}
                                icon={ <Icon name="bluetooth" size={8} />}
                                buttonStyle={{ backgroundColor:'#00aa00' }}
                                iconLeft
                                title="  Test Adaptor"
                            />
                        <Text style={{fontSize: 20,  marginTop:20, textAlign:'center'}}>Add widgets in the top right {<Text style={{fontSize:20}}>' &#8942; '</Text>} button</Text>
                    </>
                );
        }
    }
    
    header()
    {
        let startLiveColor = this.state.isStartLiveData || this.state.btSelectedDeviceAddress == "" ? Color.DISABLED_COLOR : Color.BLACK;
        let stopLiveColor = this.state.isStartLiveData ? Color.BLACK : Color.DISABLED_COLOR;
        
        return(
            <SafeAreaView style={Themes.navBar} forceInset={{top: 'always'}}>
            <StatusBar backgroundColor={Themes.navBar.backgroundColor}/>
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
            </SafeAreaView>
        );
    }


    render()
    {
        return(
            <MenuProvider skipInstancesCheck>
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
        marginTop: HEIGHT/4 - 150,
        height: 200,
        width: 200,
        backgroundColor: '#aaaaaa'
	}
});