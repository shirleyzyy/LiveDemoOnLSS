
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Navigator from './iosJS/settingView';

var screen = require('Dimensions').get('window');
class RNLive extends Component {
  render(){
    return(
        <View style={styles.container}>
            {/*<SettingView/>*/}
            <Navigator/>
     </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
      marginTop:20,
      width:screen.width,
      height:screen.height
  }
});

// Module name
AppRegistry.registerComponent('RNLive', () => RNLive);

