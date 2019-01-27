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
export default class PlayerWolf extends Player {

    // constructor() {
    //     super();
    //     //获取脚本管理器
    //     this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
    // }
    SelectTargetPos(self_node: cc.Node, target_node: cc.Node): boolean {
        //获取脚本管理器
        this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
        //获取自身Y轴
        let self_y = this.ScriptManage.GameManage.GetChessboardPos_y(self_node);
        //获取自身X轴
        let self_x = this.ScriptManage.GameManage.Chessboard_Array[self_y].indexOf(self_node);
        //获取目标Y轴
        let target_y = this.ScriptManage.GameManage.GetChessboardPos_y(target_node);
        //获取目标X轴
        let target_x = this.ScriptManage.GameManage.Chessboard_Array[target_y].indexOf(target_node);
        if (target_node.name === "grid") {
            //是否可以移动
            return this.IsMove(self_node, target_node, self_x, self_y, target_x, target_y);
        }
        if (target_node.name === "yp") {
            //是否可以攻击
            return this.IsAttack(self_node, target_node, self_x, self_y, target_x, target_y);
        }
        return false;
    }
    IsAttack(self_node: cc.Node, target_node: cc.Node, self_x: number, self_y: number, target_x: number, target_y: number): boolean {
        //垂直查找
        if (self_x === target_x) {
            //向上
            //向上一格
            if (self_y + 1 < this.ScriptManage.GameManage.Line) {
                let UpOneName = this.ScriptManage.GameManage.Chessboard_Array[self_y + 1][self_x].name;//????????????????????????????????????????????
                if (UpOneName === "grid" && self_y + 2 === target_y) {
                    //移动
                    this.SlefMove(self_node, target_node, self_x, self_y, target_x, target_y);
                    return true;
                }
            }
            //向下
            //向下一格
            if (self_y - 1 >= 0) {
                let DownOneName = this.ScriptManage.GameManage.Chessboard_Array[self_y - 1][self_x].name;
                if (DownOneName === "grid" && self_y - 2 === target_y) {
                    //移动
                    this.SlefMove(self_node, target_node, self_x, self_y, target_x, target_y);
                    return true;
                }
            }
        }
        //水平查找
        if (self_y === target_y) {
            //向右
            //向右一格
            if (self_x + 1 < this.ScriptManage.GameManage.Row) {
                let RightOneName = this.ScriptManage.GameManage.Chessboard_Array[self_y][self_x + 1].name;
                if (RightOneName === "grid" && self_x + 2 === target_x) {
                    //移动
                    this.SlefMove(self_node, target_node, self_x, self_y, target_x, target_y);
                    return true;
                }
            }
            //向左
            //向左一格
            if (self_x - 1 >= 0) {
                let LeftOneName = this.ScriptManage.GameManage.Chessboard_Array[self_y][self_x - 1].name;
                if (LeftOneName === "grid" && self_x - 2 === target_x) {
                    //移动
                    this.SlefMove(self_node, target_node, self_x, self_y, target_x, target_y);
                    return true;
                }
            }
        }
        return false;
    }
    // update (dt) {}
}
