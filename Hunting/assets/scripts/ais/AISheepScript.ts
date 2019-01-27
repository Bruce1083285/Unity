import AI from "../AIScript";
import ScriptManage from "../common/ScriptManageScript";
import { Cmap } from "../common/EnumManageScript";

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
export default class SheepAI extends AI {


    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}

    // start() {

    // }
    // constructor() {
    //     super();
    //     this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
    // }
    //查找自身二维坐标
    SelectSelfPos(self_Array: cc.Node[], target_Array: cc.Node[]) {
        this.ScriptManage = cc.find("ScriptManage").getComponent(ScriptManage);
        //四方查找
        let get_node = this.FourDirectionSelect(self_Array);
        if (get_node) {
            this.ran = self_Array.indexOf(get_node);
        } else {
            //获取随机数
            this.ran = this.getRandomPoint(self_Array.length);
            if (self_Array.length > 6) {
                //是否可移动
                this.ran = this.IsWolfFunc(self_Array, this.ran);
            }
        }
        //获取Y轴
        this.start_y = this.ScriptManage.GameManage.GetChessboardPos_y(self_Array[this.ran]);
        //获取X轴
        this.start_x = this.ScriptManage.GameManage.Chessboard_Array[this.start_y].indexOf(self_Array[this.ran]);
        //查找自身2格以内是否可移动
        let istwo = this.SelectSelfTwoGridIsMove(self_Array[this.ran], target_Array, this.start_x, this.start_y);
        if (istwo) {
            //重置随机数组
            this.Ran_Array = [];
            return
        }
        //查找自身3格以内是否可移动
        let isthree = this.SelectSelfThreeGridIsMove(self_Array[this.ran], target_Array, this.start_x, this.start_y);
        if (isthree) {
            //重置随机数组
            this.Ran_Array = [];
            return
        }
        //查找自身1格以内是否可移动
        let isone = this.SelectSelfOneGridIsMove(self_Array[this.ran], target_Array, this.start_x, this.start_y);
        if (isone) {
            //重置随机数组
            this.Ran_Array = [];
            return
        }
        //递归重新查找
        this.SelectSelfPos(self_Array, target_Array);
    }
    //是否可移动
    IsWolfFunc(self_Array, ran: number): number {
        //获取Y轴
        this.start_y = this.ScriptManage.GameManage.GetChessboardPos_y(self_Array[ran]);
        //获取X轴
        this.start_x = this.ScriptManage.GameManage.Chessboard_Array[this.start_y].indexOf(self_Array[ran]);
        //向上
        if (this.start_y + 1 < this.ScriptManage.GameManage.Line) {
            if (this.ScriptManage.GameManage.Chessboard_Array[this.start_y + 1][this.start_x].name === "dw" || this.ScriptManage.GameManage.Chessboard_Array[this.start_y + 1][this.start_x].name === "xw") {
                //获取随机数
                ran = this.getRandomPoint(self_Array.length);
                //是否可移动
                ran = this.IsWolfFunc(self_Array, ran);
                return ran;
            }
        }
        //向下
        if (this.start_y - 1 >= 0) {
            if (this.ScriptManage.GameManage.Chessboard_Array[this.start_y - 1][this.start_x].name === "dw" || this.ScriptManage.GameManage.Chessboard_Array[this.start_y - 1][this.start_x].name === "xw") {
                //获取随机数
                ran = this.getRandomPoint(self_Array.length);
                //是否可移动
                ran = this.IsWolfFunc(self_Array, ran);
                return ran;
            }
        }
        //向右
        if (this.start_x + 1 < this.ScriptManage.GameManage.Row) {
            if (this.ScriptManage.GameManage.Chessboard_Array[this.start_y][this.start_x + 1].name === "dw" || this.ScriptManage.GameManage.Chessboard_Array[this.start_y][this.start_x + 1].name === "xw") {
                //获取随机数
                ran = this.getRandomPoint(self_Array.length);
                //是否可移动
                ran = this.IsWolfFunc(self_Array, ran);
                return ran;
            }
        }
        //向左
        if (this.start_x - 1 >= 0) {
            if (this.ScriptManage.GameManage.Chessboard_Array[this.start_y][this.start_x - 1].name === "dw" || this.ScriptManage.GameManage.Chessboard_Array[this.start_y][this.start_x - 1].name === "xw") {
                //获取随机数
                ran = this.getRandomPoint(self_Array.length);
                //是否可移动
                ran = this.IsWolfFunc(self_Array, ran);
                return ran;
            }
        }
        return ran;
    }
    //查找自身1格以内是否可移动
    SelectSelfOneGridIsMove(self_node: cc.Node, target_Array: cc.Node[], start_x: number, start_y: number): boolean {
        //向下
        let isDownOneNull = this.DownOneGridSelect(start_x, start_y);
        if (isDownOneNull) {
            //移动
            this.MoveFunc(self_node, start_x, start_y, start_x, start_y - 1);
            return true;
        }
        //向右
        let isRightOneNull = this.RightOneGridSelect(start_x, start_y);
        if (isRightOneNull) {
            //移动
            this.MoveFunc(self_node, start_x, start_y, start_x + 1, start_y);
            return true;
        }
        //向左
        let isLeftOneNull = this.LeftOneGridSelect(start_x, start_y);
        if (isLeftOneNull) {
            //移动
            this.MoveFunc(self_node, start_x, start_y, start_x - 1, start_y);
            return true;
        }
        //向上
        let isUpOneNull = this.UPOneGridSelect(start_x, start_y);
        if (isUpOneNull) {
            //移动
            this.MoveFunc(self_node, start_x, start_y, start_x, start_y + 1);
            return true;
        }
        return false;
    }
    //查找自身2格以内是否可移动
    SelectSelfTwoGridIsMove(self_node: cc.Node, target_Array: cc.Node[], start_x: number, start_y: number): boolean {
        //向下查找
        let isDownOneNull = this.DownOneGridSelect(start_x, start_y);
        if (isDownOneNull && start_y - 2 >= 0) {
            if (this.ScriptManage.GameManage.Chessboard_Array[start_y - 2][start_x].name === "dw" || this.ScriptManage.GameManage.Chessboard_Array[start_y - 2][start_x].name === "xw") {
                //向下移动一格
                this.MoveFunc(self_node, start_x, start_y, start_x, start_y - 1);
                return true;
            }
        }
        //向右查找
        let isRightOneNull = this.RightOneGridSelect(start_x, start_y);
        if (isRightOneNull && start_x + 2 < this.ScriptManage.GameManage.Row) {
            if (this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 2].name === "dw" || this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 2].name === "xw") {
                //向右移动一格
                this.MoveFunc(self_node, start_x, start_y, start_x + 1, start_y);
                return true;
            }
        }
        //向左查找
        let isLeftOneNull = this.LeftOneGridSelect(start_x, start_y);
        if (isLeftOneNull && start_x - 2 >= 0) {
            if (this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 2].name === "dw" || this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 2].name === "xw") {
                //向左移动一格
                this.MoveFunc(self_node, start_x, start_y, start_x - 1, start_y);
                return true;
            }
        }
        //向上查找
        let isUpOneNull = this.UPOneGridSelect(start_x, start_y);
        if (isUpOneNull && start_y + 2 < this.ScriptManage.GameManage.Line) {
            if (this.ScriptManage.GameManage.Chessboard_Array[start_y + 2][start_x].name === "dw" || this.ScriptManage.GameManage.Chessboard_Array[start_y + 2][start_x].name === "xw") {
                //向上移动一格
                this.MoveFunc(self_node, start_x, start_y, start_x, start_y + 1);
                return true;
            }
        }
        return false;
    }
    //查找自身3格以内是否可移动
    SelectSelfThreeGridIsMove(self_node: cc.Node, target_Array: cc.Node[], start_x: number, start_y: number): boolean {
        //向上
        if (start_y + 3 < this.ScriptManage.GameManage.Line) {
            //一格查找
            let isUpOneNull = this.UPOneGridSelect(start_x, start_y);
            if (isUpOneNull) {
                //向上三格是否有威胁
                let upthreeThreat = this.UpThreeThreatSelect(start_x, start_y);
                if (!upthreeThreat) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x, start_y + 1);
                    return true;
                }
            }
        }
        //向下
        if (start_y - 3 >= 0) {
            //一格查找
            let isDownOneNull = this.DownOneGridSelect(start_x, start_y);
            if (isDownOneNull) {
                //向下三格是否有威胁
                let downthreeThreat = this.DownThreeThreatSelect(start_x, start_y);
                if (!downthreeThreat) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x, start_y - 1);
                    return true;
                }
            }
        }
        //向右
        if (start_x + 3 < this.ScriptManage.GameManage.Row) {
            //一格查找
            let isRightOneNull = this.RightOneGridSelect(start_x, start_y);
            if (isRightOneNull) {
                //向右三格是否有威胁
                let rightthreeThreat = this.RightThreeThreatSelect(start_x, start_y);
                if (!rightthreeThreat) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x + 1, start_y);
                    return true;
                }
            }
        }
        //向左
        if (start_x - 3 >= 0) {
            //一格查找
            let isLeftOneNull = this.LeftOneGridSelect(start_x, start_y);
            if (isLeftOneNull) {
                //向左三格是否有威胁
                let leftthreeThreat = this.LeftThreeThreatSelect(start_x, start_y);
                if (!leftthreeThreat) {
                    //移动
                    this.MoveFunc(self_node, start_x, start_y, start_x - 1, start_y);
                    return true;
                }
            }
        }
        return false;
    }
    //四方查找
    FourDirectionSelect(self_Array: cc.Node[]): cc.Node {
        for (let i = 0; i < self_Array.length; i++) {
            //获取X轴
            let start_y = this.ScriptManage.GameManage.GetChessboardPos_y(self_Array[i]);
            //获取Y轴
            let start_x = this.ScriptManage.GameManage.Chessboard_Array[start_y].indexOf(self_Array[i]);
            //四方两格查找
            let four_dir_tow_node = this.FourDirTwo(start_x, start_y);
            //判断是否为空
            if (four_dir_tow_node) {
                return four_dir_tow_node;
            }
            //四方三格查找
            let four_dir_three_node = this.FourDirThree(start_x, start_y);
            if (four_dir_three_node) {
                return four_dir_three_node;
            }
        }
    }
    //四方两格查找
    FourDirTwo(start_x: number, start_y: number): cc.Node {
        //向上两格
        if (start_y + 2 < this.ScriptManage.GameManage.Line) {
            let UpTowName = this.ScriptManage.GameManage.Chessboard_Array[start_y + 2][start_x].name;
            if (UpTowName === "dw" || UpTowName === "xw") {
                //向上一格
                let isUpOneNull = this.UPOneGridSelect(start_x, start_y);
                if (isUpOneNull) {
                    return this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x];
                }
            }
        }
        //向下两格
        if (start_y - 2 >= 0) {
            let DownTowName = this.ScriptManage.GameManage.Chessboard_Array[start_y - 2][start_x].name;
            if (DownTowName === "dw" || DownTowName === "xw") {
                //向下一格
                let isDownOneNull = this.DownOneGridSelect(start_x, start_y);
                if (isDownOneNull) {
                    return this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x];
                }
            }
        }
        //向右两格
        if (start_x + 2 < this.ScriptManage.GameManage.Row) {
            let RightTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 2].name;
            if (RightTwoName === "dw" || RightTwoName === "xw") {
                //向右一格
                let isRightOneNull = this.RightOneGridSelect(start_x, start_y);
                if (isRightOneNull) {
                    return this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x];
                }
            }
        }
        //向左两格
        if (start_x - 2 >= 0) {
            let LeftTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 2].name;
            if (LeftTwoName === "dw" || LeftTwoName === "xw") {
                //向左一格
                let isLeftOneNull = this.LeftOneGridSelect(start_x, start_y);
                if (isLeftOneNull) {
                    return this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x];
                }
            }
        }
        return;
    }
    //四方三格查找
    FourDirThree(start_x: number, start_y: number) {
        //向上
        if (start_y + 3 < this.ScriptManage.GameManage.Line) {
            //三格
            let UpThreeName = this.ScriptManage.GameManage.Chessboard_Array[start_y + 3][start_x].name;
            if (UpThreeName === "dw" || UpThreeName === "xw") {
                //两格
                let UpTowName = this.ScriptManage.GameManage.Chessboard_Array[start_y + 2][start_x].name;
                if (UpTowName === "grid") {
                    //一格
                    let isUpOneNull = this.UPOneGridSelect(start_x, start_y);
                    if (isUpOneNull) {
                        return this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x];
                    }
                }
            }
        }
        //向下
        if (start_y - 3 >= 0) {
            //三格
            let DownThreeName = this.ScriptManage.GameManage.Chessboard_Array[start_y - 3][start_x].name;
            if (DownThreeName === "dw" || DownThreeName === "xw") {
                //两格
                let DownTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y - 2][start_x].name;
                if (DownTwoName === "grid") {
                    //一格
                    let isDownOneNull = this.DownOneGridSelect(start_x, start_y);
                    if (isDownOneNull) {
                        return this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x];
                    }
                }
            }
        }
        //向右
        if (start_x + 3 < this.ScriptManage.GameManage.Row) {
            //三格
            let RightThreeName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 3].name;
            if (RightThreeName === "dw" || RightThreeName === "xw") {
                //两格
                let RightTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 2].name;
                if (RightTwoName === "grid") {
                    //一格
                    let isRightOneNull = this.RightOneGridSelect(start_x, start_y);
                    if (isRightOneNull) {
                        return this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x];
                    }
                }
            }
        }
        //向左
        if (start_x - 3 >= 0) {
            //三格
            let LeftThreeName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 3].name;
            if (LeftThreeName === "dw" || LeftThreeName === "xw") {
                //两格
                let LeftTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 2].name;
                if (LeftTwoName === "grid") {
                    //一格
                    let isLeftOneNull = this.LeftOneGridSelect(start_x, start_y);
                    if (isLeftOneNull) {
                        return this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x];
                    }
                }
            }
        }
    }
    //向上三格是否有危险
    UpThreeThreatSelect(start_x: number, start_y: number): boolean {
        //二格查找
        let UpTowName = this.ScriptManage.GameManage.Chessboard_Array[start_y + 2][start_x].name;
        //三格查找
        let UpThreeName = this.ScriptManage.GameManage.Chessboard_Array[start_y + 3][start_x].name;
        if (UpTowName === "grid") {
            if (UpThreeName === "dw" || UpThreeName === "xw") {
                return true;
            }
        }
        return false;
    }
    //向下三格是否有危险
    DownThreeThreatSelect(start_x: number, start_y: number): boolean {
        //二格查找
        let DownTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y - 2][start_x].name;
        //三格查找
        let DownThreeName = this.ScriptManage.GameManage.Chessboard_Array[start_y - 3][start_x].name;
        if (DownTwoName === "grid") {
            if (DownThreeName === "dw" || DownThreeName === "xw") {
                return true;
            }
        }
        return false;
    }
    //向右三格是否有危险
    RightThreeThreatSelect(start_x: number, start_y: number): boolean {
        //二格查找
        let RightTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 2].name;
        //三格查找
        let RightThreeName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 3].name;
        if (RightTwoName === "grid") {
            if (RightThreeName === "dw" || RightThreeName === "xw") {
                return true;
            }
        }
        return false;
    }
    //向左三格是否有危险
    LeftThreeThreatSelect(start_x: number, start_y: number): boolean {
        //二格查找
        let LeftTwoName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 2].name;
        //三格查找
        let LeftThreeName = this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 3].name;
        if (LeftTwoName === "grid") {
            if (LeftThreeName === "dw" || LeftThreeName === "xw") {
                return true;
            }
        }
        return false;
    }
    //移动
    MoveFunc(self_node: cc.Node, start_x: number, start_y: number, need_x: number, need_y: number): void {
        //记录AI移动前位置
        this.ScriptManage.GameManage.Undo_AI_Pos = self_node.position;
        //记录AI节点
        this.ScriptManage.GameManage.Undo_AI_Node = self_node;
        //记录被AI回收节点
        this.ScriptManage.GameManage.Undo_AI_Rec_Node = this.ScriptManage.GameManage.Chessboard_Array[need_y][need_x];
        //获取格子节点
        let grid = this.ScriptManage.ChessboardManage.Grid_Pool.get();
        if (!grid) {
            //对象池
            this.ScriptManage.ChessboardManage.GetGridPool();
            //获取格子
            grid = this.ScriptManage.ChessboardManage.Grid_Pool.get();
        }
        //放入棋盘空缺位置
        this.ScriptManage.GameManage.Chessboard.addChild(grid);
        grid.setPosition(self_node.position);
        //放入数组空缺位置
        this.ScriptManage.GameManage.Chessboard_Array[start_y].splice(start_x, 1, grid);
        self_node.setPosition(this.ScriptManage.GameManage.Chessboard_Array[need_y][need_x].position);
        //格子对象池回收格子
        this.ScriptManage.ChessboardManage.Grid_Pool.put(this.ScriptManage.GameManage.Chessboard_Array[need_y][need_x]);
        //移除格子所在二维数组中位置，放入狼牌
        this.ScriptManage.GameManage.Chessboard_Array[need_y].splice(need_x, 1, self_node);
        //结果判定
        this.ScriptManage.ResultManage.ResultDetermine(this.ScriptManage.GameManage.Player_Wolf_Array, Cmap.AI);
    }
    // update (dt) {}
}
