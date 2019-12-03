/**
 * Created by danding on 17/1/12.
 */
/**
 * Created by danding on 16/11/13.
 */


import {
    NetInfo,
    Alert,
    ToastAndroid,
    NativeModules
} from 'react-native';
import {closeWaitTip} from '../components/modal/WaitTip';
import {setGoodsInfo, getSession} from '../action/actionCreator';
import Login from '../containers/Login';
import WaitTip from '../components/modal/WaitTip';
import CookieManager from 'react-native-cookies';

var ss = require('./SolveSessionId');
const useWebKit = true;

let Proxy = {

    httputil: (params) => {//原生通信，和RN一样需要保存sessionId
        if (Object.prototype.toString.call(params.body) == '[object Object]')
            params.body = JSON.stringify(params.body);
        var url = params.url;
        let obj = NativeModules.HttpUtils;
        let callba = null;
        return new Promise((resolve, reject) => {
            obj.posted(url, params.body)
                .then((callba) => {
                    resolve(JSON.parse(callba));
                })
                .catch((err) => {
                    let wait = new WaitTip();
                    wait.close();
                    alert("网络错误");
                }).done();

        });
    },

    get: (params) => {
        var url = params.url;
        if (url !== undefined && url !== null) {

            var options = {
                method: 'GET',
                headers: params.headers !== undefined && params.headers !== null ? params.headers : null,
                cache: 'default'
            };
            return new Promise((resolve, reject) => {
                fetch(url, options)
                    .then((response) => response.text())
                    .then((responseText) => {
                        resolve(JSON.parse(responseText));
                    })
                    .catch((err) => {
                        reject(new Error(err));
                        console.warn(err);
                    }).done();
            });
        } else {
            throw new Error('lack of url field');
        }
    },

    postes(params) {
        //const {dispatch} = this.props;
        var url = params.url;
        NetInfo.isConnected.fetch().then((isConnected) => {
            if (isConnected === false) {
                ToastAndroid.show('网络中断', ToastAndroid.SHORT);
            }
        });
        if (url !== undefined && url !== null) {
            if (Object.prototype.toString.call(params.body) == '[object Object]')
                params.body = JSON.stringify(params.body);

            var options = {
                method: 'POST',
                cache: 'default',
                headers: params.headers !== undefined && params.headers !== null ? params.headers : null,
                credentials: 'include',
                body: params.body,
                //mode: "same-origin",
                data: params.data !== undefined && params.data !== null ? params.data : null,
            };
            let adnj = ss.get("defult_project");
            if (ss.get("supnuevo") !== null && ss.get("defult_project") !== "supnuevo") {
                ss.change_defult_project();
                let flag = ss.configSession("supnuevo", url);
                console.log(flag);
            }
            return new Promise((resolve, reject) => {

                fetch(url, options)
                    .then((response) => response.text())
                    .then((res) => {
                        ss.set_defult_project("supnuevo");
                        ss.set("supnuevo", url);//保留supnuevo的session
                        resolve(JSON.parse(res));
                    })
                    .catch((err) => {
                        alert("网络错误");
                        ss.set_defult_project("supnuevo");
                    }).done()
            });


        } else {
            throw new Error('lack of url field');
        }
    },

    postes_ventas(params) {
        //const {dispatch} = this.props;
        var url = params.url;
        NetInfo.isConnected.fetch().then((isConnected) => {
            if (isConnected === false) {
                ToastAndroid.show('网络中断', ToastAndroid.SHORT);
            }
        });
        if (url !== undefined && url !== null) {
            if (Object.prototype.toString.call(params.body) == '[object Object]')
                params.body = JSON.stringify(params.body);

            var options = {
                method: 'POST',
                cache: 'default',
                // mode: "same-origin",
                headers: params.headers !== undefined && params.headers !== null ? params.headers : null,
                credentials: 'include',
                body: params.body,
                data: params.data !== undefined && params.data !== null ? params.data : null,
            };
            //不需要每次请求都设置session，如果和上次访问的服务器不一样就更改session
            if (ss.get("ventas") !== null && ss.get("defult_project") !== "ventas") {
                ss.change_defult_project();
                let flag = ss.configSession("ventas", url);
            }
            else if (ss.get("ventas") === null && ss.get("defult_project") !== "ventas") {
                //如果是第一次请求ventas服务器，清空session
                ss.cleanAllSession();
            }

            let promise = new Promise((resolve, reject) => {
                fetch(url, options)
                    .then((response) => response.text())
                    .then((res) => {
                        ss.set_defult_project("ventas");
                        ss.set("ventas", url);//保存ventas的session
                        resolve({data:JSON.parse(res),re:1});
                    })
                    .catch((err) => {
                        ss.set_defult_project("ventas");
                        resolve({re:-1})
                    }).done()
            });

            return this.warp_fetch(promise)

        } else {
            throw new Error('lack of url field');
        }
    },
    ajaxPost(params) {//RN另一种通信方式
        var request = new XMLHttpRequest();
        var url = params.url;
        NetInfo.isConnected.fetch().then((isConnected) => {
            if (isConnected === false) {
                ToastAndroid.show('网络中断', ToastAndroid.SHORT);
            }
        });

        if (url !== undefined && url !== null) {
            if (Object.prototype.toString.call(params.body) == '[object Object]')
                params.body = JSON.stringify(params.body);
            request.open('POST', url);
            request.withCredentials = false;
            return new Promise((resolve, reject) => {
                request.onreadystatechange = e => {
                    if (request.readyState !== 4) {
                        return;
                    }

                    if (request.status === 200) {
                        //console.log("success", request.responseText);
                        ss.get("ventas", url);
                        resolve(JSON.parse(request.responseText));

                    } else {
                        console.warn("error");
                    }
                };
                request.setRequestHeader("Content-Type", "application/json");


                request.send(params.body)
            });
        } else {
            throw new Error('lack of url field');
        }
    },


    getSession: (params) => {
        var url = params.url;
        if (url !== undefined && url !== null) {

            if (Object.prototype.toString.call(params.body) == '[object Object]')
                params.body = JSON.stringify(params.body);

            var options = {
                method: 'POST',
                headers: params.headers !== undefined && params.headers !== null ? params.headers : null,
                credentials: 'include',
                cache: 'default',
                body: params.body,
                data: params.data !== undefined && params.data !== null ? params.data : null,
            };

            return new Promise((resolve, reject) => {
                fetch(url, options)
                    .then((res) => {
                        resolve(res)
                    })
                    .catch((err) => {
                        reject(new Error(err));
                        console.warn(err);
                    }).done();

            });

        } else {
            throw new Error('lack of url field');
        }
    },


    fetch: (params) => {
        var url = params.url;
        if (url !== undefined && url !== null) {

            var options = {
                method: params.method !== undefined && params.method !== null ? params.method : 'GET',
                headers: params.headers !== undefined && params.headers !== null ? params.headers : null,
                cache: 'default'
            };
            return new Promise((resolve, reject) => {
                fetch(url, options)
                    .then((response) => response.text())
                    .then((responseText) => {
                        resolve(JSON.parse(responseText));
                    })
                    .catch((err) => {
                        reject(new Error(err));
                        console.warn(err);
                    }).done();
            });
        } else {
            throw new Error('lack of url field');
        }
    },

    fetchInPlain: (params) => {
        var url = params.url;
        if (url !== undefined && url !== null && url != '') {
            var options = {
                method: params.method !== undefined && params.method !== null ? params.method : 'POST',
                headers: params.header !== undefined && params.header !== null ? params.header : null,
                cache: 'default'
            };

            var success = params.success;
            var fail = params.fail;

            fetch(url, options)
                .then((res) => res.text())
                .then((resText) => {
                    if (success !== undefined && success !== null)
                        success(JSON.parse(resText));
                })
                .catch((err) => {
                    if (fail !== undefined && fail !== null) {
                        fail(err);
                    }
                });
        } else {
            throw new Error('lack of url field');
        }

    },

    warp_fetch(fetch_promise, timeout = 15000) {
    let timeout_fn = null;
    let abort = null;
    //创建一个超时promise
    let timeout_promise = new Promise(function (resolve, reject) {
        timeout_fn = function () {
            //reject('网络请求超时');
            ss.set_defult_project("ventas");
            resolve({re:-1})
        };
    });
    //创建一个终止promise
    let abort_promise = new Promise(function (resolve, reject) {
        abort = function () {
            //reject('请求终止');
            ss.set_defult_project("ventas");
            resolve({re:-1})
        };
    });
    //竞赛
    let abortable_promise = Promise.race([
        fetch_promise,
        timeout_promise,
        abort_promise,
    ]);
    //计时
    setTimeout(timeout_fn, timeout);
    //终止
    abortable_promise.abort = abort;
    return abortable_promise;
}

}

module.exports = Proxy;

