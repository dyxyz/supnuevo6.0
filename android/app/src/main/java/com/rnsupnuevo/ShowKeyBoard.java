package com.rnsupnuevo;

import android.content.Context;
import android.view.inputmethod.InputMethodManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class ShowKeyBoard extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactApplicationContext;

    public ShowKeyBoard(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactApplicationContext = reactContext;
    }

    public void showKB() {
        InputMethodManager imm = (InputMethodManager) this.reactApplicationContext.getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm != null) {
//            imm.showSoftInput(, 0);
        }
    }

    @Override
    public String getName() {
        return "ShowKeyBoard";
    }
}
