/**
 * Created by yuanyuanzhao on 2017/7/27.
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ListView,
    TextInput,
    KeyboardAvoidingView,
    NativeModules,
    DeviceEventEmitter
} from 'react-native';
var screen = require('Dimensions').get('window');
import ZYPlayerView from './nativePlayView';
var imModule = NativeModules.IMCloud;
var arr = [''];
export default class PlayView extends Component {

    static navigationOptions = {
        title: 'StreamViewLandScape',
        header: null
    };

    constructor(props) {
        super(props);
        console.log("PlayView-constructor");
        var ds = new ListView.DataSource({rowHasChanged:(r1,r2) => {r1 !== r2}});
        this.state = {
            dataSource:ds,
            inputText:{
                'name':'',
                'message':''
            }
        }
        this.clickBack = this.clickBack.bind(this);
        this.scrollToEnd = this.scrollToEnd.bind(this);
        this.inputFinish = this.inputFinish.bind(this);
        this.clickSend = this.clickSend.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
    }

    componentWillMount() {
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(arr)
        });
        setTimeout(this.scrollToEnd,500);
        console.log('添加观察者');
        DeviceEventEmitter.addListener('im.onReceive', (data) => this.receiveMessage(data.userId , data.message));
    }

    render() {
        return (
            <ZYPlayerView>
                {/*<View style={styles.hud}>*/}
                    {/*<Text style={styles.hudText}>Here goes message</Text>*/}
                    {/*<TouchableOpacity onPress={() => this.sendMessage("Valar Morghulis!")}>*/}
                        {/*<Text style={styles.hudText}>*/}
                            {/*sendMessage*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}
                <View style={styles.background}>
                    <TouchableOpacity onPress={()=>this.clickBack()}>
                        <Image source={require('../img/back.png')} style={styles.imgStyle}></Image>
                    </TouchableOpacity>
                    <KeyboardAvoidingView style={styles.downView}
                                          behavior='padding'
                    >
                        <View style={styles.messageView}>
                            <ListView dataSource={this.state.dataSource}
                                      renderRow={this.renderMessages}
                                      ref='messages'
                            ></ListView>
                        </View>
                        <View style={styles.inputView}>
                            <TextInput style={styles.textInputStyle}
                                       onChangeText={(text) => this.inputFinish(text)}
                                       placeholder={'请输入消息'}
                                       placeholderTextColor="black"
                                       multiline={true}
                                       numberOfLines={2}
                                       returnKeyLabel="done"
                                       ref="textInput"
                                       blurOnSubmit={true}
                                       underlineColorAndroid={'transparent'}
                            ></TextInput>
                            <TouchableOpacity onPress={()=>this.clickSend()}>
                                <Text style={styles.inputButton}>发送</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </ZYPlayerView>
        );
    }


    renderMessages(data){
        if ( data == '' ){
            return (<Text>{data}</Text>);
        } else {
            return(<Text style={styles.textStyle}>{data.name +':'+ data.message}</Text>);
        }
    }

    scrollToEnd(){
        //FIXME：安卓上两种滚动方法均无效
        console.log('进入scrollToEnd');
        this.refs.messages.scrollToEnd({animated: true});
        // this.refs.messages.scrollTo({x:0,y:150,animated:true});
    }

    inputFinish(text){
        console.log('输入：'+text);
        this.setState({
            inputText:{
                name:'我',
                message:text
            }
        });
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
        setTimeout(this.scrollToEnd,500);
    }

    clickSend(){
        console.log('点击了send');
        arr.push(this.state.inputText);
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(arr)
        });
        this.refs.textInput.clear();
        setTimeout(this.scrollToEnd,500);
        imModule.sendMessage(this.state.inputText.message);
    }

    clickBack(){
        console.log('点击返回');
        const {goBack} = this.props.navigation;
        goBack();
    }

}

var styles = StyleSheet.create({
    background:{
        width:screen.width,
        height:screen.height,
        justifyContent:'space-between',
        flexDirection:'column',
        zIndex:1
    },
    textStyle:{
        color:'white'
    },
    imgStyle:{
        width:50,
        height:50,
        marginRight:5,
        marginLeft:5
    },
    downView:{
        height:250,
        width:screen.width/3*2,
        marginBottom:10
    },
    messageView:{
        backgroundColor:'rgba(105,105,105,0.5)',
        height:200
    },
    textInputStyle:{
        backgroundColor:'white',
        height:50,
        width:screen.width/3*2-40,
        borderColor:'#bbaadd',
        borderWidth:1,
        textAlignVertical: 'top'
        // fontSize:20,
        // lineHeight:20坑，无法设置键盘弹出的高度！！！
    },
    inputView:{
        height:50,
        flexDirection:'row'
    },
    inputButton:{
        width:40,
        backgroundColor:'#C6E2FF',
        textAlign:'center',
        height:40,
        textAlignVertical:'center',

    }
});