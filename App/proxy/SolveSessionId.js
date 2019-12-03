import CookieManager from 'react-native-cookies';

var Platform = require('Platform');

let supnuevo_sessionId = null;
let ventas_sessionId = null;
let defult_project = "supnuevo";

let SolveSessionId = {
    change_defult_project() {//如果访问的和上一次一样的服务器，不用更改sessionId
        if (defult_project === "supneuvo") {
            defult_project = "ventas";
        }
        if (defult_project === "ventas") {
            defult_project = "supnuevo";
        }
    },
    set_defult_project(project) {
        if (project !== defult_project && (project === "supnuevo" || project === "ventas"))
            defult_project = project;
    },
    set(project, url) {
        if (project === "supnuevo") {
            CookieManager.get(url).then(function (res, err) {
                supnuevo_sessionId = res.JSESSIONID;
                console.log(res);
            });
        }
        if (project === "ventas") {
            CookieManager.get(url).then(function (res, err) {
                ventas_sessionId = res.JSESSIONID;
                console.log(res);
            });
        }
    },
    cleanAllSession() {
        CookieManager.clearAll().then(function (res) {
            console.log('CookieManager.clearAll =>', res);
        });
    },
    get(project) {
        if (project === "supnuevo") {
            return supnuevo_sessionId;
        }
        if (project === "ventas") {
            return ventas_sessionId;
        }
        if (project === "defult_project") {
            return defult_project;
        }
    },
    configSession(project, url) {
        var d = new Date();
        d.setTime(d.getTime() + (3 * 60 * 60 * 1000));
        //var expires = "Thu, 1 Jan 2030 00:00:00 -0000";
        var expires = "expires=" + d.toUTCString();
        let session = null;
        if (project === "supnuevo") {
            session = supnuevo_sessionId;
        }
        if (project === "ventas") {
            session = ventas_sessionId;
        }
        session = "JSESSIONID=" + session + ";" + expires + ";path=/";
        if (Platform.OS === "ios") {
            session = {
                "Set-Cookie": session
            };
        }
        CookieManager.clearAll().then(function (res) {
            console.log('CookieManager.clearAll =>', res);
        });
        return new Promise((resolve, reject) => {
            CookieManager.setFromResponse(
                url,
                session)
                .then((res, err) => {
                    resolve(res);
                }).catch((err) => {
                console.log(err);
            }).done()
        });
    },
};
module.exports = SolveSessionId;