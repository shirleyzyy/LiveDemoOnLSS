/**
 * Created by yuanyuanzhao on 2017/6/22.
 */
import React , {Component, PropTypes} from 'react';
import {
    Text,
    View,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity,
    NavigatorIOS
} from 'react-native';
import StreamView from './streamView';
import StreamViewLandScape from './streamViewLandScape';
var screen = require('Dimensions').get('window');
var ppi = require('PixelRatio').get();
var scale = screen.width/375;//在6P上需要加入ppi的计算scale = screen.width*ppi/375/2，但在模拟器上看不出差别
export default class Navigator extends Component{
    render(){
        return(
          <NavigatorIOS initialRoute={{
              component:SettingView,
              title:'setting',
              navigationBarHidden:true
          }}//此处一定要设置flex：1，不然显示不出来
              style={{flex:1}}
          />
        );
    }
}


class SettingView extends Component{
    constructor(props){
        super(props);
        this.pressButton = this.pressButton.bind(this);
        this.pressDirectionButton = this.pressDirectionButton.bind(this);
        this.pressPushButton = this.pressPushButton.bind(this);
        this.gotoPortraitView = this.gotoPortraitView.bind(this);
        this.gotoLandscapeView = this.gotoLandscapeView.bind(this);
        this.state = {
            directionButtonTag:1,
            resolutionButtonTag:1,
            url:''
        }
    }

    render(){
        console.log(screen.width);
        console.log(ppi);

        return(
            <View style={styles.backgroundView}>

                {/*输入推流地址框*/}
                <Image source={require('../img/background.png')} style={styles.streamImg}>
                    <Image source={require('../img/url_background.png')} style={styles.urlImg}>
                        <TextInput onChangeText={(text)=>this.setState({url:text})} placeholder={'请输入推流地址'} style={styles.inputStyle}/>
                    </Image>
                </Image>

                {/*选择视频流清晰度*/}
                <View style={styles.resolutionView}>
                    <TouchableOpacity onPress={()=>this.pressButton(1)}>
                        <View style={(this.state.resolutionButtonTag == 1) ? styles.resolutionButtonSelected:styles.resolutionButtonNoSelected}>
                            <Text>1080P</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.pressButton(2)}>
                        <View style={(this.state.resolutionButtonTag == 2) ? styles.resolutionButtonSelected:styles.resolutionButtonNoSelected}>
                            <Text>720P</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.pressButton(3)}>
                        <View style={(this.state.resolutionButtonTag == 3) ? styles.resolutionButtonSelected:styles.resolutionButtonNoSelected}>
                            <Text>480P</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.pressButton(4)}>
                        <View style={(this.state.resolutionButtonTag == 4) ? styles.resolutionButtonSelected:styles.resolutionButtonNoSelected}>
                            <Text>360P</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/*选择横屏或竖屏*/}
                <View style={styles.directionView}>
                    <TouchableOpacity onPress={()=>this.pressDirectionButton(1)}>
                        <View style={(this.state.directionButtonTag == 1) ? styles.directionButtonSelected:styles.directionButtonNoSelected}>
                            <Text>竖屏</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.pressDirectionButton(2)}>
                        <View style={(this.state.directionButtonTag == 2) ? styles.directionButtonSelected:styles.directionButtonNoSelected}>
                            <Text>横屏</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/*推流按钮*/}
                <TouchableOpacity onPress={()=>this.pressPushButton()}>
                    <Image source={require('../img/start_stream.png')} style={styles.pushButton}/>
                </TouchableOpacity>

            </View>
        )}

    pressButton(tag){
        console.log('点击了按钮'+tag);
        this.setState({
            resolutionButtonTag:tag
        });
    }

    pressDirectionButton(tag){
        console.log('选择了方向'+tag);
        this.setState({
            directionButtonTag:tag
        });
    }

    pressPushButton(){
        console.log('点击推流');
        if (this.state.directionButtonTag == 1){
            this.gotoPortraitView();
        } else {
            this.gotoLandscapeView();
        }
    }

    gotoPortraitView(){
        this.props.navigator.push({
                component: StreamView,
                title: '推流',
                navigationBarHidden:true,
                passProps: {
                                directionButtonTag : this.state.directionButtonTag,
                                resolutionButtonTag:this.state.resolutionButtonTag,
                                url:this.state.url
                            }
                }
            );
    }

    gotoLandscapeView(){
        this.props.navigator.push({
            component: StreamViewLandScape,
            title: '推流',
            navigationBarHidden:true,
            passProps: {
                            directionButtonTag : this.state.directionButtonTag,
                            resolutionButtonTag:this.state.resolutionButtonTag,
                            url:this.state.url
                        }
        });

    }
}
const styles = StyleSheet.create({
    backgroundView : {
        backgroundColor:'#ffffff',
        flex:1,
        alignItems:'center'
    },
    streamImg:{
        height:230*scale,
        width:screen.width
    },
    urlImg:{
        marginTop:30,
        marginLeft:10,
        marginRight:10,
        width:screen.width-20,
        height:170*scale
    },
    inputStyle:{
        marginLeft:10,
        marginRight:10,
        height:100*scale
    },
    resolutionView:{
        height:60*scale,
        marginRight:10,
        marginLeft:10,
        flexDirection:'row'
    },
    resolutionButtonSelected:{
        width:(screen.width-20)/4-10,
        marginLeft:5,
        marginRight:5,
        marginTop:10,
        height:40*scale,
        borderRadius:20*scale,
        borderColor:'gray',
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#1475ea'
    },
    resolutionButtonNoSelected:{
        width:(screen.width-20)/4-10,
        marginLeft:5,
        marginRight:5,
        marginTop:10,
        height:40*scale,
        borderRadius:20*scale,
        borderColor:'#1475ea',
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center'
    },
    directionView:{
        height:60*scale,
        marginRight:10,
        marginLeft:10,
        flexDirection:'row'
    },
    directionButtonSelected:{
        width:(screen.width-20)/2-10,
        marginLeft:5,
        marginRight:5,
        marginTop:10,
        height:40*scale,
        borderRadius:20*scale,
        borderColor:'gray',
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#1475ea'
    },
    directionButtonNoSelected:{
        width:(screen.width-20)/2-10,
        marginLeft:5,
        marginRight:5,
        marginTop:10,
        height:40*scale,
        borderRadius:20*scale,
        borderColor:'#1475ea',
        borderWidth:1,
        justifyContent:'center',
        alignItems:'center'
    },
    pushButton:{
        marginTop:100*scale,
        height:200*scale,
        width:200*scale
    }
});