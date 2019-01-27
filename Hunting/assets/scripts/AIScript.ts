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
export default class AI extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    //脚本管理器
    public ScriptManage: ScriptManage;
    //扫描开始节点Y轴
    protected start_y: number = 0;
    //扫描开始节点X轴
    protected start_x: number = 0
    //随机数
    protected ran: number = 0;
    //随机数组
    protected Ran_Array: number[] = [];
    // //AI羊牌数组
    // public AI_Sheep_Array: cc.Node[] = [];
    // //AI狼牌数组
    // public AI_Wolf_Array: cc.Node[] = [];
    // onLoad() {
    // }
    // start() {

    // }
    // //构造函数
    // constructor() { }
    //查找最近节点
    SelectTargetMinPos(self_node: cc.Node, target_Array: cc.Node[]) {
        //最小距离
        let min_dis = cc.pDistance(target_Array[0].position, self_node.position);
        //最小距离节点
        let min_dis_node = target_Array[0];
        for (let i = 0; i < target_Array.length; i++) {
            //目标距离
            let target_dis = cc.pDistance(target_Array[i].position, self_node.position);
            if (Math.abs(min_dis) < Math.abs(target_dis)) {
                min_dis = target_dis;
                min_dis_node = target_Array[i];
            }
        }
        return min_dis_node;
    }
    //获取随机点
    getRandomPoint(maxRan: number): number {
        let ran_1 = Math.floor(Math.random() * maxRan);
        //去重复
        let ind = this.Ran_Array.indexOf(ran_1);
        if (ind === -1) {
            this.Ran_Array.push(ran_1);
            return ran_1;
        } else {
            //重新获取随机数
            ran_1 = this.getRandomPoint(maxRan);
            return ran_1;
        }
    }
    //查找自身二维坐标
    SelectSelfPos(self_Array: cc.Node[], target_Array: cc.Node[]) { }
    //向上1格查找
    UPOneGridSelect(start_x: number, start_y: number): boolean {
        //越界判断
        if (start_y + 1 < this.ScriptManage.GameManage.Line) {
            if (this.ScriptManage.GameManage.Chessboard_Array[start_y + 1][start_x].name === "grid") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    //向下1格查找
    DownOneGridSelect(start_x: number, start_y: number): boolean {
        //越界判断
        if (start_y - 1 >= 0) {
            if (this.ScriptManage.GameManage.Chessboard_Array[start_y - 1][start_x].name === "grid") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    //向右1格查找
    RightOneGridSelect(start_x: number, start_y: number): boolean {
        //越界判断
        if (start_x + 1 < this.ScriptManage.GameManage.Row) {
            if (this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x + 1].name === "grid") {
                return true;
            } else {
                return false;
            }
        } else {
            return false
        }
    }
    //向左1格查找
    LeftOneGridSelect(start_x: number, start_y: number): boolean {
        //越界判断
        if (start_x - 1 >= 0) {
            if (this.ScriptManage.GameManage.Chessboard_Array[start_y][start_x - 1].name === "grid") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    // //查找自身1格以内是否可移动
    // SelectSelfOneGridIsMove(self_node: cc.Node, target_Array: cc.Node[], start_x: number, start_y: number) { }
    // //查找自身2格以内是否可移动
    // SelectSelfTwoGridIsMove(self_node: cc.Node, target_Array: cc.Node[], start_x: number, start_y: number) { }
    // //查找自身3格以内是否可移动
    // SelectSelfThreeGridIsMove(self_node: cc.Node, target_Array: cc.Node[], start_x: number, start_y: number) { }
    // //逃跑
    // RunAwayFunc(self_node: cc.Node, start_x: number, start_y: number, need_x: number, need_y: number) { }

    // update (dt) {}
}