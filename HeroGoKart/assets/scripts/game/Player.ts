import Game from "../Game";
import { EventCenter } from "../commont/EventCenter";
import { EventType, Prop_Passive, DragonBonesAnimation_Role, CacheType } from "../commont/Enum";
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
import { Cache } from "../commont/Cache";
import { Transportation } from "./Transportation";
import { TranSpeedUp } from "./transportation/TranSpeedUp";
import { TranCoin } from "./transportation/TranCoin";
import AI from "./AI";

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
    //------------------------------------------------>空投奖励
    /**
     * @property 空投奖励--->加速卡
     */
    private TranSpeedUp: Transportation = null;
    /**
     * @property 空投奖励--->金币卡
     */
    private TranCoin: Transportation = null;

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
        //---------->空投奖励
        this.TranSpeedUp = new TranSpeedUp();
        this.TranCoin = new TranCoin();


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
            case "card":
                this.CollisionTransportation(target, self);
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
        let target_x = target.position.x;
        let self_x = self.position.x;
        let target_y = target.position.y;
        let self_y = self.position.y;
        let speed_value = 100;
        let callback = (target_x: number, target_y: number, self_x: number, self_y: number) => {
            // let target_act_move = cc.moveTo(0.3, target_x, target_y);
            // target.runAction(target_act_move);

            let self_act_move = cc.moveTo(0.3, self_x, self_y);
            self.runAction(self_act_move);
        }

        //水平碰撞
        let dis_y = Math.abs(target_y - self_y);
        if (dis_y <= 30) {
            let value = this.Horizontal(target, self, target_x, self_x, speed_value);
            callback(target.position.x + value, target.position.y, self.position.x - value, self.position.y);
            return;
        }

        //垂直碰撞
        let dis_x = Math.abs(target_x - self_x);
        if (dis_x <= 30) {
            let value = this.Vertical(target, self, target_y, self_y, speed_value);
            callback(target.position.x, target.position.y + value, self.position.x, self.position.y - value);
            return;
        }

        let value_x = this.Horizontal(target, self, target_x, self_x, speed_value);
        let value_y = this.Vertical(target, self, target_y, self_y, speed_value);
        callback(target.position.x + value_x, target.position.y + value_y, self.position.x - value_x, self.position.y - value_y);
    }

    /**
     * 水平碰撞
     * @param target AI节点
     * @param self 玩家节点
     * @param target_x AI的X轴
     * @param self_x 玩家的X轴
     */
    private Horizontal(target: cc.Node, self: cc.Node, target_x: number, self_x: number, speed_value: number) {

        //向右
        if (target_x > self_x) {
            // target.setPosition(target_x + speed_value, target.position.y);
            return speed_value;
        }

        //向左
        if (target_x < self_x) {
            // target.setPosition(target_x - speed_value, target.position.y);
            return - speed_value;
        }
    }


    /**
     * 垂直碰撞
     * @param target AI节点
     * @param self 玩家节点
     * @param target_y AI的Y轴
     * @param self_y 玩家的Y轴
     */
    private Vertical(target: cc.Node, self: cc.Node, target_y: number, self_y: number, speed_value: number) {

        //向上
        if (target_y > self_y) {
            // target.setPosition(target.position.x, target_y + speed_value);
            return speed_value;
        }

        //向下
        if (target_y < self_y) {
            // target.setPosition(target.position.x, target_y - speed_value);
            return - speed_value;
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

    /**
     * 碰撞到空投
     * @param target 空投奖励
     * @param self 玩家节点
     */
    private CollisionTransportation(target: cc.Node, self: cc.Node) {
        let spr_target = target.getComponent(cc.Sprite);
        let name = spr_target.spriteFrame.name;
        let cha = name.charAt(0);
        //加速
        if (cha === "7") {
            this.TranSpeedUp.SetTransportation(self);
        }
        //金币
        if (cha === "2") {
            this.TranCoin.SetTransportation();
        }
        target.destroy();
    }
}
