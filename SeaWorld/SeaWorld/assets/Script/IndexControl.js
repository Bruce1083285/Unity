function initMgr() {
    window.GameTools = require('GameTools');
    window.GameConfig = require('GameConfig');
    window.HandleMgr = new (require("HandleMgr"));              // 处理事件的类 
    window.DataHelper = new (require("DataHelper"));
    window.MySocket = require('MySocket');                      // websocket
    window.HTTP = require('HTTP');                             // Toast
    window.GoldFormat = require('GoldFormat');
    window.AudioMgr = new (require('AudioMgr'));                // 音乐播放类
    window.UserMgr = new (require('UserMgr'));                  // 用户信息相关类
    window.BigNumber = require('bignumber');
    window.FishesPool = new cc.NodePool();
    window.GuestPool = new cc.NodePool();

    AudioMgr.init();
    window.Global = {};                                                 // 全局变量
}
cc.Class({
    extends: cc.Component,

    properties: {
        LBL_Progress: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {
        initMgr();

        // this.LookAchievement();
        var pregress = (completedCount, totalCount) => {
            if (completedCount == 0 || !this.LBL_Progress) {
                return;
            }
            this.LBL_Progress.string = parseInt((completedCount / totalCount).toFixed(2) * 100) + '%';
        };
        GameTools.preloadScene(this, 'GameScene_1', () => {
            cc.log('preloadScene');
            this.initWxSetting();
            cc.find('Canvas/LoadingScene').active = false;
        }, pregress);

    },

    LookAchievement() {
        console.log("任务目标数据--------------->1");
        HTTP.sendRequest('Hall/LookAchievement', (data) => {
            console.log("任务目标数据--------------->2");
            console.log(data);
        }, { uid: 66664169 });
    },

    testNum() {
        // cc.log('testNum------>' + GameTools.formatGold('621400000000000000000000'));
    },

    initWxSetting: function () {
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({ withShareTicket: false });
            // GameDataHelper.getShareInfo((data) => {
            //     window.wx.onShareAppMessage(function () {
            //         // 用户点击了“转发”按钮
            //         return {
            //             title: data.content,
            //             imageUrl: data.img
            //         }
            //     });
            // })

            Global.LaunchOption = window.wx.getLaunchOptionsSync().query;

            console.log("LaunchOption->", JSON.stringify(Global.LaunchOption))

            if (GameTools.getItemByLocalStorage("UserPlayGame", true)) {
                cc.sys.localStorage.setItem("UserPlayGame", false);
                // 对用户托管数据进行写数据操作
                window.wx.setUserCloudStorage({
                    KVDataList: [{ key: "UserPlayGame", value: "1" }],
                });
            }
            this.info = window.wx.getSystemInfoSync();

            wx.onAudioInterruptionEnd(function () {
                //强行暂停音乐 如果不暂停，调用resumeMusic是无效的，因为是微信让声音消失了
                cc.audioEngine.pauseMusic();
                //恢复音乐播放，比如调用
                cc.audioEngine.resumeMusic();
                //self.refreshBG();
                //console.log('refreshBG');
            });

            // window.BannerAd = wx.createBannerAd({
            //     adUnitId: GameConfig.BannerID,
            //     style: {
            //         left: 0,
            //         top: this.info.windowHeight - 100,
            //         width: this.info.windowWidth,
            //         height: 100
            //     }
            // });
            // BannerAd.hide();

            // window.RewardedVideoAd =wx.createRewardedVideoAd({
            //     adUnitId: GameConfig.VideoID,
            // });

            window.wx.login({
                success: (res) => {
                    console.log(res.code);
                    HTTP.sendRequest('weixin/Authorize', (data) => {
                        if (data.status != 1) {
                            GameTools.dialog('请求错误:Authorize', data.msg, null);
                            return;
                        }
                        data = data.data;
                        this.sendToServer(data);
                    }, { code: res.code });
                }
            });
        } else {
            Global.LaunchOption = GameTools.urlParse();
            cc.find('Canvas/New Layout').active = true;
        }
    },

    sendToServer(openid) {
        var self = this;
        var fn = (data) => {
            console.log('data------>' + JSON.stringify(data));
            HTTP.sendRequest('weixin/Login', (res) => {
                console.log('wxdl------>' + JSON.stringify(res));
                if (res.status != 1) {
                    GameTools.dialog('请求错误:Login', res.msg, null);
                    return;
                }
                DataHelper.initData(res.data);
                cc.director.loadScene('GameScene_1');
                button.hide();
            }, { openid: openid, userInfo: encodeURI(JSON.stringify(data)), time: GameTools.getItemByLocalStorage('LastTime') })
        }

        const button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: self.info.windowWidth,
                height: self.info.windowHeight,
                lineHeight: 40,
                // backgroundColor: '#ff0000',
            }
        })
        button.onTap((res) => {
            console.log(res)
            // GameTools.dialog('点击授权',res.errMsg);
            if (res.errMsg == 'getUserInfo:ok') {
                fn(res.userInfo);
                button.hide();
            }
        });

        window.wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        withCredentials: true,
                        success(res) {
                            console.log(res.userInfo)
                            fn(res.userInfo);
                        }
                    })
                } else {
                    cc.find('Canvas/bt_dl').active = true;
                }
            }
        })
    },

    onBtnClicked(event, data) {
        let openid = data;
        HTTP.sendRequest('weixin/login', (data) => {
            if (data.status == 0) {
                GameTools.dialog('请求错误', data.msg, null);
                return;
            }
            DataHelper.initData(data.data);
            cc.director.preloadScene("GameScene_1", function () {
                cc.director.loadScene("GameScene_1");
            });
        }, { openid: openid });
    },
    // update (dt) {},
});
