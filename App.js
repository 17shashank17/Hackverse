/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{Component} from 'react';

import Compass from './Components/Compass/compass.js'
import haversineDistance from './Components/Distance_calculator/haversine_distance.js'

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TouchableOpacity,
  Image,
  NativeModules, 
  NativeEventEmitter,
  ActivityIndicator,
  NativeAppEventEmitter,
  AsyncStorage,
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


class App extends Component{
  constructor(){
    super();
    window.onload=this.startLoopForGettingLocation();
    console.disableYellowBox = true;
    
    this.state={
      location: null,
      destination_location: null,
      total_distance: 0,
      bearing_angle: 0,
      heading_angle: 0,
      latitude: 0,
      longitude: 0,
      isLoading: false,
      mark_safe: null,
      mark_unsafe: null,
    }
  }

  markSafe(){
    var lat=this.state.location.coords.latitude;
    var long=this.state.location.coords.longitude;
    fetch(`http://hackverse-gods.herokuapp.com/mark_safe_location?latitude=${lat}&longitude=${long}`)
    .then((response)=>{
      this.setState({mark_safe: 'Your location is marked as safe'})
      _storeData = async () => {
        try {
          await AsyncStorage.setItem('location', [this.state.latitude,' ',this.state.longitude]);
        } catch (error) {
          // Error saving data
        }
      };
    })

  }

  markUnsafe(){
    var lat=this.state.location.coords.latitude;
    var long=this.state.location.coords.longitude;
    fetch(`http://hackverse-gods.herokuapp.com/mark_unsafe_location?latitude=${lat}&longitude=${long}`)
    .then((response)=>{
      this.setState({mark_unsafe:'Your location is marked as unsafe'})
    })
    .catch(err=()=> {
      _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('location');
          if (value !== null) {
            // We have data!!
            console.warn(value);
          }
        } catch (error) {
          // Error retrieving data
        }
      };
    })
  }

  startLoopForGettingLocation(){
    setInterval(this.getLocation.bind(this),1000)
  }

  get_bearing_angle(lat_src,long_src,lat_dest,long_dest){
    //calculation of bearing angle
    lat2=lat_dest*Math.PI/180
    lat1=lat_src*Math.PI/180
    long2=long_dest*Math.PI/180
    long1=long_src*Math.PI/180
    var x = Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(long1-long2)
    var y = Math.sin(long2-long1)*Math.cos(lat2)
    var bearing_angle = Math.atan2(y,x)
    this.setState({bearing_angle:1*bearing_angle*180/(Math.PI)})

    

  }

  handleHeadingAngle(heading_angle){
    
    this.setState({heading_angle:-1*heading_angle})
    this.props.bearing_angle=this.state.bearing_angle;

  }

  getLocation(){
    Geolocation.getCurrentPosition(
      position => {
        const location = position;
        this.setState({location:location});
        var long=this.state.location.coords.longitude;
        
        var lat=this.state.location.coords.latitude;
        this.state.latitude=this.state.location.coords.latitude;
        this.state.longitude=this.state.location.coords.longitude;
        fetch(`http://hackverse-gods.herokuapp.com/get_nearest_safe_location?latitude=${lat}&longitude=${long}`)
        .then(response=>{
          return response.json()
        }).then((data) => {
          
          this.setState({destination_location:[data.latitude,' ',data.longitude]})

          var distance=haversineDistance(data.latitude,data.longitude,this.state.location.coords.latitude,this.state.location.coords.longitude);
          this.setState({total_distance:distance})
          this.get_bearing_angle(this.state.location.coords.latitude,this.state.location.coords.longitude,data.latitude,data.longitude)
        })
      },
      err => console.warn('Move to an open location'),   //raise an alert
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }

  showloader(){
    this.setState({isLoading: true})
  }

  Sos(){
    fetch(`http://hackverse-gods.herokuapp.com/sos_distress?latitude=${this.state.latitude}&longitude=${this.state.longitude}`)
  }


  render(){
    
    return (
        <View style={styles.container}>

          <ScrollView>
          <Text style={[styles.text_style,styles.text_style_heading]}>Your Location Coordinates</Text>
          <Text style={styles.text_style}>{ this.state.latitude } lat {this.state.longitude} long</Text>
          <Text style={styles.text_style}>Your Nearest Safest Location is: {this.state.destination_location}</Text>

          <Text style={styles.text_style}>Distance from your location is {this.state.total_distance*1000} m</Text>
          <Text style={styles.text_style}>Bearing Angle: {this.state.bearing_angle}</Text>
          <Text style={styles.text_style}>Heading Angle: {this.state.heading_angle}</Text>
          <View>
            <Compass getHeadingAngle = {this.handleHeadingAngle.bind(this)} BearingAngle={this.state.bearing_angle}/>
          </View>
          <View style={styles.button_container}>
            <Button style={styles.button} title="Mark Yourself Safe" onPress={this.markSafe.bind(this)}></Button>
            <Text>{this.state.mark_safe}</Text>
            <Button style={styles.button} title="Mark Yourself Unsafe" onPress={this.markUnsafe.bind(this)}></Button>
            <Text>{this.state.mark_unsafe}</Text>
            <Button style={styles.button} title="Find Your Family Member" onPress={this.Sos.bind(this)}></Button>
            <Text></Text>
            <Button color="red" style={styles.button} title="SOS" onPress={this.Sos.bind(this)}></Button>

            {/* <ActivityIndicator animating={this.state.isLoading} size="large" color="#0000ff" /> */}
          </View>
          <View style={{
            height: 100
          }}>

          </View>
          </ScrollView>
        </View>
        
    )
  }
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  navbar: {
    height: 400,
    backgroundColor: 'white',
    textAlign: 'center',
    elevation: 3,
  },
  text_disaster: {
    fontSize: 30,
    color: 'black',
    textAlign: "center"
  },
  text_style: {
    marginBottom: 10,
    fontSize: 20,
    textAlign:"center"
  },
  text_style_heading:{
    textAlign: 'center'
  },
  button: {
    margin: 100,
  },
  button_container: {
    padding: 20,
    justifyContent: 'space-between',
  }
  
});

export default App;


