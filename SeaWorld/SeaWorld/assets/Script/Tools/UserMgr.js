// 用户信息管理类
cc.Class({
    extends: cc.Component,
    properties: {
        uid: -1,                     //id
        nick: null,                  //用户名
        headImg: null,               //用户头像
        gold: 0,                     //房卡/金币
        sex: 0,                      //性别
        oldRoomId: null,             //历史房间号
        vip: 11,                     //vip等级
    },

    onLoad() {
        console.log('登录');
    },

    /**
     * 设置用户数据
     */
    setUserData: function (ret) {
        this.uid = ret.UID;
        this.gold = ret.Gold;
        this.headImg = ret.HUrl;
        this.nick = ret.Nick;
        this.sex = ret.Sex;
        this.vip = ret.Grade;
        if (ret.Room) {
            this.oldRoomId = ret.Room;
        }
    },

    checkOldRoom() {
        if (this.oldRoomId) {
            HandleMgr.addHandle('SC_EnterCard', (data) => {
                data = data.data;
                if (data.state == 0) {
                    Toast.showText(data.msg);
                    return;
                }
                Loading.show();
                let name = Tools.getSceneName(data.GameID);
                cc.vv.gameType = data.GameID;
                cc.vv.gameLevel = data.Level;
                cc.director.preloadScene(name, () => {
                    Loading.hide();
                    cc.director.loadScene(name);
                })
            });
            var data = {
                data: {
                    RoomID: parseInt(this.oldRoomId)
                }
            }
            MySocket.send('CS_EnterCard', data);
        }
    },
});
