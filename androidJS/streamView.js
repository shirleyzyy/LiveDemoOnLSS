/**
 * Created by yuanyuanzhao on 2017/6/23.
 */
import React ,{Component} from 'react';
import {
    View,
    Text,
    ListView,
    Image,
    TouchableOpacity,
    StyleSheet,
    NativeModules,
    DeviceEventEmitter
} from 'react-native';

var screen = require('Dimensions').get('window');
var scale = screen.width/375;
import ZYLiveBackGroundGroupViewManager from './nativeStreamView';
var imModule = NativeModules.IMCloud;
var myModule = NativeModules.ZYLiveBackGroundGroupViewManager;
var arr = [''];
export default class StreamView extends Component {
    static navigationOptions = {
        title: 'StreamView ',
        header:null
    };
    constructor(props){
        super(props);
        this.clickBack = this.clickBack.bind(this);
        this.clickFlash = this.clickFlash.bind(this);
        this.clickSwitch = this.clickSwitch.bind(this);
        this.clickBeauty = this.clickBeauty.bind(this);
        this.clickStart = this.clickStart.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        var ds = new ListView.DataSource({rowHasChanged:(r1,r2) => {r1 !== r2}});

        this.state = {
            flash:false,
            camera:false,
            beauty:false,
            steam:false,
            dataSource:ds,
            inputText:{
                'name':'',
                'message':''
            }
        }
    }

    componentWillMount() {
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(arr)
        });
        console.log('添加观察者');
        DeviceEventEmitter.addListener('im.onReceive', (data) => this.receiveMessage(data.userId , data.message));
    }

   render(){
        console.log('这是竖直页');
        console.log('directionButtonTag:',this.props.navigation.state.params.directionButtonTag);
        console.log('resolutionButtonTag:',this.props.navigation.state.params.resolutionButtonTag);
        console.log('url:',this.props.navigation.state.params.url);
        console.log('width',screen.width);
        console.log('height',screen.height);
        myModule.start(this.props.navigation.state.params.url,this.props.navigation.state.params.resolutionButtonTag.toString(),this.props.navigation.state.params.directionButtonTag.toString());

       return(
    <ZYLiveBackGroundGroupViewManager>
        <View style={styles.background}>
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
                <View style={styles.messageView}>
                    <ListView dataSource={this.state.dataSource}
                              renderRow={this.renderMessages}
                              ref='messages'
                    ></ListView>
                </View>
                <TouchableOpacity onPress={()=>this.clickStart()}>
                    <Image source={(!this.state.steam) ? require('../img/stream.png') :require('../img/streaming.png')} style={styles.videoImgStyle}></Image>
                </TouchableOpacity>
            </View>
        </View>
    </ZYLiveBackGroundGroupViewManager>
      )
  };
    renderMessages(data){
        if ( data == '' ){
            return (<Text>{data}</Text>);
        } else {
            return(<Text style={styles.textStyle}>{data.name +':'+ data.message}</Text>);
        }
    }

    receiveMessage(name,text){
        //收到消息刷新界面
        console.log('收到消息刷新界面'+name+'：'+text);
        this.setState({
            inputText:{
                name:name,
                message:text
            }
        });
        arr.push(this.state.inputText);
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(arr)
        });
    }

    clickBack(){
      console.log('点击返回');
      myModule.onBack();
      const {goBack} = this.props.navigation;
      goBack();
    }

    clickFlash(){
        console.log('点击闪光灯');
        var before = this.state.flash;
        var that = this;
        var events = myModule.onToggleFlash();
        events.then(function (value) {
            console.log(value);
            that.setState({
                flash:!before
            });
        },function (error) {
            console.log(error);
        });
    }

    clickSwitch(){
        console.log('点击转换相机');
        var before = this.state.camera;
        var that = this;
        var events = myModule.onSwitchCamera();
        events.then(function (value) {
            console.log(value);
            that.setState({
                camera:!before
            });
        },function (error) {
            console.log(error);
        });
    }

    clickBeauty(){
        console.log('点击美颜');
        var before = this.state.beauty;
        var that = this;
        var events = myModule.onBeauty();
        events.then(function (value) {
            console.log(value);
            that.setState({
                beauty:!before
            });
        },function (error) {
            console.log(error);
        });
    }

    clickStart(){
        console.log('点击开始录制');
        var before = this.state.steam;
        var that = this;
        var events =  myModule.onToggleStream();
        events.then(function (value) {
            console.log(value);
            that.setState({
                steam:!before
            });
        },function (error) {
            console.log(error);
        });
    }
}
const styles = StyleSheet.create({
    tt:{
        zIndex:6
    },
    test:{
        width:30,
        height:50,
        backgroundColor:"#aaddff",
        // position:'absolute',
        top:5,
        left:10
    },
    testa:{
        width:200,
        height:300,
        backgroundColor:"#ddddff",
        zIndex:-1
    },
    background:{
        width:screen.width,
        height:screen.height,
        backgroundColor:'transparent',
        flexDirection:'column',
        justifyContent:'space-between',
        zIndex:1
    },
    upperView:{
        backgroundColor:'transparent',
        width:screen.width,
        height:300*scale,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    downView:{
        backgroundColor:'transparent',
        width:screen.width,
        height:250*scale,
        justifyContent:'space-between',
        alignItems:'center',
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
        marginBottom:30*scale,
        marginRight:10
    },
    rightView:{
        width:200*scale,
        height:50,
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    messageView:{
        backgroundColor:'rgba(105,105,105,0.5)',
        height:250*scale,
        width:screen.width/3*2
    },
    textStyle:{
        color:'white'
    }
})