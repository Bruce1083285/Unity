String.prototype.formatName = function (len) {
    let str = this;
    if (this.length > len) {
        str = this.substring(0, len) + '...';
    }
    return str;
}

String.prototype.fixed = function () {
    let arry = this.split('.');
    return arry[0];
}

String.prototype.isEmpty = function () {
    if (typeof this == "undefined" || this == null || this == "") {
        return true;
    } else {
        return false;
    }
}

Array.prototype.getIndexByUid = function (uid) {
    let index = -1;
    for (let i = 0; i < this.length; i++) {
        const element = this[i];
        if (element.uid == uid) {
            index = i;
            break;
        }
    }
    return index;
}

Array.prototype.copy = function () {
    let str = JSON.stringify(this);
    return JSON.parse(str);
}

Array.prototype.updateItem = function (uid, key, value) {
    let index = -1;
    for (let i = 0; i < this.length; i++) {
        if (this[i].uid == uid) {
            this[i][key] = value;
            break;
        }
    }
}

Array.prototype.getIndexBySeat = function (seat) {
    let index = -1;
    for (let i = 0; i < this.length; i++) {
        const element = this[i];
        if (element.seat == seat) {
            index = i;
            break;
        }
    }
    return index;
}

Array.prototype.removeIndexOf = function (index) {
    if (index < 0) {
        return;
    }
    this.splice(index, 1);
};

Array.prototype.removeItem = function (item) {
    if (this.indexOf(item) >= 0) {
        this.splice(this.indexOf(item), 1);
    }
};

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

Array.prototype.replace = function (index, item) {
    this.splice(index, 1, item);
};
Array.prototype.add = function (item) {
    this[this.length] = item;
};
cc.Node.prototype.setStatus = function (status) {
    this.status = status;
    if (this.getComponent(cc.Button)) {
        this.getComponent(cc.Button).interactable = status;
    }

    if (this.getComponent(cc.Sprite)) {
        this.getComponent(cc.Sprite).setState(status ? cc.Sprite.State.NORMAL : cc.Sprite.State.GRAY);
    }

    for (let i = 0; i < this.childrenCount; i++) {
        var element = this.children[i];
        if (element.getComponent(cc.Sprite)) {
            element.getComponent(cc.Sprite).setState(status ? cc.Sprite.State.NORMAL : cc.Sprite.State.GRAY);
        }
    }
}

var showFail = function (model, res) {
    console.log('fail:' + model + '--->' + JSON.stringify(res));
}
var GameTools = {
    GetRandom(min, max) {
        var n = Math.floor(Math.random() * (max - min + 1) + min);
        return n;
    },
    RemoveKey(object, key) {
        if (object.hasOwnProperty(key)) {
            delete object[key];
        }
    },

    copy(str) {
        if (!window.wx) {
            this.webCopyString(str);
            return;
        }
        wx.setClipboardData({
            data: str
        })
    },

    // 显示加载框
    loading(str) {
        if (!window.wx) {
            return;
        }
        if (!str || str.isEmpty) {
            wx.showLoading();
        } else {
            wx.showLoading({ title: str });
        }
    },


    // 隐藏加载框
    hidLoading() {
        if (!window.wx) {
            return;
        }
        wx.hideLoading();
    },

    // 获取网络状态
    getNetworkType(callback) {
        if (!window.wx) {
            return;
        }
        wx.getNetworkType({
            success: callback,
            fail: function (res) {
                showFail('getNetworkType', res);
            }
        })
    },

    // 对话框
    dialog(title, content, callback) {
        if (!window.wx) {
            return;
        }
        wx.showModal({
            title: title,
            content: content,
            showCancel: true,
            success: callback,
            fail: function (res) {
                showFail('showModal', res);
            }
        });
    },

    // 消息提示框
    toast(title) {
        if (!window.wx) {
            return;
        }
        wx.showToast({
            title: title,
        })
    },

    getItemByLocalStorage: function (key) {
        let values = cc.sys.localStorage.getItem(key);
        if (values === undefined || values === null || values === '') {
            values = null;
        }
        // if (typeof value === 'boolean') {
        //     if (typeof values === 'boolean') {
        //         return values;
        //     }
        //     return "true" == values;
        // } else if (typeof value === 'number') {
        //     return Number(values);
        // }
        return values;
    },

    setItemByLocalStorage: function (key, value) {
        cc.sys.localStorage.setItem(key, value);
    },

    //检查是否首次登录
    checkFirstLoginGame() {
        // let loginDate = Math.floor((new Date().getTime() - new Date(2018, 3, 18, 0, 0, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
        // if (loginDate > this.getItemByLocalStorage("FirstEnterGameDate", 0)) {
        //     cc.sys.localStorage.setItem("FirstEnterGameDate", loginDate);
        //     this.setGameIntegral(this.getGameIntegral() + 100);
        // }
    },

    //评论
    commentGame() {
        if (CC_WECHATGAME) {
            window.wx.openCustomerServiceConversation({});
        } else {
            cc.log("执行了评论")
        }
    },

    formatPrice1(price) {
        price = price + '';
        var price_arr = price.split('.');
        price = price_arr[0];
        if (price.length <= 3) {
            return price;
        }
        var length = price.length;
        var b = parseInt(length / 3);
        var result = '';
        if (b > 0) {
            result = price.substring(0, length - b * 3) + GameConfig.ZiMu[b - 1];
        } else {
            result = price;
        }
        return result;
    },

    formatPrice(price1) {

        var index = 0;
        var zimu = '';
        var result = '';
        if (price1 < 1000) {
            return price1;
        }
        var fn = (price) => {
            if (price > 1000) {
                price = price / 1000;
                zimu = GameConfig.ZiMu[index];
                index++;
                price = Math.floor(price * 1000) / 1000;
                fn(price);
            } else {
                if (price >= 10 && price < 100) {
                    result = Math.floor(price * 10) / 10 + zimu;
                } else if (price >= 100) {
                    result = parseInt(price) + zimu;
                } else {
                    result = Math.floor(price * 100) / 100 + zimu;
                }
            }
        }
        fn(price1);
        return result;
    },

    addClickEvent: function (node, target, component, handler, data) {
        if (!node) {
            return;
        }
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler
        eventHandler.customEventData = data ? data : '';

        // var clickEvents = node.getComponent(cc.Button).clickEvents;
        // clickEvents = [];
        // clickEvents.push(eventHandler);
        node.getComponent(cc.Button).clickEvents = [eventHandler];
    },

    removeEvent(node) {
        node.off(cc.Node.EventType.TOUCH_START);
        node.off(cc.Node.EventType.TOUCH_END);
        node.off(cc.Node.EventType.TOUCH_CANCEL);
    },

    addEvent(node, callback, initScale) {


        node.off(cc.Node.EventType.TOUCH_START);
        node.off(cc.Node.EventType.TOUCH_END);
        node.off(cc.Node.EventType.TOUCH_CANCEL);
        node.initScale = initScale ? initScale : node.scale;
        console.log('initScale------->' + node.initScale);
        node.on(cc.Node.EventType.TOUCH_START, () => {
            if (node.status && node.status == 1) {
                return;
            }
            cc.find('Canvas/Mask').active = true;
            node.runAction(cc.scaleTo(0.1, node.initScale - 0.1));
        });

        node.on(cc.Node.EventType.TOUCH_END, () => {
            if (node.status && node.status == 1) {
                return;
            }
            node.runAction(cc.sequence(cc.scaleTo(0.1, node.initScale), cc.callFunc(() => {
                callback(node);
                setTimeout(() => {
                    cc.find('Canvas/Mask').active = false;
                }, 100);
            })));
        });
        node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            if (node.status && node.status == 1) {
                return;
            }
            node.runAction(cc.sequence(cc.scaleTo(0.1, node.initScale), cc.callFunc(() => {
                // callback(node);
                cc.find('Canvas/Mask').active = false;
            })));
        });
    },

    formatFloat(float, num) {
        var a = Math.pow(10, num);
        return Math.floor(float * a) / a;
    },

    toNonExponential(num) {
        var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
        return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
    },
    formatGold(num) {
        num = this.toNonExponential(BigNumber(num));
        num = num + '';
        var price_arr = num.split('.');
        num = price_arr[0];
        // num = num.spr
        let length = num.length;
        let a = parseInt(length / 3);
        let b = length % 3;
        if (b == 0) {
            if (a <= 1) {
                return num;
            } else {
                let str = num.slice(0, 3);
                return str + GameConfig.ZiMu[a - 2];
            }
        } else {
            if (a <= 0) {
                return num;
            } else {
                let str1 = num.slice(0, b);
                let str2 = num.slice(b, 3);
                let str = str1 + '.' + str2;
                return str + GameConfig.ZiMu[a - 1];
            }
        }
    },

    copyOb(obj) {
        if (typeof obj != 'object') {
            return obj;
        }
        var newobj = {};
        for (var attr in obj) {
            newobj[attr] = this.copyOb(obj[attr]);
        }
        return newobj;
    },

    webCopyString1: function (str) {
        var input = str + '';
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS
        // el.style.zIndex = 1000;
        const selection = getSelection();
        var originalRange = false;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        var success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) { }

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
        if (success) {
            this.toast('复制成功');
        } else {
            if (!this.webCopyString2(str)) {
                this.toast('复制失败，请手动输入');
            }
        }
        return success;
    },

    webCopyString2(str) {
        var save = function (e) {
            e.clipboardData.setData('text/plain', str);
            e.preventDefault();
        }
        document.addEventListener('copy', save);
        let b = document.execCommand('copy');
        document.removeEventListener('copy', save);
        return b;
    },
    webCopyString(input) {
        var textToClipboard = input; //文本到剪贴板

        var success = true;
        if (window.clipboardData) { // 浏览器
            window.clipboardData.setData("Text", textToClipboard);
        }
        else {
            var forExecElement = this.CreateElementForExecCommand(textToClipboard);
            this.SelectContent(forExecElement);
            try {
                if (window.netscape && netscape.security) {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                }
                //将选定内容复制到剪贴板
                success = document.execCommand("copy", false, null);
            }
            catch (e) {
                success = false;
            }
            //移除临时元素
            document.body.removeChild(forExecElement);
        }
        if (success) {
            this.toast('复制成功');
        } else {
            this.webCopyString1(input);
        }
        return success;
    },
    urlParse() {
        var params = {};
        if (window.location == null) {
            return params;
        }
        var name, value;
        var str = window.location.href; //取得整个地址栏
        var num = str.indexOf("?")
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                params[name] = value;
            }
        }
        return params;
    },

    preloadScene: function (_This, sceneName, onLoaded, onProgress) {
        var director = cc.director;
        var info = director._getSceneUuid(sceneName);
        if (info) {
            director.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
            cc.loader.load({
                uuid: info.uuid,
                type: "uuid"
            }, null == onProgress ? null : function (e, a) {
                onProgress && onProgress.call(_This, e, a);
            }, function (error, asset) {
                error && cc.errorID(1215, sceneName, error.message);
                onLoaded && onLoaded(error, asset);
            });
        } else {
            var error = 'Can not preload the scene "' + sceneName + '" because it is not in the build settings.';
            onLoaded && onLoaded(new Error(error));
            cc.error("preloadScene: " + error);
        }
    },
}

module.exports = GameTools;