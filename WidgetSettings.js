import React, { Component } from 'react'
const obd2 = require('react-native-obd2');

import {Alert, Modal, Text, View, Picker, StyleSheet, Map, DeviceEventEmitter, ScrollView, TouchableHighlight} from 'react-native';
import MenuButton from './components/MenuButton';
import NavBar, { NavButton, NavGroup, NavButtonText, NavTitle } from 'react-native-nav';
import Menu, { MenuProvider, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

import Dial from './Dial';
import DigitalInp from './DigitalInp';
import { Col, Row, Grid } from "react-native-easy-grid";
import { Icon} from 'native-base'

export default class WidgetSettings extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
        {
            speed: 40
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
            widgetSettings: {
                "data" : "",
                "ec" : "",
                "mc" : "",
                "screen" : 0
            }
        };
    }

    setModalVisible(visible)
    {
        if(this.state.finishedWidgetSetup)
        {
            this.setState({modalVisible: visible});
            
            //add gauge to ASyncConfig Here
            
            
            Alert.alert('Gauge Added to Dashboard');
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
                    <DigitalInp title="Digital Gauge:" digitStyles={{lineStyle : "#00FF00", fillStyle : "#888888"}}/>
                    </TouchableHighlight>
                );

            case "analog":
                return(
                    <TouchableHighlight underlayColor='#DDDDDD' onPress={() => { this.setState({modalVisible: true});}}>
                    <Dial title="Analog Gauge:" value={0} />
                    </TouchableHighlight>
                );

            default:
                return(
                    <TouchableHighlight underlayColor='#DDDDDD' onPress={() => { this.setState({modalVisible: true});}}>
                    <Dial title="Analog Gauge:" value={0} />
                    </TouchableHighlight>
                );
        }
    }
    
    setGaugeSetting(key, setting)
    {
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
                            {analogInputs.map((item, key) => <Picker.Item label={item.name} value={item.address}/>)}
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
                            {presetColors.map((item, key) => <Picker.Item label={item.name} value={item.rgbCode}/>)}
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
                            {presetColors.map((item, key) => <Picker.Item label={item.name} value={item.rgbCode}/>)}
                        </Picker>
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
                        {analogInputs.map((item, key) => <Picker.Item label={item.name} value={item.address}/>)}
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
                            {presetColors.map((item, key) => <Picker.Item label={item.name} value={item.rgbCode}/>)}
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
                this.setState({modalVisible: false});
              }}>
                  <NavBar>
                    <NavGroup>
                    <NavButton>
                        <Icon name="arrow-back" style={{ marginLeft: 5, fontSize: 24, color:'#000000'}}
                         onPress={() => { this.setState({modalVisible: false}); }} />
                    </NavButton>
                    </NavGroup>
                    <NavTitle style={{flex:1}}>
                        <Text style={styles.settingsTitle}>{this.props.widgetType.substring(0, 1).toUpperCase() + this.props.widgetType.substring(1)} Gauge Settings</Text>
                    </NavTitle>
                    <NavGroup>
                    <NavButton>
                        <Icon name="md-checkbox" style={{ marginLeft: 5, fontSize: 24, color:'#00AA00'}}
                         onPress={() => { this.setModalVisible(!this.state.modalVisible); }} />
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

const analogInputs = 
      [
          {
              name: "Speed",
              address: "speed"
          },
          {
              name: "RPM",
              address: "rpm"
          },
          {
              name: "Throttle Position",
              address: "tp"
          },
      ];

const digitalInputs = 
      [
          {
              name: "Speed",
              address: "speed"
          },
          {
              name: "RPM",
              address: "rpm"
          },
          {
              name: "Throttle Position",
              address: "tp"
          },
      ];

const presetColors = 
      [
          {
              name: "Red",
              rgbCode: "#FF0000"
          },
          {
              name: "Green",
              rgbCode: "#00FF00"
          },
          {
              name: "Black",
              rgbCode: "#000000"
          },
      ];

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