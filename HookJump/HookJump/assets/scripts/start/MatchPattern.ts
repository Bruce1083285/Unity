import Cache from "../common/Cache";
import { CacheType, SoundType } from "../common/Enum";
import MatchRank from "./match/MatchRank";
import WX from "../common/WX";
import StartAudio from "./StartAudio";
import Http from "../common/Http";
import GameAudio from "../game/GameAudio";
import Start from "../Start";

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
export default class Match extends cc.Component {

    /**
     * @property 排行榜页
     */
    private Page_Rank: cc.Node = null;
    /**
     * @property 开始页
     */
    private Page_Start: cc.Node = null;
    /**
     * @property 参赛人数
     */
    private Participants_Num: cc.Label = null;
    /**
     * @property 点击开关
     */
    private Click_Switch: boolean = true;


    onLoad() {
        // this.Init();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Page_Rank = this.node.getChildByName("Page_Rank");
        this.Page_Start = this.node.getChildByName("Page_Start");

        this.node.active = true;
        this.Page_Start.active = true;

        this.GetHttp();
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        cc.winSize.width
        cc.find("Canvas/Audio").getComponent(StartAudio).PlaySound(SoundType.Click);
        if (this.Click_Switch) {
            switch (click) {
                case "signup":
                    this.Click_Switch = false;
                    cc.audioEngine.pauseAll();
                    if (WX.IsPlay) {
                        // Cache.SetCache(CacheType.GameMode, "match");
                        let callback_yes = () => {
                            // WX.Login(null)
                            let start = this.node.parent.getComponent(Start);
                            WX.GetUserInfo(WX.Open_id, start.Share_ID, true);
                            cc.director.loadScene("Game");
                            cc.audioEngine.resumeAll();
                        }
                        let callback_no = () => {
                            this.Click_Switch = true;
                            cc.audioEngine.resumeAll();
                        }
                        WX.RewardedVideoClose(callback_yes, callback_no);
                    } else {
                        let istrue = true;
                        let callfunc_yes = () => {
                            // if (istrue) {
                            cc.director.loadScene("Game");
                            // istrue = false;
                            // }
                        }
                        let callback_no = () => {
                            this.Click_Switch = true;
                        }
                        WX.Share(callfunc_yes, callback_no);
                        // WX.OnShow(callfunc);
                    }
                    break;
                case "close":
                    this.node.active = false;
                    WX.BannerCreator("game");
                    break;
                case "rank_open":
                    this.Page_Start.active = false;
                    this.Page_Rank.getComponent(MatchRank).Init();
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * 获取后台数据
     * 
     */
    private GetHttp() {
        Http.sendRequest("https://xy.zcwx.com/userapi/hall/count", (data) => {
            // console.log("获取参赛人数数据");
            // console.log(data);
            if (data === null) {
                return;
            }
            if (data.data === null) {
                // console.log("获取参赛人数数据return");
                return;
            }
            this.Participants_Num = this.node.getChildByName("Page_Start").getChildByName("title_label").getComponent(cc.Label);
            this.Participants_Num.string = "已有" + data.data + "人参加比赛";
        });
    }
}
