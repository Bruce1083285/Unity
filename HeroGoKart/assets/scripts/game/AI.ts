import Game from "../Game";
import { PropEffect } from "./PropEffect";
import { EffectBananaSkin } from "./propeffect/EffectBananaSkin";
import { EffectBomb } from "./propeffect/EffectBomb";
import { EffectClownGift } from "./propeffect/EffectClownGift";
import { PropUseing } from "./PropUseing";
import { BananaSkin } from "./propUseing/BananaSkin";
import { Bomb } from "./propUseing/Bomb";
import { ClownGift } from "./propUseing/ClownGift";
import { WaterPolo } from "./propUseing/WaterPolo";
import { Frozen } from "./propUseing/Frozen";
import { Protection } from "./propUseing/Protection";
import { SpeedUp } from "./propUseing/SpeedUp";
import { Magnet } from "./propUseing/Magnet";
import { Lightning } from "./propUseing/Lightning";

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
export default class AI extends cc.Component {

    /**
     * @property 道具精灵帧
     */
    @property([cc.SpriteFrame])
    private Fra_InitiativeProp: cc.SpriteFrame[] = [];
    /**
      * @property 水平移动速度
      */
    private Speed_Horizontal: number = 1;
    /**
     * @property 移动速度
     */
    public Speed: number = 0.1;
    /**
     * @property 保护罩是否开启
     */
    public IsOpen_Pretection: boolean = false;
    /**
     * @property 水平移动值   -1：左  0：不变  1：右
     */
    private Horizontal: number = 0;
    /**
     * @property 游戏类
     */
    private Game: Game = null;
    /**
     * @property 香蕉皮效果
     */
    private Effect_BananaSkin: PropEffect = null;
    /**
     * @property 炸弹效果
     */
    private Effect_Bomb: PropEffect = null;
    /**
     * @property 小丑礼包
     */
    private Effect_ClownGift: PropEffect = null;
    /**
    * @property 香蕉皮使用
    */
    private Useing_BananaSkin: PropUseing = null;
    /**
     * @property 炸弹使用
     */
    private Useing_Bomb: PropUseing = null;
    /**
     * @property 小丑礼包使用
     */
    private Useing_ClownGift: PropUseing = null;
    /**
     * @property 水球使用
     */
    private Useing_WaterPolo: PropUseing = null;
    /**
     * @property 冰冻使用
     */
    private Useing_Frozen: PropUseing = null;
    /**
     * @property 保护罩使用
     */
    private Useing_Protection: PropUseing = null;
    /**
     * @property 加速使用
     */
    private Useing_SpeedUp: PropUseing = null;
    /**
     * @property 吸铁石使用
     */
    private Useing_Mangnet: PropUseing = null;
    /**
     * @property 雷击使用
     */
    private Useing_Lightning: PropUseing = null;

    onLoad() {
        this.Init();
    }

    start() {

    }

    update(dt) {
        //垂直移动
        let y = this.node.position.y + this.Speed * dt;
        //水平移动
        let x = this.node.position.x + this.Speed_Horizontal * 100 * dt * this.Horizontal;
        this.node.setPosition(x, y);
    }

    /**
     * 初始化
     */
    Init() {
        this.Game = this.node.parent.parent.getComponent(Game);

        //道具效果
        this.Effect_BananaSkin = new EffectBananaSkin(this.Game.Pool_Prop);
        this.Effect_Bomb = new EffectBomb(this.Game.Pool_Prop);
        this.Effect_ClownGift = new EffectClownGift(this.Game.Pool_Prop);

        //道具使用
        this.Useing_BananaSkin = new BananaSkin(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Useing_Bomb = new Bomb(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Useing_ClownGift = new ClownGift(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Useing_WaterPolo = new WaterPolo(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Useing_Frozen = new Frozen(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Useing_Protection = new Protection(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Useing_SpeedUp = new SpeedUp(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Useing_Mangnet = new Magnet(this.Fra_InitiativeProp, this.Game.Pool_Prop);
        this.Useing_Lightning = new Lightning(this.Fra_InitiativeProp, this.Game.Pool_Prop);

        this.UpdateSpeed();
    }

    /**
     * 更新速度值
     */
    private UpdateSpeed() {
        let callback = () => {
            this.Speed += 20;
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
            case "prop":
                this.CollisionProp(target, self_node);
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
        this.Game.Pool_Question.put(target);
        let ran = Math.floor(Math.random() * this.Fra_InitiativeProp.length);
        let str = ran.toString();
        switch (str) {
            case "1":
                //香蕉皮
                this.Useing_BananaSkin.Useing(this.Game.Player, str);
                break;
            case "2":
                //炸弹
                this.Useing_Bomb.Useing(this.Game.Player, str);
                break;
            case "3":
                //小丑礼包
                this.Useing_ClownGift.Useing(this.Game.Player, str);
                break;
            case "4":
                //水球
                this.Useing_WaterPolo.Useing(this.Game.Player, str);
                break;
            case "5":
                //冰冻
                this.Useing_Frozen.Useing(this.Game.Player, str);
                break;
            case "6":
                //保护罩
                this.Useing_Protection.Useing(this.Game.Player, str);
                break;
            case "7":
                //加速
                this.Useing_SpeedUp.Useing(this.Game.Player, str);
                break;
            case "8":
                //吸铁石
                this.Useing_Mangnet.Useing(this.Game.Player, str);
                break;
            case "9":
                //雷击
                this.Useing_Lightning.Useing(this.Game.Player, str);
                break;
            default:
                break;
        }
    }

    /**
     * 碰撞到道具
     * @param target 道具节点
     */
    private CollisionProp(target: cc.Node, self: cc.Node) {
        let name = target.getChildByName("prop").getComponent(cc.Sprite).spriteFrame.name;
        switch (name) {
            case "1":
                //香蕉皮效果
                this.Effect_BananaSkin.Effect(self, target);
                break;
            case "2":
                //炸弹效果
                this.Effect_Bomb.Effect(self, target);
                break;
            case "3":
                //小丑礼包
                this.Effect_ClownGift.Effect(self, target);
                break;
            default:
                break;
        }
    }
}
