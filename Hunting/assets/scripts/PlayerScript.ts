import ScriptManage from "./common/ScriptManageScript";


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
export default class Player extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    protected ScriptManage: ScriptManage = null;
    //构造函数
    // constructor() {
    //     //this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
    // }
    //查询目标位置
    SelectTargetPos(self_node: cc.Node, target_node: cc.Node): boolean { return }
    //是否移动
    IsMove(self_node: cc.Node, target_node: cc.Node, self_x: number, self_y: number, target_x: number, target_y: number): boolean {
        //垂直查找
        if (self_x === target_x) {
            //向上
            if (self_y + 1 === target_y) {
                //移动
                this.SlefMove(self_node, target_node, self_x, self_y, target_x, target_y);
                return true;
            }
            //向下
            if (self_y - 1 === target_y) {
                //移动
                this.SlefMove(self_node, target_node, self_x, self_y, target_x, target_y);
                return true;
            }
        }
        //水平查找
        if (self_y === target_y) {
            //向右
            if (self_x + 1 === target_x) {
                //移动
                this.SlefMove(self_node, target_node, self_x, self_y, target_x, target_y);
                return true;
            }
            //向左
            if (self_x - 1 === target_x) {
                //移动
                this.SlefMove(self_node, target_node, self_x, self_y, target_x, target_y);
                return true;
            }
        }
        return false;
    }
    //移动
    SlefMove(self_node: cc.Node, target_node: cc.Node, self_x: number, self_y: number, target_x: number, target_y: number) {
        //播放移动音效
        cc.audioEngine.play(this.ScriptManage.MusicManage.Move_Audio, false, 1);
        //记录玩家移动前位置
        this.ScriptManage.GameManage.Undo_Player_Pos = self_node.position
        //记录玩家节点
        this.ScriptManage.GameManage.Undo_Player_Node = self_node;
        //记录被玩家回收节点
        this.ScriptManage.GameManage.Undo_Player_Rec_Node = this.ScriptManage.GameManage.Chessboard_Array[target_y][target_x];
        //对象池获取格子
        let grid = this.ScriptManage.ChessboardManage.Grid_Pool.get();
        this.ScriptManage.GameManage.Chessboard.addChild(grid);
        grid.setPosition(self_node.position);
        //将格子放入数组
        this.ScriptManage.GameManage.Chessboard_Array[self_y].splice(self_x, 1, grid);
        self_node.setPosition(this.ScriptManage.GameManage.Chessboard_Array[target_y][target_x].position);
        //回收格子
        if (target_node.name === "grid") {
            this.ScriptManage.ChessboardManage.Grid_Pool.put(this.ScriptManage.GameManage.Chessboard_Array[target_y][target_x]);
        }
        //回收羊牌
        if (target_node.name === "yp") {
            //播放吃的音效
            cc.audioEngine.play(this.ScriptManage.MusicManage.Eat_Audio, false, 1);
            //获取光效
            let light = this.ScriptManage.ChessboardManage.Lighting_Pool.get();
            this.ScriptManage.GameManage.Chessboard.addChild(light);
            light.setPosition(this.ScriptManage.GameManage.Chessboard_Array[target_y][target_x].position);
            //获取长度
            let patch_length = this.ScriptManage.GameManage.Chessboard.children;
            //设置渲染顺序
            light.setSiblingIndex(patch_length.length);
            light.runAction(cc.moveTo(1, this.ScriptManage.GameManage.Mouth.position));
            //延时执行
            this.scheduleOnce(function () {
                this.ScriptManage.ChessboardManage.Lighting_Pool.put(light);
            }, 1);
            //移除羊牌数组中对应羊牌
            let ind = this.ScriptManage.GameManage.AI_Sheep_Array.indexOf(target_node);
            this.ScriptManage.GameManage.AI_Sheep_Array.splice(ind, 1);
            //对象池回收羊牌
            this.ScriptManage.ChessboardManage.Sheep_Pool.put(this.ScriptManage.GameManage.Chessboard_Array[target_y][target_x]);
        }
        //将自身放入数组
        this.ScriptManage.GameManage.Chessboard_Array[target_y].splice(target_x, 1, self_node);
    }
    // update (dt) {}
}
