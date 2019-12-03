package com.rnsupnuevo;

import android.util.Log;

import java.io.*;
import java.net.*;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;

public class HttpUtils extends ReactContextBaseJavaModule {

    public HttpUtils(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public static void posted(String sessionId,String address, String data, Promise promise) {
        byte[] dt = data.toString().getBytes();
        HttpURLConnection conn = null;
        String stringurl = address;
        Object returnobj = new Object();
        try {
            URL url = new URL(stringurl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setConnectTimeout(3000);
            //获得输出流，向服务器写入数据
            OutputStream outputStream = conn.getOutputStream();
            outputStream.write(data.getBytes());
//            ObjectOutputStream objectOutputStream = new ObjectOutputStream(outputStream);
//            objectOutputStream.writeObject(data);
//            objectOutputStream.flush();
//            objectOutputStream.close();
            if (HttpURLConnection.HTTP_OK == conn.getResponseCode()) {
                InputStream in = conn.getInputStream();
                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                byte[] returndata = new byte[1024];
                int len = 0;
                try {
                    while((len = in.read(returndata)) != -1) {
                        byteArrayOutputStream.write(returndata, 0, len);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
                String resultData = new String(byteArrayOutputStream.toByteArray());
//                ObjectInputStream objectInputStream = new ObjectInputStream(in);
//                returnobj = objectInputStream.readObject();
                promise.resolve(resultData);//回调函数
                in.close();
               // objectInputStream.close();
            } else {
                promise.reject("error","请求失败");
                Log.i("PostGetUtil","get请求失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getName() {
        return "HttpUtils";
    }
}
