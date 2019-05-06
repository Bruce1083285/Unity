import Game from "../Game";
import Cache from "../common/Cache";
import { CacheType, SoundType } from "../common/Enum";
import GameAudio from "./GameAudio";
import BeginTime from "./BeginTime";
import OverTime from "./OverTime";
import WX from "../common/WX";
import Http from "../common/Http";

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
export default class Level extends cc.Component {


    /**
     * @property 选择框
     */
    private Selection_Box: cc.Node = null;
    /**
     * @property 关闭按钮
     */
    private But_Close: cc.Node = null;
    /**
     * @property 角色
     */
    private Game: Game = null;
    /**
     * @property [Array]关卡
     */
    private Levels: cc.Node[] = [];

    onLoad() {

    }

    start() {
        // this.Init();
    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Selection_Box = this.node.getChildByName("pageview");
        this.But_Close = this.node.getChildByName("but_Back");
        this.Game = cc.find("Canvas").getComponent(Game);


        let isfirst = Cache.GetCache(CacheType.IsFirst);
        if (isfirst) {
            this.PageShow(0.2, this.Selection_Box, this.But_Close);
        }
        this.Levels = this.GetLevels(this.Selection_Box);
        this.GetCache(this.Levels);
        //更新在线时长
        // this.schedule(this.UpdateTime, 2);
    }

    /**
     * 更新在线时长
     */
    UpdateTime() {
        // console.log("是否更新");
        Http.sendRequest("https://xy.zcwx.com/userapi/weixin/heart", (data) => {
            // console.log("更新在线时长——2");
            // console.log(data);
        }, { uid: WX.Uid });
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Click);
        if (click === "back") {
            WX.OffShow();
            WX.OffHide();
            // WX.BannerHide();
            // this.unschedule(this.UpdateTime);
            cc.director.loadScene("Start");
            return;
        }
        let islock = this.GetLockState(this.Levels, click);
        if (!islock) {
            cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
            let level_num = parseInt(click);
            this.node.active = false;
            let level = Cache.GetCache(CacheType.Level_Num);
            if (level) {
                let num = parseInt(level);
                if (level_num > num) {
                    Cache.SetCache(CacheType.Level_Num, click);
                }
            } else {
                Cache.SetCache(CacheType.Level_Num, click);
            }
            // cc.find("Canvas/BeginTime").getComponent(BeginTime).Play();
            this.SetGameDifficulty(level_num, this.Game);
        }
    }

    /**
     * 获取缓存
     * @param levels [Array]关卡
     */
    private GetCache(levels: cc.Node[]) {
        let level_num = Cache.GetCache(CacheType.Level_Num);
        if (level_num) {
            for (let i = 0; i < levels.length; i++) {
                let num_1 = parseInt(level_num);
                let num_2 = parseInt(levels[i].name);
                if (num_2 <= num_1) {
                    levels[i].getChildByName("lock").active = false;
                }
            }
        } else {
            for (let i = 0; i < levels.length; i++) {
                if (levels[i].name === "1") {
                    levels[i].getChildByName("lock").active = false;
                    return;
                }
            }
        }
    }

    /**
     * 获取锁的状态
     * @param levels [Array]关卡
     * @param level_num 关卡数
     */
    private GetLockState(levels: cc.Node[], level_num: string): boolean {
        for (let i = 0; i < levels.length; i++) {
            if (levels[i].name === level_num) {
                let islock = levels[i].getChildByName("lock").active;
                return islock
            }
        }
    }

    /**
     * 设置游戏难度
     * @param level_num 关卡数
     * @param game 游戏类
     */
    private SetGameDifficulty(level_num: number, game: Game) {
        //获取皮肤ID缓存
        let skin_id = Cache.GetCache(CacheType.Role_SkinId);
        // console.log("角色皮肤：" + skin_id);
        game.SetNowRoleID(skin_id);
        game.GameInit(level_num);
    }

    /**
     * 获取关卡
     * @param selection_box 选择框
     * @returns [Array]关卡
     */
    private GetLevels(selection_box: cc.Node): cc.Node[] {
        let page_1_arr = selection_box.getChildByName("view").getChildByName("content").getChildByName("page_1").children;
        let page_2_arr = selection_box.getChildByName("view").getChildByName("content").getChildByName("page_2").children;
        let patch_arr = [];
        for (let i = 0; i < page_1_arr.length; i++) {
            patch_arr.push(page_1_arr[i]);
        }
        for (let i = 0; i < page_2_arr.length; i++) {
            patch_arr.push(page_2_arr[i]);
        }
        return patch_arr;
    }

    /**
     * 页面显示
     * @param dt 持续时间
     * @param selection_box 关卡选择框
     * @param but_close 关闭按钮
     */
    private PageShow(dt: number, selection_box: cc.Node, but_close: cc.Node) {
        selection_box.scale = 0.1;
        but_close.scale = 0.1;
        let selection_act = cc.scaleTo(dt, 1, 1)
        let but_act = cc.scaleTo(dt, 1, 1)
        selection_box.runAction(selection_act);
        but_close.runAction(but_act);
    }
}
