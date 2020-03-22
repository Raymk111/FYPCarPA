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
    }
    
    static defaultProps = {
        value : "888",
        format : "ddd",
        digitStyles : {lineStyle : "#00FF00", fillStyle : "#000000"},
        scale : 2
    }
    
    handleCanvas = (canvas) => {
        if(canvas)
        {
            console.log(this.props.value);
            canvas.width = 45 * this.props.scale * this.props.format.length;
            canvas.height = 120 * this.props.scale;
            const context = canvas.getContext('2d');
            
            this.paintOut(context);
        }
    };

    paintOut(ctx)
    {
        ctx.strokeStyle = this.props.digitStyles.lineStyle;
        ctx.fillStyle = this.props.digitStyles.fillStyle;

        ctx.scale(this.props.scale, this.props.scale);
        ctx.translate(0, 12);

        //title work
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.props.title, 44*(this.props.format.length/2), 85);

        var value = parseInt(this.props.value).toString();
        if(value && value.length == this.props.format.length)
        {
            for(var i = 0; i < value.length; i++)
            {
                this.drawNum(ctx, parseInt(value.charAt(i)), i);
                ctx.restore();
                ctx.translate(44, 0);
            }
        }
        else if(value.length)
        {
            for(var i = 0; i < this.props.format.length - value.length; i++)
            {
                this.drawNum(ctx, 0, i);
                ctx.restore();
                ctx.translate(44, 0);
            }

            for(var i = 0; i < value.length; i++)
            {
                this.drawNum(ctx, parseInt(value.charAt(i)), i);
                ctx.restore();
                ctx.translate(44, 0);
            }
        }
        else
        {
            for(var i = 0; i < this.props.format.length; i++)
            {
                this.drawNum(ctx, 0, i);
                ctx.restore();
                ctx.translate(44, 0);
            }
        }
        
        ctx.stroke();
        ctx.fill();
    }
    
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
                    ctx.translate(32, -6);
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
            <Canvas ref={this.handleCanvas} style={[styles.canvasStyle, {width: 45 * this.props.scale * this.props.format.length}]}/>
        </SafeAreaView>
        );

    }
}

const styles = StyleSheet.create(
    {
        canvasStyle :
        {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent:'space-around'
        },
        
        titleContainer :
        {
            textAlign : 'center',
            fontWeight : 'bold',
            fontSize : 32
        }
        
    }
);