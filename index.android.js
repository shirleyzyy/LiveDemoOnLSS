import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
// import Navigator from './androidJS/settingView';
import StreamView from './androidJS/streamView';
import SettingView from './androidJS/settingView';
import StreamViewLandScape from './androidJS/streamViewLandScape';
import playView from "./androidJS/playView";
var screen = require('Dimensions').get('window');
class SettingScreen extends Component {
    static navigationOptions = {
        title: 'Welcome',
        header: null
    };

    constructor(props) {
        super(props);
    }

    render() {
        console.log('进入index.android.js');

        return (
            <View style={styles.container}>
                {/*这里要显示的传递navigation*/}
                <SettingView navigation={this.props.navigation}/>
                {/*<Navigator/>*/}
                {/*<Text>ReactNative!!!</Text>*/}
            </View>
        );
    }

}

const RNLive = StackNavigator({
    Setting: {screen: SettingScreen},
    Stream: {screen: StreamView},
    StreamLandscape: {screen: StreamViewLandScape},
    playView: {screen: playView}
});


const styles = StyleSheet.create({
    container: {
        width: screen.width,
        height: screen.height
    }
});

// Module name
AppRegistry.registerComponent('RNLive', () => RNLive);

