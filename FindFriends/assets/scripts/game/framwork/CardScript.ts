import { Color } from "../../common/EnumScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Card extends cc.Component {

    /**
     * @property [Array]花色精灵帧
     */
    @property([cc.SpriteFrame])
    private Suit: cc.SpriteFrame[] = [];
    /**
     * @property [Array]笑脸精灵帧
     */
    @property([cc.SpriteFrame])
    private Yes: cc.SpriteFrame[] = [];
    /**
     * @property [Array]难过精灵帧
     */
    @property([cc.SpriteFrame])
    private No: cc.SpriteFrame[] = [];
    /**
     * @property 右上
     */
    public RightAndUp: Color = null;
    /**
     * @property 左下
     */
    public LeftAndDown: Color = null;
    /**
     * @property 是否可以使用
     */
    public IsUse: boolean = false;
    /**
     * @property 是否通过
     */
    public IsPass: boolean = false;

    Init() {
        let ran_suit = Math.floor(Math.random() * this.Suit.length);
        let ran_yes = Math.floor(Math.random() * this.Yes.length);
        let suti_name = this.Suit[ran_suit].name;
        if (suti_name === "5") {
            this.IsPass=true;
            this.RightAndUp = Color.any;
            this.LeftAndDown = Color.any;
        } else {
            let one = parseInt(suti_name.charAt(0));
            let two = parseInt(suti_name.charAt(1));
            this.LeftAndDown = one;
            this.RightAndUp = two;
        }
        this.node.getChildByName("Front").getComponent(cc.Sprite).spriteFrame = this.Suit[ran_suit];
        this.node.getChildByName("Front").getChildByName("yes").getComponent(cc.Sprite).spriteFrame = this.Yes[ran_yes];
        this.node.getChildByName("Front").getChildByName("no").getComponent(cc.Sprite).spriteFrame = this.No[ran_yes];
        this.node.getChildByName("Front").getChildByName("no").active = true;
    }
}
