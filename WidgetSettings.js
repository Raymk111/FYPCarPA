import React, { Component } from 'react'
const obd2 = require('react-native-obd2');

import {Alert, Modal, Text, View, Picker, StyleSheet, Map, DeviceEventEmitter, ScrollView, TouchableHighlight} from 'react-native';
import MenuButton from './components/MenuButton';
import NavBar, { NavButton, NavGroup, NavButtonText, NavTitle } from 'react-native-nav';
import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import AsyncStorage from '@react-native-community/async-storage';

import Dial from './Dial';
import DigitalInp from './DigitalInp';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Icon} from 'native-base'

const ObdUtils = require('./utils/ObdUtils');

const STORAGE_KEY = '@screen_setup';
const STORAGE_KEY_SCREENS = '@screens';

export default class WidgetSettings extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            speed: 40,
            numberScreens: 2
        }
        this.readScreenConfigFromStorage();
    }
    
    componentDidUpdate()
    {
        this.writeScreenConfigToStorage();
    }
    
    readScreenConfigFromStorage = async () => {
        
        try
        {
            var item = await AsyncStorage.getItem(STORAGE_KEY_SCREENS);
            var itemJSON = JSON.parse(item);
            this.setState({numberScreens: itemJSON});
        }
        catch (e) 
        {
            console.log(e);
        }
    }

    writeScreenConfigToStorage = async () => {
        try
        {
            var screenSetupJSON = JSON.stringify(this.state.numberScreens);
            await AsyncStorage.setItem(STORAGE_KEY_SCREENS, screenSetupJSON);
        }
        catch (e)
        {
            console.log(e);
        }
    }
    
    render()
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
              Widgets
            </NavTitle>
                <Picker
                    mode='dropdown'
                    selectedValue={this.state.numberScreens}
                    onValueChange={(itemValue, itemIndex) => {this.setState({numberScreens: itemValue});} }
                    style={{height: 40, width: 80}}>
                    <Picker.Item label="2" value={2} />
                    <Picker.Item label="4" value={4} />
                </Picker>
            </NavBar>
            <ScrollView>
            <Grid>
            <Row style={styles.widgetStyle}>
                <WidgetSettingsPane widgetType="analog"/>
            </Row>
            <Row style={styles.widgetStyle}>
                <WidgetSettingsPane widgetType="digital"/>
            </Row>
            </Grid>
            </ScrollView>
            </View>
        </>
        );
    }
}

class WidgetSettingsPane extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            modalVisible: false,
            finishedWidgetSetup: false,
            screenSetup: {
            },
            widgetSettings: {
                "clockType" : this.props.widgetType,
                data: "",
                ec: "",
                mc: "",
                screen: 0
            }
        };
    }
    
    static defaultProps = {
        screens: 2
    };

    readAndWriteNewWidgetConfig = async () => {
        try
        {
            var screenSetup = await AsyncStorage.getItem(STORAGE_KEY);
            var screenSetupJSON = JSON.parse(screenSetup);
            if(screenSetupJSON == null)
            {
                screenSetupJSON = {};
            }
            console.log("reading", screenSetupJSON);
            
            screenSetupJSON[this.state.widgetSettings.screen] = this.state.widgetSettings;
            screenSetupJSON[this.state.widgetSettings.screen].cmdID = ObdUtils.cmdIDMap[this.state.widgetSettings.data];
            
            var screenSetupJSON = JSON.stringify(screenSetupJSON);
            console.log("writing", screenSetupJSON);
            await AsyncStorage.setItem(STORAGE_KEY, screenSetupJSON);
            
            this.setState(
            {
                finishedWidgetSetup: false,
                widgetSettings:
                {
                    "clockType" : this.props.widgetType,
                    "data" : "",
                    "ec" : "",
                    "mc" : "",
                    "screen" : 0
                }
            }
            );
        }
        catch (e)
        {
            console.log(e);
        }
    }

    setModalVisible(visible, closeWithoutSaving)
    {
        if(this.state.finishedWidgetSetup && !closeWithoutSaving && this.state.screenSetup)
        {
            this.setState({modalVisible: false});
            
            //add gauge to ASyncConfig Here
            this.readAndWriteNewWidgetConfig();
            
            Alert.alert('Gauge Added to Dashboard');
        }
        else if(closeWithoutSaving)
        {
            this.setState(
            {
                finishedWidgetSetup: false,
                widgetSettings:
                {
                    "clockType" : this.props.widgetType,
                    "data" : "",
                    "ec" : "",
                    "mc" : "",
                    "screen" : 0
                },
                modalVisible: false
            }
            );
        }
        else
        {
            Alert.alert('You Must Finish Setup to Add Widget to Dashboard');
        }
    }

    displayType(displayType)
    {
        switch(displayType)
        {
            case "digital":
                return(
                    <TouchableHighlight underlayColor='#DDDDDD' onPress={() => {this.setState({modalVisible: true});}}>
                    <DigitalInp title="Digital:" digitStyles={{lineStyle : "#00FF00", fillStyle : "#888888"}}/>
                    </TouchableHighlight>
                );

            case "analog":
                return(
                    <TouchableHighlight underlayColor='#DDDDDD' onPress={() => { this.setState({modalVisible: true});}}>
                    <Dial title="Analog Gauge:" value={0} maxValue={100} />
                    </TouchableHighlight>
                );

            default:
                return(
                    <TouchableHighlight underlayColor='#DDDDDD' onPress={() => { this.setState({modalVisible: true});}}>
                    <Dial title="Analog Gauge:" value={0} maxValue={100}/>
                    </TouchableHighlight>
                );
        }
    }
    
    setGaugeSetting(key, setting)
    {
        console.log("called");
        var currentSetting = this.state.widgetSettings;
        currentSetting[key] = setting;
        this.setState({currentSetting});
        this.checkSettingsFinished();
    }

    checkSettingsFinished()
    {
        switch(this.props.widgetType)
        {
            case "digital":
                if(this.state.widgetSettings && this.state.widgetSettings.mc.length > 0 && this.state.widgetSettings.ec.length > 0 && this.state.widgetSettings.data.length > 0 && this.state.widgetSettings.screen != 0)
                {
                    this.setState({finishedWidgetSetup: true});
                }
                else
                {
                    this.setState({finishedWidgetSetup: false});
                }
                break;
            case "analog":
                if(this.state.widgetSettings && this.state.widgetSettings.mc.length > 0 && this.state.widgetSettings.data.length > 0  && this.state.widgetSettings.screen != 0)
                {
                    this.setState({finishedWidgetSetup: true});
                }
                else
                {
                    this.setState({finishedWidgetSetup: false});
                }
                break;
            default:
                return;
        }
    }
    
    displaySettings(displayType)
    {
        switch(displayType)
        {
            case "digital":
                return(
                <ScrollView>
                <Grid>
                <Row style={styles.widgetStyle}>
                    <Col size={1}>
                        <Text style={styles.settingsSubHead}>Data Input</Text>
                    </Col>
                    <Col size={3}>
                        <Picker
                          mode='dropdown'
                          style={{backgroundColor: '#aaaaaa'}}
                          selectedValue={this.state.widgetSettings.data}
                          onValueChange={(itemValue, itemIndex) => this.setGaugeSetting("data", itemValue) }
                        >
                        <Picker.Item
                            label='Select Data Input' 
                            value='0'/>
                            {ObdUtils.digitalInputs.map((item, key) => <Picker.Item label={item.name} value={item.address} key={item.address}/>)}
                        </Picker>
                    </Col>
                </Row>
                <Row style={styles.widgetStyle}>
                    <Col size={1}>
                        <Text style={styles.settingsSubHead}>Edge Color</Text>
                    </Col>
                    <Col size={3}>
                        <Picker
                          mode='dropdown'
                          style={{backgroundColor: '#aaaaaa'}}
                          selectedValue={this.state.widgetSettings.ec}
                          onValueChange={(itemValue, itemIndex) => this.setGaugeSetting("ec", itemValue) }
                        >
                        <Picker.Item
                            label='Select Edge Colour' 
                            value=''/>
                            {ObdUtils.presetColors.map((item, key) => <Picker.Item label={item.name} value={item.rgbCode} key={item.rgbCode}/>)}
                        </Picker>
                    </Col>
                </Row>
                <Row style={styles.widgetStyle}>
                    <Col size={1}>
                        <Text style={styles.settingsSubHead}>Main Colour</Text>
                    </Col>
                    <Col size={3}>
                        <Picker
                          mode='dropdown'
                          style={{backgroundColor: '#aaaaaa'}}
                          selectedValue={this.state.widgetSettings.mc}
                          onValueChange={(itemValue, itemIndex) => this.setGaugeSetting("mc", itemValue) }
                        >
                        <Picker.Item
                            label='Select Main Colour' 
                            value=''/>
                            {ObdUtils.presetColors.map((item, key) => <Picker.Item label={item.name} value={item.rgbCode} key={item.rgbCode}/>)}
                        </Picker>
                    </Col>
                </Row>
                <Row size={8} style={styles.widgetStyle}>
                    <Col size={1}>
                        <Text style={styles.settingsSubHead}>Screen Position</Text>
                    </Col>
                    <Col size={3}>
                        {this.getStatsDashSetup()}
                    </Col>
                </Row>
                </Grid>
                </ScrollView>
                );

            case "analog":
                return(
                <ScrollView>
                <Grid>
                <Row size={1} style={styles.widgetStyle}>
                    <Col size={1}>
                        <Text style={styles.settingsSubHead}>Data Input</Text>
                    </Col>
                    <Col size={3}>
                        <Picker
                          mode='dropdown'
                          style={{backgroundColor: '#aaaaaa'}}
                          selectedValue={this.state.widgetSettings["data"]}
                          onValueChange={(itemValue, itemIndex) => this.setGaugeSetting("data", itemValue) }
                        >
                        <Picker.Item
                            label='Select Data Input' 
                            value='0'/>
                            {ObdUtils.analogInputs.map((item, key) => <Picker.Item label={item.name} value={item.address} key={item.address}/>)}
                        </Picker>
                    </Col>
                </Row>
                <Row size={1} style={styles.widgetStyle}>
                    <Col size={1}>
                        <Text style={styles.settingsSubHead}>Main Colour</Text>
                    </Col>
                    <Col size={3}>
                        <Picker
                          mode='dropdown'
                          style={{backgroundColor: '#aaaaaa'}}
                          selectedValue={this.state.widgetSettings.mc}
                          onValueChange={(itemValue, itemIndex) => this.setGaugeSetting("mc", itemValue) }
                        >
                        <Picker.Item
                            label='Select Bg Colour' 
                            value=''/>
                            {ObdUtils.presetColors.map((item, key) => <Picker.Item label={item.name} value={item.rgbCode} key={item.rgbCode}/>)}
                        </Picker>
                    </Col>
                </Row>
                <Row size={8} style={styles.widgetStyle}>
                    <Col size={1}>
                        <Text style={styles.settingsSubHead}>Screen Position</Text>
                    </Col>
                    <Col size={3}>
                        {this.getStatsDashSetup()}
                    </Col>
                </Row>
                </Grid>
                </ScrollView>
                );

            default:
                return(
                    <ScrollView>
                    <Grid>
                    <Row style={styles.widgetStyle}>
                        <Text>No Settings</Text>
                    </Row>
                    </Grid>
                    </ScrollView>
                );
        }
    }
    
    getStatsDashSetup()
    {
        return(
            <>
            <View style={styles.screenButtonRow}>
            <TouchableHighlight style={[styles.screenButton, {backgroundColor:"#FF0000"}]} underlayColor='#DDDDDD' onPress={() => {this.setGaugeSetting("screen", 1);}}>
                <Text>1</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.screenButton, {backgroundColor:"#00FF00"}]} underlayColor='#DDDDDD' onPress={() => {this.setGaugeSetting("screen", 2);}}>
                <Text>2</Text>
            </TouchableHighlight>
            </View>
            <View style={styles.screenButtonRow}>
            <TouchableHighlight style={[styles.screenButton, {backgroundColor:"#0000FF"}]} underlayColor='#DDDDDD' onPress={() => {this.setGaugeSetting("screen", 3);}}>
                <Text>3</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.screenButton, {backgroundColor:"#888888"}]} underlayColor='#DDDDDD' onPress={() => {this.setGaugeSetting("screen", 4);}}>
                <Text>4</Text>
            </TouchableHighlight>
            </View>
            </>
        );
    }

    render()
    {
        return(
          <View style={{marginTop: 22}}>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setModalVisible(false, true);
              }}>
                  <NavBar>
                    <NavGroup>
                    <NavButton>
                        <Icon name="arrow-back" style={{ marginLeft: 5, fontSize: 24, color:'#000000'}}
                         onPress={() => { this.setModalVisible(false, true); }} />
                    </NavButton>
                    </NavGroup>
                    <NavTitle style={{flex:1}}>
                        <Text style={styles.settingsTitle}>{this.props.widgetType.substring(0, 1).toUpperCase() + this.props.widgetType.substring(1)} Gauge Settings</Text>
                    </NavTitle>
                    <NavGroup>
                    <NavButton>
                        <Icon name="md-checkbox" style={{ marginLeft: 5, fontSize: 24, color:'#00AA00'}}
                         onPress={() => { this.setModalVisible(false, false); }} />
                    </NavButton>
                    </NavGroup>
                    </NavBar>
                {this.displaySettings(this.props.widgetType)}
            </Modal>
            {this.displayType(this.props.widgetType)}
          </View>
        );
    }
}

const styles = StyleSheet.create({
    bodyContainer:
    {
        fontSize: 20,
        marginTop: 25,
        color: '#000000'
    },
    btDeviceContainer:
    {
        backgroundColor: '#999999'
    },
    widgetStyle :
    {
        flex: 1,
        flexDirection: "row",
        padding: 40,
        justifyContent: 'space-around'
    },
    settingsTitle:
    {
        fontSize: 20
    },
    settingsSubHead:
    {
        fontSize: 20
    },
    screenButtonRow:
    {
        maxWidth: 220,
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around"
    },
    screenButton:
    {
        height:100,
        width:100,
        margin: 4,
        borderColor: "#000000",
        borderWidth: 2
    }
});