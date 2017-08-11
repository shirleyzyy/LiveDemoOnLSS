package com.example.yuanyuanzhao.livedemoandroid;


import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import com.example.yuanyuanzhao.livedemoandroid.ZYReactPackage.AppApplication;
import com.example.yuanyuanzhao.livedemoandroid.util.HttpUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

import io.rong.imlib.RongIMClient;
import io.rong.imlib.model.Conversation;
import io.rong.imlib.model.Message;
import io.rong.imlib.model.MessageContent;
import io.rong.imlib.model.UserInfo;
import io.rong.message.TextMessage;

/**
 * Created by Chad on 2017/8/8.
 * react native js层的接口
 */

public class IMCloud extends ReactContextBaseJavaModule {

    private final String TAG = "IMCloud";

    public IMCloud(ReactApplicationContext reactContext) {
        super(reactContext);
        Log.i(TAG, "init IMCloud once");
        fakeLogin();
    }

    @Override
    public String getName() {
        return "IMCloud";
    }

    @ReactMethod
    public void sendMessage(String message) {
        Log.i(TAG, "sendMessage:" + message);
        try {
            sendIMMessage(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void onReceiveMessage(WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("im.onReceive", params);
    }

    //////////////////////////////////////////
    public static void init(Context context) {
        //for RongYun
        RongIMClient.init(context);
    }

    /**
     * 获取融云Token, 通过调用融云ServerApi获得.
     *
     * @param user
     * @param callback
     */
    public void getToken(UserInfo user, HttpUtil.OnResponse callback) {
        final String HTTP_GET_TOKEN = "https://api.cn.ronghub.com/user/getToken.json";
        HttpUtil.Header header = HttpUtil.getRcHeader("mgb7ka1nmfxjg", "B2dMr4dAc1a");
        String body = "userId=" + user.getUserId() + "&name=" + user.getName() + "&portraitUri=" + user.getPortraitUri();
        HttpUtil httpUtil = new HttpUtil();
        httpUtil.post(HTTP_GET_TOKEN, header, body, callback);
    }

    private void fakeLogin() {
        //TODO: 目前只管连接， 不管断开, demo
        final UserInfo user = new UserInfo("001", "chad", null);
        Log.i(TAG, "login as :" + user.getName());
        getToken(user, new HttpUtil.OnResponse() {
            @Override
            public void onResponse(int code, String body) {
                if (code != 200) {
                    Toast.makeText(AppApplication.getContext(), "getToken error:" + body, Toast.LENGTH_SHORT).show();
                    return;
                }

                String token;
                try {
                    JSONObject jsonObj = new JSONObject(body);
                    token = jsonObj.getString("token");
                } catch (JSONException e) {
                    e.printStackTrace();
                    Toast.makeText(AppApplication.getContext(), "Token 解析失败!", Toast.LENGTH_SHORT).show();
                    return;
                }

                RongIMClient.connect(token, new RongIMClient.ConnectCallback() {
                    @Override
                    public void onTokenIncorrect() {
                        Log.d(TAG, "connect onTokenIncorrect");
                        // 检查appKey 与token是否匹配.
                        Toast.makeText(AppApplication.getContext(), "Token不匹配!", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onSuccess(String userId) {
                        Log.d(TAG, "connect onSuccess");
//                        joinGroup();
                        RongIMClient.setOnReceiveMessageListener(new RongIMClient.OnReceiveMessageListener() {
                            @Override
                            public boolean onReceived(Message message, int left) {

                                Log.i(TAG, "onReceived" + message.getObjectName() + ". left: " + left);
                                MessageContent mc = message.getContent();
                                if (mc instanceof TextMessage) {
                                    Log.i(TAG, "onReceived.text from" + message.getSenderUserId());
                                    Log.i(TAG, "onReceived.text:" + ((TextMessage) mc).getContent());
                                    WritableMap map = Arguments.createMap();
//                                    map.putString("name", mc.getUserInfo().getName());
                                    map.putString("userId", message.getSenderUserId());
//                                    map.putString("portrait", mc.getUserInfo().getPortraitUri().getEncodedPath());
                                    map.putString("message", ((TextMessage) mc).getContent());
                                    IMCloud.this.onReceiveMessage(map);
                                }
                                return false;
                            }
                        });
                    }

                    @Override
                    public void onError(RongIMClient.ErrorCode errorCode) {
                        Log.e(TAG, "connect onError = " + errorCode);
                        // 根据errorCode 检查原因.
                        Toast.makeText(AppApplication.getContext(), "connect error:" + errorCode, Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });
    }

    public void joinGroup() {
        RongIMClient.getInstance().joinGroup("001", "直播聊天室1", new RongIMClient.OperationCallback() {
            @Override
            public void onSuccess() {
                Log.i(TAG, "joinGroup: onSucess");
                sendIMMessage("哥來了。");
            }

            @Override
            public void onError(RongIMClient.ErrorCode errorCode) {
                Log.e(TAG, "joinGroup.onError:" + errorCode.getValue() + ">>" + errorCode.getMessage());
            }
        });
    }

    public void sendIMMessage(String text) {
        if (text == null) {
            return;
        }
        // 构建文本消息实例
        TextMessage textMessage = TextMessage.obtain(text);

        RongIMClient.getInstance().sendMessage(Conversation.ConversationType.GROUP, "001", textMessage, null, null, new io.rong.imlib.IRongCallback.ISendMessageCallback() {
            @Override
            public void onAttached(Message message) {
                // 消息成功存到本地数据库的回调
                Log.i(TAG, "sendMessage:onAttached:" + message.getContent().toString());
            }

            @Override
            public void onSuccess(Message message) {
                // 消息发送成功的回调
                Log.i(TAG, "sendMessage:onSuccess:" + message.getObjectName());
                if (message.getContent() instanceof TextMessage) {
                    TextMessage tm = (TextMessage) message.getContent();
                    Log.i("sendMessage:text:", tm.getContent());
                }
            }

            @Override
            public void onError(Message message, RongIMClient.ErrorCode errorCode) {
                // 消息发送失败的回调
                Log.e(TAG, "sendMessage:onError:" + errorCode.getValue() + ">>" + errorCode.getMessage());
            }
        });
    }
}
