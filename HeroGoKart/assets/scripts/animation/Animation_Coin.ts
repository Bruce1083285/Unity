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
export default class Animation_Coin extends cc.Component {

    /**
     * @property [Array]金币精灵帧
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

    onLoad() {
        this.Init();
    }

    start() {

    }

    update(dt) {
        this.Sprite_Coin.spriteFrame = this.Coin_Skins[this.Index];
        this.Index++;
        if (this.Index >= this.Coin_Skins.length) {
            this.Index = 0;
        }
    }

    /**
     * 初始化
     */
    Init() {
        this.Sprite_Coin = this.node.getChildByName("coin").getComponent(cc.Sprite)

    }
}
