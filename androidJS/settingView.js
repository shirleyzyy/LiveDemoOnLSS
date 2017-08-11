/**
 * Created by yuanyuanzhao on 2017/6/22.
 */
import React, {Component, PropTypes} from 'react';
import {
    Text,
    View,
    TextInput,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import StreamView from './streamView';
import StreamViewLandScape from './streamViewLandScape';
var screen = require('Dimensions').get('window');
var ppi = require('PixelRatio').get();
var scale = screen.width / 375;//在6P上需要加入ppi的计算scale = screen.width*ppi/375/2，但在模拟器上看不出差别

export default class SettingView extends Component {

    static navigationOptions = {
        title: 'SettingView ',
        header: null
    };

    constructor(props) {
        super(props);
        this.pressButton = this.pressButton.bind(this);
        this.pressDirectionButton = this.pressDirectionButton.bind(this);
        this.pressPushButton = this.pressPushButton.bind(this);
        this.gotoPortraitView = this.gotoPortraitView.bind(this);
        this.gotoLandscapeView = this.gotoLandscapeView.bind(this);
        this.state = {
            directionButtonTag: 0,
            resolutionButtonTag: 0,
            url: ''
        }
        console.log('进入settingView.js构造函数');
    }

    render() {
        console.log(screen.width);
        console.log(ppi);

        return (
            <View style={styles.backgroundView}>

                {/*输入推流地址框*/}
                <Image source={require('../img/background.png')} style={styles.streamImg}>
                    <Image source={require('../img/url_background.png')} style={styles.urlImg}>
                        <TextInput onChangeText={(text) => this.setState({url: text})}
                                   placeholder={'请输入推流或播放地址,默认推流地址为rtmp://push.bcelive.com/live/yvwslfyqf9lgyfnnsy'}
                                   underlineColorAndroid={'transparent'}
                                   multiline={true}
                                   numberOfLines={3}
                                   style={styles.inputStyle}/>
                    </Image>
                </Image>

                {/*选择视频流清晰度*/}
                <View style={styles.resolutionView}>
                    <TouchableOpacity onPress={() => this.pressButton(0)}>
                        <View
                            style={(this.state.resolutionButtonTag == 0) ? styles.resolutionButtonSelected : styles.resolutionButtonNoSelected}>
                            <Text>1080P</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pressButton(1)}>
                        <View
                            style={(this.state.resolutionButtonTag == 1) ? styles.resolutionButtonSelected : styles.resolutionButtonNoSelected}>
                            <Text>720P</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pressButton(2)}>
                        <View
                            style={(this.state.resolutionButtonTag == 2) ? styles.resolutionButtonSelected : styles.resolutionButtonNoSelected}>
                            <Text>480P</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pressButton(3)}>
                        <View
                            style={(this.state.resolutionButtonTag == 3) ? styles.resolutionButtonSelected : styles.resolutionButtonNoSelected}>
                            <Text>360P</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/*选择横屏或竖屏*/}
                <View style={styles.directionView}>
                    <TouchableOpacity onPress={() => this.pressDirectionButton(0)}>
                        <View
                            style={(this.state.directionButtonTag == 0) ? styles.directionButtonSelected : styles.directionButtonNoSelected}>
                            <Text>竖屏</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.pressDirectionButton(1)}>
                        <View
                            style={(this.state.directionButtonTag == 1) ? styles.directionButtonSelected : styles.directionButtonNoSelected}>
                            <Text>横屏</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonView}>
                    {/*推流按钮*/}
                    <TouchableOpacity onPress={() => this.pressPushButton()}>
                        <View style={styles.pushButton}>
                            <Text>我要直播</Text>
                        </View>
                    </TouchableOpacity>
                    {/*播放按钮*/}
                    <TouchableOpacity onPress={() => this.pressPlayButton()}>
                        <View style={styles.pushButton}>
                            <Text>我要看直播</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    pressButton(tag) {
        console.log('点击了按钮' + tag);
        this.setState({
            resolutionButtonTag: tag
        });
    }

    pressDirectionButton(tag) {
        console.log('选择了方向' + tag);
        this.setState({
            directionButtonTag: tag
        });
    }

    pressPushButton() {
        console.log('点击推流');
        if (this.state.directionButtonTag == 0) {
            this.gotoPortraitView();
        } else {
            this.gotoLandscapeView();
        }
    }

    pressPlayButton() {
        console.log('点击了播放按钮');
        this.props.navigation.navigate('playView', {
        });
    }

    gotoPortraitView() {
        this.props.navigation.navigate('Stream', {
            directionButtonTag: this.state.directionButtonTag,
            resolutionButtonTag: this.state.resolutionButtonTag,
            url: this.state.url
        });
    }

    gotoLandscapeView() {
        this.props.navigation.navigate('StreamLandscape', {
            directionButtonTag: this.state.directionButtonTag,
            resolutionButtonTag: this.state.resolutionButtonTag,
            url: this.state.url
        });

    }
}

const styles = StyleSheet.create({
    backgroundView: {
        backgroundColor: '#ffffff',
        flex: 1,
        alignItems: 'center'
    },
    streamImg: {
        height: 230 * scale,
        width: screen.width
    },
    urlImg: {
        marginTop: 30,
        marginLeft: 10,
        marginRight: 10,
        width: screen.width - 20,
        height: 170 * scale
    },
    inputStyle: {
        marginLeft: 10,
        marginRight: 10,
        height: 100 * scale,
        padding: 0,
        textAlignVertical: 'top',
        marginTop: 40
    },
    resolutionView: {
        height: 60 * scale,
        marginRight: 10,
        marginLeft: 10,
        flexDirection: 'row'
    },
    resolutionButtonSelected: {
        width: (screen.width - 20) / 4 - 10,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        height: 40 * scale,
        borderRadius: 20 * scale,
        borderColor: 'gray',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1475ea'
    },
    resolutionButtonNoSelected: {
        width: (screen.width - 20) / 4 - 10,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        height: 40 * scale,
        borderRadius: 20 * scale,
        borderColor: '#1475ea',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    directionView: {
        height: 60 * scale,
        marginRight: 10,
        marginLeft: 10,
        flexDirection: 'row'
    },
    directionButtonSelected: {
        width: (screen.width - 20) / 2 - 10,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        height: 40 * scale,
        borderRadius: 20 * scale,
        borderColor: 'gray',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1475ea'
    },
    directionButtonNoSelected: {
        width: (screen.width - 20) / 2 - 10,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        height: 40 * scale,
        borderRadius: 20 * scale,
        borderColor: '#1475ea',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonView: {
        marginTop: 100 * scale,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: screen.width
    },
    pushButton: {
        height: 100 * scale,
        width: 100 * scale,
        borderRadius: 60 * scale,
        borderWidth: 2,
        borderColor: '#1475ea',
        justifyContent: 'center',
        alignItems: 'center'
    }
});