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
    }
    
    render()
    {
        return(
            <SafeAreaView>
            <Text style={styles.titleContainer}>{this.props.title}</Text>
            <RNSpeedometer value={this.props.value} size={300} labels = {labels} innerCircleStyle={circleStyle}/>
            </SafeAreaView>
        )
    }
}

const circleStyle = 
      {
          overflow: 'hidden',
          justifyContent: 'flex-end',
          alignItems: 'center',
          backgroundColor: '#ffffff'
      };

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