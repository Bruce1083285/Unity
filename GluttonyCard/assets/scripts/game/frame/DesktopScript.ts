import ScriptManage from "../common/ScriptManageScript";
import Card from "./CardScript";
//导入花色
import { PosTag, SoundType } from "../common/EnumManageScript";

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
export default class Desktop extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    //脚本管理器
    private ScriptManage: ScriptManage = null;
    //卡牌对象池
    public Card_Pool: cc.NodePool = null;
    //卡牌花色点数记录
    private Card_Record: string[] = [];
    //牌堆数组
    public Cards_Pile_Array: cc.Node[] = [];
    //公共区域数组
    public Cards_Common_Array: cc.Node[] = [];
    // onLoad () {}

    start() {
        //获取脚本管理器脚本
        this.ScriptManage = ScriptManage.GetScriptManage();
        //初始化
        this.Init();
    }
    /**
     * 初始化
     */
    Init() {
        //实例化对象池
        this.Card_Pool = new cc.NodePool();
        //初始化卡牌对象池获取
        this.GetCardPool();
        //初始化牌堆
        this.SetCards();
        //初始化公共区域发牌
        this.CommonDeal();
        //玩家区域发牌
        this.PlayerAreaDeal();
        //计算玩家分数
        this.ScriptManage.RuleJudgeManage.ComputePlayerScore(this.ScriptManage.GameManage.Player_1_Cards_Array);
    }
    /**
     * 获取卡牌对象池
     */
    GetCardPool() {
        for (let i = 0; i < this.ScriptManage.GameManage.Cards_Sum; i++) {
            //实例化预制体
            let card = cc.instantiate(this.ScriptManage.GameManage.Card);
            //随机点数
            let ran_count = Math.floor(Math.random() * this.ScriptManage.GameManage.Count_Num);
            //随机花色种类
            let ran_suit = Math.floor(Math.random() * this.ScriptManage.GameManage.Suit_Num);
            //初始化卡牌
            card.getComponent(Card).InitCard(false, ran_count, ran_suit);
            //获取点数
            let count = card.getChildByName("front").getChildByName("count").getComponent(cc.Sprite).spriteFrame.name;
            //获取花色
            let suit = card.getChildByName("front").getChildByName("suit").getChildByName("top_suit").getComponent(cc.Sprite).spriteFrame.name;
            //判断重复
            let ind = this.Card_Record.indexOf(count + suit);
            if (ind === -1) {
                //记录卡牌信息
                this.Card_Record.push(count + suit);
                //注册触摸事件
                this.ScriptManage.EventManage.TouchOn(card);
                //放入对象池
                this.Card_Pool.put(card);
            } else {
                //销毁节点
                card.destroy();
                //重复此次循环
                i--;
            }
        }
        //清除记录
        this.Card_Record = [];
    }
    /**
     * 设置卡牌
     */
    SetCards() {
        for (let i = 0; i < this.ScriptManage.GameManage.Cards_Pile_Num; i++) {
            //对象池获取卡牌
            let card = this.Card_Pool.get();
            this.ScriptManage.GameManage.Cards_Pile.addChild(card);
            //设置卡牌位置
            card.setPosition(0, 0);
            //设置标签
            card.tag = PosTag.Pile;
            //放入牌堆数组
            this.Cards_Pile_Array.push(card);
        }
    }
    /**
     * 公共区域发牌
     */
    CommonDeal() {
        //发牌音效
        this.ScriptManage.GameManage.SoundShow(SoundType.Deal_Audio);
        if (this.Cards_Pile_Array.length > 0) {
            this.Cards_Common_Array = this.Cards_Pile_Array.splice(0, this.ScriptManage.GameManage.Common_Num);
            for (let i = 0; i < this.Cards_Common_Array.length; i++) {
                this.Cards_Common_Array[i].removeFromParent(false);
                this.ScriptManage.GameManage.Cards_Common.addChild(this.Cards_Common_Array[i]);
                this.Cards_Common_Array[i].getChildByName("back").active = false;
                //移动卡牌
                this.Cards_Common_Array[i].runAction(cc.moveTo(0.3, cc.v2(30 * i, 0)));
            }
            //初始化更新牌堆中卡牌数
            this.UpdateCardsPileNum();
        }
    }
    /**
     * 玩家区域发牌
     */
    PlayerAreaDeal() {
        //玩家1
        for (let i = 0; i < this.ScriptManage.GameManage.Player_Cards_Num; i++) {
            //对象池获取卡牌
            let card = this.Card_Pool.get();
            this.ScriptManage.GameManage.Player_1.getChildByName("Card_Area").addChild(card);
            card.setPosition(i * 30, 0);
            //设置标签
            card.tag = PosTag.Plyaer_1;
            //初始化卡牌为可用状态
            card.getComponent(Card).InitCard(true);
            //玩家1手牌数组
            this.ScriptManage.GameManage.Player_1_Cards_Array.push(card);
        }
        //玩家2——AI
        for (let i = 0; i < this.ScriptManage.GameManage.Player_Cards_Num; i++) {
            let card = this.Card_Pool.get();
            this.ScriptManage.GameManage.Player_2.getChildByName("Card_Area").addChild(card);
            card.setPosition(i * 10, 0);
            //设置标签
            card.tag = PosTag.Plyaer_2;
            //玩家2手牌数组
            this.ScriptManage.GameManage.Player_2_Cards_Array.push(card);
        }
        //玩家3——AI
        for (let i = 0; i < this.ScriptManage.GameManage.Player_Cards_Num; i++) {
            let card = this.Card_Pool.get();
            this.ScriptManage.GameManage.Player_3.getChildByName("Card_Area").addChild(card);
            card.setPosition(i * 10, 0);
            //设置标签
            card.tag = PosTag.Plyaer_3;
            //玩家2手牌数组
            this.ScriptManage.GameManage.Player_3_Cards_Array.push(card);
        }
    }
    /**
     * 卡牌回收
     */
    CardRecycle() {
        //公共区域卡牌回收
        for (let i = 0; i < this.Cards_Common_Array.length; i++) {
            //对象池回收卡牌
            this.Card_Pool.put(this.Cards_Common_Array[i]);
            this.Cards_Common_Array[i].removeFromParent();
        }
        //清空公共区域数组
        this.Cards_Common_Array = [];
        //玩家发牌区域卡牌回收
        for (let i = 0; i < this.ScriptManage.GameManage.Player_Play_Area.length; i++) {
            //对象池回收卡牌
            this.Card_Pool.put(this.ScriptManage.GameManage.Player_Play_Area[i]);
            this.ScriptManage.GameManage.Player_Play_Area[i].removeFromParent();
        }
        //清空玩家出牌区域数组
        this.ScriptManage.GameManage.Player_Play_Area = [];
    }
    /**
     * 更新牌堆中卡牌数
     */
    UpdateCardsPileNum() {
        //牌堆中卡牌数赋值
        this.ScriptManage.GameManage.Cards_Pile_Record.string = this.Cards_Pile_Array.length + "";
    }
    // update (dt) {}
}
