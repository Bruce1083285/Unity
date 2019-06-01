import { GameManager } from "../../commont/GameManager";
import { Click_FunManage, Cubes, EventType } from "../../commont/Enum";
import { EventCenter } from "../../commont/EventCenter";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Group extends cc.Component {

    /**
     * @property 闪光--->消除
     */
    @property(cc.Prefab)
    private Pre_Eliminate: cc.Prefab = null;
    /**
     * @property 闪光--->掉落
     */
    @property(cc.Prefab)
    private Pre_DropOut: cc.Prefab = null;
    /**
     * @property 闪光--->星星
     */
    @property(cc.Prefab)
    private Pre_Star: cc.Prefab = null;
    /**
     * @property [Array]方块预制体
     */
    @property([cc.Prefab])
    private Pre_Cubes: cc.Prefab[] = [];
    /**
     * @property 预知位置方块
     */
    private Cube_Foresee: cc.Node = null;
    /**
     * @property 是否加速
     */
    private IsSpeedUp: boolean = false;
    /**
     * @property 时间
     */
    private Time: number = 0;
    /**
     * @property 当前时间
     */
    private Time_Current: number = 0;
    /**
     * @property 宽度
     */
    private Max_Width: number = 0;
    /**
     * @property 高度
     */
    private Max_Height: number = 0;
    /**
     * @property [Array]自身子节点
     */
    private Childers: cc.Node[] = [];

    onLoad() {
    }

    start() {
        this.Init();
    }

    update(dt) {

        if (GameManager.Instance.IsGameOver) {
            return;
        }

        this.UpdateMoveDown(dt);
        // this.UpdateTargetPos();

        switch (GameManager.Instance.Click_FunManage) {
            case Click_FunManage.Up:
                this.MoveDirUp();
                break;
            case Click_FunManage.Down:
                this.MoveDirDown();
                break
            case Click_FunManage.Left:
                this.MoveDirLeft();
                break
            case Click_FunManage.Right:
                this.MoveDirRight();
                break
            case Click_FunManage.Clockwise:
                this.RotateClockwise();
                break
            case Click_FunManage.Anticlockwise:
                this.RotateAnticlockwise();
                break
            default:
                break;
        }

        GameManager.Instance.Click_FunManage = null;
    }

    /**
     * 初始化
     */
    Init() {
        this.Childers = this.node.children;
        this.Max_Width = this.node.parent.getContentSize().width;
        this.Max_Height = this.node.parent.getContentSize().height;

        if (!this.IsValidGridPos()) {
            console.log("游戏结束");
            this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_Value);
            GameManager.Instance.IsGameOver = true;
            return;
        }

        this.AddListenter();
        // this.GetCubeForesee();
        this.UpdateGameGrid();
    }

    /**
     * 获取预知位置的方块
     */
    private GetCubeForesee() {
        let pre = this.GetPreIDBySelf();
        this.Cube_Foresee = cc.instantiate(pre);
        this.Cube_Foresee.getComponent(Group).enabled = false;
        this.Cube_Foresee.opacity = 150;
        this.node.parent.addChild(this.Cube_Foresee);
        this.Cube_Foresee.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_Value * 10);
        // console.log("预知方块为空------>3");
        // console.log(this.Cube_Foresee);
    }

    /**
     * 通过自身节点获取对应ID的预制体
     */
    private GetPreIDBySelf(): cc.Prefab {
        for (let i = 0; i < this.Pre_Cubes.length; i++) {
            let pre = this.Pre_Cubes[i];
            if (pre.name === this.node.name) {
                return pre;
            }
        }
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {
        //添加事件监听--->销毁预知位置方块
        EventCenter.AddListenter(EventType.CubeForeseeDestory, () => {
            this.CubeForeseeDestory();
        }, "Group");
    }

    /**
     * 添加事件监听
     */
    private RemoveListenter() {
        //移除事件监听--->销毁预知位置方块
        EventCenter.RemoveListenter(EventType.CubeForeseeDestory, "Group");
    }

    /**
     * 销毁预知位置方块
     */
    private CubeForeseeDestory() {
        let arr: cc.Node[] = this.node.children;
        for (let i = 0; i < arr.length; i++) {
            this.ResetGameGrid(arr[i]);
        }

        this.RemoveListenter();
        return;
        this.Cube_Foresee.destroy();
        this.Cube_Foresee = null;
        // console.log("预知方块为空------>2");
        // console.log(this.Cube_Foresee);
    }

    /**
     * 重置游戏区域格子
     * @param target 目标节点
     */
    private ResetGameGrid(target: cc.Node) {
        for (let y = 0; y < GameManager.Instance.Game_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.Game_Grid[y].length; x++) {
                let grid = GameManager.Instance.Game_Grid[y][x];
                if (grid !== null && grid.parent === this.node) {
                    GameManager.Instance.Game_Grid[y][x] = null;
                }
            }
        }
    }


    /**
     * 更新向下移动
     * @param dt 更新时间
     */
    private UpdateMoveDown(dt: number) {
        this.Time += dt;
        if (this.Time - this.Time_Current >= GameManager.Instance.Time_Interval) {
            this.node.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_Value);
            if (this.IsValidGridPos()) {
                this.UpdateGameGrid();
            } else {
                this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_Value);
                this.ForbiddenScript();
            }

            this.Time_Current = this.Time;
        }
    }

    /**
     * 移动--->上：瞬间移动到底部
     */
    private MoveDirUp() {
        GameManager.Instance.SetTimeInterval(0.000001);
        this.IsSpeedUp = true;
    }

    /**
     * 更新目标点位置
     */
    private UpdateTargetPos() {
        // let arr_x: number[] = this.GetChildGrid_X();
        // let target: cc.Node = this.GetTargetGrid_Y(arr_x);
        // this.Cube_Foresee.rotation = this.node.rotation;

        // if (!target) {
        //     this.Cube_Foresee.setPosition(0, 0);
        //     let dir_y = this.GetDownDirCubeForesee(this.Cube_Foresee);
        //     if (dir_y === 0) {
        //         this.Cube_Foresee.setPosition(this.node.position.x, GameManager.Instance.Interval_Value / 2);
        //     } else if (dir_y > 0) {
        //         this.Cube_Foresee.setPosition(this.node.position.x, this.Cube_Foresee.position.y + dir_y + GameManager.Instance.Interval_Value / 2);
        //     }
        // } else {
        //     let world_pos: cc.Vec2 = target.parent.convertToWorldSpaceAR(target.position);
        //     let node_pos: cc.Vec2 = this.node.parent.convertToNodeSpaceAR(world_pos);
        //     this.Cube_Foresee.setPosition(this.node.position.x, node_pos.y);
        // }
        this.Cube_Foresee.rotation = this.node.rotation;
        let y = this.Cube_Foresee.position.y - GameManager.Instance.Interval_Value * 2;
        this.Cube_Foresee.setPosition(this.node.position.x, y);
        if (!this.IsValidCubeForeseePos()) {
            this.Cube_Foresee.setPosition(this.node.position.x, this.Cube_Foresee.position.y + GameManager.Instance.Interval_Value * 2);
        }
    }

    /**
     * 是否为有效位置
     * @returns 位置是否有效
     */
    private IsValidCubeForeseePos(): boolean {
        let arr_child = this.Cube_Foresee.children;
        for (let i = 0; i < arr_child.length; i++) {
            let child = arr_child[i];

            let world_pos = this.Cube_Foresee.convertToWorldSpaceAR(child.position);
            let node_pos = this.Cube_Foresee.parent.convertToNodeSpaceAR(world_pos);
            if (!this.IsBorder(node_pos)) {
                return false;
            }

            let y: number = Math.floor(node_pos.y / GameManager.Instance.Interval_Value);
            if (y <= 0) {
                y = 0;
            }
            if (y >= 20) {
                y = 19;
            }
            let x: number = Math.floor(node_pos.x / GameManager.Instance.Interval_Value);
            if (x <= 0) {
                x = 0;
            }
            if (GameManager.Instance.Game_Grid[y][x] !== null && GameManager.Instance.Game_Grid[y][x].parent !== this.Cube_Foresee) {
                return false;
            }
        }

        return true;
    }

    /**
     * 获取子节点方块所在二维数组的X轴
     */
    private GetChildGrid_X(): number[] {
        let arr: number[] = [];
        //获取自身小方块所在二维数组的X轴
        for (let y = 0; y < GameManager.Instance.Game_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.Game_Grid[y].length; x++) {
                let grid = GameManager.Instance.Game_Grid[y][x];
                if (grid !== null && grid.parent === this.node) {
                    let ind = arr.indexOf(x);
                    if (ind === -1) {
                        arr.push(x);
                    }
                }
                // console.log("循环--->1");
            }
        }
        return arr;
    }

    /**
     * 获取目标格子Y轴坐标
     * @param arr_x 二维数组中X轴坐标
     * @returns 最大Y轴所对应节点
     */
    private GetTargetGrid_Y(arr_x: number[]): cc.Node {
        //通过X轴获取Y轴
        let arr_y: number[] = [];
        for (let x = 0; x < arr_x.length; x++) {
            for (let y = 0; y < GameManager.Instance.Game_Grid.length; y++) {
                let grid = GameManager.Instance.Game_Grid[y][arr_x[x]];
                if (grid !== null && grid.parent !== this.node) {
                    let ind = arr_y.indexOf(y);
                    if (ind === -1) {
                        arr_y.push(y);
                    }
                }
                // console.log("循环--->2");
            }
        }

        if (arr_y.length <= 0) {
            return null;
        }

        //获取最大Y轴
        let max_y: number = arr_y[0];
        for (let i = 0; i < arr_y.length; i++) {
            if (max_y < arr_y[i]) {
                max_y = arr_y[i];
            }
            // console.log("循环--->3");
        }

        //获取最大Y轴所对应节点
        for (let x = 0; x < GameManager.Instance.Game_Grid[max_y].length; x++) {
            let grid: cc.Node = GameManager.Instance.Game_Grid[max_y][x];
            if (grid !== null) {
                return grid
            }
            // console.log("循环--->4");
        }
    }

    /**
     * 获取越出底部的距离
     * @param cube_Foresee 预知方块
     * @returns 越出底部距离
     */
    private GetDownDirCubeForesee(cube_Foresee: cc.Node): number {
        let arr: cc.Node[] = cube_Foresee.children;
        let arr_y: number[] = [];
        for (let i = 0; i < arr.length; i++) {
            let child = arr[i];
            let world_pos = cube_Foresee.convertToWorldSpaceAR(child.position);
            let node_pos = cube_Foresee.parent.convertToNodeSpaceAR(world_pos);
            if (node_pos.y <= 0) {
                let ind = arr_y.indexOf(node_pos.y);
                if (ind === -1) {
                    arr_y.push(node_pos.y);
                }
            }
        }

        let min_y: number = arr_y[0];
        for (let i = 0; i < arr_y.length; i++) {
            if (min_y > arr_y[i]) {
                min_y = arr_y[i];
            }
        }

        return Math.abs(min_y);
    }

    /**
     * 移动--->下
     */
    private MoveDirDown() {
        this.node.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_Value);
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_Value);
            this.ForbiddenScript();
        }
    }


    /**
    * 移动--->左
    */
    private MoveDirLeft() {
        this.node.setPosition(this.node.position.x - GameManager.Instance.Interval_Value, this.node.position.y);
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.setPosition(this.node.position.x + GameManager.Instance.Interval_Value, this.node.position.y);
        }
    }

    /**
    * 移动--->右
    */
    private MoveDirRight() {
        this.node.setPosition(this.node.position.x + GameManager.Instance.Interval_Value, this.node.position.y);
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.setPosition(this.node.position.x - GameManager.Instance.Interval_Value, this.node.position.y);
        }
    }

    /**
     * 顺时针旋转
     */
    private RotateClockwise() {
        if (this.node.name === Cubes.CO) {
            return;
        }
        // console.log("预知方块为空------>6");
        // console.log(this.Cube_Foresee);
        this.node.rotation += 90;
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.rotation -= 90;
        }
    }

    /**
     * 逆时针旋转
     */
    private RotateAnticlockwise() {
        if (this.node.name === Cubes.CO) {
            return;
        }
        // console.log("预知方块为空------>5");
        // console.log(this.Cube_Foresee);
        this.node.rotation -= 90;
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.rotation += 90;
        }
    }

    /**
     * 是否为有效位置
     * @returns 位置是否有效
     */
    private IsValidGridPos(): boolean {
        let arr_child = this.node.children;
        for (let i = 0; i < arr_child.length; i++) {
            let child = arr_child[i];

            let world_pos = this.node.convertToWorldSpaceAR(child.position);
            let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
            // let pos = this.PosRound(node_pos);
            if (!this.IsBorder(node_pos)) {
                return false;
            }

            let y: number = Math.floor(node_pos.y / GameManager.Instance.Interval_Value);
            if (y <= 0) {
                y = 0;
            }
            let x: number = Math.floor(node_pos.x / GameManager.Instance.Interval_Value);
            if (x <= 0) {
                x = 0;
            }
            if (GameManager.Instance.Game_Grid[y][x] !== null && GameManager.Instance.Game_Grid[y][x].parent !== this.node) {
                return false;
            }
        }

        return true;
    }

    /**
     * 将位置坐标四舍五入为最接近的整数
     * @param pos 坐标位置
     * @returns 四舍五入后的坐标位置
     */
    private PosRound(pos: cc.Vec2): cc.Vec2 {
        let x = Math.floor(pos.x);
        let y = Math.floor(pos.y);
        let v2: cc.Vec2 = new cc.Vec2(x, y);
        return v2;
    }

    /**
     * 是否越出边界
     * @returns 是否越出边界
     */
    private IsBorder(pos: cc.Vec2): boolean {
        if (pos.x >= 0 && pos.x < this.Max_Width && pos.y >= 0) {
            return true;
        }
        return false;
    }

    /**
     * 更新游戏格子
     */
    private UpdateGameGrid() {
        //清除上一次方块所在格子二维数组中的位置
        for (let y = 0; y < GameManager.Instance.Game_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.Game_Grid[y].length; x++) {
                let grid = GameManager.Instance.Game_Grid[y][x];
                if (grid !== null && grid.parent === this.node) {
                    GameManager.Instance.Game_Grid[y][x] = null;
                }
            }
        }

        //更新方块现在在格子二维数组中的位置
        let arr: cc.Node[] = this.node.children;
        for (let i = 0; i < arr.length; i++) {
            let child = arr[i];
            let world_pos = this.node.convertToWorldSpaceAR(child.position);
            let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
            let pos = this.PosRound(node_pos);
            let x = Math.floor(pos.x / GameManager.Instance.Interval_Value);
            if (x <= 0) {
                x = 0;
            }
            let y = Math.floor(pos.y / GameManager.Instance.Interval_Value);
            if (y <= 0) {
                y = 0;
            }
            if (y >= 20) {
                y = 19;
            }
            GameManager.Instance.Game_Grid[y][x] = child;
        }
    }

    /**
     * 禁用脚本
     */
    private ForbiddenScript() {
        EventCenter.BroadcastOne(EventType.UpdatePointBegin, GameManager.Instance.Standby_FirstID);
        EventCenter.Broadcast(EventType.UpdateStandby);

        this.getComponent(Group).enabled = false;
        if (this.IsSpeedUp) {
            GameManager.Instance.SetTimeInterval(1);
            this.CreatroDropOut();
            this.IsSpeedUp = false;
        }
        this.RemoveListenter();
        this.RemoveParent();
        this.ClearFullGridByRow();
        //预知方块是否存在
        if (!this.Cube_Foresee) {
            return
        }
        this.Cube_Foresee.destroy();
        // console.log("预知方块为空------>4");
        // console.log(this.Cube_Foresee);
        console.log(GameManager.Instance.Game_Grid);
    }

    /**
     * 创建掉落闪光
     * @param y 通过Y轴计算高度
     */
    private CreatroDropOut() {
        let drop_Out = cc.instantiate(this.Pre_DropOut);
        let parent = this.node.parent;
        parent.addChild(drop_Out);
        drop_Out.scale = 2;
        let pos = cc.v2(this.node.position.x, this.node.position.y + 168);
        if (this.node.name === "4") {
            pos = cc.v2(this.node.position.x + GameManager.Instance.Interval_Value / 2 + 10, this.node.position.y + 168);
        }
        drop_Out.setPosition(pos);
        let callback = () => {
            drop_Out.destroy();
        }
        this.scheduleOnce(callback, 0.1);
    }

    /**
     * 移除父节点
     */
    private RemoveParent() {
        let arr = this.node.children;
        for (let i = 0; i < arr.length; i++) {
            let child = arr[i];
            let world_pos = this.node.convertToWorldSpaceAR(child.position);
            let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
            child.removeFromParent(false);
            this.node.parent.addChild(child);
            child.setPosition(node_pos);
            i--;
        }
    }

    /**
     * 通过行清除满员格子
     */
    private ClearFullGridByRow() {
        for (let y = 0; y < GameManager.Instance.Game_Grid.length; y++) {
            let isFull = this.IsFullGrid(y);
            if (isFull) {
                this.ClearFullGrid(y);
                this.CreatorEliminateSpine(y);
                let callback = () => {
                    this.GridMove(y);
                }
                this.scheduleOnce(callback, 0.1);
                y--;
                continue;
            }
        }
    }

    /**
     * 格子是否满员
     * @param y Y轴
     * @returns 是否满员
     */
    private IsFullGrid(y: number): boolean {
        for (let x = 0; x < GameManager.Instance.Game_Grid[y].length; x++) {
            let grid = GameManager.Instance.Game_Grid[y][x];
            if (!grid) {
                return false;
            }
        }
        return true;
    }

    /**
     * 清除满员格子
     * @param y Y轴
     */
    private ClearFullGrid(y: number) {
        for (let x = 0; x < GameManager.Instance.Game_Grid[y].length; x++) {
            let grid = GameManager.Instance.Game_Grid[y][x];
            let e = cc.instantiate(this.Pre_Eliminate);
            grid.destroy();
            GameManager.Instance.Game_Grid[y][x] = null;
        }
    }

    /**
     * 创建消除闪光
     * @param y 通过Y轴计算高度
     */
    private CreatorEliminateSpine(y: number) {
        let eliminate = cc.instantiate(this.Pre_Eliminate);
        let parent = this.node.parent;
        parent.addChild(eliminate);
        let width = parent.getContentSize().width;
        eliminate.setPosition(width / 2, y * GameManager.Instance.Interval_Value + GameManager.Instance.Interval_Value / 2 + 10);
        let callback = () => {
            eliminate.destroy();
        }
        this.scheduleOnce(callback, 0.1);
    }

    /**
     * 格子下移
     * @param min_yy Y轴
     */
    private GridMove(min_y: number) {
        for (let y = min_y + 1; y < GameManager.Instance.Game_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.Game_Grid[y].length; x++) {
                let grid: cc.Node = GameManager.Instance.Game_Grid[y][x];
                if (grid !== null) {
                    GameManager.Instance.Game_Grid[y][x] = null;
                    GameManager.Instance.Game_Grid[y - 1][x] = grid;
                    grid.setPosition(grid.position.x, grid.position.y - GameManager.Instance.Interval_Value);
                }
            }
        }
    }
}
