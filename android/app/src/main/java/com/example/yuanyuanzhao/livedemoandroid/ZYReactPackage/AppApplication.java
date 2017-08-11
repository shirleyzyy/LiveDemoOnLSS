package com.example.yuanyuanzhao.livedemoandroid.ZYReactPackage;

import android.app.Application;
import android.util.Log;

import com.example.yuanyuanzhao.livedemoandroid.IMCloud;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

/**
 * Created by yuanyuanzhao on 2017/7/19.
 */

public class AppApplication extends Application {

    static Application sContext = null;

    @Override
    public void onCreate() {
        super.onCreate();
        sContext = this;
        Log.d("2", "hahahah");
        getPackages();

        IMCloud.init(this);

    }

    public static Application getContext() {
        return sContext;
    }

    protected List<ReactPackage> getPackages() {
        Log.d("3", "hahahah");
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new ZYReactNativePackage()); // <-- 添加这一行，类名替换成你的Package类的名字.
    }
}
