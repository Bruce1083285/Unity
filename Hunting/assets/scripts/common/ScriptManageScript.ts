import Chessboard from "../ChessboardSciprt";
import Player from "../PlayerScript";
import EventManage from "./EventManageScript";
import Game from "../GameScript";
import AI from "../AIScript";
import WolfAI from "../ais/AIWolfScript";
import SheepAI from "../ais/AISheepScript";
import PlayerWolf from "../players/PlayerWolfScript";
import PlayerSheep from "../players/PlayerSheepScript";
import Result from "../ResultScript";
import Audio from "../AudioScript";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScriptManage extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    //游戏管理
    public GameManage: Game = null;
    //棋盘管理
    public ChessboardManage: Chessboard = null;
    //玩家管理
    public PlayerMange: Player = null;
    //事件管理
    public EventManage: EventManage = null;
    //结果判定管理
    public ResultManage: Result = null;
    //狼牌AI管理
    public Wolf_AI: AI = null;
    //羊牌AI管理
    public Sheep_AI: AI = null;
    //狼牌玩家管理
    public Wolf_Player: Player = null;
    //羊牌玩家管理
    public Sheep_Player: Player = null;
    //音效管理
    public MusicManage: Audio = null;
    onLoad() {
        //获取游戏脚本
        this.GameManage = cc.find("Game").getComponent(Game);
        //获取棋盘脚本
        this.ChessboardManage = cc.find("Canvas/Chessboard/chessboard").getComponent(Chessboard);
        //获取事件脚本
        this.EventManage = new EventManage();
        //获取结果判定
        this.ResultManage = new Result();
        //获取音效管理
        this.MusicManage = cc.find("Audio").getComponent(Audio);
        //_______________________AI
        //实例化狼牌AI
        this.Wolf_AI = new WolfAI();
        //实例化羊牌AI
        this.Sheep_AI = new SheepAI();
        //_______________________玩家
        //实例化狼牌玩家
        this.Wolf_Player = new PlayerWolf();
        //实例化羊牌玩家
        this.Sheep_Player = new PlayerSheep();
    }

    start() {

    }
    // update (dt) {}
}