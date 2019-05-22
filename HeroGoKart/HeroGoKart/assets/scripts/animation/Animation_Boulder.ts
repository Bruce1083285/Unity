import { GameManage } from "../commont/GameManager";

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
export default class Animation_Boulder extends cc.Component {

    /**
     * @property 石头
     */
    private Boulder: cc.Node = null;
    /**
     * @property 旋转速度
     */
    private Rotate_Speed: number = 100;
    /**
     * @property 水平移动方向值
     */
    private Horizontal: number = -1;
    /**
     * @property 速度值
     */
    private Speed: number = 100;

    onLoad() {
        this.Init();
    }

    start() {

    }

    update(dt) {
        if (GameManage.Instance.IsPause) {
            return;
        }
        if (this.Boulder && GameManage.Instance.IsGameStart) {
            this.Boulder.rotation = this.Boulder.rotation + this.Rotate_Speed * dt * this.Horizontal;

            let x = this.node.position.x + this.Speed * this.Horizontal * dt;
            this.node.setPosition(x, this.node.y);
            // console.log(this.node.position);
        }

        if (this.node.position.x <= -100) {
            this.Horizontal = 1;
        }
        if (this.node.position.x >= 700) {
            this.Horizontal = -1;
        }
    }

    /**
     * 初始化
     */
    Init() {
        this.Boulder = this.node.getChildByName("img");
    }

    /**
    * 碰撞开始
    * @param other 被碰撞目标
    * @param self 自身
    */
    private onCollisionEnter(other, self) {
        return;
        let target: cc.Node = other.node;
        let self_node: cc.Node = self.node;
        let group = target.group;
        if (group === "wall") {
            let world_pos = self_node.parent.convertToWorldSpaceAR(self_node.position);
            let world_Size = cc.winSize.width;
            if (world_pos.x > world_Size / 2) {
                this.Horizontal = -1;
            } else {
                this.Horizontal = 1;
            }
        }
    }
}
