package com.example.yuanyuanzhao.livedemoandroid.ZYReactPackage;

import com.example.yuanyuanzhao.livedemoandroid.IMCloud;
import com.example.yuanyuanzhao.livedemoandroid.ZYLiveBackGroundViewManager;
import com.example.yuanyuanzhao.livedemoandroid.ZYPlayerViewManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by yuanyuanzhao on 2017/7/19.
 */

public class ZYReactNativePackage implements ReactPackage {

    ZYLiveBackGroundViewManager registerManager = new ZYLiveBackGroundViewManager();

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                registerManager,
                new ZYPlayerViewManager()
        );
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {

        List<NativeModule> modules = new ArrayList<>();

        modules.add(registerManager);
        modules.add(new IMCloud(reactContext));

        return modules;
    }

}
