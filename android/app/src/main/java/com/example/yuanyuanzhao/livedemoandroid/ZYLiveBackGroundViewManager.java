package com.example.yuanyuanzhao.livedemoandroid;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Handler;
import android.text.TextUtils;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.view.LayoutInflater;
import android.os.Message;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;

import com.example.yuanyuanzhao.livedemoandroid.ZYReactPackage.AppApplication;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.baidu.recorder.api.LiveConfig;
import com.baidu.recorder.api.LiveSession;
import com.baidu.recorder.api.LiveSessionHW;
import com.baidu.recorder.api.LiveSessionSW;
import com.baidu.recorder.api.SessionStateListener;

/**
 * Created by yuanyuanzhao on 2017/7/18.
 */

public class ZYLiveBackGroundViewManager extends ViewGroupManager<FrameLayout> {

    private static final String TAG = "surfaceView";
    private static final String E_LAYOUT_ERROR = "回调失败";
    private boolean isSessionReady = false;
    private boolean isSessionStarted = false;
    private boolean isConnecting = false;
    private boolean needRestartAfterStopped = false;

    private LiveSession mLiveSession = null;
    private SessionStateListener mStateListener = null;
    private Handler mUIEventHandler = null;

    private static final int UI_EVENT_RECORDER_CONNECTING = 0;
    private static final int UI_EVENT_RECORDER_STARTED = 1;
    private static final int UI_EVENT_RECORDER_STOPPED = 2;
    private static final int UI_EVENT_SESSION_PREPARED = 3;
    private static final int UI_EVENT_HIDE_FOCUS_ICON = 4;
    private static final int UI_EVENT_RESTART_STREAMING = 5;
    private static final int UI_EVENT_RECONNECT_SERVER = 6;
    private static final int UI_EVENT_STOP_STREAMING = 7;
    private static final int UI_EVENT_SHOW_TOAST_MESSAGE = 8;
    private static final int UI_EVENT_RESIZE_CAMERA_PREVIEW = 9;
    private static final int TEST_EVENT_SHOW_UPLOAD_BANDWIDTH = 10;
    //设置的所有参数
    private int mVideoWidth = 1280;
    private int mVideoHeight = 720;
    private int mFrameRate = 15;
    private int mBitrate = 1024000;
    private String mStreamingUrl = null;

    // Bitrate related params
    private int mSupportedBitrateValues[] = new int[] { 2000, 1200, 800, 600 };

    // Resolution related params
    private int mSupportedResolutionValues[] = new int[] { 1920, 1080, 1280, 720, 640, 480, 480, 360 };
    private int mSelectedResolutionIndex = 1;

    // Frame rate ralated params
    private int mSupportedFramerateValues[] = new int[] { 18, 15, 15, 15 };

    private boolean isOritationLanscape = false;
    private boolean isFlashOn = false;
    private boolean hasBueatyEffect = false;
    private int mCurrentCamera = -1;
    private SurfaceView mCameraView = null;
    private FrameLayout root =null;

    @Override
    public String getName(){
        return "ZYLiveBackGroundGroupViewManager";
    }
    //暴露给JS的事件
    @ReactMethod
    public void start(String url ,String resolution ,String direction){
        Log.e(TAG,"进入Start   "+this);
        mSelectedResolutionIndex = Integer.parseInt(resolution);
        isOritationLanscape = Boolean.parseBoolean(direction);
        mVideoWidth = mSupportedResolutionValues[mSelectedResolutionIndex * 2];
        mVideoHeight = mSupportedResolutionValues[mSelectedResolutionIndex * 2 + 1];
        mFrameRate = mSupportedFramerateValues[mSelectedResolutionIndex];
        mBitrate = mSupportedBitrateValues[mSelectedResolutionIndex] *1000;
        if (url.equals("")){
            mStreamingUrl = "rtmp://push.bcelive.com/live/yvwslfyqf9lgyfnnsy";
        } else {
            mStreamingUrl = url;
        }

    }


    @ReactMethod
    public void onToggleFlash(Promise promise){
        try {
            String t = "Flash success";
            if (mCurrentCamera == LiveConfig.CAMERA_FACING_BACK) {
                mLiveSession.toggleFlash(!isFlashOn);
                isFlashOn = !isFlashOn;
            }
            promise.resolve(t);
        } catch (IllegalViewOperationException e){
            promise.reject(E_LAYOUT_ERROR, e);
        }
    }

    @ReactMethod
    public void onSwitchCamera(Promise promise){
        Log.e(TAG,"进入SwitchCamera"+this);
        boolean t = mLiveSession.canSwitchCamera();
        if (t) {
            if (mCurrentCamera == LiveConfig.CAMERA_FACING_BACK) {
                mCurrentCamera = LiveConfig.CAMERA_FACING_FRONT;
                mLiveSession.switchCamera(mCurrentCamera);
            } else {
                mCurrentCamera = LiveConfig.CAMERA_FACING_BACK;
                mLiveSession.switchCamera(mCurrentCamera);
            }
            promise.resolve("SwitchCamera success");
        } else {
            promise.reject(E_LAYOUT_ERROR, "抱歉！该分辨率下不支持切换摄像头");
        }
    }

    @ReactMethod
    public void onBeauty(Promise promise){
        try {
            hasBueatyEffect = !hasBueatyEffect;
            mLiveSession.enableDefaultBeautyEffect(hasBueatyEffect);
            promise.resolve("beauty success");
        } catch (IllegalViewOperationException e){
            promise.reject(E_LAYOUT_ERROR, e);
        }
    }

    @ReactMethod
    public void onToggleStream(Promise promise){
        try {
            Log.e(TAG, String.valueOf(isSessionReady) + this);
            if (!isSessionReady) {
                return;
            }
            if (!isSessionStarted && !TextUtils.isEmpty(mStreamingUrl)) {
                if (mLiveSession.startRtmpSession(mStreamingUrl)) {
                    Log.i(TAG, "Starting Streaming in right state!");
                } else {
                    Log.e(TAG, "Starting Streaming in wrong state!");
                }
                mUIEventHandler.sendEmptyMessage(UI_EVENT_RECORDER_CONNECTING);
            } else {
                if (mLiveSession.stopRtmpSession()) {
                    Log.i(TAG, "Stopping Streaming in right state!");
                } else {
                    Log.e(TAG, "Stopping Streaming in wrong state!");
                }
                mUIEventHandler.sendEmptyMessage(UI_EVENT_RECORDER_CONNECTING);
            }
            promise.resolve("Stream success");
        } catch (IllegalViewOperationException e){
            promise.reject(E_LAYOUT_ERROR, e);
        }
    }

    @ReactMethod
    public void onBack(Promise promise){
        try {
//            if (mCameraView != null) {
//                mCameraView.setVisibility(View.INVISIBLE);
//            }
            if (mLiveSession.stopRtmpSession()) {
                Log.i(TAG, "Stopping Streaming in right state!");
            } else {
                Log.e(TAG, "Stopping Streaming in wrong state!");
            }
            mUIEventHandler.sendEmptyMessage(UI_EVENT_RECORDER_CONNECTING);
            mLiveSession.enableDefaultBeautyEffect(hasBueatyEffect);
            promise.resolve("onBack success");
        } catch (IllegalViewOperationException e){
            promise.reject(E_LAYOUT_ERROR, e);
        }
    }

    @Override
    public FrameLayout createViewInstance(ThemedReactContext context){
        Log.e(TAG,"进入createViewInstance"+this);
        Log.e(TAG, String.valueOf(mBitrate));
        LayoutInflater lf = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        root = (FrameLayout) lf.inflate(R.layout.mycamera_layout,null);
        mCameraView = root.findViewById(R.id.surfaceId);

        mCurrentCamera = LiveConfig.CAMERA_FACING_FRONT;
        isFlashOn = false;
        initUIEventHandler();
        initStateListener();
        initRTMPSession(mCameraView.getHolder(), context);
        return root;
    }

    private void initStateListener() {
        mStateListener = new SessionStateListener() {
            @Override
            public void onSessionPrepared(int code) {
                if (code == SessionStateListener.RESULT_CODE_OF_OPERATION_SUCCEEDED) {
                    if (mUIEventHandler != null) {
                        mUIEventHandler.sendEmptyMessage(UI_EVENT_SESSION_PREPARED);
                    }
                    int realWidth = mLiveSession.getAdaptedVideoWidth();
                    int realHeight = mLiveSession.getAdaptedVideoHeight();
                    if (realHeight != mVideoHeight || realWidth != mVideoWidth) {
                        mVideoHeight = realHeight;
                        mVideoWidth = realWidth;
                        mUIEventHandler.sendEmptyMessage(UI_EVENT_RESIZE_CAMERA_PREVIEW);
                    }
                }
            }

            @Override
            public void onSessionStarted(int code) {
                if (code == SessionStateListener.RESULT_CODE_OF_OPERATION_SUCCEEDED) {
                    if (mUIEventHandler != null) {
                        mUIEventHandler.sendEmptyMessage(UI_EVENT_RECORDER_STARTED);
                        Log.d(TAG, "Starting Streaming success");
                    }
                } else {
                    Log.e(TAG, "Starting Streaming failed!");
                }
            }

            @Override
            public void onSessionStopped(int code) {
                if (code == SessionStateListener.RESULT_CODE_OF_OPERATION_SUCCEEDED) {
                    if (mUIEventHandler != null) {
                        if (needRestartAfterStopped && isSessionReady) {
                            mLiveSession.startRtmpSession(mStreamingUrl);
                        } else {
                            mUIEventHandler.sendEmptyMessage(UI_EVENT_RECORDER_STOPPED);
                        }
                    }
                } else {
                    Log.e(TAG, "Stopping Streaming failed!");
                }
            }

            @Override
            public void onSessionError(int code) {
                switch (code) {
                    case SessionStateListener.ERROR_CODE_OF_OPEN_MIC_FAILED:
                        Log.e(TAG, "Error occurred while opening MIC!");
//                        onOpenDeviceFailed();
                        break;
                    case SessionStateListener.ERROR_CODE_OF_OPEN_CAMERA_FAILED:
                        Log.e(TAG, "Error occurred while opening Camera!");
//                        onOpenDeviceFailed();
                        break;
                    case SessionStateListener.ERROR_CODE_OF_PREPARE_SESSION_FAILED:
                        Log.e(TAG, "Error occurred while preparing recorder!");
//                        onPrepareFailed();
                        break;
                    case SessionStateListener.ERROR_CODE_OF_CONNECT_TO_SERVER_FAILED:
                        Log.e(TAG, "Error occurred while connecting to server!");
                        if (mUIEventHandler != null) {
//                            serverFailTryingCount++;
//                            if (serverFailTryingCount > 5) {
//                                Message msg = mUIEventHandler.obtainMessage(UI_EVENT_SHOW_TOAST_MESSAGE);
//                                msg.obj = "自动重连服务器失败，请检查网络设置";
//                                mUIEventHandler.sendMessage(msg);
//                                mUIEventHandler.sendEmptyMessage(UI_EVENT_RECORDER_STOPPED);
//                            } else {
//                                Message msg = mUIEventHandler.obtainMessage(UI_EVENT_SHOW_TOAST_MESSAGE);
//                                msg.obj = "连接推流服务器失败，自动重试5次，当前为第" + serverFailTryingCount + "次";
//                                mUIEventHandler.sendMessage(msg);
//                                mUIEventHandler.sendEmptyMessageDelayed(UI_EVENT_RECONNECT_SERVER, 2000);
//                            }

                        }
                        break;
                    case SessionStateListener.ERROR_CODE_OF_DISCONNECT_FROM_SERVER_FAILED:
                        Log.e(TAG, "Error occurred while disconnecting from server!");
                        isConnecting = false;
                        // Although we can not stop session successfully, we still
                        // need to take it as stopped
                        if (mUIEventHandler != null) {
                            mUIEventHandler.sendEmptyMessage(UI_EVENT_RECORDER_STOPPED);
                        }
                        break;
                    default:
//                        onStreamingError(code);
                        break;
                }
            }
        };
    }
    int serverFailTryingCount = 0;
    private void initRTMPSession(SurfaceHolder sh,Context myContext) {
        int orientation = isOritationLanscape ? LiveConfig.ORIENTATION_LANDSCAPE : LiveConfig.ORIENTATION_PORTRAIT;
        LiveConfig liveConfig = new LiveConfig.Builder().setCameraId(LiveConfig.CAMERA_FACING_FRONT) // 选择摄像头为前置摄像头
                .setCameraOrientation(orientation) // 设置摄像头为竖向
                .setVideoWidth(mVideoWidth) // 设置推流视频宽度, 需传入长的一边
                .setVideoHeight(mVideoHeight) // 设置推流视频高度，需传入短的一边
                .setVideoFPS(mFrameRate) // 设置视频帧率
                .setInitVideoBitrate(mBitrate) // 设置初始视频码率，单位为bit per seconds
                .setAudioBitrate(64 * 1000) // 设置音频码率，单位为bit per seconds
                .setAudioSampleRate(LiveConfig.AUDIO_SAMPLE_RATE_44100) // 设置音频采样率
                .setGopLengthInSeconds(2) // 设置I帧间隔，单位为秒
                .setQosEnabled(true) // 开启码率自适应，默认为true，即默认开启
                .setMinVideoBitrate(200 * 1000) // 码率自适应，最低码率
                .setMaxVideoBitrate(mBitrate) // 码率自适应，最高码率
                .setQosSensitivity(5) // 码率自适应，调整的灵敏度，单位为秒，可接受[5, 10]之间的值
//                .setVideoEnabled(false)
                .build();
        Log.d(TAG, "Calling initRTMPSession..." + liveConfig.toString());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2) {
            mLiveSession = new LiveSessionHW(myContext, liveConfig);
        } else {
            mLiveSession = new LiveSessionSW(myContext, liveConfig);
        }
        mLiveSession.setStateListener(mStateListener);
        mLiveSession.bindPreviewDisplay(sh);
        mLiveSession.prepareSessionAsync();
    }
    private void initUIEventHandler() {
        mUIEventHandler = new Handler() {

            public void handleMessage(Message msg) {
                switch (msg.what) {
                    case UI_EVENT_RECORDER_CONNECTING:
                        isConnecting = true;
//                    mRecorderButton.setBackgroundResource(R.drawable.btn_block_streaming);
//                    mRecorderButton.setPadding(0, 0, 0, 0);
//                    statusView.setText("连接中");
//                    mRecorderButton.setEnabled(false);
                        break;
                    case UI_EVENT_RECORDER_STARTED:
                        Log.i(TAG, "Starting Streaming succeeded!");
                        serverFailTryingCount = 0;
                        isSessionStarted = true;
                        needRestartAfterStopped = false;
                        isConnecting = false;
//                    mRecorderButton.setBackgroundResource(R.drawable.btn_stop_streaming);
//                    mRecorderButton.setPadding(0, 0, 0, 0);
//                    statusView.setText("停止直播");
//                    mRecorderButton.setEnabled(true);
                        break;
                    case UI_EVENT_RECORDER_STOPPED:
                        Log.i(TAG, "Stopping Streaming succeeded!");
                        serverFailTryingCount = 0;
                        isSessionStarted = false;
                        needRestartAfterStopped = false;
                        isConnecting = false;
//                    mRecorderButton.setBackgroundResource(R.drawable.btn_start_streaming);
//                    mRecorderButton.setPadding(0, 0, 0, 0);
//                    statusView.setText("开始直播");
//                    mRecorderButton.setEnabled(true);
                        break;
                    case UI_EVENT_SESSION_PREPARED:
                        isSessionReady = true;
                        Log.i(TAG, "PREPARED Streaming succeeded!" + ZYLiveBackGroundViewManager.this);
//                    mLoadingAnimation.setVisibility(View.GONE);
//                    mRecorderButton.setEnabled(true);
                        break;
                    case UI_EVENT_HIDE_FOCUS_ICON:
//                    mFocusIcon.setVisibility(View.GONE);
                        break;
                    case UI_EVENT_RECONNECT_SERVER:
                        Log.i(TAG, "Reconnecting to server...");
                        if (isSessionReady && mLiveSession != null) {
                            mLiveSession.startRtmpSession(mStreamingUrl);
                        }
                        if (mUIEventHandler != null) {
                            mUIEventHandler.sendEmptyMessage(UI_EVENT_RECORDER_CONNECTING);
                        }

                        break;
                    case UI_EVENT_STOP_STREAMING:
                        if (!isConnecting) {
                            Log.i(TAG, "Stopping current session...");
                            if (isSessionReady) {
                                mLiveSession.stopRtmpSession();
                            }
                            mUIEventHandler.sendEmptyMessage(UI_EVENT_RECORDER_STOPPED);
                        }
                        break;
                    case UI_EVENT_RESTART_STREAMING:
                        if (!isConnecting) {
                            Log.i(TAG, "Restarting session...");
                            isConnecting = true;
                            needRestartAfterStopped = true;
                            if (isSessionReady && mLiveSession != null) {
                                mLiveSession.stopRtmpSession();
                            }
                            if (mUIEventHandler != null) {
                                mUIEventHandler.sendEmptyMessage(UI_EVENT_RECORDER_CONNECTING);
                            }

                        }
                        break;
                    case UI_EVENT_SHOW_TOAST_MESSAGE:
                        String text = (String) msg.obj;
//                        Toast.makeText(TestActivity.this, text, Toast.LENGTH_SHORT).show();
                        break;
                    case UI_EVENT_RESIZE_CAMERA_PREVIEW:
                        String hint = "注意：当前摄像头不支持您所选择的分辨率\n实际分辨率为" + mVideoWidth + "x" + mVideoHeight;
//                        Toast.makeText(TestActivity.this, hint, Toast.LENGTH_LONG).show();
                        fitPreviewToParentByResolution(mCameraView.getHolder(), mVideoWidth, mVideoHeight);
                        break;
                    case TEST_EVENT_SHOW_UPLOAD_BANDWIDTH:
                        if (mLiveSession != null) {
                            Log.d(TAG, "Current upload bandwidth is " + mLiveSession.getCurrentUploadBandwidthKbps()
                                    + " KBps.");
                        }
                        if (mUIEventHandler != null) {
                            mUIEventHandler.sendEmptyMessageDelayed(TEST_EVENT_SHOW_UPLOAD_BANDWIDTH, 2000);
                        }
                        break;
                    default:
                        break;
                }
                super.handleMessage(msg);
            }
        };
    }

    private void fitPreviewToParentByResolution(SurfaceHolder holder, int width, int height) {
        // Adjust the size of SurfaceView dynamically
//        int screenHeight = getWindow().getDecorView().getRootView().getHeight();
//        int screenWidth = getWindow().getDecorView().getRootView().getWidth();

        int screenHeight = 1920;
        int screenWidth = 1080;
//        if (getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT) { // If
            // portrait,
            // we
            // should
            // swap
            // width
            // and
            // height
            width = width ^ height;
            height = width ^ height;
            width = width ^ height;
//        }
        // Fit height
        int adjustedVideoHeight = screenHeight;
        int adjustedVideoWidth = screenWidth;
        if (width * screenHeight > height * screenWidth) { // means width/height
            // >
            // screenWidth/screenHeight
            // Fit width
            adjustedVideoHeight = height * screenWidth / width;
            adjustedVideoWidth = screenWidth;
        } else {
            // Fit height
            adjustedVideoHeight = screenHeight;
            adjustedVideoWidth = width * screenHeight / height;
        }
        holder.setFixedSize(adjustedVideoWidth, adjustedVideoHeight);
    }
}
