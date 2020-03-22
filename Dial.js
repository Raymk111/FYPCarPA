'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    SafeAreaView
} from 'react-native';

import RNSpeedometer from 'react-native-speedometer'

export default class Dial extends React.Component
{
    constructor(props)
    {
        super(props);
        this.circleStyle = 
        {
            overflow: 'hidden',
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: this.props.backColor ? this.props.backColor : '#ffffff'
        };
    }
    
    static defaultProps = {
        scale: 2
    };
    
    render()
    {
        return(
            <SafeAreaView>
            <Text style={styles.titleContainer}>{this.props.title}</Text>
            <RNSpeedometer value={parseInt(this.props.value)} maxValue={this.props.maxValue} size={parseInt(150 * this.props.scale)} labels = {labels} innerCircleStyle={this.circleStyle}/>
            </SafeAreaView>
        )
    }
}

const labels = [
    {
      name: 'Idle',
      labelColor: '#aaff00',
      activeBarColor: '#aaff00',
    },
    {
      name: '',
      labelColor: '#14eb6e',
      activeBarColor: '#14eb6e',
    },
    {
      name: 'Ideal',
      labelColor: '#14eb6e',
      activeBarColor: '#14eb6e',
    },
    {
      name: 'Change Gear',
      labelColor: '#ff3000',
      activeBarColor: '#ffa000',
    },
    {
      name: 'Dangerous',
      labelColor: '#ff2000',
      activeBarColor: '#ff2000',
    }
  ];

const styles = StyleSheet.create(
    {
        titleContainer :
        {
            textAlign : 'center',
            fontWeight : 'bold',
            fontSize : 32
        }
    }
);