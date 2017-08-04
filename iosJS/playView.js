/**
 * Created by yuanyuanzhao on 2017/7/27.
 */
import React ,{Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    NativeModules
} from 'react-native';
var screen = require('Dimensions').get('window');
import ZYPlayerView from './nativePlayView';
var myModule = NativeModules.ZYPlayerViewManager;
export default class PlayView extends Component{
    constructor(props){
        super(props);
        this.clickBack = this.clickBack.bind(this);
    }
    render(){
        // myModule.start(this.props.url);
        var tt = "hahaha";
        myModule.start(tt);
        return(
        <ZYPlayerView style={styles.background}>
            <TouchableOpacity onPress={()=>this.clickBack()}>
                <Image source={require('../img/back.png')} style={styles.imgStyle}></Image>
            </TouchableOpacity>
        </ZYPlayerView>

            );
    }
    clickBack(){
        console.log('点击返回');
        myModule.onBack();
        this.props.navigator.pop();
    }
}
var styles = StyleSheet.create({
    background:{
        width:screen.width,
        height:screen.height
    },
    imgStyle:{
        width:50,
        height:50,
        marginRight:5,
        marginLeft:5
    }
});