import AI from "../AIScript";
//导入脚本管理器
import ScriptManage from "../common/ScriptManageScript";
//导入目标名字
import { Target_Name, Cmap } from "../common/EnumManageScript";

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
export default class WolfAI extends AI {

    // LIFE-CYCLE CALLBACKS:
    // // onLoad () {}
    // start() {

    // }
    // constructor() {
    //     super();
    //     this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
    // }
    //查找自身二维坐标
    SelectSelfPos(self_Array: cc.Node[], target_Array: cc.Node[]): void {
        this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
        this.Ran_Array = [];
        //获取随机数
        this.ran = this.getRandomPoint(self_Array.length);
        //是否上锁
        let islock = self_Array[this.ran].getChildByName("suo").active;
        if (islock) {
            //是否进行胜负判断？？？
            this.ran = (self_Array.length - 1) - this.ran;
            islock = self_Array[this.ran].getChildByName("suo").active;
            if (islock) {
                return;
            }
        }
        //获取Y轴
        this.start_y = this.ScriptManage.GameManage.GetChessboardPos_y(self_Array[this.ran]);
        //获取X轴
        this.start_x = this.ScriptManage.GameManage.Chessboard_Array[this.start_y].indexOf(self_Array[this.ran]);
        //危险查找
        let dan = this.DangerSelect(self_Array[this.ran], this.start_x, this.start_y);
        if (dan) {
            return
        }
        //查找自身3格以内是否可移动
        this.SelectSelfThreeGridIsMove(self_Array[this.ran], target_Array, this.start_x, this.start_y);
    }
    //危险查找
    DangerSelect(self_node: cc.Node, start_x: number, start_y: number): boolean {
        //向上两格查找
        if (start_y + 2 < this.ScriptManage.GameManage.Line) {
            //向上两格
            let UpTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y + 2][start_x].name;
            //向上一格
            let UpOneName = this.ScriptManage.GameManage.Chessboard_Array[start_y + 1][start_x].name;
            if (UpTwoName === "yp" && UpOneName === "grid") {
                //目标点是否可移动
                let ismove = this.TargetIsMove(start_x, start_y + 2);
                if (ismove) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x, start_y + 2, Target_Name.sheep_card);
                    return true;
                }
            }
        }
        //向下两格查找
        if (start_y - 2 >= 0) {
            //向下两格
            let DownTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y - 2][start_x].name;
            //向下一格
            let DownOneName = this.ScriptManage.GameManage.Chessboard_Array[start_y - 1][start_x].name;
            if (DownTwoName === "yp" && DownOneName === "grid") {
                //目标点是否可移动
                let ismove = this.TargetIsMove(start_x, start_y - 2);
                if (ismove) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x, start_y - 2, Target_Name.sheep_card);
                    return true;
                }
            }
        }
        //向右两格查找
        if (start_x + 2 < this.ScriptManage.GameManage.Row) {
            //向右两格
            let RightTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 2].name;
            //向右一格
            let RightOneName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 1].name;
            if (RightTwoName === "yp" && RightOneName === "grid") {
                //目标点是否可移动
                let ismove = this.TargetIsMove(start_x + 2, start_y);
                if (ismove) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x + 2, start_y, Target_Name.sheep_card);
                    return true;
                }
            }
        }
        //向左两格查找
        if (start_x - 2 >= 0) {
            //向左两格
            let LeftTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 2].name;
            //向左一格
            let LeftOneName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 1].name;
            if (LeftTwoName === "yp" && LeftOneName === "grid") {
                //目标是否可移动
                let ismove = this.TargetIsMove(start_x - 2, start_y);
                if (ismove) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x - 2, start_y, Target_Name.sheep_card);
                    return true;
                }
            }
        }
        return false;
    }
    //目标点是否可移动
    TargetIsMove(start_x: number, start_y: number): boolean {
        let num: number = 0;
        //向上
        if (start_y + 1 >= this.ScriptManage.GameManage.Line || this.ScriptManage.GameManage.Chessboard_Array[start_y + 1][start_x].name === "yp") {
            num++;
        }
        //向下
        if (start_y - 1 < 0 || this.ScriptManage.GameManage.Chessboard_Array[start_y - 1][start_x].name === "yp") {
            num++;
        }
        //向右
        if (start_x + 1 >= this.ScriptManage.GameManage.Row || this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 1].name === "yp") {
            num++;
        }
        //向左
        if (start_x - 1 < 0 || this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 1].name === "yp") {
            num++;
        }
        if (num >= 3) {
            return false;
        } else {
            return true;
        }
    }
    //查找自身1格以内是否可移动
    SelectSelfOneGridIsMove(self_node: cc.Node, target_Array: cc.Node[], start_x: number, start_y: number): void {
        //查找最近目标节点
        let near_node = this.SelectTargetMinPos(self_node, target_Array);
        //判断最近节点所在方向
        if (near_node.position.x === self_node.position.x) {
            //垂直查找
            this.VerticalDisSelect(self_node, near_node, start_x, start_y, "Vertical");
        } else if (near_node.position.y === self_node.position.y) {
            //水平查找
            this.HorizontalDisSelect(self_node, near_node, start_x, start_y, "Horizontal");
        } else {
            //垂直查找
            let isVertical = this.VerticalDisSelect(self_node, near_node, start_x, start_y);
            if (isVertical) {
                return;
            }
            //水平查找
            let isHorizontal = this.HorizontalDisSelect(self_node, near_node, start_x, start_y);
            if (isHorizontal) {
                return;
            }
        }
        return;
    }
    //查找自身3格以内是否可移动
    SelectSelfThreeGridIsMove(self_node: cc.Node, target_Array: cc.Node[], start_x: number, start_y: number): void {
        //向下3格扫描
        let min_y = start_y - 3;
        if (min_y >= 0) {
            //向下扫描1格是否为空
            let isDownOneGridNull = this.DownOneGridSelect(start_x, start_y);
            //向下扫描2格是否为空
            let DownTowGridName = this.ScriptManage.GameManage.Chessboard_Array[start_y - 2][start_x].name;
            //向下扫描3格是否为羊牌
            let DownThreeGridName = this.ScriptManage.GameManage.Chessboard_Array[min_y][start_x].name;
            if (isDownOneGridNull && DownTowGridName === "grid" && DownThreeGridName === target_Array[0].name) {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x, start_y - 1, Target_Name.grid_card);
                return;
            }
        }
        //向右3格扫描
        let max_x = start_x + 3;
        if (max_x < this.ScriptManage.GameManage.Line) {
            //向右扫描1格是否为空
            let isRightOneGridNull = this.RightOneGridSelect(start_x, start_y);
            //向右扫描2格是否为空
            let RightTowGridName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 2].name;
            //向右扫描3格是否为羊牌
            let RightThreeGridName = this.ScriptManage.GameManage.Chessboard_Array[start_y][max_x].name;
            if (isRightOneGridNull && RightTowGridName === "grid" && RightThreeGridName === target_Array[0].name) {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x + 1, start_y, Target_Name.grid_card);
                return;
            }
        }
        //向左3格扫描
        let min_x = start_x - 3;
        if (min_x >= 0) {
            //向左扫描1格是否为空
            let isLeftOneGridNull = this.LeftOneGridSelect(start_x, start_y);
            //向左扫描2格是否为空
            let LeftTowGridName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 2].name;
            //向左扫描3格是否为羊牌
            let LeftThreeGridName = this.ScriptManage.GameManage.Chessboard_Array[start_y][min_x].name;
            if (isLeftOneGridNull && LeftTowGridName === "grid" && LeftThreeGridName === target_Array[0].name) {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x - 1, start_y, Target_Name.grid_card);
                return;
            }
        }
        //向上3格扫描
        let max_y = start_y + 3;
        if (max_y < this.ScriptManage.GameManage.Line) {
            //向上扫描1格是否为空
            let isUpOneGridNull = this.UPOneGridSelect(start_x, start_y);
            //向上扫描2格是否为空
            let UpTowGridName = this.ScriptManage.GameManage.Chessboard_Array[start_y + 2][start_x].name;
            //向上扫描3格是否为羊牌
            let UpThreeGridName = this.ScriptManage.GameManage.Chessboard_Array[max_y][start_x].name;
            if (isUpOneGridNull && UpTowGridName === "grid" && UpThreeGridName === target_Array[0].name) {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x, start_y + 1, Target_Name.grid_card);
                return;
            }
        }
        //查找1格以内是否可移动
        this.SelectSelfOneGridIsMove(self_node, target_Array, start_x, start_y);
    }
    //最近目标垂直方向查找
    VerticalDisSelect(self_node: cc.Node, target_node: cc.Node, start_x: number, start_y: number, dis?: string): boolean {
        //自身上方
        if (self_node.position.y < target_node.position.y) {
            //向上1格查找
            let isUpNull = this.UPOneGridSelect(start_x, start_y);
            if (isUpNull) {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x, start_y + 1, Target_Name.grid_card);
                return true;
            } else {
                //向右查找
                let isRightNull = this.RightOneGridSelect(start_x, start_y);
                if (isRightNull) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x + 1, start_y, Target_Name.grid_card);
                    return true;
                }
                //向左查找
                let isLeftNull = this.LeftOneGridSelect(start_x, start_y);
                if (isLeftNull) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x - 1, start_y, Target_Name.grid_card);
                    return true;
                }
            }
            if (dis === "Vertical") {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x, start_y - 1, Target_Name.grid_card);
                return;
            }
        }
        //自身下方
        if (self_node.position.y > target_node.position.y) {
            //向下1格查找
            let isDownNull = this.DownOneGridSelect(start_x, start_y);
            if (isDownNull) {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x, start_y - 1, Target_Name.grid_card);
                return true;
            } else {
                //向右查找
                let isRightNull = this.RightOneGridSelect(start_x, start_y);
                if (isRightNull) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x + 1, start_y, Target_Name.grid_card);
                    return true;
                }
                //向左查找
                let isLeftNull = this.LeftOneGridSelect(start_x, start_y);
                if (isLeftNull) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x - 1, start_y, Target_Name.grid_card);
                    return true;
                }
            }
            if (dis === "Vertical") {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x, start_y + 1, Target_Name.grid_card);
                return;
            }
        }
        return false;
    }
    //最近目标水平方向查找
    HorizontalDisSelect(self_node: cc.Node, target_node: cc.Node, start_x: number, start_y: number, dis?: string): boolean {
        //自身右方
        if (self_node.position.x < target_node.position.x) {
            //向右扫描
            let isRightNull = this.RightOneGridSelect(start_x, start_y);
            if (isRightNull) {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x + 1, start_y, Target_Name.grid_card);
                return true;
            } else {
                //向上查找
                let isUpNull = this.UPOneGridSelect(start_x, start_y);
                if (isUpNull) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x, start_y + 1, Target_Name.grid_card);
                    return true;
                }
                //向下查找
                let isDownNull = this.DownOneGridSelect(start_x, start_y);
                if (isDownNull) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x, start_y - 1, Target_Name.grid_card);
                    return true;
                }
            }
            if (dis === "Horizontal") {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x - 1, start_y, Target_Name.grid_card);
                return;
            }
        }
        //自身左方
        if (self_node.position.x > target_node.position.x) {
            //向左扫描
            let isLeftNull = this.LeftOneGridSelect(start_x, start_y);
            if (isLeftNull) {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x - 1, start_y, Target_Name.grid_card);
                return true;
            } else {
                //向上查找
                let isUpNull = this.UPOneGridSelect(start_x, start_y);
                if (isUpNull) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x, start_y + 1, Target_Name.grid_card);
                    return true;
                }
                //向下查找
                let isDownNull = this.DownOneGridSelect(start_x, start_y);
                if (isDownNull) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x, start_y - 1, Target_Name.grid_card);
                    return true;
                }
            }
            if (dis === "Horizontal") {
                //移动
                this.MoveFunc(self_node, start_x, start_y, start_x + 1, start_y, Target_Name.grid_card);
                return;
            }
        }
        return false;
    }
    //移动
    MoveFunc(self_node: cc.Node, start_x: number, start_y: number, need_x: number, need_y: number, target_num: number): void {
        //播放移动音效
        cc.audioEngine.play(this.ScriptManage.MusicManage.Move_Audio, false, 1);
        //记录AI移动前位置
        this.ScriptManage.GameManage.Undo_AI_Pos = self_node.position;
        //记录AI节点
        this.ScriptManage.GameManage.Undo_AI_Node = self_node;
        //记录被AI回收节点
        this.ScriptManage.GameManage.Undo_AI_Rec_Node = this.ScriptManage.GameManage.Chessboard_Array[need_y][need_x];
        //获取格子节点
        let need_node: cc.Node = null;
        need_node = this.ScriptManage.ChessboardManage.Grid_Pool.get();
        if (!need_node) {
            this.ScriptManage.ChessboardManage.GetGridPool();
            need_node = this.ScriptManage.ChessboardManage.Grid_Pool.get();
        }
        //放入棋盘空缺位置
        this.ScriptManage.GameManage.Chessboard.addChild(need_node);
        need_node.setPosition(self_node.position);
        //放入数组空缺位置
        this.ScriptManage.GameManage.Chessboard_Array[start_y].splice(start_x, 1, need_node);
        self_node.setPosition(this.ScriptManage.GameManage.Chessboard_Array[need_y][need_x].position);
        if (target_num === Target_Name.grid_card) {
            //格子对象池回收格子
            this.ScriptManage.ChessboardManage.Grid_Pool.put(this.ScriptManage.GameManage.Chessboard_Array[need_y][need_x]);
        }
        if (target_num === Target_Name.sheep_card) {
            //播放吃的音效
            cc.audioEngine.play(this.ScriptManage.MusicManage.Eat_Audio, false, 1);
            //获取光效
            let light = this.ScriptManage.ChessboardManage.Lighting_Pool.get();
            this.ScriptManage.GameManage.Chessboard.addChild(light);
            light.setPosition(this.ScriptManage.GameManage.Chessboard_Array[need_y][need_x].position);
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
            let ind = this.ScriptManage.GameManage.Player_Sheep_Array.indexOf(this.ScriptManage.GameManage.Chessboard_Array[need_y][need_x]);
            this.ScriptManage.GameManage.Player_Sheep_Array.splice(ind, 1);
            //格子对象池回收格子
            this.ScriptManage.ChessboardManage.Sheep_Pool.put(this.ScriptManage.GameManage.Chessboard_Array[need_y][need_x]);
        }
        //移除格子所在二维数组中位置，放入狼牌
        this.ScriptManage.GameManage.Chessboard_Array[need_y].splice(need_x, 1, self_node);
        //结果判定
        this.ScriptManage.ResultManage.ResultDetermine(this.ScriptManage.GameManage.Player_Sheep_Array, Cmap.AI, this.ScriptManage.GameManage.AI_Wolf_Array);
    }
    // //逃跑
    // RunAwayFunc(self_node: cc.Node, start_x: number, start_y: number, need_x: number, need_y: number): void {

    // }
    // update (dt) {}
}