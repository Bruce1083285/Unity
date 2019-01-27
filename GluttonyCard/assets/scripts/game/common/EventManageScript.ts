import Card from "../frame/CardScript";
import ScriptManage from "./ScriptManageScript";
//导入枚举
import { PlayerNo, SoundType } from "../common/EnumManageScript"

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class EventManage {
    //----------------属性
    //脚本管理器
    private ScriptManage: ScriptManage = null;
    //是否可以点击
    public IsClick: boolean = true;
    //触摸次数
    private Touch_Num: number = 0;
    //第一次点击节点记录
    private First_Node: cc.Node = null;

    //构造函数
    constructor(scriptmanage: ScriptManage) {
        //获取管理器脚本
        this.ScriptManage = scriptmanage;
    }
    //触摸事件注册
    TouchOn(target: cc.Node) {
        target.on(cc.Node.EventType.TOUCH_START, this.TouchBegin, this);
    }
    //触摸开始
    TouchBegin(event) {
        //获取卡牌使用状态
        let isuse = event.target.getComponent(Card).IsUse;
        if (isuse && this.ScriptManage.GameManage.Game_State === PlayerNo.Plyaer_1) {
            //出牌音效
            this.ScriptManage.GameManage.SoundShow(SoundType.Play_Audio);
            //第一次点击
            if (this.Touch_Num === 0) {
                //存储第一次点击节点
                this.First_Node = event.target;
                //目标节点上移
                this.UpTargetMove(event.target);
            }
            this.Touch_Num++;
            //第二次点击
            if (this.Touch_Num >= 2) {
                //判断距离
                let dis = cc.pDistance(this.First_Node.position, event.target.position);
                if (Math.abs(dis) <= 1) {
                    this.ScriptManage.GameManage.Game_State = PlayerNo.Plyaer_2
                    //玩家出牌
                    this.ScriptManage.PlayerManage.Play(event.target);
                    //清空第一次点击节点记录
                    this.First_Node = null;
                    //重置触摸点击次数
                    this.Touch_Num = 0;
                    //关闭点击
                    this.IsClick = false;
                    //游戏回合控制
                    this.ScriptManage.GameManage.GameRoundControl(PlayerNo.Plyaer_2);
                } else {
                    //目标节点下移
                    this.DownTargetMove(this.First_Node);
                    //清空第一次点击节点记录
                    this.First_Node = null;
                    //重置触摸点击次数
                    this.Touch_Num = 0;
                }
            }
        }
    }
    //目标节点上移
    UpTargetMove(target: cc.Node) {
        target.runAction(cc.moveTo(0.1, cc.v2(target.position.x, 20)));
    }
    //目标节点下移
    DownTargetMove(target: cc.Node) {
        target.runAction(cc.moveTo(0.1, cc.v2(target.position.x, 0)));
    }
    // update (dt) {}
}
