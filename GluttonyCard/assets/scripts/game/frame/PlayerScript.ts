import ScriptManage from "../common/ScriptManageScript";
import Card from "./CardScript";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export default class Player {

    //----------------属性
    //脚本管理器
    private ScriptManage: ScriptManage = null;
    //构造函数
    constructor(scriptmanage: ScriptManage) {
        //获取脚本管理器
        this.ScriptManage = scriptmanage;
    }
    //出牌
    Play(card: cc.Node) {
        //获取出牌点
        let play_point = card.parent.parent.getChildByName("play_point");
        //世界坐标
        let wold_pos = card.parent.parent.convertToWorldSpaceAR(play_point.position);
        //本地坐标
        let node_pos = card.parent.convertToNodeSpaceAR(wold_pos);
        //卡牌移动
        card.runAction(cc.sequence(cc.moveTo(0.3, node_pos), cc.callFunc(() => {
            //从父节点中移除自身
            card.removeFromParent(false);
            play_point.addChild(card);
            card.setPosition(0, 0);
            //卡牌状态修改为不可用
            card.getComponent(Card).IsUse = false;

        })));
        //出牌区域卡牌添加
        this.ScriptManage.GameManage.Player_Play_Area.push(card);
        //卡牌下标索引
        let ind = this.ScriptManage.GameManage.Player_1_Cards_Array.indexOf(card);
        //从手牌中移除
        this.ScriptManage.GameManage.Player_1_Cards_Array.splice(ind, 1);
    }
}
