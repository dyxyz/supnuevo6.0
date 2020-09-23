package com.rnsupnuevo;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.zmxv.RNSound.RNSoundPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new RNSoundPackage(),
            new VectorIconsPackage(),
            new RNFSPackage(),

                    new RCTCameraPackage(),
                    new RNSensitiveInfoPackage(),
                    new CookieManagerPackage(),
                    new ImagePickerPackage(),
                    new HttpUtilsPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
