/**
 * Created by yuanyuanzhao on 2017/6/23.
 */
import React ,{Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    NativeModules
} from 'react-native';

var screen = require('Dimensions').get('window');
var scale = screen.width/375;
import ZYLiveBackGroundView from './nativeStreamView';

var myModule = NativeModules.ZYLiveBackGroundViewManager;

export default class StreamView extends Component {
    constructor(props){
        super(props);
        this.clickBack = this.clickBack.bind(this);
        this.clickFlash = this.clickFlash.bind(this);
        this.clickSwitch = this.clickSwitch.bind(this);
        this.clickBeauty = this.clickBeauty.bind(this);
        this.clickStart = this.clickStart.bind(this);
        this.state = {
            flash:false,
            camera:false,
            beauty:false,
            steam:false
        }
        this.setupNativeComponent();
    }
    setupNativeComponent(){
        console.log('这是竖直页');
        console.log('directionButtonTag:',this.props.directionButtonTag);
        console.log('resolutionButtonTag:',this.props.resolutionButtonTag);
        console.log('url:',this.props.url);
        myModule.start(this.props.url,this.props.resolutionButtonTag.toString(),this.props.directionButtonTag.toString());
    }
   render(){
       return(
          <ZYLiveBackGroundView style={styles.background}>
              <View style={styles.upperView}>
                  <TouchableOpacity onPress={()=>this.clickBack()}>
                      <Image source={require('../img/back.png')} style={styles.imgStyle}></Image>
                  </TouchableOpacity>

                  <View style={styles.rightView}>
                      <TouchableOpacity onPress={()=>this.clickFlash()}>
                          <Image source={(this.state.flash) ? require('../img/flash_off.png') :require('../img/flash_on.png')} style={styles.imgStyle}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>this.clickSwitch()}>
                          <Image source={require( '../img/switch_camera.png')} style={styles.imgStyle}></Image>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>this.clickBeauty()}>
                          <Image source={(this.state.beauty) ? require('../img/beauty_off.png') :require('../img/beauty_on.png')} style={styles.imgStyle}></Image>
                      </TouchableOpacity>

                  </View>
              </View>
              <View style={styles.downView}>
                  <TouchableOpacity onPress={()=>this.clickStart()}>
                      <Image source={(!this.state.steam ) ? require('../img/stream.png') :require('../img/streaming.png')} style={styles.videoImgStyle}></Image>
                  </TouchableOpacity>
              </View>
          </ZYLiveBackGroundView>
      )
  };

  clickBack(){
      console.log('点击返回');
      myModule.onBack();
      this.props.navigator.pop();
  }

  async clickFlash(){
      console.log('点击闪光灯');
      var that = this;
      var events = myModule.onToggleFlash();
      events.then(function (events){
          console.log("进入then  events is ", events);
          if(events == '闪光灯打开'){
              that.setState({
                  flash:1
              });
          } else {
              that.setState({
                  flash:0
              });
          }
      }).catch(function (error) {
          console.log(error);
      });
  }

  async clickSwitch(){
      console.log('点击转换相机');
      var events = myModule.onSwitchCamera();
      // events.then(function (events){
      //     console.log("转换相机方向成功 ", events);
      // }).catch(function (error) {
      //     console.log(error);
      // });
  }

  async clickBeauty(){
      console.log('点击美颜');
      var that = this;
      var events = myModule.onBeauty();
      events.then(function (events){
          console.log("进入then  events is ", events);
          if(events == '正在美颜'){
              that.setState({
                  beauty:1
              });
          } else {
              that.setState({
                  beauty:0
              });
          }
      }).catch(function (error) {
          console.log(error);
      });
  }

   async clickStart(){
        console.log('点击开始录制');
        var that = this;
        var events = myModule.onToggleStream();
        events.then(function (events){
            console.log("进入then  events is ", events);
            if(events == '正在推流'){
                that.setState({
                    steam:1
                });
            } else {
                that.setState({
                    steam:0
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
  }
}
const styles = StyleSheet.create({
    background:{
        width:screen.width,
        height:screen.height,
        flexDirection:'column',
        justifyContent:'space-between'
    },
    upperView:{
        backgroundColor:'transparent',
        width:screen.width,
        height:300*scale,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    downView:{
        backgroundColor:'transparent',
        width:screen.width,
        height:130*scale,
        justifyContent:'center',
        flexDirection:'row'
    },
    imgStyle:{
        width:50,
        height:50,
        marginRight:5,
        marginLeft:5
    },
    videoImgStyle:{
        width:100*scale,
        height:100*scale,
        marginBottom:30*scale
    },
    rightView:{
        width:200*scale,
        height:50,
        flexDirection:'row',
        justifyContent:'flex-end'
    }
})