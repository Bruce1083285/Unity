import { CacheType } from "./Enum";
import Cache from "./Cache";
import Http from "./Http";
import AdvList from "../start/AdvertisementList";
// import sdk from "../common/sdk";
const sdk = require("../common/sdk")

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * @class WX
 */
export default class WX {

    /**
     * @property 分享次数
     */
    private static Share_Count: number = 0;
    /**
     * @property 授权数
     */
    private static Authorization_Count: number = 0;
    /**
     * @property Banner广告组件
     */
    private static BannerAd: any = null;
    /**
     * @property 激励视频广告组件
     */
    private static VideoAd: any = null;
    /**
     * @property 激励视频广告是否完整关闭
     */
    private static IsEnded: boolean = null;
    /**
     * @property 用户信息按钮
     */
    private static button: any = null;
    /**
   * @property 比赛用户信息按钮
   */
    private static Match_button: any = null;
    /**
     * @property 广告加载是否成功
     */
    public static IsPlay: boolean = null;
    /**
     * @property Uid唯一标识符
     */
    public static Uid: any = null;
    /**
     * @property openid
     */
    public static Open_id: any = null;
    /**
     * @property 广告列表数据
     */
    public static Adver: any = {};
    /**
     * @property 是否授权
     */
    private static IsAut: boolean = false;
    /**
     * @property 微信开关——判断是否为微信环境
     */
    public static WX_Swtich: boolean = window.wx ? true : false;

    private constructor() { }

    public static Login(share_id: any) {
        // console.log(share_id + "分享ID");
        if (WX.WX_Swtich) {
            // WX.GetUserInfo("data.data.openid");
            // return
            sdk.getOpenid((openid) => {
                console.log("获取openid");
                console.log(openid)
                WX.Open_id = openid;
                // console.log(data);
                // openid = data.openid;
                Http.sendRequest("https://xy.zcwx.com/userapi/weixin/Getuid", (data) => {
                    // console.log("登录数据++++1");
                    // console.log(data);
                    if (data === null) {
                        return;
                    }
                    if (data.data === null) {
                        return
                    }
                    WX.Uid = data.data.uid;
                    WX.GetUserInfo(openid, share_id);
                }, { gid: 1, openid: openid, shareid: share_id, nickname: null, headimgurl: null, sex: null });
            })
            return;
            wx.login({
                success(res) {
                    // console.log("登录:" + res);
                    // console.log("登录:" + JSON.stringify(res));
                    if (res.code) {
                        // // 发起网络请求
                        // wx.request({
                        //     url: 'http://192.168.31.11:8200/userapi/weixin/getopenid',
                        //     data: {
                        //         code: res.code
                        //     }
                        // })
                        // Http.sendRequest("https://xy.zcwx.com/userapi/weixin/getopenid", (data) => {
                        //     // console.log("登录数据");
                        //     // console.log(data);
                        //     // openid = data.openid;
                        //     Http.sendRequest("https://xy.zcwx.com/userapi/weixin/Getuid", (data) => {
                        //         // console.log("登录数据++++1");
                        //         // console.log(data);
                        //         if (data.data === null) {
                        //             return
                        //         }
                        //         WX.Uid = data.data.uid;
                        //         // Http.sendRequest("https://xy.zcwx.com/userapi/hall/getcoin", (data) => {
                        //         //     console.log("金币数据");
                        //         //     console.log(data);
                        //         //     if (data === null) {
                        //         //         return;
                        //         //     }
                        //         //     if (data.data === null) {
                        //         //         return;
                        //         //     }
                        //         //     console.log("金币缓存修改是否成功");
                        //         //     Cache.SetCache(CacheType.Coin, data.data.coin);
                        //         // }, { uid: WX.Uid, coin: 0 });
                        //         //获取奖品排行榜
                        //         // Http.sendRequest("http://192.168.31.11:8201/userapi/hall/reward", (data) => {
                        //         //     console.log("获取奖品排行数据");
                        //         //     console.log(data);
                        //         //     let arr: any[] = data.data;
                        //         // });
                        //         WX.GetUserInfo(data.data.openid, share_id);
                        //     }, { gid: 1, openid: data.data.openid, nickname: null, headimgurl: null, sex: null });
                        // }, { code: res.code });

                    } else {
                        // console.log('登录失败！' + res.errMsg)
                    }
                }
            });
        }
    }

    /**
     * 获取用户信息
     * @param openid openid
     */
    public static GetUserInfo(openid: any, share_id: any, bm: boolean = false) {
        // return;
        if (WX.WX_Swtich) {
            wx.getSetting({
                success(res) {
                    // console.log("是否授权");
                    // console.log(res);
                    // console.log(res.authSetting['scope.userInfo'] + "是否进入");
                    if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                            withCredentials: true,
                            lang: "zh_CN",
                            success(res) {
                                let userInfo = res.userInfo
                                let nickName = userInfo.nickName
                                let avatarUrl = userInfo.avatarUrl
                                let gender = userInfo.gender // 性别 0：未知、1：男、2：女
                                console.log("openid:" + openid);
                                console.log("名字:" + nickName);
                                console.log("头像:" + avatarUrl);
                                console.log("shareid" + share_id);
                                if (share_id) {
                                    Http.sendRequest("https://xy.zcwx.com/userapi/weixin/Getuid", (data) => {
                                        // console.log("登录数据++++");
                                        // console.log(data);
                                        // WX.Uid = data.data.uid;
                                        //获取奖品排行榜
                                        // Http.sendRequest("http://192.168.31.11:8201/userapi/hall/reward", (data) => {
                                        //     console.log("获取奖品排行数据");
                                        //     console.log(data);
                                        //     let arr: any[] = data.data;
                                        // });
                                        if (bm) {
                                            Http.sendRequest("https://xy.zcwx.com/userapi/hall/bm", (data) => {
                                            }, { uid: WX.Uid });
                                        }
                                    }, { gid: 1, openid: openid, shareid: share_id, nickname: nickName, headimgurl: avatarUrl, sex: gender });
                                } else {
                                    Http.sendRequest("https://xy.zcwx.com/userapi/weixin/Getuid", (data) => {
                                        // console.log("登录数据++++");
                                        // console.log(data);
                                        // WX.Uid = data.data.uid;
                                        //获取奖品排行榜
                                        // Http.sendRequest("http://192.168.31.11:8201/userapi/hall/reward", (data) => {
                                        //     console.log("获取奖品排行数据");
                                        //     console.log(data);
                                        //     let arr: any[] = data.data;
                                        // });
                                        if (bm) {
                                            Http.sendRequest("https://xy.zcwx.com/userapi/hall/bm", (data) => {
                                            }, { uid: WX.Uid });
                                        }
                                    }, { gid: 1, openid: openid, shareid: null, nickname: nickName, headimgurl: avatarUrl, sex: gender });
                                }
                                // console.log("openid:" + JSON.stringify(res));
                                // console.log("openid:" + res.encryptedData);
                                // console.log("头像:" + res.iv);
                                sdk.getUserInfo({ encryptedData: res.encryptedData, iv: res.iv })
                            },
                            fail(res) {
                                console.log(res);
                            }
                        });
                    }
                }
            })
            return;
            wx.navigateToMiniProgram({
                appid: "",
                success: (res) => {
                    sdk.clickAd(this.Adver.id);
                }
            })
        }
    }

    /**
     * 获取小游戏启动时的参数
     */
    public static GetLaunchOptionsSync(): any {
        if (WX.WX_Swtich) {
            let ob = wx.getLaunchOptionsSync()
            return ob;
        }
        return null;
    }

    /**
     * 创建Banner广告
     */
    public static BannerCreator(scene: string) {
        if (WX.WX_Swtich) {
            if (WX.BannerAd) {
                return;
            }
            //获取设备信息
            let systemInfo = wx.getSystemInfoSync();
            let width = systemInfo.windowWidth;
            let height = systemInfo.windowHeight;
            if (scene === "game") {
                // console.log(height + "高度");
                WX.BannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-bad130a7dbf49ee7',
                    style: {
                        // left: 0,
                        top: 0,
                        left: width / 2 - 150,
                        // top: height - 150,
                        width: 300,
                        // height: 100,
                    }
                })
                WX.BannerAd.onResize(function () {
                    // WX.BannerAd.style.left = width - WX.BannerAd.style.realWidth / 2 - 150 + 0.1;
                    WX.BannerAd.style.top = height - WX.BannerAd.style.realHeight + 0.1;
                    // console.log(bannerAd);
                })
                WX.BannerAd.show();
                WX.BannerAd.onError((res) => {
                    // console.log("广告加载失败：" + res);
                    // WX.BannerAd.destroy();
                });
                // WX.BannerAd.onLoad((res) => {
                //     console.log("广告加载成功：" + res);
                //     WX.BannerAd.show()
                // });
                // WX.CreatorBannerType(width / 2 - 150, 0, 300, 0);
                // WX.BannerAd.onResize(function () {
                //     // WX.BannerAd.style.left = width - WX.BannerAd.style.realWidth / 2 - 150 + 0.1;
                //     WX.BannerAd.style.top = height - WX.BannerAd.style.realHeight + 0.1;
                //     // console.log(bannerAd);
                // })
            }
            // if (scene === "start") {
            //     WX.CreatorBannerType(width / 2 - 150, height - 150, 300, 100);
            // }
        }
    }

    private static CreatorBannerType(left: number, top: number, width: number, height: number) {
        if (WX.WX_Swtich) {
            WX.BannerAd = wx.createBannerAd({
                adUnitId: 'adunit-bad130a7dbf49ee7',
                style: {
                    top: top,
                    left: left,
                    width: width,
                    height: height,
                }
            })
            WX.BannerAd.show();
            WX.BannerAd.onError((res) => {
                // console.log("广告加载失败：" + res);
                // WX.BannerAd.destroy();
            });
            // WX.BannerAd.onLoad((res) => {
            //     console.log("广告加载成功：" + res);
            //     WX.BannerAd.show()
            // });
        }
    }

    /**
     * Banner广告显示
     */
    public static BannerShow() {
        if (WX.WX_Swtich) {
            WX.BannerAd.show();
            // WX.BannerCreator("start");
        }
    }

    /**
    * Banner广告隐藏
    */
    public static BannerHide() {
        if (WX.WX_Swtich) {
            // console.log("销毁是否执行");
            if (WX.BannerAd) {
                WX.BannerAd.destroy();
                WX.BannerAd = null;
                // WX.BannerAd.hide();
            }
        }
    }

    /**
     * Banner广告销毁
     */
    public static BannerDestroy() {
        if (WX.WX_Swtich) {
            // if (WX.BannerAd) {
            // console.log("是否进入销毁");
            WX.BannerAd.hide();
            WX.BannerAd.destroy();
            // }
        }
    }

    /**
     * 创建激励视频广告
     */
    public static RewardedVideoCreator() {
        if (WX.WX_Swtich) {
            this.VideoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-97f4865187e094ba'
            })
            // this.VideoAd.load()
            // .then(() => this.VideoAd.show())
            // .catch(err => console.log(err.errMsg))
            this.VideoAd.onError((res) => {
                console.log("激励视频加载失败" + res);
            });
            this.VideoAd.onLoad((res) => {
                this.IsPlay = true;
                // console.log("激励视频加载成功" + JSON.stringify(res));
            });
            // console.log(JSON.stringify(this.VideoAd) + "激励视频");
            // this.VideoAd.onClose((res) => {
            //     if (res.isEnded) {
            //         callback_yes();
            //     } else {
            //         callback_no();
            //     }
            //     this.VideoAd.load();
            // });
        }
    }

    /**
     * 发起 HTTPS 网络请求
     */
    public static Request() {
        if (WX.WX_Swtich) {
            // return
            let a = null;
            wx.request({
                url: "https://cdnfile.zcwx.com/Uploads/gds.json",
                success: (res) => {
                    // console.log("微信网络请求");
                    WX.Adver = res.data;
                    cc.find("Canvas/Page_Advertisement").getComponent(AdvList).Init();
                    // console.log(WX.Adver);
                }
            })
        }
    }

    /**
     * 监听是否完整观看视频激励广告
     * @param callback_yes 完整观看广告方法
     * @param callback_no 未完整观看广告方法
     */
    public static RewardedVideoClose(callback_yes: Function, callback_no: Function) {
        if (WX.WX_Swtich) {
            this.VideoAd.show();
            this.VideoAd.onClose((res) => {
                if (res.isEnded) {
                    callback_yes();
                } else {
                    callback_no();
                }
                // this.VideoAd.load();
                this.VideoAd.offClose();
            });
        }
    }

    /**
     * 注册监听音频中断结束事件
     */
    public static OnAudioInterruptionEnd() {
        if (WX.WX_Swtich) {
            let callback = () => {
                cc.audioEngine.pauseAll();
                cc.audioEngine.resumeAll();
            }
            wx.onAudioInterruptionEnd(callback);
        }
    }

    /**
    * 注销监听音频中断结束事件
    */
    public static OffAudioInterruptionEnd() {
        if (WX.WX_Swtich) {
            wx.offAudioInterruptionEnd();
        }
    }

    /**
     * 微信小游戏跳转
     * @param appid 
     * @param path 
     */
    public static NavigateToMiniProgram(appid: string, path: string) {
        if (WX.WX_Swtich) {
            // console.log("跳转目标");
            // console.log(appid);
            // console.log(path);
            wx.navigateToMiniProgram({
                appId: appid,
                path: path,
            })
        }
    }

    // /**
    //  * 激励视频广告是否完整关闭
    //  */
    // public static RewardedVideoIsEnded() {
    //     console.log("是否完整关开视频:" + this.IsEnded);
    // }

    /**
     * 微信授权
     * @param mode 可选参数，模式
     */
    public static InitUserInfoButton() {

        if (WX.WX_Swtich) {
            if (typeof wx === 'undefined') {
                return;
            }
            wx.getSetting({
                success: (res) => {
                    // console.log("授权状态")
                    // console.log(JSON.stringify(res));
                    // console.log(res.authSetting["scope.userInfo"])
                    if (!res.authSetting["scope.userInfo"]) {
                        return
                        let launck = WX.GetLaunchOptions();
                        // console.log("获取启动场景参数-2");
                        // console.log(JSON.stringify(launck));
                        if (launck.query.is_auth === "1") {
                            //获取设备信息
                            let systemInfo = wx.getSystemInfoSync();
                            let width = systemInfo.windowWidth;
                            let height = systemInfo.windowHeight;
                            //创建授权按钮
                            this.button = wx.createUserInfoButton({
                                type: 'text',
                                text: '',
                                style: {
                                    left: width / 2 - 75,
                                    top: height / 2 - 86 - 75,
                                    width: 150,
                                    height: 150,
                                    lineHeight: 40,
                                    // backgroundColor: '#000000',
                                    // borderColor:'#000000',
                                    textAlign: 'center',
                                    fontSize: 10,
                                    borderRadius: 4
                                }
                            });

                            this.button.onTap((res) => {
                                let userInfo = res.userInfo;
                                if (!userInfo) {
                                    console.log(res.errMsg);
                                }
                                wx.getUserInfo({
                                    withCredentials: true,
                                    lang: "zh_CN",
                                    success(res) {
                                        sdk.getUserInfo({ encryptedData: res.encryptedData, iv: res.iv })
                                    },
                                    fail(res) {
                                        console.log(res);
                                    }
                                });
                                this.button.hide();
                                this.button.destroy();
                            });
                        }
                    } else {
                        wx.getUserInfo({
                            withCredentials: true,
                            lang: "zh_CN",
                            success(res) {
                                sdk.getUserInfo({ encryptedData: res.encryptedData, iv: res.iv })
                            },
                            fail(res) {
                                console.log(res);
                            }
                        });
                    }
                }
            })
        }
    }

    public static GetLaunchOptions() {
        if (WX.WX_Swtich) {
            let launck = wx.getLaunchOptionsSync();
            console.log("获取启动场景参数");
            console.log(JSON.stringify(launck));
            return launck;
        }
    }
    /**
     * 微信授权
     * @param mode 可选参数，模式
     */
    public static MatchUserInfoButton(mode: string, mode_callback: Function) {

        if (WX.WX_Swtich) {
            if (typeof wx === 'undefined') {
                return;
            }
            wx.getSetting({
                success: (res) => {
                    // console.log("授权状态")
                    // console.log(JSON.stringify(res));
                    // console.log(res.authSetting["scope.userInfo"])
                    if (!res.authSetting["scope.userInfo"]) {
                        let launck = WX.GetLaunchOptions();
                        // console.log("获取启动场景参数-2");
                        // console.log(JSON.stringify(launck));
                        // if (launck.query.is_auth === "1") {
                        //获取设备信息
                        let systemInfo = wx.getSystemInfoSync();
                        let width = systemInfo.windowWidth;
                        let height = systemInfo.windowHeight;
                        //创建授权按钮
                        this.Match_button = wx.createUserInfoButton({
                            type: 'text',
                            text: '',
                            style: {
                                left: 0,
                                top: 0,
                                width: width,
                                height: height,
                                lineHeight: 40,
                                // backgroundColor: '#000000',
                                // borderColor:'#000000',
                                textAlign: 'center',
                                fontSize: 10,
                                borderRadius: 4
                            }
                        });

                        this.Match_button.onTap((res) => {
                            let userInfo = res.userInfo;
                            if (!userInfo) {
                                console.log(res.errMsg);
                                if (mode === "match") {
                                    mode_callback();
                                }
                            }
                            wx.getUserInfo({
                                withCredentials: true,
                                lang: "zh_CN",
                                success(res) {
                                    sdk.getUserInfo({ encryptedData: res.encryptedData, iv: res.iv })
                                },
                                fail(res) {
                                    console.log(res);
                                }
                            });
                            this.Match_button.hide();
                            this.Match_button.destroy();
                        });
                        // }
                    } else {
                        wx.getUserInfo({
                            withCredentials: true,
                            lang: "zh_CN",
                            success(res) {
                                sdk.getUserInfo({ encryptedData: res.encryptedData, iv: res.iv })
                            },
                            fail(res) {
                                console.log(res);
                            }
                        });
                    }
                }
            })
        }
    }

    // public static GetMatchLaunchOptions() {
    //     if (WX.WX_Swtich) {
    //         let launck = wx.getLaunchOptionsSync();
    //         console.log("获取启动场景参数-1");
    //         console.log(JSON.stringify(launck));
    //         return launck;
    //     }
    // }

    /**
     * 获取授权
     */
    public static GetAuthorization() {
        if (WX.WX_Swtich) {
            let isaut = Cache.GetCache(CacheType.IsAuthorization);
            if (!isaut) {
                wx.getSetting({
                    success: (res) => {
                        // console.log("授权状态")
                        // console.log(JSON.stringify(res));
                        // console.log(res.authSetting["scope.userInfo"])
                        if (res.authSetting["scope.userInfo"]) {
                            WX.Authorization_Count++;
                            Cache.SetCache(CacheType.IsAuthorization, "true");
                            // console.log(WX.Authorization_Count + "授权数");
                        }
                    }
                })
                // console.log(WX.Authorization_Count + "授权数测试");
            }
        }
    }

    /**
     * 回到小游戏
     * @param callbacks 回调函数
     */
    public static OnShow(callbacks: Function) {
        // cc.audioEngine.resumeAll();
        if (WX.WX_Swtich) {
            wx.onShow(callbacks);
            // wx.offShow();
        } else {
            callbacks();
        }
    }

    /**
     * 注销回到小游戏监听
     */
    public static OffShow() {
        if (WX.WX_Swtich) {
            wx.offShow()
        }
    }

    /**
     * 右上角分享按钮显示
     */
    public static ShareButtonShow() {
        if (WX.WX_Swtich) {
            cc.audioEngine.pauseAll();
            //微信右上角转发显示
            wx.showShareMenu();
            //获取更多转发信息
            wx.updateShareMenu({
                withShareTicket: true,
            })
            let tit = '你有我准么？';
            let imageurl = "https://mmocgame.qpic.cn/wechatgame/woPD4tgIiaBvk0WEVUhC4jYmeib7iaH37hNqWhDndBtWB1r9yQibLL8Ut5XJgsEI5Izr/0";
            // imageurl
            Http.sendRequest("https://xy.zcwx.com/userapi/hall/shall", (data) => {
                if (data && data.status === 1) {
                    tit = data.data.content;
                    let imgurl = data.data.img;
                    let arr = imgurl.split("/");
                    arr[0] = "https:";
                    arr[2] = "xy.zcwx.com";
                    imageurl = arr.join("/");
                    // console.log("字符串解析");
                    // console.log(imageurl);
                }
                this.onShareApp(tit, imageurl);
            }, { id: 1 });
            // wx.onShareAppMessage(() => {
            //     return {
            //         title: tit,
            //         imageUrl: imageurl,
            //         // imageUrlId: "DPwCrjKwQsiuXe7gi5n7Jw",
            //     }
            // })
            // //分享，监听用户点击右上角菜单的“转发”按钮时触发的事件
            // wx.aldOnShareAppMessage(() => {
            //     return {
            //         title: '钩大师',
            //         imageUrl: "https://mmocgame.qpic.cn/wechatgame/CqTkaIBUstsZwV6FwxPicWKAE9u8ic65icibEmmrNTf3SMc6cqBCGJrFaVGKQu0xbJJ3/0",
            //         imageUrlId: "DPwCrjKwQsiuXe7gi5n7Jw",
            //         // query: 'id=89&select=2'//查询字符串，必须是 key1=val1&key2=val2 的格式。从这条转发消息进入后，可通过 wx.getLaunchOptionSync() 或 wx.onShow() 获取启动参数中的 query。
            //     }
            // })
        }
    }

    /**
     * 右上角转发管理
     * @param tit 标题
     * @param imageurl 图片路径
     */
    public static onShareApp(tit, imageurl) {
        if (WX.WX_Swtich) {
            wx.aldOnShareAppMessage(() => {
                return {
                    title: tit,
                    imageUrl: imageurl,
                    query: "shareid=" + WX.Uid,
                    // imageUrlId: "DPwCrjKwQsiuXe7gi5n7Jw",
                }
            })
            wx.onHide(() => {
                console.log('开始分享')
                let share_stime = (new Date()).getTime()
                wx.onShow(() => {
                    let share_etime = (new Date()).getTime()
                    if (share_etime - share_stime < 3000) {
                        wx.showToast({
                            title: '分享失败，请换一个群试试',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                    cc.audioEngine.resumeAll();
                    wx.offHide()
                    wx.offShow()
                })
            })
        }
    }

    /**
     * 转发
     */
    public static Share(callback_yes?: Function, callback_no?: Function) {
        if (WX.WX_Swtich) {
            cc.audioEngine.pauseAll();
            console.log('do share')
            var that = this
            WX.Share_Count++;
            // console.log(WX.Share_Count + "微信分享数");
            let tit = '你有我准么？';
            let imageurl = "https://mmocgame.qpic.cn/wechatgame/woPD4tgIiaBvk0WEVUhC4jYmeib7iaH37hNqWhDndBtWB1r9yQibLL8Ut5XJgsEI5Izr/0";
            Http.sendRequest("https://xy.zcwx.com/userapi/hall/shall", (data) => {
                if (data && data.status === 1) {
                    tit = data.data.content;
                    let imgurl = data.data.img;
                    let arr = imgurl.split("/");
                    arr[0] = "https:";
                    arr[2] = "xy.zcwx.com";
                    imageurl = arr.join("/");
                    // console.log(data.data.content);
                    // console.log(data.data.img);
                    // console.log(tit);
                    // console.log(imageurl);
                }
                WX.shareApp(tit, imageurl, callback_yes, callback_no);
            }, { id: WX.Uid });

        }
    }

    /**
     * 主动转发管理
     * @param tit 标题
     * @param imageurl 图片路径
     */
    public static shareApp(tit, imageurl, callback_yes: Function, callback_no: Function) {
        if (WX.WX_Swtich) {
            //转发
            console.log("share_id是否为空");
            console.log(WX.Uid);
            wx.aldShareAppMessage({
                title: tit,
                imageUrl: imageurl,
                query: "shareid=" + WX.Uid,
            })
            wx.onHide(() => {
                console.log('开始分享')
                let share_stime = (new Date()).getTime()
                wx.onShow(() => {
                    let share_etime = (new Date()).getTime()
                    if (share_etime - share_stime < 5000) {
                        wx.showToast({
                            title: '分享失败，请换一个群试试',
                            icon: 'none',
                            duration: 2000
                        })
                        if (callback_no) {
                            callback_no();
                        }
                    } else {
                        if (callback_yes) {
                            callback_yes();
                        }
                    }
                    cc.audioEngine.resumeAll();
                    wx.offHide()
                    wx.offShow()
                })
            })
        }
    }

    /**
     * 隐藏小游戏（切换到后台）
     * @param callback 回调函数
     */
    public static OnHide(callback: Function) {
        // cc.audioEngine.pauseAll();
        if (WX.WX_Swtich) {
            wx.onHide(callback)
        } else {
            callback();
        }
    }

    /**
     * 注销隐藏小游戏监听
     */
    public static OffHide() {
        if (WX.WX_Swtich) {
            wx.offHide();
        }
    }

    /**
     * 向子域发送消息
     */
    public static PostMessage(key: string, param: string) {
        if (WX.WX_Swtich) {
            if (key === "direction") {
                //向子域发送消息
                wx.getOpenDataContext().postMessage({
                    direction: param,
                });
            }
        }
        // if (key === "upda") {
        //     //向子域发送消息
        //     wx.getOpenDataContext().postMessage({
        //         upda: param,
        //     });
        // }
        // if (key === "init") {
        //     //向子域发送消息
        //     wx.getOpenDataContext().postMessage({
        //         init: param,
        //     });
        // }
    }
    /**
     * 设置微信存储
     */
    // public static SetWxInitCache(max_str: string) {
    //     if (WX.WX_Swtich) {
    //         console.log("最大关卡数：" + max_str);
    //         //设置用户托管数据
    //         wx.setUserCloudStorage({
    //             KVDataList: [{ key: 'tier', value: max_str }],
    //             success: res => {
    //                 console.log(res);
    //                 // console.log(res + "成功");
    //                 // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
    //                 let openDataContext = wx.getOpenDataContext();
    //                 openDataContext.postMessage({
    //                     init: "init",
    //                 });
    //             },
    //             fail: res => {
    //                 console.log(res);
    //             }
    //         });
    //     }
    // }
    /**
   * 设置微信存储
   */
    public static SetWxUpdateCache(max_str: string) {
        if (WX.WX_Swtich) {
            // console.log("最大关卡数：" + max_str);
            //设置用户托管数据
            wx.setUserCloudStorage({
                KVDataList: [{ key: 'tier', value: max_str }],
                success: res => {
                    // console.log(res);
                    // console.log(res + "成功");
                    // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                    let openDataContext = wx.getOpenDataContext();
                    openDataContext.postMessage({
                        update: "update",
                    });
                },
                fail: res => {
                    console.log(res);
                }
            });
        }
    }
}
