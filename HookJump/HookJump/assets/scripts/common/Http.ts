// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class Http {

    public static sendRequest(url, callback, data?) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var str = '';
        if (data) {
            str = "?";
            for (var k in data) {
                if (str != "?") {
                    str += "&";
                }
                str += k + "=" + data[k];
            }
        }
        var requestURL = url + encodeURI(str);
        // cc.log("RequestURL:" + requestURL);
        xhr.open('GET', requestURL, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    console.log(requestURL + '\n' + xhr.responseText + '\n');
                    var ret = null;
                    try {
                        ret = JSON.parse(xhr.responseText);
                        // console.log("网络请求");
                        // console.log(ret);
                        // console.log(typeof (ret.data) + "数据类型");
                        // console.log(JSON.stringify(ret));
                        // console.log(JSON.parse(ret));
                        // if (ret.data === null) {
                        //     console.log("数据为空是否可以return+++++++++++++");
                        //     return
                        // }
                    } catch (error) {
                        if (callback !== null) {
                            callback(null);
                        }
                        return;
                    }
                    if (callback !== null) {
                        callback(ret);
                    }
                } else {
                    if (callback !== null) {
                        callback(null);
                    }
                }
            }
        }
        xhr.onerror = function (e) {
            console.log("onerror");
            if (callback !== null) {
                callback(null);
            }
        };
        xhr.ontimeout = function (e) {
            console.log("ontimeout");
            if (callback !== null) {
                callback(null);
            }
        };
        xhr.send();
        return xhr;
    }
}
