import Game from "../frame/GameScript";
import AI from "../frame/AIScript";
import Player from "../frame/PlayerScript";
import EventManage from "./EventManageScript";
import Desktop from "../frame/DesktopScript";
import RuleJudge from "../frame/RuleJudgeScript";
import AI_1 from "../ai/AI_1Script";
import AI_2 from "../ai/AI_2Script";
import Card from "../frame/CardScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * @class 脚本管理器
 * @mod 单例模式
 */
export default class ScriptManage {

    // LIFE-CYCLE CALLBACKS:
    //自身
    private static SelfManage: ScriptManage = null;
    //游戏场景管理器
    public GameManage: Game = null;
    //桌面管理器
    public DesktopManage: Desktop = null;
    //规则判定管理器
    public RuleJudgeManage: RuleJudge = null;
    //事件管理器
    public EventManage: EventManage = null;
    // //卡牌管理器
    // public CardManage: Card = null;
    //玩家管理器
    public PlayerManage: Player = null;
    //AI_1
    public AI_1: AI = null;
    //AI_2
    public AI_2: AI = null;
    //私有化构造函数
    private constructor() {

    }
    //初始化
    Init() {
        //获取游戏场景脚本
        this.GameManage = cc.find("Game").getComponent(Game);
        //获取桌面管理器
        this.DesktopManage = cc.find("Canvas/Desktop").getComponent(Desktop);
        //获取规则判定脚本
        this.RuleJudgeManage = new RuleJudge(ScriptManage.SelfManage);
        //获取事件脚本
        this.EventManage = new EventManage(ScriptManage.SelfManage);
        // //获取卡牌脚本
        // this.CardManage = new Card();
        //获取玩家脚本
        this.PlayerManage = new Player(ScriptManage.SelfManage);
        // //获取AI脚本
        // this.AIManage = new AI();
        //获取AI_1脚本
        this.AI_1 = new AI_1(ScriptManage.SelfManage);
        //获取AI_2脚本
        this.AI_2 = new AI_2(ScriptManage.SelfManage);
    }
    /**
     * 对外提供访问点
     */
    public static GetScriptManage(): ScriptManage {
        if (!ScriptManage.SelfManage) {
            ScriptManage.SelfManage = new ScriptManage();
        }
        this.SelfManage.Init();
        return this.SelfManage;
    }
}
