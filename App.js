/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import CompassHeading from 'react-native-compass-heading';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


export default class App extends Component{
  
  constructor(){
    super();
    this.state={
      location: null,
    }
  }

  getDistance(lat,long){
    //use haversine formula to calculate distance between two coordinates
  }

  getLocation(){
    Geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position)
        this.setState({location:location});
        var degree = 20
        CompassHeading.start(3, degree => {
          setCompassHeading(degree);
          CompassHeading.stop();
        });
      },
      err => console.warn(err.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  render(){
    return (
        <View style={styles.container}>
          <TouchableOpacity onPress={this.getLocation.bind(this)}>
            <Text>Find Your Location</Text>
          </TouchableOpacity>
          <Text>Location:{this.state.location}</Text>
        </View>
        
    )
  }
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});


