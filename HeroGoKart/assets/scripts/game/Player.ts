import Game from "../Game";
import { EventCenter } from "../commont/EventCenter";
import { EventType, Prop_Passive, DragonBonesAnimation_Role } from "../commont/Enum";
import { PropEffect } from "./PropEffect";
import { EffectBananaSkin } from "./propeffect/EffectBananaSkin";
import { EffectBomb } from "./propeffect/EffectBomb";
import { EffectClownGift } from "./propeffect/EffectClownGift";
import { GameManage } from "../commont/GameManager";
import { EffectCoin } from "./propPassive/EffectCoin";
import { PropPassive } from "./PropPassive";
import { EffectTornado } from "./propPassive/EffectTornado";
import { EffectAreaSpeedUp } from "./propPassive/EffectAreaSpeedUp";
import { EffectPaint } from "./propPassive/EffectPaint";
import { EffectHandrail } from "./propPassive/EffectHandrail";
import { EffectPortal } from "./propPassive/EffectPortal";
import { EffectRoadblock } from "./propPassive/EffectRoadblock";
import { EffectBoulder } from "./propPassive/EffectBoulder";
import { EffectPiers } from "./propPassive/EffectPiers";
import { EffectWater } from "./propPassive/EffectWater";
import { EffectTimeBomb } from "./propPassive/EffectTimeBomb";

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
    private Speed_Horizontal: number = 0.1;
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
     * @property 保护罩是否开启
     */
    public IsOpen_Pretection: boolean = false;
    /**
     * @property 水平移动开关
     */
    public IsHorizontal: boolean = true;
    /**
     * @property 是否加速
     */
    public IsSpeedUp: boolean = true;
    /**
     * @property 是否存在定时炸弹
     */
    private TimeBomb: cc.Node = null;
    /**
     * @property 游戏类
     */
    private Game: Game = null;
    //------------------------------------------------>主动道具效果
    /**
     * @property 香蕉皮效果
     */
    private BananaSkin: PropEffect = null;
    /**
     * @property 炸弹效果
     */
    private Bomb: PropEffect = null;
    /**
     * @property 小丑礼包
     */
    private ClownGift: PropEffect = null;
    //------------------------------------------------>被动道具效果
    /**
     * @property 金币效果
     */
    private EffectCoin: PropPassive = null;
    /**
     * @property 龙卷风效果 
     */
    private EffectTornado: PropPassive = null;
    /**
     * @property 加速带效果
     */
    private EffectAreaSpeedUp: PropPassive = null;
    /**
     * @property 传送门效果
     */
    private EffectPortal: PropPassive = null;
    /**
     * @property 油漆效果
     */
    private EffectPaint: PropPassive = null;
    /**
     * @property 栏杆效果
     */
    private EffectHandrail: PropPassive = null;
    /**
     * @property 路障效果
     */
    private EffectRoadblock: PropPassive = null;
    /**
     * @property 大石头效果
     */
    private EffectBoulder: PropPassive = null;
    /**
     * @property 石墩效果
     */
    private EffectPiers: PropPassive = null;
    /**
     * @property 水滩效果
     */
    private EffectWater: PropPassive = null;
    /**
     * @property 定时炸弹
     */
    private EffectTimeBomb: PropPassive = null;

    onLoad() {
        this.Init();
    }

    update(dt) {
        if (!this.Game || !GameManage.Instance.IsGameStart) {
            return;
        }
        if (!this.IsHorizontal) {
            this.Game.Horizontal = 0;
        }
        //垂直移动
        let y = this.node.position.y + this.Speed * dt;
        //水平移动
        let x = this.node.position.x + this.Speed_Horizontal * 1 * this.Horizontal_Sensitivity * this.Game.Horizontal;
        this.node.setPosition(x, y);
    }

    /**
     * 初始化
     */
    Init() {
        this.Game = this.node.parent.parent.getComponent(Game);

        //---------->主动道具效果
        this.BananaSkin = new EffectBananaSkin(this.Game.Pool_Prop);
        this.Bomb = new EffectBomb(this.Game.Pool_Prop);
        this.ClownGift = new EffectClownGift(this.Game.Pool_Prop);
        //---------->被动道具效果
        this.EffectCoin = new EffectCoin(this.Game.Pool_PassiveProps);
        this.EffectTornado = new EffectTornado(this.Game.Pool_PassiveProps);
        this.EffectAreaSpeedUp = new EffectAreaSpeedUp(this.Game.Pool_PassiveProps);
        this.EffectPortal = new EffectPortal(this.Game.Pool_PassiveProps);
        this.EffectPaint = new EffectPaint(this.Game.Pool_PassiveProps);
        this.EffectHandrail = new EffectHandrail(this.Game.Pool_PassiveProps);
        this.EffectRoadblock = new EffectRoadblock(this.Game.Pool_PassiveProps);
        this.EffectBoulder = new EffectBoulder(this.Game.Pool_PassiveProps);
        this.EffectPiers = new EffectPiers(this.Game.Pool_PassiveProps);
        this.EffectWater = new EffectWater(this.Game.Pool_PassiveProps);
        this.EffectTimeBomb = new EffectTimeBomb(this.Game.Pool_PassiveProps);


        this.UpdateSpeed();
    }

    /**
     * 更新速度值
     */
    private UpdateSpeed() {
        let callback = () => {
            if (!this.IsSpeedUp) {
                return;
            }
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
            case "prop":
                this.CollisionProp(target, self_node);
                break;
            case "passive_prop":
                this.CollisionPassiveProp(target, self_node);
                break;
            case "role":
                this.CollisionRole(target, self_node);
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
        EventCenter.Broadcast(EventType.Game_ExtractProp);
    }

    /**
     * 碰撞到道具
     * @param target 道具节点
     * @param self 玩家节点
     */
    private CollisionProp(target: cc.Node, self: cc.Node) {
        let name = target.getChildByName("prop").getComponent(cc.Sprite).spriteFrame.name;
        switch (name) {
            case "1":
                //香蕉皮效果
                this.BananaSkin.Effect(self, target);
                break;
            case "2":
                //炸弹效果
                this.Bomb.Effect(self, target);
                break;
            case "3":
                //小丑礼包
                this.ClownGift.Effect(self, target);
                break;
            default:
                break;
        }
    }

    /**
     * 碰撞到被动道具
     * @param target 道具节点
     * @param self 玩家节点
     */
    private CollisionPassiveProp(target: cc.Node, self: cc.Node) {
        let name = target.name;
        switch (name) {
            case "Coin":
                //金币
                this.EffectCoin.Effect(self, target);
                break;
            case Prop_Passive.Tornado:
                //龙卷风
                this.EffectTornado.Effect(self, target);
                break;
            case Prop_Passive.AreaSpeedUp:
                //加速带
                this.EffectAreaSpeedUp.Effect(self, target);
                break;
            case Prop_Passive.Portal:
                //传送门
                this.EffectPortal.Effect(self, target);
                break;
            case Prop_Passive.Paint:
                //油漆
                this.EffectPaint.Effect(self, target);
                break;
            case Prop_Passive.Handrail:
                //栏杆
                this.EffectHandrail.Effect(self, target);
                break;
            case Prop_Passive.Roadblock:
                //路障
                this.EffectRoadblock.Effect(self, target);
                break;
            case Prop_Passive.Boulder:
                //大石油
                this.EffectBoulder.Effect(self, target);
                break;
            case Prop_Passive.Piers:
                //石墩
                this.EffectPiers.Effect(self, target);
                break;
            case Prop_Passive.Water:
                //水滩
                this.EffectWater.Effect(self, target);
                break;
            case Prop_Passive.TimeBomb:
                //定时炸弹
                this.SetTimeBomb(target);
                // this.EffectTimeBomb.Effect(self, target);
                break;
            default:
                break;
        }
    }

    /**
     * 设置定时炸弹
     * @param target 
     */
    private SetTimeBomb(target: cc.Node) {
        this.TimeBomb = target;
        target.removeFromParent(false);
        this.node.addChild(target);
        target.setPosition(0, 0);
    }

    /**
     * 碰撞到AI
     * @param target AI节点
     * @param self 玩家节点
     */
    private CollisionRole(target: cc.Node, self: cc.Node) {
        if (this.TimeBomb) {
            this.TransferTimeBomb(target);
        }
    }

    /**
     * 转移定时炸弹
     * @param target AI节点
     */
    private TransferTimeBomb(target: cc.Node) {
        let world_pos = target.parent.convertToWorldSpaceAR(target.position);
        let node_pos = this.TimeBomb.parent.convertToNodeSpaceAR(world_pos);
        let act_move = cc.moveTo(0.3, node_pos);
        let callback = () => {
            this.TimeBomb.removeFromParent(false);
            target.addChild(this.TimeBomb);
            this.TimeBomb.setPosition(0, 0);
            this.TimeBomb = null;
        }
        let act_seq = cc.sequence(act_move, cc.callFunc(callback));
        this.TimeBomb.runAction(act_seq);
    }
}
