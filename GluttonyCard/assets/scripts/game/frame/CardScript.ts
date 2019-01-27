//导入花色
import { Color } from "../common/EnumManageScript"
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
    //--------节点
    //点数
    @property(cc.Sprite)
    public Count: cc.Sprite = null;
    //顶部花色
    @property(cc.Sprite)
    public Top_Suit: cc.Sprite = null;
    //底部花色
    @property(cc.Sprite)
    public Base_Suit: cc.Sprite = null;
    //背面
    @property(cc.Node)
    public Back: cc.Node = null;
    //--------数组
    //黑色点数
    @property([cc.SpriteFrame])
    public Black_Count: cc.SpriteFrame[] = [];
    //红色点数
    @property([cc.SpriteFrame])
    public Red_Count: cc.SpriteFrame[] = [];
    //黑色花色顶部
    @property([cc.SpriteFrame])
    public Black_Suit_Top: cc.SpriteFrame[] = [];
    //黑色花色底部
    @property([cc.SpriteFrame])
    public Black_Suit_Base: cc.SpriteFrame[] = [];
    //红色花色顶部
    @property([cc.SpriteFrame])
    public Red_Suit_Top: cc.SpriteFrame[] = [];
    //红色花色底部
    @property([cc.SpriteFrame])
    public Red_Suit_Base: cc.SpriteFrame[] = [];
    // LIFE-CYCLE CALLBACKS:
    //是否可以使用
    public IsUse: boolean = null;
    // onLoad () {}

    start() {

    }
    //初始化卡牌
    InitCard(isuse: boolean,Count?: number, suit?: Color) {
        //红色
        if (suit === Color.red) {
            //赋值点数
            this.Count.spriteFrame = this.Red_Count[Count];
            //随机花色
            let ran_suit = Math.floor(Math.random() * this.Red_Suit_Top.length);
            //赋值顶部花色
            this.Top_Suit.spriteFrame = this.Red_Suit_Top[ran_suit];
            //赋值底部花色
            this.Base_Suit.spriteFrame = this.Red_Suit_Base[ran_suit];
        }
        //黑色
        if (suit === Color.black) {
            //赋值点数
            this.Count.spriteFrame = this.Black_Count[Count];
            //随机花色
            let ran_suit = Math.floor(Math.random() * this.Black_Suit_Top.length);
            //顶部花色
            this.Top_Suit.spriteFrame = this.Black_Suit_Top[ran_suit];
            //底部花色
            this.Base_Suit.spriteFrame = this.Black_Suit_Base[ran_suit];
        }
        //是否可以使用
        if (isuse) {
            //关闭背面节点
            this.Back.active = false;
        } else {
            //开启背面节点
            this.Back.active = true;
        }
        //赋值是否可以使用
        this.IsUse = isuse;
    }
    // update (dt) {}
}
