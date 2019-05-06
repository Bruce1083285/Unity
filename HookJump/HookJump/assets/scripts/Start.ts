import Role from "./common/Role";
import RoleShop from "./common/RoleShop";
import Share from "./common/Share";
import Rank from "./common/Rank";
import EventListenter from "./common/EventListenter";
import { EventType, CacheType, SoundType } from "./common/Enum";
import WX from "./common/WX";
import Cache from "./common/Cache";
import StartAudio from "./start/StartAudio";
import StartRed from "./start/StartRed";
import Http from "./common/Http";
import AdvList from "./start/AdvertisementList";
import Match from "./start/MatchPattern";
import HFExchange from "./start/HFExchange";
import FriendHelp from "./start/FriendHelp";
import PrizeHint from "./start/PrizeHint";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Start extends cc.Component {

    /**
     * @property 加载页
     */
    @property(cc.Node)
    private Page_Loading: cc.Node = null;
    /**
     * @property 角色商城页
     */
    private Page_RoleShop: cc.Node = null;
    /**
     * @property 规则页
     */
    private Page_Help: cc.Node = null;
    /**
     * @property 排行榜页
     */
    private Page_Rank: cc.Node = null;
    /**
     * @property 分享页
     */
    private Page_Share: cc.Node = null;
    /**
     * @property 红包页
     */
    private Page_Red: cc.Node = null;
    /**
     * @property 话费兑换页
     */
    private Page_HF: cc.Node = null;
    /**
     * @property 比赛页
     */
    private Page_Match: cc.Node = null;
    /**
     * @property 奖品领取页
     */
    private Page_Prize_Hint: cc.Node = null;
    /**
     * @property 新手指引
     */
    private NoviceGuide: cc.Node = null;
    /**
     * @property 按钮管理
     */
    private Buts: cc.Node = null;
    /**
     * @property 角色
     */
    public Role: Role = null;
    /**
     * @property 角色商城
     */
    public RoleShop: RoleShop = null;
    /**
     * @property BGM按钮
     */
    private But_Sound: cc.Node = null;
    /**
     * @property 首页音效
     */
    private Start_Audio: cc.Node = null;
    /**
     * @property 分享
     */
    public Share: Share = null;
    /**
     * @property 红包开关
     */
    private Red_Swtich: number = 0;
    /**
     * @property 排行榜
     */
    public Rank: Rank = null;
    /**
     * @property 获取时间戳
     */
    private Time: Date = null;
    /**
     * @property 分享ID
     */
    public Share_ID: any = null;

    onLoad() {
        // this.Start_Audio = this.node.getChildByName("Audio");
        // this.Start_Audio.getComponent(StartAudio).PlayBGM();
        // return
        // this.Init();

    }

    start() {
        // Http.sendRequest("https://xy.zcwx.com/userapi/hall/opendown", (data) => {
        //     console.log("加载时");
        //     console.log(data);
        //     if (data && data.status === 1) {
        //         this.Red_Swtich = parseInt(data.data);
        //     }
        // }, { id: 1 });
        this.Loading();
        this.Red_Swtich = 0;
        WX.Request();
        // let callbacks = (res) => {
        //     console.log(JSON.stringify(res) + "进入游戏数据");
        //     this.Share_ID = res.query.shareid;
        //     if (this.Share_ID) {
        //         console.log("share_id不为空");
        //         WX.Login(this.Share_ID);
        //     }
        // }
        // WX.OnShow(callbacks);
        let ob = WX.GetLaunchOptionsSync();
        console.log(JSON.stringify(ob) + "进入游戏数据");
        if (ob && ob.query && ob.query.shareid) {
            this.Share_ID = ob.query.shareid;
            // if (this.Share_ID) {
            //     console.log("share_id不为空");
            //     console.log(this.Share_ID);
            //     WX.Login(this.Share_ID);
            // }else{

            // }
        }
        this.Init();
    }

    // update (dt) {}

    /**
     * 初始化
     */
    private Init() {
        // if (!this.Share_ID) {
        //     console.log("share_id为空");

        // }
        // Cache.SetCache(CacheType.Coin, "0");
        // Cache.RemoveCache(CacheType.IsFirst);
        // Cache.RemoveCache(CacheType.Pur_Hook);

        this.BackGroundSwitch();
        WX.InitUserInfoButton();
        WX.RewardedVideoCreator();
        Cache.RemoveCache(CacheType.Current_Coin);
        // Cache.SetCache(CacheType.Level_Num, "1");
        this.Page_Rank = this.node.getChildByName("Page_Rank");
        // this.Page_RoleShop = this.node.getChildByName("Page_RoleShop");
        this.Page_Help = this.node.getChildByName("Page_Help");
        this.Page_Share = this.node.getChildByName("Page_Share");
        this.Page_Red = this.node.getChildByName("Page_Red");
        this.Buts = this.node.getChildByName("Buts");
        this.Role = this.node.getChildByName("Role").getComponent(Role);
        this.Share = this.Page_Share.getComponent(Share);
        this.Rank = this.Page_Rank.getComponent(Rank);
        this.Start_Audio = this.node.getChildByName("Audio");
        this.But_Sound = this.Buts.getChildByName("but_Sound");
        this.NoviceGuide = this.node.getChildByName("NoviceGuide");
        this.Page_Match = this.node.getChildByName("Page_Match");
        this.Page_HF = this.node.getChildByName("Page_HF");
        this.RoleShop = this.Page_HF.getChildByName("RoleShop").getComponent(RoleShop);
        this.Page_Prize_Hint = this.node.getChildByName("Prize_Hint");

        if (this.Red_Swtich === 1) {
            this.Buts.getChildByName("but_Red").active = true;
        } else {
            this.Buts.getChildByName("but_Red").active = false;
        }

        // Cache.RemoveCache(CacheType.IsFirst);
        let isfirst = Cache.GetCache(CacheType.IsFirst);
        if (!isfirst) {
            this.NoviceGuide.active = true;
            //初始皮肤
            Cache.SetCache(CacheType.Role_SkinId, "1");
            // let level_num = Cache.GetCache(CacheType.Level_Num);
            // if (level_num) {
            //     WX.SetWxUpdateCache(level_num);
            // } else {
            //     WX.SetWxUpdateCache(0 + "");
            // }

        } else {
            // this.node.getChildByName("OfflineRewards").active = true;
        }
        // Cache.SetCache(CacheType.Last_Receive_Time,"2019222")

        //初始化脚本
        this.Role.Init(3);
        // this.RoleShop.Init();
        // this.Share.Init();

        this.ButShowAction(this.Buts);

        WX.ShareButtonShow();
        WX.OnAudioInterruptionEnd();
        this.Page_Prize_Hint.getComponent(PrizeHint).Init();

        WX.Login(this.Share_ID);
        this.GetCache();

        //更新在线时长
        // this.schedule(this.UpdateTime, 2);

        //初始化子域
        // WX.PostMessage("init", "init");

        // this.Time = new Date();
        // let year = this.Time.getFullYear();
        // let month = this.Time.getMonth();
        // let day = this.Time.getDate();
        // let hours = this.Time.getHours();
        // let now_receive_time = "" + year + month + day;
        // let now_time = "" + year + month + day + hours;
        //缓存领取时间
        // Cache.SetCache(CacheType.Last_Receive_Time, now_receive_time);
        // Cache.SetCache(CacheType.Last_Time, now_time);
        // console.log("加载中");
    }


    /**
     * 切换后台
     */
    BackGroundSwitch() {
        // cc.game.on(cc.game.EVENT_HIDE, function () {
        //     console.log("游戏暂停");
        //     cc.audioEngine.pauseAll();
        // });
        // cc.game.on(cc.game.EVENT_SHOW, function () {
        //     cc.audioEngine.resumeAll();
        // });
        WX.OnHide(() => {
            this.PauseGame();
        });
        // let istrue = true;
        // let callbacks = () => {
        //     if (istrue) {
        //         console.log("回到游戏");
        //         istrue = true;
        //     }
        // }
        WX.OnShow(() => {
            this.ResumeGame();
        });
    }

    /**
     * 暂停游戏
     */
    PauseGame() {
        // console.log("游戏暂停");
        cc.audioEngine.pauseAll();
    }

    /**
     * 恢复游戏
     */
    ResumeGame() {
        // console.log("游戏恢复");
        cc.audioEngine.resumeAll();
    }

    /**
     * 预加载
     */
    Loading() {
        WX.BannerCreator("game");
        // WX.BannerShow();

        cc.loader.downloader.loadSubpackage('audio', function (err) {
            if (err) {
                console.log("分包加载失败");
                return console.error(err);
            }
            // console.log("分包加载成功");
            // console.log('load subpackage successfully.');
        });
        try {
            cc.director.preloadScene("Game", (res) => {
                // console.log(res + "进度条");
                this.Page_Loading.active = false;
            });
        } catch (error) {
            this.Page_Loading.active = false;
            return
        }
    }

    /**
     * 更新在线时长
     */
    UpdateTime() {
        // console.log("是否更新");
        Http.sendRequest("https://xy.zcwx.com/userapi/weixin/heart", (data) => {
            // console.log("更新在线时长——1");
            // console.log(data);

        }, { uid: WX.Uid });
    }

    /**
     * 获取缓存
     */
    GetCache() {

        // Cache.SetCache(CacheType.FragmentNum, "100");

        // this.Start_Audio.getComponent(StartAudio).PlayBGM();
        // return
        this.Start_Audio.getComponent(StartAudio).StopBGM();
        let bgm = Cache.GetCache(CacheType.BGM);
        // console.log('--------------------');
        if (bgm === "") {
            // console.log('111111111111111111');
            bgm = null;
        }
        if (!bgm || bgm === "true") {
            this.But_Sound.getChildByName("yinliang_open").active = true;
            this.But_Sound.getChildByName("yinliang_close").active = false;
            this.Start_Audio.getComponent(StartAudio).PlayBGM();
            // console.log('33333333333333333');
        } else {
            this.But_Sound.getChildByName("yinliang_open").active = false;
            this.But_Sound.getChildByName("yinliang_close").active = true;
            this.Start_Audio.getComponent(StartAudio).StopBGM();
            // console.log('222222222222222222');
        }
        // if (bgm === "false") {
        //     this.But_Sound.getChildByName("yinliang_open").active = false;
        //     this.But_Sound.getChildByName("yinliang_close").active = true;
        //     this.Start_Audio.getComponent(StartAudio).StopBGM();
        //     console.log('222222222222222222');
        // }
    }

    /**
     * 按钮显示
     * @param buts 按钮管理
     */
    private ButShowAction(buts: cc.Node) {
        buts.scale = 0.1;
        let show_action = cc.scaleTo(0.2, 1, 1);
        buts.runAction(show_action);
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        this.Start_Audio.getComponent(StartAudio).PlaySound(SoundType.Click);
        switch (click) {
            case "hf_open":
                this.Page_HF.getComponent(HFExchange).Init();
                break;
            case "match_open":
                WX.BannerHide();
                let callbacks = () => {
                    this.Page_Match.active = false;
                }
                WX.MatchUserInfoButton("match", callbacks);
                this.Page_Match.getComponent(Match).Init();
                break;
            case "rank_open":
                WX.BannerHide();
                // WX.GetAuthorization();
                // WX.InitUserInfoButton();
                let level_num = Cache.GetCache(CacheType.Level_Num);
                if (level_num) {
                    WX.SetWxUpdateCache(level_num);
                } else {
                    WX.SetWxUpdateCache(0 + "");
                }
                this.PageSwitch(this.Page_Rank, true);
                break;
            case "roleshop_open":
                WX.BannerHide();
                this.Page_RoleShop.getComponent(RoleShop).UpdateCoin();
                this.PageSwitch(this.Page_RoleShop, true);
                break;
            case "help_open":
                WX.BannerHide();
                this.PageSwitch(this.Page_Help, true);
                break;
            case "share_open":
                // this.PageSwitch(this.Page_Share, true);
                this.Page_Share.getComponent(FriendHelp).Init();
                break;
            case "sound_yes":
                this.PlayBGM();
                break;
            case "sound_no":
                this.StopBGM();
                break;
            case "red_open":
                // this.Page_Red.active = true;
                this.Page_Red.getComponent(StartRed).Init();
                break;
            case "start":
                WX.OffAudioInterruptionEnd();
                WX.OffShow();
                WX.OffHide();
                WX.BannerHide();
                // this.unschedule(this.UpdateTime);
                // Cache.SetCache(CacheType.GameMode, "game");
                cc.director.loadScene("Game");
                break;
            default:
                break;
        }
    }

    /**
     * 页面显示
     * @param show_node 
     * @param isShow 
     */
    private PageSwitch(show_node: cc.Node, isShow: boolean) {
        show_node.active = isShow;
    }

    /**
     * 播放背景音乐
     */
    private PlayBGM() {
        this.But_Sound.getChildByName("yinliang_open").active = true;
        this.But_Sound.getChildByName("yinliang_close").active = false;
        this.Start_Audio.getComponent(StartAudio).PlayBGM();
        this.Start_Audio.getComponent(StartAudio).SetAudioSwitch(true);
        Cache.SetCache(CacheType.BGM, "true");
    }

    /**
     * 停止播放背景音乐
     */
    private StopBGM() {
        this.But_Sound.getChildByName("yinliang_open").active = false;
        this.But_Sound.getChildByName("yinliang_close").active = true;
        this.Start_Audio.getComponent(StartAudio).StopBGM();
        this.Start_Audio.getComponent(StartAudio).SetAudioSwitch(false);
        Cache.SetCache(CacheType.BGM, "false");
    }
}
