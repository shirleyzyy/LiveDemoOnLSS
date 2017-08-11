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
    ListView,
    TextInput,
    KeyboardAvoidingView,
    NativeModules,
    NativeEventEmitter
} from 'react-native';
var screen = require('Dimensions').get('window');
import ZYPlayerView from './nativePlayView';
var playerModule = NativeModules.ZYPlayerViewManager;
var imModule = NativeModules.IMCloud;
var im = new NativeEventEmitter(imModule);
var arr = [''];
export default class PlayView extends Component{
    constructor(props){
        super(props);
        var ds = new ListView.DataSource({rowHasChanged:(r1,r2) => {r1 !== r2}});
        this.state = {
            dataSource:ds,
            inputText:{
                'name':'',
                'message':''
            }
        };
        this.clickBack = this.clickBack.bind(this);
        this.scrollToEnd = this.scrollToEnd.bind(this);
        this.inputFinish = this.inputFinish.bind(this);
        this.clickSend = this.clickSend.bind(this);
        this.renderMessages = this.renderMessages.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        playerModule.start(this.props.url);
        imModule.startRongYunIM();
    }

    componentDidMount(){
        this.setState({
            dataSource:this.state.dataSource.cloneWithRows(arr)
        });
        setTimeout(this.scrollToEnd,500);
        console.log('添加观察者');
        im.addListener(
            'EventReminder',
            (data) => this.receiveMessage(data.userId , data.message),
            this
        );
    }

    componentWillUnmount(){
        // im.remove();
    }

    render(){
        return(
        <ZYPlayerView style={styles.background}>
            <TouchableOpacity onPress={()=>this.clickBack()}>
                <Image source={require('../img/back.png')} style={styles.imgStyle}></Image>
            </TouchableOpacity>
            <KeyboardAvoidingView style={styles.downView}
                               behavior='position'
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
                           multiline={true}
                           numberOfLines={2}
                           returnKeyType="done"
                           ref="textInput"
                           blurOnSubmit={true}
                ></TextInput>
                    <TouchableOpacity onPress={()=>this.clickSend()}>
                        <Text style={styles.inputButton}>发送</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        this.refs.messages.scrollToEnd({animated: true});
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
        imModule.sendRCMessage(this.state.inputText.message);
    }

    clickBack(){
        console.log('点击返回');
        playerModule.onBack();
        this.props.navigator.pop();
    }
}
var styles = StyleSheet.create({
    background:{
        width:screen.width,
        height:screen.height,
        justifyContent:'space-between',
        flexDirection:'column'
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
        height:240,
        width:screen.width/3*2,
        marginBottom:10
    },
    messageView:{
        backgroundColor:'rgba(105,105,105,0.5)',
        height:200
    },
    textInputStyle:{
        backgroundColor:'white',
        height:20,
        width:screen.width/3*2-40,
        borderColor:'#bbaadd',
        borderWidth:1,
        // fontSize:20,
        // lineHeight:20坑，无法设置键盘弹出的高度！！！
    },
    inputView:{
        height:40,
        flexDirection:'row'
    },
    inputButton:{
        width:40,
        backgroundColor:'#C6E2FF',
        textAlign:'center',
        height:20,
        textAlignVertical:'center'
    }
});