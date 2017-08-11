/**
 * Created by yuanyuanzhao on 2017/7/7.
 */
import React ,{Component} from 'react';
import {
    View,
    Text,
    Image,
    ListView,
    TouchableOpacity,
    StyleSheet,
    NativeModules,
    DeviceEventEmitter
} from 'react-native';

var screen = require('Dimensions').get('window');
var scale = screen.width/375;
var arr = [''];
import ZYLiveBackGroundGroupViewManager from './nativeStreamView';
//
var myModule = NativeModules.ZYLiveBackGroundGroupViewManager;

export default class StreamViewLandScape extends Component {
    static navigationOptions = {
        title: 'StreamViewLandScape',
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
        console.log('这是水平页');
        console.log('directionButtonTag:',this.props.navigation.state.params.directionButtonTag);
        console.log('resolutionButtonTag:',this.props.navigation.state.params.resolutionButtonTag);
        console.log('url:',this.props.navigation.state.params.url);
        myModule.start(this.props.navigation.state.params.url,this.props.navigation.state.params.resolutionButtonTag.toString(),this.props.navigation.state.params.directionButtonTag.toString());

        return(
            <ZYLiveBackGroundGroupViewManager>
                <View style={styles.background}>
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

                    <View style={styles.upperView}>

                        <TouchableOpacity onPress={()=>this.clickBack()}>
                            <Image source={require('../img/back.png')} style={styles.backStyle}></Image>
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
        var that = this;
        var before = this.state.beauty;
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
    background:{
        width:screen.width,
        height:screen.height,
        flexDirection:'row',
        justifyContent:'space-between',
        zIndex:1
    },
    upperView:{

        height:screen.height,
        backgroundColor:'transparent',
        flexDirection:'column',
        justifyContent:'space-between'
    },
    downView:{
        backgroundColor:'transparent',
        height:screen.height,
        flexDirection:'column',
        width:200*scale,
        justifyContent:'space-between',
        alignItems:'center'
    },
    backStyle:{
        width:50,
        height:50,
        transform:[{rotate:'90deg'}]
    },
    imgStyle:{
        width:50,
        height:50,
        marginTop:5,
        marginBottom:5,
        transform:[{rotate:'90deg'}]
    },
    videoImgStyle:{
        width:100*scale,
        height:100*scale,
        transform:[{rotate:'90deg'}],
        backgroundColor:'white'
    },
    rightView:{
        width:50,
        height:200*scale,
        marginBottom:30*scale,
        flexDirection:'column',
        justifyContent:'flex-end'
    },
    messageView:{
        backgroundColor:'rgba(105,105,105,0.5)',
        // backgroundColor:'white',
        height:200*scale,
        width:screen.height/3*2,
        transform:[{rotate:'90deg'}]
    },
    textStyle:{
        color:'white'
    }
})