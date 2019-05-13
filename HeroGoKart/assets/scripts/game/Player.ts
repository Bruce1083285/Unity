import Game from "../Game";
import { EventCenter } from "../commont/EventCenter";
import { EventType } from "../commont/Enum";

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
export default class Player extends cc.Component {
    /**
     * @property 水平移动速度
     */
    private Speed_Horizontal: number = 1;
    /**
     * @property 移动速度
     */
    public Speed: number = 0;
    /**
     * @property 速度最大值
     */
    private Speed_Max: number = 120;
    /**
     * @property 灵敏度
     */
    public Horizontal_Sensitivity: number = 100;
    /**
     * @property 游戏类
     */
    private Game: Game = null;

    onLoad() {
        this.Init();
    }

    update(dt) {
        if (!this.Game || !this.Game.IsGameStart) {
            return;
        }
        //垂直移动
        let y = this.node.position.y + this.Speed * dt;
        //水平移动
        let x = this.node.position.x + this.Speed_Horizontal * 100 * this.Horizontal_Sensitivity * this.Game.Horizontal;
        this.node.setPosition(x, y);
    }

    /**
     * 初始化
     */
    Init() {
        this.Game = this.node.parent.parent.getComponent(Game);

        this.UpdateSpeed();
    }

    /**
     * 更新速度值
     */
    private UpdateSpeed() {
        let callback = () => {
            this.Speed += 20;
            if (this.Speed >= this.Speed_Max) {
                this.Speed = this.Speed_Max;
            }
            if (this.Speed % 20 === 0) {
                let num = this.Speed / 20;
                EventCenter.BroadcastOne<number>(EventType.Game_SetSpeedBar, num);
            }
        }
        this.schedule(callback, 1);
    }

    /**
     * 碰撞开始
     * @param other 被碰撞目标
     * @param self 自身
     */
    private onCollisionEnter(other, self) {
        let target: cc.Node = other.node;
        let self_node: cc.Node = self.node;
        let group = target.group;
        switch (group) {
            case "wall":
                this.CollisionWall(this.Game);
                break;
            case "question":
                this.CollisionQuestion(target);
                break;
            default:
                break;
        }
    }

    /**
     * 碰撞到围墙
     */
    private CollisionWall(game: Game) {
        game.Horizontal = 0;
    }

    /**
     * 碰撞到问号
     * @param target 问号节点
     */
    private CollisionQuestion(target: cc.Node) {
        target.active = false;
        EventCenter.Broadcast(EventType.Game_ExtractProp);
    }
}
