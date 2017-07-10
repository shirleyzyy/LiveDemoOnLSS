/**
 * Created by yuanyuanzhao on 2017/7/7.
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
import ZYLiveBackGroundView from './myView';

var myModule = NativeModules.ZYLiveBackGroundViewManager;

export default class StreamViewLandScape extends Component {
    constructor(props){
        super(props);
        this.clickBack = this.clickBack.bind(this);
        this.clickFlash = this.clickFlash.bind(this);
        this.clickSwitch = this.clickSwitch.bind(this);
        this.clickBeauty = this.clickBeauty.bind(this);
        this.clickStart = this.clickStart.bind(this);
        this.state = {
            flash:0,
            camera:0,
            beauty:0,
            steam:0
        }
    }

    render(){
        console.log('这是水平页');
        console.log('directionButtonTag:',this.props.directionButtonTag);
        console.log('resolutionButtonTag:',this.props.resolutionButtonTag);
        console.log('url:',this.props.url);
        myModule.start(this.props.url,this.props.resolutionButtonTag.toString(),this.props.directionButtonTag.toString());

        return(
            <ZYLiveBackGroundView style={styles.background}>
                <View style={styles.downView}>
                    <TouchableOpacity onPress={()=>this.clickStart()}>
                        <Image source={require('../img/stream_background.png')} style={styles.videoImgStyle}></Image>
                    </TouchableOpacity>
                </View>

                <View style={styles.upperView}>

                    <TouchableOpacity onPress={()=>this.clickBack()}>
                        <Image source={require('../img/back.png')} style={styles.backStyle}></Image>
                    </TouchableOpacity>

                    <View style={styles.rightView}>
                        <TouchableOpacity onPress={()=>this.clickFlash()}>
                            <Image source={(this.state.flash == 0) ? require('../img/flash_off.png') :require('../img/flash_on.png')} style={styles.imgStyle}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.clickSwitch()}>
                            <Image source={require( '../img/switch_camera.png')} style={styles.imgStyle}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.clickBeauty()}>
                            <Image source={(this.state.beauty == 0) ? require('../img/beauty_off.png') :require('../img/beauty_on.png')} style={styles.imgStyle}></Image>
                        </TouchableOpacity>

                    </View>
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

        try {
            var events = myModule.onToggleFlash();
            console.log('闪光灯成功');
            this.setState({
                flash:1
            });
        } catch(e) {
            console.error(e);
        }
    }

    clickSwitch(){
        console.log('点击转换相机');
        myModule.onSwitchCamera();
    }

    async clickBeauty(){
        console.log('点击美颜');
        try {
            var events = myModule.onBeauty();
            console.log('美颜成功');
            this.setState({
                beauty:1
            });
        } catch(e) {
            console.error(e);
        }

    }

    clickStart(){
        console.log('点击开始录制');
        myModule.onToggleStream();
    }
}
const styles = StyleSheet.create({
    background:{
        width:screen.width,
        height:screen.height,
        flexDirection:'row',
        justifyContent:'space-between'
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
        width:100*scale,
        justifyContent:'center',
        flexDirection:'column'
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
        transform:[{rotate:'90deg'}]
    },
    rightView:{
        width:50,
        height:200*scale,
        marginBottom:30*scale,
        flexDirection:'column',
        justifyContent:'flex-end'
    }
})