// var iconv = require('iconv-lite');
var MySocket = {
    _sock: null,  //当前的webSocket的对象
    _contented: false,
    _isPinging: false,
    _ip: null,
    _port: null,
    connect: function (ip, port) {
        this._ip = ip ? ip : GameConfig.SOCKET.HOST;
        this._port = port ? port : GameConfig.SOCKET.PORT;
        if (!this._sock || this._sock.readyState !== 1) {
            //当前接口没有打开
            //重新连接
            this._sock = new WebSocket("ws://" + this._ip + ":" + this._port);
            this._sock.onopen = this._onOpen.bind(this);
            this._sock.onclose = this._onClose.bind(this);
            this._sock.onmessage = this._onMessage.bind(this);
        }
        return this;
    },

    _onOpen: function () {
        console.log('websockit---------->onopen');
        this._contented = true;
        HandleMgr.sendHandle("onopen");
        setTimeout(() => {
            this._isPinging = false;
            this.lastRecieveTime = 0;
            this.startHearbeat();
        }, 800);
    },

    _onClose: function (err) {
        this.close();

    },

    _onMessage: function (obj) {
        var data = JSON.parse(obj.data);
        console.log('websocket---------->onMessage------>' + JSON.stringify(data));
        // if (data.msgid == 'SC_Heart') {
        //     HandleMgr.sendHandle(data.msgid, data);
        //     return;
        // }
        HandleMgr.sendHandle(data.msgid, data);
    },

    send: function (event, data) {
        // if (!this._contented) {
        //     console.log('链接失败了');
        //     Dialog.showDialog('与服务器断开连接', () => {
        //         UserMgr.reConnect();
        //     }, null, null, "重新连接");
        //     return;
        // }
        if (event != 'CS_Heart') {
            var loading = cc.find('Canvas/loading');
            if (loading) {
                loading.getComponent('Loading').show();
            }
        }
        if (this._sock && this._sock.readyState != 1) {
            this.close();
            return;
        }
        data.msgid = event;
        data.uid = UserMgr.uid;
        console.log('websocket---------->send------>' + JSON.stringify(data));
        this._sock.send(JSON.stringify(data));
    },

    close: function (hide) {
        if (this._sock) {
            this._sock.close();
            this._sock.onopen = null;
            this._sock.onclose = null;
            this._sock.onmessage = null;
            this._sock = null;
            if (this.pingTimeFn) {
                clearInterval(this.pingTimeFn);
                this.pingTimeFn = null;
            }
            if (this.checkTimeFn) {
                clearInterval(this.checkTimeFn);
                this.checkTimeFn = null;
            }
            console.log('111111111');
            if (!hide) {
                // Dialog.show('与服务器断开连接', () => {
                //     // UserMgr.reConnect();
                //     Loading.hide();
                // }, 1);
                if (cc.director.getScene().name == 'Login') {
                    Loading.hide();
                    return;
                }
                Reconnect.show();
                Loading.hide();
            }

        }
        this._contented = false;
    },

    /**
     * 心跳包
     */
    startHearbeat: function () {
        console.log('Hearbeat--------------start');
        var self = this;
        HandleMgr.removeHandle('SC_Heart');
        HandleMgr.addHandle('SC_Heart', () => {
            self.lastRecieveTime = Date.now();
            self.delayMS = self.lastRecieveTime - self.lastSendTime;
        })

        this.lastRecieveTime = Date.now();
        if (!self._isPinging) {
            self._isPinging = true;
            this.pingTimeFn = setInterval(function () {
                if (self._sock) {
                    self._ping();
                }
            }.bind(this), 4000);
            this.checkTimeFn = setInterval(function () {
                if (self._sock) {
                    if (Date.now() - self.lastRecieveTime > 8000 && self.lastRecieveTime > 0) {
                        self.close();
                    }
                }
            }.bind(this), 500);
        }
    },

    _ping: function () {
        if (this._contented) {
            this.lastSendTime = Date.now();
            if (this._sock.readyState == 2) {
                HandleMgr.sendHandle("onclose");
                return;
            }
            this.send('CS_Heart', {});
        }
    },

};
module.exports = MySocket;
