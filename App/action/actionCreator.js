import {
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    ActivityIndicator,
    TabBarIOS,
    Dimensions,
    Button,
    ScrollView,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';

import * as types from './types';
import Config from '../../config';

var proxy = require('../proxy/Proxy');
import PreferenceStore from '../utils/PreferenceStore';
import CookieManager from 'react-native-cookies';

export let loginAction = function (username, password, cb) {

    return dispatch => {
        return new Promise((resolve, reject) => {
            var versionName = "5.2";

            CookieManager.clearAll().then(function (res) {
                console.log('CookieManager.clearAll =>', res);
            });
            proxy.postes({
                //url: Config.server + '/func/auth/getMerchantInitInfoMobile',
                url: Config.server + '/func/auth/webLogin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    loginName: username,
                    password: password,
                    loginType: 1,
                    parameter: {appVersion: versionName}
                }
            }).then((json) => {

                if (json.errorMessageList !== null && json.errorMessageList !== undefined && json.errorMessageList.length > 0) {
                    alert(json.errorMessageList[1]);
                    dispatch(clearTimerAction());
                    resolve(json.errorMessageList[1]);
                }
                else {
                    let sessionId = json.sessionId;
                    proxy.postes({

                        url: Config.server + '/func/merchant/getMerchantInitInfoMobile',

                        headers: {
                            'Content-Type': 'application/json'
                            // 'Cookie': sessionId
                        },
                        body: {}
                    }).then((json) => {
                        var errorMsg = json.message;
                        if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                            dispatch(getSession(null));
                            dispatch(clearTimerAction());
                            if (cb)
                                cb(errorMsg);
                        }
                        else {
                            //var priceModifyState=2;
                            var priceModifyState = json.data.priceModifyState;
                            var csVersion = json.data.csVersion;
                            if(csVersion!=null && csVersion!='' && csVersion!=undefined)
                                csVersion = parseFloat(csVersion)
                            if (priceModifyState === 0 || priceModifyState === 2) {
                                resolve({priceModifyState: 0});
                                alert("改价未开启，不能使用");
                            } else if (priceModifyState === 1) {
                                resolve({priceModifyState: 1});
                                alert("客户端版本不符，请更新客户端程序到第五版本");
                            } else {

                                if (csVersion < 5) {
                                    Alert.alert(
                                        'Alert',
                                        '电脑客户端程序版本低，请升级客户端版本',

                                        [
                                            {
                                                text: 'OK', onPress: () => {
                                                resolve({priceModifyState: 2});
                                                dispatch(setSessionId(sessionId));
                                                dispatch(setAnnouncement(json.data.helpContent));
                                                dispatch(setCommodityClassList(json.data.commodityClassList));
                                                dispatch(setWeightService(json.data.weightService));
                                                dispatch(getSession({
                                                        username: json.data.username,
                                                        merchantStates: json.data.merchantStates,
                                                        supnuevoMerchantId: json.data.merchantId,
                                                        merchantType: json.data.merchantType,
                                                        password: password,
                                                        unionId: json.data.unionId,
                                                        unionMemberType:json.data.unionMemberType,
                                                    }
                                                ));
                                                dispatch(setJisuanPrice(json.data.addPriceMap));
                                                if (json.data.FlashFrequency == null) {
                                                    dispatch(setScanTimerAction(2))
                                                } else {
                                                    dispatch(setScanTimerAction(json.data.FlashFrequency))
                                                }
                                                PreferenceStore.put('username', username);
                                                PreferenceStore.put('password', password);

                                                dispatch(clearTimerAction());
                                            }
                                            }
                                        ]
                                    );

                                }else{
                                    resolve({priceModifyState: 2});
                                    dispatch(setSessionId(sessionId));
                                    dispatch(setAnnouncement(json.data.helpContent));
                                    dispatch(setCommodityClassList(json.data.commodityClassList));
                                    dispatch(setWeightService(json.data.weightService));
                                    dispatch(getSession({
                                            username: json.data.username,
                                            merchantStates: json.data.merchantStates,
                                            supnuevoMerchantId: json.data.merchantId,
                                            merchantType: json.data.merchantType,
                                            password: password,
                                            unionId: json.data.unionId,
                                            unionMemberType:json.data.unionMemberType,
                                        }
                                    ));
                                    dispatch(setJisuanPrice(json.data.addPriceMap));
                                    if (json.data.FlashFrequency == null) {
                                        dispatch(setScanTimerAction(2))
                                    } else {
                                        dispatch(setScanTimerAction(json.data.FlashFrequency))
                                    }
                                    PreferenceStore.put('username', username);
                                    PreferenceStore.put('password', password);

                                    dispatch(clearTimerAction());
                                }
                            }

                        }
                    }).catch((err) => {
                        alert(err.message);
                    })
                    // })
                }
            }).catch((err) => {
                resolve(err);
                //alert(err.message);
            })
        })
    }

};

export let setGoodsInfo = function (goodsinfo) {
    return dispatch => {
        dispatch({
            type: types.SET_GOODSINFO,
            codigo: goodsinfo.codigo,
            nombre: goodsinfo.nombre,
            oldPrice: goodsinfo.oldPrice,
            price: goodsinfo.price,
            flag: goodsinfo.flag,
            suggestPrice: goodsinfo.suggestPrice,
            suggestLevel: goodsinfo.suggestLevel,
        });
    };
}

export let setTimerAction = function (timer) {
    return dispatch => {
        dispatch({
            type: types.TIMER_SET,
            timer: timer
        });
    };
}

export let setScanTimerAction = function (scanTime) {
    //设置收银扫码间隔时间
    return dispatch => {
        dispatch({
            type: types.SCANTIMER_SET,
            scanTime: scanTime
        });
    };
}

export let setJisuanPrice = function (price) {
    return dispatch => {
        dispatch({
            type: types.SET_JISUAN_PRICE,
            AddIva0: price.AddIva0,
            AddIva1: price.AddIva1,
            AddIva2: price.AddIva2,
            AddIva3: price.AddIva3,
            AddMode: price.AddMode,
            AddProfit0: price.AddProfit0,
            AddProfit1: price.AddProfit1,
            AddProfit2: price.AddProfit2,
            AddProfit3: price.AddProfit3,
        });
    };
}


export let clearTimerAction = function () {
    return dispatch => {
        dispatch({
            type: types.TIMER_CLEAR
        });
    };
}


export let setNetInfo = function (connectionInfoHistory) {
    return dispatch => {
        dispatch({
            type: types.SET_NETINFO,
            connectionInfoHistory: connectionInfoHistory
        })
    };
}

export let setIsConnected = function (isConnected) {
    return dispatch => {
        dispatch({
            type: types.IS_CONNECTED,
            isConnected: isConnected
        })
    };
}

export let setAnnouncement = function (string) {
    return dispatch => {
        dispatch({
            type: types.SET_ANNOUNCEMENT,
            announcement: string
        });
    };
}

export let setSessionId = function (string) {
    return dispatch => {
        dispatch({
            type: types.SET_SESSIONID,
            sessionId: string
        });
    };
}

export let setCommodityClassList = function (commodityClassList) {
    return dispatch => {
        dispatch({
            type: types.SET_COMMODITY_CLASS_LIST,
            commodityClassList: commodityClassList
        });
    };
}

export let setWeightService = function (weightService) {
    return dispatch => {
        dispatch({
            type: types.SET_WEIGHT_SERVICE,
            weightService: weightService
        });
    };
}

export let getSession = (ob) => {
    if (ob !== null)
        return {
            type: types.AUTH_ACCESS__ACK,
            supnuevoMerchantId: ob.supnuevoMerchantId,
            merchantStates: ob.merchantStates,
            auth: true,
            validate: true,
            username: ob.username,
            password: ob.password,
            unionId: ob.unionId,
            unionMemberType:ob.unionMemberType,
        };
    else
        return {
            type: types.AUTH_ACCESS__ACK,
            auth: false
        }
}

export let changeAuth = (auth) => {
    return dispatch => {
        dispatch({
            type: types.AUTH_ACCESS__ACK,
            auth: !auth,
        });
    };
}

export let setAttachIdList = function (attachIdList) {
    return dispatch => {
        dispatch({
            type: types.SET_ATTACH_ID_LIST,
            attachIdList: attachIdList
        })
    };
}

export let setPictureUrl = function (pictureUrl) {
    return dispatch => {
        dispatch({
            type: types.SET_PICTURE_URL,
            pictureUrl: pictureUrl
        })
    };
}

