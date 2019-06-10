
window.NETWORK_STATE = cc.Enum({
    SUCCESS: 0,         // 请求成功
    ERROR: 1,           // 请求错误
    TIMEOUT: 2,         // 请求超时
})

// var baseUrl = 'http://192.168.31.213:8110/userapi/sign/';
// var baseUrl1 = 'http://192.168.31.213:8110/userapi/sms/';
// var baseUrl2 = 'http://192.168.31.213:8110/userapi/weixin/';

var baseUrl = 'http://47.104.141.78:8000/userapi/sign/';
var baseUrl1 = 'http://47.104.141.78:8000/userapi/sms/';
var baseUrl2 = 'http://47.104.141.78:8000/userapi/weixin/';



var HTTP = cc.Class({

    extends: cc.Component,

    statics: {

        sendRequest: function (url, data, callback, type,isHide) {
            if (!isHide) {
                Loading.show();
            }
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
            var requestURL = '';
            if (type == 1) {
                requestURL = baseUrl1 + url + encodeURI(str);
            } else if (type == 2) {
                requestURL = baseUrl2 + url + encodeURI(str);
            } else {
                requestURL = baseUrl + url + encodeURI(str);
            }
            console.log("RequestURL:" + requestURL);
            xhr.open('GET', requestURL, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        Loading.hide();
                        console.log(requestURL + '\n' + xhr.responseText + '\n');
                        var ret = null;
                        try {
                            ret = JSON.parse(xhr.responseText);
                        } catch (error) {
                            ret = xhr.responseText
                        }
                        if (callback !== null) {
                            callback(ret, NETWORK_STATE.SUCCESS);
                        }
                    } else {
                        if (callback !== null) {
                            callback(null, NETWORK_STATE.ERROR);
                        }
                    }
                }
            }
            xhr.onerror = function (e) {
                console.log("onerror");
                Loading.hide();
                Dialog.show('请求错误', null, 1);
                // if (callback !== null) {
                //     callback(null, NETWORK_STATE.ERROR);
                // }
            };
            xhr.ontimeout = function (e) {
                console.log("ontimeout");
                Loading.hide();
                Dialog.show('请求超时', null, 1);
                // if (handler !== null) {
                //     callback(null, NETWORK_STATE.TIMEOUT);
                // }
            };
            xhr.send();
            return xhr;
        },
        upload: function (url, data, callback, type) {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;
            var requestURL = '';
            if (type == 1) {
                requestURL = baseUrl1 + url;
            } else if (type == 2) {
                requestURL = baseUrl2 + url;
            } else {
                requestURL = baseUrl + url;
            }
            var formData = new FormData();
            formData.append('uploadfile', data.img);
            formData.append('uid', data.uid);
            xhr.open('POST', requestURL, true);
            xhr.send(formData);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        console.log(requestURL + '\n' + xhr.responseText + '\n');
                        var ret = null;
                        try {
                            ret = JSON.parse(xhr.responseText);
                        } catch (error) {
                            ret = xhr.responseText
                        }
                        if (callback !== null) {
                            callback(ret, NETWORK_STATE.SUCCESS);
                        }
                    } else {
                        if (callback !== null) {
                            callback(null, NETWORK_STATE.ERROR);
                        }
                    }
                }
            }
            xhr.onerror = function (e) {
                console.log("onerror");
                Dialog.show('请求错误', null, 1);
                // if (callback !== null) {
                //     callback(null, NETWORK_STATE.ERROR);
                // }
            };
            xhr.ontimeout = function (e) {
                console.log("ontimeout");
                Dialog.show('请求超时', null, 1);
                // if (handler !== null) {
                //     callback(null, NETWORK_STATE.TIMEOUT);
                // }
            };
            return xhr;
        }
    },
});
