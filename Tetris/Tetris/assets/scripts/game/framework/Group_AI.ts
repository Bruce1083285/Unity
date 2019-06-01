import { GameManager } from "../../commont/GameManager";
import { Cubes, EventType, Click_FunManage } from "../../commont/Enum";
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

    //#region 
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

        switch (GameManager.Instance.Click_AIFunManage) {
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

        GameManager.Instance.Click_AIFunManage = null;
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
            this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_AIValue);
            GameManager.Instance.IsGameOver = true;
            return;
        }

        // this.AddListenter();
        this.UpdateGameGrid();
    }

    /**
     * 添加事件监听
     */
    private AddListenter() {
        //添加事件监听--->销毁预知位置方块
        EventCenter.AddListenter(EventType.CubeForeseeDestory, () => {
            // this.CubeForeseeDestory();
        }, "Group_AI");
    }

    /**
     * 添加事件监听
     */
    private RemoveListenter() {
        //移除事件监听--->销毁预知位置方块
        EventCenter.RemoveListenter(EventType.CubeForeseeDestory, "Group_AI");
    }

    /**
     * 更新向下移动
     * @param dt 更新时间
     */
    private UpdateMoveDown(dt: number) {
        this.Time += dt;
        if (this.Time - this.Time_Current >= GameManager.Instance.Time_AIInterval) {
            this.node.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_AIValue);
            if (this.IsValidGridPos()) {
                this.UpdateGameGrid();
            } else {
                this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_AIValue);
                this.ForbiddenScript();
            }

            this.Time_Current = this.Time;
        }
    }

    /**
     * 移动--->上：瞬间移动到底部
     */
    private MoveDirUp() {

    }

    /**
     * 移动--->下
     */
    private MoveDirDown() {
        this.node.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_AIValue);
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.setPosition(this.node.position.x, this.node.position.y + GameManager.Instance.Interval_AIValue);
            this.ForbiddenScript();
        }
    }


    /**
    * 移动--->左
    */
    private MoveDirLeft() {
        this.node.setPosition(this.node.position.x - GameManager.Instance.Interval_AIValue, this.node.position.y);
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.setPosition(this.node.position.x + GameManager.Instance.Interval_AIValue, this.node.position.y);
        }
    }

    /**
    * 移动--->右
    */
    private MoveDirRight() {
        this.node.setPosition(this.node.position.x + GameManager.Instance.Interval_AIValue, this.node.position.y);
        if (this.IsValidGridPos()) {
            this.UpdateGameGrid();
        } else {
            this.node.setPosition(this.node.position.x - GameManager.Instance.Interval_AIValue, this.node.position.y);
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

            let y: number = Math.floor(node_pos.y / GameManager.Instance.Interval_AIValue);
            if (y <= 0) {
                y = 0;
            }
            if (y >= 20) {
                y = 19;
            }
            let x: number = Math.floor(node_pos.x / GameManager.Instance.Interval_AIValue);
            if (x <= 0) {
                x = 0;
            }
            // console.log(x + "<-----X轴");
            // console.log(y + "<-----Y轴");
            if (GameManager.Instance.AIGame_Grid[y][x] !== null && GameManager.Instance.AIGame_Grid[y][x].parent !== this.node) {
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
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
                let grid = GameManager.Instance.AIGame_Grid[y][x];
                if (grid !== null && grid.parent === this.node) {
                    GameManager.Instance.AIGame_Grid[y][x] = null;
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
            let x = Math.floor(pos.x / GameManager.Instance.Interval_AIValue);
            if (x <= 0) {
                x = 0;
            }
            let y = Math.floor(pos.y / GameManager.Instance.Interval_AIValue);
            if (y <= 0) {
                y = 0;
            }
            if (y >= 20) {
                y = 19;
            }
            GameManager.Instance.AIGame_Grid[y][x] = child;
        }
    }

    /**
     * 禁用脚本
     */
    private ForbiddenScript() {
        this.getComponent(Group).enabled = false;
        EventCenter.Broadcast(EventType.UpdateAIPointBegin);
        // this.RemoveListenter();
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
        this.ClearFullGridByRow();
        // console.log("预知方块为空------>4");
        // console.log(this.Cube_Foresee);
        // console.log(GameManager.Instance.AIGame_Grid);
    }

    /**
     * 通过行清除满员格子
     */
    private ClearFullGridByRow() {
        for (let y = 0; y < GameManager.Instance.AIGame_Grid.length; y++) {
            let isFull = this.IsFullGrid(y);
            if (isFull) {
                this.ClearFullGrid(y);
                this.GridMove(y);
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
        for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
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
        for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
            let grid = GameManager.Instance.AIGame_Grid[y][x];
            grid.destroy();
            GameManager.Instance.AIGame_Grid[y][x] = null;
        }
    }

    /**
     * 格子下移
     * @param min_yy Y轴
     */
    private GridMove(min_y: number) {
        for (let y = min_y + 1; y < GameManager.Instance.AIGame_Grid.length; y++) {
            for (let x = 0; x < GameManager.Instance.AIGame_Grid[y].length; x++) {
                let grid: cc.Node = GameManager.Instance.AIGame_Grid[y][x];
                if (grid !== null) {
                    GameManager.Instance.AIGame_Grid[y][x] = null;
                    GameManager.Instance.AIGame_Grid[y - 1][x] = grid;
                    grid.setPosition(grid.position.x, grid.position.y - GameManager.Instance.Interval_AIValue);
                }
            }
        }
    }
    //#endregion
}
