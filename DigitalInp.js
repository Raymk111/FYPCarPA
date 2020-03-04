'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    SafeAreaView
} from 'react-native';

import Canvas from 'react-native-canvas';

export default class DigitalInp extends React.Component
{
    constructor(props)
    {
        super(props);
        var digiStyles = this.props.digitStyles ? this.props.digitStyles : {lineStyle : "#00FF00", fillStyle : "#000000"};
        this.state = 
        {
            value : "888",
            format : "ddd",
            digitStyles : digiStyles
        }
    }
    
    handleCanvas = (canvas) => {
        if(canvas)
        {
            const ctx = canvas.getContext('2d');
            ctx.strokeStyle = this.state.digitStyles.lineStyle;
            ctx.fillStyle = this.state.digitStyles.fillStyle;
            ctx.scale(2, 2);
            ctx.translate(0, 12);
            
            if(this.state.value.length == this.state.format.length)
            {
                for(var i = 0; i < this.state.value.length; i++)
                {
                    this.drawNum(ctx, parseInt(this.state.value.charAt(i)), i);
                    ctx.restore();
                    ctx.translate(44, 0);
                }
            }
            else
            {
                for(var i = 0; i < this.state.format.length; i++)
                {
                    this.drawNum(ctx, 9, i);
                    ctx.restore();
                    ctx.translate(44, 0);
                }
            }
            ctx.stroke();
            ctx.fill();
        }
    };
    
    drawSegment = (ctx) =>
    {
        ctx.moveTo(6, 1);
        ctx.lineTo(11, 6);
        ctx.lineTo(11, 26);
        ctx.lineTo(11, 26);
        ctx.lineTo(6, 31);
        ctx.lineTo(1, 26);
        ctx.lineTo(1, 6);
        ctx.lineTo(6, 1);
    };
    
    //fsm producing a letter in base segment (translate context outside to select another segment set)
    drawNum = (ctx, num, segmentNumber) =>
    {
        ctx.save();
        switch(num)
            {
                case 0:
                    //segment top
                    ctx.translate(6, 0);
                    ctx.rotate(-Math.PI/2);
                    this.drawSegment(ctx);
                    
                    //segment bottom
                    ctx.translate(-64, 0);
                    this.drawSegment(ctx);
                    
                    //reset
                    ctx.translate(64, 0);
                    ctx.rotate(Math.PI/2);
                    ctx.translate(-6, -6);
                    
                    //top left seg
                    this.drawSegment(ctx);
                    
                    //bottom left seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    
                    //top right seg
                    ctx.translate(32, -32);
                    this.drawSegment(ctx);
                    
                    //bottome right seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    break;
                case 1:
                    //top right seg
                    ctx.translate(32, 0);
                    this.drawSegment(ctx);
                    
                    //bottom right seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    break;
                case 2:
                    //segment top
                    ctx.translate(6, 0);
                    ctx.rotate(-Math.PI/2);
                    this.drawSegment(ctx);
                    
                    //segment middle
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //segment bottom
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //reset
                    ctx.translate(64, 0);
                    ctx.rotate(Math.PI/2);
                    ctx.translate(-6, -6);
                    
                    //bottom left seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    
                    //top right seg
                    ctx.translate(32, -32);
                    this.drawSegment(ctx);
                    break;
                case 3:
                    //segment top
                    ctx.translate(6, 0);
                    ctx.rotate(-Math.PI/2);
                    this.drawSegment(ctx);
                    
                    //segment middle
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //segment bottom
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //reset
                    ctx.translate(64, 0);
                    ctx.rotate(Math.PI/2);
                    ctx.translate(-6, -6);
                    
                    //top right seg
                    ctx.translate(32, 0);
                    this.drawSegment(ctx);
                    
                    //bottome right seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    break;
                case 4:
                    //segment middle
                    ctx.translate(6, 0);
                    ctx.rotate(-Math.PI/2);
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //reset
                    ctx.translate(32, 0);
                    ctx.rotate(Math.PI/2);
                    ctx.translate(-6, -6);
                    
                    //top left seg
                    this.drawSegment(ctx);
                    
                    //top right seg
                    ctx.translate(32, 0);
                    this.drawSegment(ctx);
                    
                    //bottome right seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    
                    break;
                case 5:
                    //segment top
                    ctx.translate(6, 0);
                    ctx.rotate(-Math.PI/2);
                    this.drawSegment(ctx);
                    
                    //segment middle
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //segment bottom
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //reset
                    ctx.translate(64, 0);
                    ctx.rotate(Math.PI/2);
                    ctx.translate(-6, -6);
                    
                    //top left seg
                    this.drawSegment(ctx);
                    
                    //bottome right seg
                    ctx.translate(32, 32);
                    this.drawSegment(ctx);
                    break;
                case 6:
                    //segment top
                    ctx.translate(6, 0);
                    ctx.rotate(-Math.PI/2);
                    this.drawSegment(ctx);
                    
                    //segment middle
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //segment bottom
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //reset
                    ctx.translate(64, 0);
                    ctx.rotate(Math.PI/2);
                    ctx.translate(-6, -6);
                    
                    //top left seg
                    this.drawSegment(ctx);
                    
                    //bottom left seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    
                    //bottome right seg
                    ctx.translate(32, 0);
                    this.drawSegment(ctx);
                    break;
                case 7:
                    //segment top
                    ctx.translate(6, 0);
                    ctx.rotate(-Math.PI/2);
                    this.drawSegment(ctx);
                    
                    //reset
                    ctx.rotate(Math.PI/2);
                    ctx.translate(-6, -6);
                    
                    //top right seg
                    ctx.translate(32, 0);
                    this.drawSegment(ctx);
                    
                    //bottome right seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    
                    break;
                case 8:
                    //segment top
                    ctx.translate(6, 0);
                    ctx.rotate(-Math.PI/2);
                    this.drawSegment(ctx);
                    
                    //segment middle
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //segment bottom
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //reset
                    ctx.translate(64, 0);
                    ctx.rotate(Math.PI/2);
                    ctx.translate(-6, -6);
                    
                    //top left seg
                    this.drawSegment(ctx);
                    
                    //bottom left seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    
                    //top right seg
                    ctx.translate(32, -32);
                    this.drawSegment(ctx);
                    
                    //bottome right seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    break;
                case 9:
                    //segment top
                    ctx.translate(6, 0);
                    ctx.rotate(-Math.PI/2);
                    this.drawSegment(ctx);
                    
                    //segment middle
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //segment bottom
                    ctx.translate(-32, 0);
                    this.drawSegment(ctx);
                    
                    //reset
                    ctx.translate(64, 0);
                    ctx.rotate(Math.PI/2);
                    ctx.translate(-6, -6);
                    
                    //top left seg
                    this.drawSegment(ctx);
                    
                    //top right seg
                    ctx.translate(32, 0);
                    this.drawSegment(ctx);
                    
                    //bottome right seg
                    ctx.translate(0, 32);
                    this.drawSegment(ctx);
                    break;
                        
            };
    };
    
    render()
    {
        return(
            <SafeAreaView>
            <Text style={styles.titleContainer}>{this.props.title}</Text>
            <Canvas ref={this.handleCanvas} style={styles.canvasStyle}/>
            </SafeAreaView>
            );
    }
}

const styles = StyleSheet.create(
    {
        canvasStyle :
        {
            height: 150,
            width: 260,
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-around'
        },
        
        titleContainer :
        {
            textAlign : 'center',
            fontWeight : 'bold',
            fontSize : 32
        }
        
    }
);