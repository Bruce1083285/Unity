import Player from "../PlayerScript";
import ScriptManage from "../common/ScriptManageScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// const { ccclass, property } = cc._decorator;

// @ccclass
export default class PlayerSheep extends Player {

    // constructor() {
    //     super();
    //     //获取脚本管理器
    //     this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
    // }
    SelectTargetPos(self_node: cc.Node, target_node: cc.Node) {
        this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
        if (target_node.name === "grid") {
            //获取自身Y轴
            let self_y = this.ScriptManage.GameManage.GetChessboardPos_y(self_node);
            //获取自身X轴
            let self_x = this.ScriptManage.GameManage.Chessboard_Array[self_y].indexOf(self_node);
            //获取目标Y轴
            let target_y = this.ScriptManage.GameManage.GetChessboardPos_y(target_node);
            //获取目标X轴
            let target_x = this.ScriptManage.GameManage.Chessboard_Array[target_y].indexOf(target_node);
            //是否可以移动
            return this.IsMove(self_node, target_node, self_x, self_y, target_x, target_y);
        }
        return false;
    }
    // update (dt) {}
}
