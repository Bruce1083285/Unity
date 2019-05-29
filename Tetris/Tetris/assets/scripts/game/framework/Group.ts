import { GameManager } from "../../commont/GameManager";
import { Click_FunManage, Cubes } from "../../commont/Enum";

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
     * @property [Array]自身子节点
     */
    private Childers: cc.Node[] = [];
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

    onLoad() {
        this.Init();
    }

    start() {

    }

    update(dt) {

        if (!this.IsMoveDown()) {
            this.ForbiddenScript();
            return;
        }

        this.UpdateMoveDown(dt);

        switch (GameManager.Instance.Click_FunManage) {
            case Click_FunManage.Up:
                this.MoveDirUp();
                break;
            case Click_FunManage.Down:
                this.MoveDirDown();
                break
            case Click_FunManage.Left:
                if (!this.IsMoveLeft()) {
                    this.MoveDirRight();
                }
                this.MoveDirLeft();
                break
            case Click_FunManage.Right:
                if (!this.IsMoveRight()) {
                    this.MoveDirLeft();
                }
                this.MoveDirRight();
                break
            case Click_FunManage.Clockwise:
                this.RotateClockwise();
                break
            case Click_FunManage.Anticlockwise:
                this.RotateAnticlockwise();
                break
            case Click_FunManage.Save:
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
    }

    /**
     * 是否可以移动
     * @returns 是否可以移动
     */
    private IsMoveDown(): boolean {
        let minY_node = this.Childers[0];
        for (let i = 0; i < this.Childers.length; i++) {
            let chi = this.Childers[i];
            if (minY_node.position.y > chi.position.y) {
                minY_node = chi;
            }
        }
        let world_pos = this.node.convertToWorldSpace(minY_node.position);
        let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
        if (node_pos.y - GameManager.Instance.Interval_Value / 2 <= 0) {
            return false;
        }
        return true
    }

    /**
     * 禁用脚本
     */
    private ForbiddenScript() {
        this.getComponent(Group).enabled = false;
    }

    /**
     * 是否可以向左移动
     * @returns 是否可以向左移动
     */
    private IsMoveLeft(): boolean {
        let minX_node = this.Childers[0];
        for (let i = 0; i < this.Childers.length; i++) {
            let chi = this.Childers[i];
            if (minX_node.position.x > chi.position.x) {
                minX_node = chi;
            }
        }
        let world_pos = this.node.convertToWorldSpace(minX_node.position);
        let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
        if (node_pos.x - GameManager.Instance.Interval_Value / 2 <= 0) {
            return false;
        }
        return true
    }

    /**
     * 是否可以向右移动
     * @returns 是否可以向右移动
     */
    private IsMoveRight(): boolean {
        let maxX_node = this.Childers[0];
        for (let i = 0; i < this.Childers.length; i++) {
            let chi = this.Childers[i];
            if (maxX_node.position.x < chi.position.x) {
                maxX_node = chi;
            }
        }
        let world_pos = this.node.convertToWorldSpace(maxX_node.position);
        let node_pos = this.node.parent.convertToNodeSpaceAR(world_pos);
        if (node_pos.x + GameManager.Instance.Interval_Value / 2 >= this.Max_Width - 10) {
            return false;
        }
        return true
    }

    /**
     * 更新向下移动
     * @param dt 更新时间
     */
    private UpdateMoveDown(dt: number) {
        this.Time += dt;
        if (this.Time - this.Time_Current >= GameManager.Instance.Time_Interval) {
            this.node.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_Value);
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
        this.node.setPosition(this.node.position.x, this.node.position.y - GameManager.Instance.Interval_Value);
    }


    /**
    * 移动--->左
    */
    private MoveDirLeft() {
        this.node.setPosition(this.node.position.x - GameManager.Instance.Interval_Value, this.node.position.y);
    }

    /**
    * 移动--->右
    */
    private MoveDirRight() {
        this.node.setPosition(this.node.position.x + GameManager.Instance.Interval_Value, this.node.position.y);
    }

    /**
     * 顺时针旋转
     */
    private RotateClockwise() {
        if (this.node.name === Cubes.CO) {
            return;
        }
        this.node.rotation += 90;
    }

    /**
     * 逆时针旋转
     */
    private RotateAnticlockwise() {
        if (this.node.name === Cubes.CO) {
            return;
        }
        this.node.rotation -= 90;
    }
}
