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
export default class Animation_Tornado extends cc.Component {

    /**
     * @property [Array]龙卷风精灵帧
     */
    @property([cc.SpriteFrame])
    private Coin_Skins: cc.SpriteFrame[] = [];
    /**
     * @property 精灵组件
     */
    private Sprite_Coin: cc.Sprite = null;
    /**
     * @property 下标索引
     */
    private Index: number = 0;
    /**
     * @property 回调函数
     */
    private CallBack: Function = null;
    /**
     * @property 水平移动值
     */
    private Horizontal: number = 1;
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
        // if (!GameManage.Instance.IsGameStart) {
        //     return;
        // }
        // let x = this.node.position.x + this.Speed * this.Horizontal * dt;
        // this.node.setPosition(x, this.node.y);
    }

    /**
     * 初始化
     */
    Init() {
        this.Sprite_Coin = this.node.getChildByName("img").getComponent(cc.Sprite)

        this.CallBack = () => {
            this.Play(this.Sprite_Coin, this.Coin_Skins)
        }
        this.schedule(this.CallBack, 0.1);
    }

    /**
     * 播放动画
     * @param sprite_Coin 金币精灵
     * @param coin_Skins [Array]金币皮肤
     */
    private Play(sprite_Coin: cc.Sprite, coin_Skins: cc.SpriteFrame[]) {
        sprite_Coin.spriteFrame = coin_Skins[this.Index];
        this.Index++;
        if (this.Index >= this.Coin_Skins.length) {
            this.Index = 0;
        }
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
