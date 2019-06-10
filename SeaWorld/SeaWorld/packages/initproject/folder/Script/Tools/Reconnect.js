cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() { },

    show() {
        this.node.active = true;
        this.reConnect();
    },

    reConnect() {
      
        HandleMgr.removeHandle('onopen');
        HandleMgr.addHandle('onopen', () => {
            MySocket.send('CS_Connect', {});
            HandleMgr.removeHandle('onopen');
            HandleMgr.removeHandle('onclose');
        });
        HandleMgr.removeHandle('onclose');
        HandleMgr.addHandle('onclose', () => {
            this.reConnect();
        });
        HandleMgr.removeHandle('SC_Connect');
        HandleMgr.addHandle('SC_Connect', (data) => {
            console.log('SC_Connect------->' + JSON.stringify(data));
            data = data.data;
            if (data) {
                UserMgr.setUserData(data);
                if (data.Room) {
                    var data = {
                        data: {
                            RoomID: parseInt(data.Room)
                        }
                    }
                    MySocket.send('CS_EnterCard', data);
                    HandleMgr.removeHandle('SC_Connect');
                }else{
                    var screName = cc.director.getScene().name;
                    if (screName=='NNTable'||screName=='ZJHTable'||screName=='LHDTable'||screName=='BJLTable') {
                        cc.director.loadScene('GameHome');
                    }
                }
                this.node.active = false;
            }
        });
        HandleMgr.removeHandle('SC_EnterCard');
        HandleMgr.addHandle('SC_EnterCard', (data) => {
            HandleMgr.removeHandle('SC_EnterCard');
            data = data.data;
            if (data.state == 0) {
                Dialog.show(data.msg, () => {
                    cc.director.loadScene('GameHome');
                }, 1);
                return;
            }
            cc.vv.gameType = data.GameID;
            var screName = cc.director.getScene().name;
            let name = Tools.getSceneName(data.GameID);
            if (screName == name) {
                MySocket.send('CS_GAME_SYNC', { data: {} });
            } else {
                Loading.show();
                cc.vv.gameLevel = data.Level;
                cc.director.preloadScene(name, () => {
                    Loading.hide();
                    cc.director.loadScene(name);
                })
            }

        });
        MySocket.connect();
    },

    start() {

    },

    // update (dt) {},
});
