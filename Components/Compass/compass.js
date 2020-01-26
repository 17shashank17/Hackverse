import React,{Component} from 'react';
import styles from './compass_style.js'


import {
    Button,
    Animated,
    Easing,
  } from 'react-native';

import {magnetometer,SensorTypes,setUpdateIntervalForType} from 'react-native-sensors'

import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
  } from 'react-native';

export default class Compass extends Component{

    constructor(){
        super();
        setUpdateIntervalForType(SensorTypes.magnetometer,500);
        this.state={
            magnetometer_text: null,
            angle: 0,
            bearing_angle: 0,
        }
    }


    getMagnetometer(){

        magnetometer.subscribe(({x,y,z,timestamp}) => {
            this.setState({magnetometer_text: [x,y,z,timestamp]})
            this.getAngle(x,y,z);
        })
    }

    getAngle(x,y,z){
        var angle=0;
        if (Math.atan2(y, x) >= 0) {
            angle = Math.atan2(y, x) * (180 / Math.PI);
        }
        else {
            angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
        }
        this.setState({angle:-1*angle+90})
        this.props.getHeadingAngle(this.state.angle)
        //get bearing angle
        
        this.state.bearing_angle=this.props.BearingAngle

    }


    render(){

        var RotateData=()=>{
            var compass_head_angle=(this.state.angle+this.state.bearing_angle)
            return compass_head_angle.toString()+'deg'
        }
        return(
            
            <View style={styles.container}>
                <Animated.Image style=
                {{
                    width: 300,
                    height: 300,
                    marginLeft: 50,
                    transform: [{rotate:RotateData()}]
                }}
                source={require('../../assets/compass_image.png')}  />
                {/* <Text>Magnetometer : {this.state.magnetometer_text}</Text> */}
                
                <Button title="Get Nearest Location" onPress={this.getMagnetometer.bind(this)}></Button>
                <Text></Text>
            </View>
                
            
        )
    }
}

