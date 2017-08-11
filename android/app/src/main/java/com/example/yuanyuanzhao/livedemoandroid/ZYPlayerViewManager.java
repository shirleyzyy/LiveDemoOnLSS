package com.example.yuanyuanzhao.livedemoandroid;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.widget.FrameLayout;
import android.widget.Toast;

import com.baidu.cloud.media.player.BDCloudMediaPlayer;
import com.baidu.cloud.media.player.IMediaPlayer;
import com.example.yuanyuanzhao.livedemoandroid.ZYReactPackage.AppApplication;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;

import java.io.IOException;

/**
 * Created by Chad on 2017/8/3.
 */

public class ZYPlayerViewManager extends ViewGroupManager<FrameLayout> implements IMediaPlayer.OnPreparedListener, IMediaPlayer.OnVideoSizeChangedListener, IMediaPlayer.OnCompletionListener, IMediaPlayer.OnErrorListener, IMediaPlayer.OnInfoListener, IMediaPlayer.OnBufferingUpdateListener, SurfaceHolder.Callback {

    private static String TAG = "ZYPlayerViewManager";

    SurfaceView surfaceView;
    BDCloudMediaPlayer mMediaPlayer;

    public ZYPlayerViewManager() {
        super();
        BDCloudMediaPlayer.setAK("724c9abc6cd9403daece9d4d17c3e31b");
    }

    @Override
    public String getName() {
        return "ZYPlayerView";
    }

    @Override
    protected FrameLayout createViewInstance(ThemedReactContext context) {
        LayoutInflater lf = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        FrameLayout root = (FrameLayout) lf.inflate(R.layout.mycamera_layout, null);
        surfaceView = (SurfaceView) root.findViewById(R.id.surfaceId);
        startBaiduPlayer();
        surfaceView.getHolder().addCallback(this);
        return root;
    }

    void startBaiduPlayer() {
        mMediaPlayer = new BDCloudMediaPlayer(AppApplication.getContext());
        // 播放器已经解析出播放源格式时回调
        mMediaPlayer.setOnPreparedListener(this);
        // 视频宽高变化时回调, 首次解析出播放源的宽高时也会回调
        mMediaPlayer.setOnVideoSizeChangedListener(this);
        // 播放完成时回调
        mMediaPlayer.setOnCompletionListener(this);
        // 播放出错时回调
        mMediaPlayer.setOnErrorListener(this);
        // 播放器信息回调，如缓冲开始、缓冲结束
        mMediaPlayer.setOnInfoListener(this);
        // 总体加载进度回调，返回为已加载进度占视频总时长的百分比
        mMediaPlayer.setOnBufferingUpdateListener(this);
        //// seek快速调节播放位置，完成后回调
        //        mMediaPlayer.setOnSeekCompleteListener(this);

        // 若想设置headers，需使用setDataSource(String url, Map<String, String> headers) 方法
        try {
            mMediaPlayer.setDataSource("http://hf8rads3r2zq4z8yuwm.exp.bcelive.com/lss-hf8rat3avr7vwekq/live.m3u8");
        } catch (IOException e) {
            Toast.makeText(AppApplication.getContext(), "解析播放地址失败", Toast.LENGTH_LONG).show();
        }
        // 播放器仅支持异步准备，在onPrepared回调后方可调用start()启动播放
        Log.i(TAG, "mMediaPlayer.prepareAsync");
        mMediaPlayer.prepareAsync();
    }

    @Override
    public void onPrepared(IMediaPlayer iMediaPlayer) {
        Log.i(TAG, "mMediaPlayer.start");
        mMediaPlayer.start();
    }

    @Override
    public void onVideoSizeChanged(IMediaPlayer iMediaPlayer, int i, int i1, int i2, int i3) {

    }

    @Override
    public void onCompletion(IMediaPlayer iMediaPlayer) {
        Log.w(TAG, "onCompletion");
    }

    @Override
    public boolean onError(IMediaPlayer iMediaPlayer, int i, int i1) {
        Log.w(TAG, "onError");
        Toast.makeText(AppApplication.getContext(), "播放器错误， 请重新刚进入", Toast.LENGTH_LONG).show();
        return false;
    }

    @Override
    public boolean onInfo(IMediaPlayer iMediaPlayer, int i, int i1) {
        return false;
    }

    @Override
    public void onBufferingUpdate(IMediaPlayer iMediaPlayer, int i) {

    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        mMediaPlayer.setDisplay(holder);
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width, int height) {

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        Log.w(TAG, "surfaceDestroyed");
        mMediaPlayer.release();
    }
}
