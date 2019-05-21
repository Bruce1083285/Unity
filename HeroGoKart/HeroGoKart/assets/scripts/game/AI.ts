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
import { PropPassive } from "./PropPassive";
import { Transportation } from "./Transportation";
import { EffectCoin } from "./propPassive/EffectCoin";
import { EffectTornado } from "./propPassive/EffectTornado";
import { EffectAreaSpeedUp } from "./propPassive/EffectAreaSpeedUp";
import { EffectPortal } from "./propPassive/EffectPortal";
import { EffectPaint } from "./propPassive/EffectPaint";
import { EffectHandrail } from "./propPassive/EffectHandrail";
import { EffectRoadblock } from "./propPassive/EffectRoadblock";
import { EffectBoulder } from "./propPassive/EffectBoulder";
import { EffectPiers } from "./propPassive/EffectPiers";
import { EffectWater } from "./propPassive/EffectWater";
import { EffectTimeBomb } from "./propPassive/EffectTimeBomb";
import { TranSpeedUp } from "./transportation/TranSpeedUp";
import { TranCoin } from "./transportation/TranCoin";
import { Prop_Passive, EventType, SoundType, Special_Car } from "../commont/Enum";
import { GameManage } from "../commont/GameManager";
import { EventCenter } from "../commont/EventCenter";
import Animation_TimeBomb from "../animation/Animation_TimeBomb";
import Player from "./Player";
import { SpecialCar } from "./SpecialCar";
import { Pickup } from "./specialcar/Pickup";

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
     * @property 定时炸弹
     */
    public TimeBomb: cc.Node = null;
    /**
      * @property 水平移动速度
      */
    private Speed_Horizontal: number = 1;
    /**
     * @property 移动速度
     */
    public Speed: number = 0;
    /**
     * @property 保护罩是否开启
     */
    public IsOpen_Pretection: boolean = false;
    /**
     * @property 是否开启加速
     */
    public IsSpeedUp: boolean = true;
    /**
   * @property 是否被水泡困住
   */
    public IsWaterPolo: boolean = false;
    /**
    * @property 是否被冰冻
    */
    public IsFrozen: boolean = false;
    /**
    * @property 是否被雷击
    */
    public IsLightning: boolean = false;
    /**
     * @property 是否移动
     */
    private IsMove: boolean = true;
    /**
     * @property 加速最大值
     */
    private Speed_Max: number = 1000;
    /**
     * @property 当前速度值
     */
    public Current_SpeedValue: number = 0;
    /**
     * @property 是否在空中
     */
    public IsSky: boolean = false;
    /**
     * @property 水平移动值   -1：左  0：不变  1：右
     */
    private Horizontal: number = 0;
    /**
     * @property 游戏类
     */
    public Game: Game = null;
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
    //---------->特殊汽车
    /**
     * @property 皮卡车
     */
    private Pickup: SpecialCar = null;
    /**
     * @property 左右移动比例
     */
    private MoveRatio = [
        /**加速带 */
        {
            name: "AreaSpeedUp",
            ratio: 20,
        },
        /**大石头 */
        {
            name: "Boulder",
            ratio: 80,
        },
        /**集装箱 */
        {
            name: "Container",
            ratio: 20,
        },
        /**栏杆 */
        {
            name: "Handrail",
            ratio: 60,
        },
        /**油漆 */
        {
            name: "Paint",
            ratio: 50,
        },
        /**石墩 */
        {
            name: "Piers",
            ratio: 70,
        },
        /**传送门 */
        {
            name: "Portal",
            ratio: 10,
        },
        /**路障 */
        {
            name: "Roadblock",
            ratio: 50,
        },
        /**定时炸弹 */
        {
            name: "TimeBomb",
            ratio: 50,
        },
        /**龙卷风 */
        {
            name: "Tornado",
            ratio: 50,
        },
        /**水滩 */
        {
            name: "Water",
            ratio: 20,
        },
        /**香蕉皮 */
        {
            name: "1",
            ratio: 50,
        },
        /**小丑盒子 */
        {
            name: "3",
            ratio: 50,
        },
        /**问号 */
        {
            name: "Question",
            ratio: 20,
        },
    ]

    onLoad() {
        this.Init();
    }

    start() {

    }

    update(dt) {

        if (!GameManage.Instance.IsGameStart || !this.IsMove || GameManage.Instance.IsPause || GameManage.Instance.IsGameEnd) {
            return;
        }
        if ((this.node.position.x <= 0 && this.node.position.x >= -50) || (this.node.position.x >= 600 && this.node.position.x <= 650)) {
            this.Speed = 100;
        }
        if (this.node.position.x < -5 || this.node.position.x > 650) {
            this.CollisionWall(this.Game, this.node);
            return;
        }
        //垂直移动
        let y = this.node.position.y + this.Speed * dt;
        //水平移动
        let x = this.node.position.x + this.Speed_Horizontal * 100 * dt * this.Horizontal;
        this.node.setPosition(x, y);
        this.UpdateSpeed();
        if (GameManage.Instance.IsListenterDis) {
            this.ListenterDistance();
        }
    }

    /**
     * 初始化
     */
    Init() {
        this.Game = this.node.parent.parent.getComponent(Game);

        //道具效果
        this.Effect_BananaSkin = new EffectBananaSkin(this.Game);
        this.Effect_Bomb = new EffectBomb(this.Game);
        this.Effect_ClownGift = new EffectClownGift(this.Game);

        //道具使用
        this.Useing_BananaSkin = new BananaSkin(this.Game.Pre_InitiativeProp, this.Game);
        this.Useing_Bomb = new Bomb(this.Game.Pre_InitiativeProp, this.Game);
        this.Useing_ClownGift = new ClownGift(this.Game.Pre_InitiativeProp, this.Game);
        this.Useing_WaterPolo = new WaterPolo(this.Game.Pre_InitiativeProp, this.Game);
        this.Useing_Frozen = new Frozen(this.Game.Pre_InitiativeProp, this.Game);
        this.Useing_Protection = new Protection(this.Game.Pre_InitiativeProp, this.Game);
        this.Useing_SpeedUp = new SpeedUp(this.Game.Pre_InitiativeProp, this.Game);
        this.Useing_Mangnet = new Magnet(this.Game.Pre_InitiativeProp, this.Game);
        this.Useing_Lightning = new Lightning(this.Game.Pre_InitiativeProp, this.Game);
        //---------->被动道具效果
        this.EffectCoin = new EffectCoin(this.Game.Pool_PassiveProps, this.Game);
        this.EffectTornado = new EffectTornado(this.Game.Pool_PassiveProps, this.Game);
        this.EffectAreaSpeedUp = new EffectAreaSpeedUp(this.Game.Pool_PassiveProps, this.Game);
        this.EffectPortal = new EffectPortal(this.Game.Pool_PassiveProps, this.Game);
        this.EffectPaint = new EffectPaint(this.Game.Pool_PassiveProps, this.Game);
        this.EffectHandrail = new EffectHandrail(this.Game.Pool_PassiveProps, this.Game);
        this.EffectRoadblock = new EffectRoadblock(this.Game.Pool_PassiveProps, this.Game);
        this.EffectBoulder = new EffectBoulder(this.Game.Pool_PassiveProps, this.Game);
        this.EffectPiers = new EffectPiers(this.Game.Pool_PassiveProps, this.Game);
        this.EffectWater = new EffectWater(this.Game.Pool_PassiveProps, this.Game);
        this.EffectTimeBomb = new EffectTimeBomb(this.Game.Pool_PassiveProps, this.Game);
        //---------->空投奖励
        this.TranSpeedUp = new TranSpeedUp(this.Game);
        this.TranCoin = new TranCoin(this.Game);
        //---------->特殊汽车
        this.Pickup = new Pickup();
    }

    /**
     * 重置自身
     */
    public ResetSelf() {
        this.node.scale = 0.4;
        this.node.rotation = 0;
        this.node.opacity = 255;
        this.IsMove = true;
        this.unscheduleAllCallbacks();
    }

    /**
     * 更新速度值
     */
    private UpdateSpeed() {
        if (!this.IsSpeedUp || !GameManage.Instance.IsGameStart) {
            return;
        }
        let ran = Math.random() * 3 + 1;
        this.Speed += ran;
        if (this.Speed >= this.Speed_Max) {
            this.Speed = this.Speed_Max;
        }
    }

    /**
     * 监听距离
     */
    private ListenterDistance() {
        let arr = this.Game.Area_Path.children;
        for (let i = 0; i < arr.length; i++) {
            let prop = arr[i];
            if (prop.name === "AI" || prop.name === "Player") {
                continue;
            }
            //计算亮点距离
            let dis = prop.position.sub(this.node.position).mag();
            if (dis <= 200 && dis > 5) {
                let name = prop.name;
                // console.log(this.MoveRatio);
                for (let j = 0; j < this.MoveRatio.length; j++) {
                    if (name === this.MoveRatio[j].name) {
                        this.Move(this.MoveRatio[j].ratio);
                        return;
                    }
                }
            }
        }
    }

    /**
     * 左右移动
     * @param ratio 比例
     */
    public Move(ratio: number) {
        let ran = Math.random() * 100;
        if (ran <= ratio) {
            let left_Or_right = Math.random() * 100;
            if (left_Or_right <= 50) {
                let act_move_Left = cc.moveBy(0.5, -200, 0);
                this.node.runAction(act_move_Left);
            } else {
                let act_move_Left = cc.moveBy(0.5, 200, 0);
                this.node.runAction(act_move_Left);
            }
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
        switch (group) {
            case "wall":
                // this.CollisionWall(this.Game, self_node);
                break;
            case "question":
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Question);
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
                this.CollisionTransportation(target, self_node);
                break;
            case "begin":
                // GameManage.Instance.IsUpdateProgress = true;
                GameManage.Instance.IsListenterDis = true;
                break;
            case "end":
                this.CollisionEnd(self_node);
                break;
            default:
                break;
        }
    }
    /**
        * 当碰撞结束后调用
        * @param  {Collider} other 产生碰撞的另一个碰撞组件
        * @param  {Collider} self  产生碰撞的自身的碰撞组件
        */
    private onCollisionExit(other, self) {
        let target: cc.Node = other.node;
        switch (target.name) {
            case "Player":
                // this.ClearTimeBomb();
                break;
            case "AI":
                // this.ClearTimeBomb();
                break;
            default:
                break;
        }

    }

    /**
     * 清空定时炸弹
     */
    private ClearTimeBomb() {
        if (this.TimeBomb) {
            this.TimeBomb = null;
        }
    }

    /**
     * 碰撞到围墙
     */
    private CollisionWall(game: Game, self: cc.Node) {
        game.Horizontal = 0;
        this.CrossingTheLineProtection(self);
    }

    /**
     * 碰撞到问号
     * @param target 问号节点
     */
    private CollisionQuestion(target: cc.Node) {
        this.Game.Pool_Question.put(target);
        let ran = Math.floor(Math.random() * this.Fra_InitiativeProp.length);
        let str = ran.toString();
        let arr = this.node.getChildByName("Role").children;
        let role: cc.Node = null;
        for (let i = 0; i < arr.length; i++) {
            role = arr[i];
            if (role.active) {
                break;
            }
        }
        let dragon = role.getComponent(dragonBones.ArmatureDisplay)
        dragon.playAnimation("a8", 1);
        this.scheduleOnce(() => {
            dragon.playAnimation("a1", 0);
        }, 0.5);
        switch (str) {
            case "1":
                //香蕉皮
                this.Useing_BananaSkin.Useing(this.node, str);
                break;
            case "2":
                //炸弹
                this.Useing_Bomb.Useing(this.node, str);
                break;
            case "3":
                //小丑礼包
                this.Useing_ClownGift.Useing(this.node, str);
                break;
            case "4":
                //水球
                EventCenter.BroadcastOne(EventType.Sound, SoundType.WaterPolo);
                this.Useing_WaterPolo.Useing(this.node, str);
                break;
            case "5":
                //冰冻
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Frozen);
                this.Useing_Frozen.Useing(this.node, str);
                break;
            case "6":
                //保护罩
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Protection);
                this.Useing_Protection.Useing(this.node, str);
                break;
            case "7":
                //加速
                EventCenter.BroadcastOne(EventType.Sound, SoundType.SpeedUp);
                this.Useing_SpeedUp.Useing(this.node, str);
                break;
            case "8":
                //吸铁石
                EventCenter.BroadcastOne(EventType.Sound, SoundType.SpeedUp);
                this.Useing_Mangnet.Useing(this.node, str);
                break;
            case "9":
                //雷击
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Lightning);
                this.Useing_Lightning.Useing(this.node, str);
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
        let istrue = this.GetPretection(target);
        if (istrue) {
            return
        }
        let name = target.name;
        switch (name) {
            case "1":
                //香蕉皮效果
                EventCenter.BroadcastOne(EventType.Sound, SoundType.BananaSkin);
                istrue = this.GetPretection(target);
                this.Effect_BananaSkin.Effect(self, target);
                break;
            case "2":
                //炸弹效果
                // this.Effect_Bomb.Effect(self, target);
                break;
            case "3":
                //小丑礼包
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Bomb);
                istrue = this.GetPretection(target);
                this.Effect_ClownGift.Effect(self, target);
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
        let arr: cc.Node[] = this.node.getChildByName("SpecialCar").children;
        let car_name: string = null;
        for (let i = 0; i < arr.length; i++) {
            let chi = arr[i];
            if (chi.active && (chi.name === Special_Car.CementTruck || chi.name === Special_Car.Pickup || chi.name === Special_Car.StreetRoller)) {
                car_name = chi.name;
                break;
            }
        }

        let istrue: boolean = null;
        let name = target.name;
        switch (name) {
            case "Coin":
                //金币
                target.destroy();
                // this.EffectCoin.Effect(self, target);
                break;
            case Prop_Passive.Tornado:
                //龙卷风
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                if (car_name && (car_name === Special_Car.CementTruck || car_name === Special_Car.StreetRoller)) {
                    return;
                }
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Tornado);
                this.EffectTornado.Effect(self, target);
                break;
            case Prop_Passive.AreaSpeedUp:
                //加速带
                EventCenter.BroadcastOne(EventType.Sound, SoundType.SpeedUp);
                this.EffectAreaSpeedUp.Effect(self, target);
                break;
            case Prop_Passive.Portal:
                //传送门
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Portal);
                this.EffectPortal.Effect(self, target);
                break;
            case Prop_Passive.Paint:
                //油漆
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                if (car_name && (car_name === Special_Car.CementTruck || car_name === Special_Car.StreetRoller)) {
                    return;
                }
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Paint);
                this.EffectPaint.Effect(self, target);
                break;
            case Prop_Passive.Handrail:
                //栏杆
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Roadblock);
                this.EffectHandrail.Effect(self, target);
                break;
            case Prop_Passive.Roadblock:
                //路障
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Roadblock);
                this.EffectRoadblock.Effect(self, target);
                break;
            case Prop_Passive.Boulder:
                //大石头
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Piers);
                this.EffectBoulder.Effect(self, target);
                break;
            case Prop_Passive.Piers:
                //石墩
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Piers);
                this.EffectPiers.Effect(self, target);
                break;
            case Prop_Passive.Water:
                //水滩
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                if (car_name && (car_name === Special_Car.Pickup || car_name === Special_Car.StreetRoller)) {
                    return;
                }
                EventCenter.BroadcastOne(EventType.Sound, SoundType.Water);
                this.EffectWater.Effect(self, target);
                break;
            case Prop_Passive.TimeBomb:
                //定时炸弹
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                if (car_name && car_name === Special_Car.StreetRoller) {
                    return;
                }
                this.SetTimeBomb(target);
                // this.EffectTimeBomb.Effect(self, target);
                break;
            case Prop_Passive.Container:
                //集装箱
                this.SetSpecialCar(target);
                break;
            default:
                break;
        }
    }

    /**
     * 设置定时炸弹
     * @param target  炸弹节点
     */
    private SetTimeBomb(target: cc.Node) {
        this.TimeBomb = target;
        target.removeFromParent(false);
        this.node.addChild(target);
        target.setPosition(0, 0);
        target.zIndex = 1;
        let collider = target.getComponent(cc.BoxCollider);
        collider.enabled = false;
        let time_Bomb = target.getComponent(Animation_TimeBomb);
        if (!GameManage.Instance.IsTime) {
            time_Bomb.Play();
            GameManage.Instance.IsTime = true;
        }
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
            let value = this.GetHorizontal(target, self, target_x, self_x, speed_value);
            callback(target.position.x + value, target.position.y, self.position.x - value, self.position.y);
            return;
        }

        //垂直碰撞
        let dis_x = Math.abs(target_x - self_x);
        if (dis_x <= 30) {
            let value = this.GetVertical(target, self, target_y, self_y, speed_value);
            callback(target.position.x, target.position.y + value, self.position.x, self.position.y - value);
            return;
        }

        let value_x = this.GetHorizontal(target, self, target_x, self_x, speed_value);
        let value_y = this.GetVertical(target, self, target_y, self_y, speed_value);
        callback(target.position.x + value_x, target.position.y + value_y, self.position.x - value_x, self.position.y - value_y);
    }

    /**
     * 水平碰撞
     * @param target AI节点
     * @param self 玩家节点
     * @param target_x AI的X轴
     * @param self_x 玩家的X轴
     */
    private GetHorizontal(target: cc.Node, self: cc.Node, target_x: number, self_x: number, speed_value: number) {

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
    private GetVertical(target: cc.Node, self: cc.Node, target_y: number, self_y: number, speed_value: number) {

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
        let ai: AI = null;
        let player: Player = null;
        if (target.name === "AI") {
            ai = target.getComponent(AI);
            if (ai.TimeBomb) {
                return;
            }
        }
        if (target.name === "Player") {
            player = target.getComponent(Player);
            if (player.TimeBomb) {
                return;
            }
        }

        let world_pos = target.parent.convertToWorldSpaceAR(target.position);
        let node_pos = this.TimeBomb.parent.convertToNodeSpaceAR(world_pos);
        // let act_move = cc.moveTo(0.3, node_pos);
        // let callback = () => {
        //     this.TimeBomb.removeFromParent(false);
        //     target.addChild(this.TimeBomb);
        //     this.TimeBomb.setPosition(0, 0);
        //     // this.TimeBomb = null;
        // }
        // let act_seq = cc.sequence(act_move, cc.callFunc(callback));
        // this.TimeBomb.runAction(act_seq);
        this.TimeBomb.setPosition(node_pos);
        this.TimeBomb.removeFromParent(false);
        target.addChild(this.TimeBomb);
        this.TimeBomb.setPosition(0, 0);
        if (ai) {
            ai.TimeBomb = this.TimeBomb;
        }
        if (player) {
            player.TimeBomb = this.TimeBomb;
        }
        let callback = () => {
            this.TimeBomb = null;
        }
        this.scheduleOnce(callback, 0.3);
    }

    /**
     * 碰撞到空投
     * @param target 空投奖励
     * @param self AI节点
     */
    private CollisionTransportation(target: cc.Node, self: cc.Node) {
        let arr_str = ["7", "2"];
        let ran = Math.floor(Math.random() * arr_str.length);
        let cha = arr_str[ran];
        // let spr_target = target.getChildByName("Card").getComponent(cc.Sprite);
        // let name = spr_target.spriteFrame.name;
        // let cha = name.charAt(0);
        //加速
        if (cha === "7") {
            EventCenter.BroadcastOne(EventType.Sound, SoundType.SpeedUp);
            this.TranSpeedUp.SetTransportation(self);
        }
        //金币
        if (cha === "2") {
            // this.TranCoin.SetTransportation();
        }
        target.destroy();
    }

    /**
     * 碰撞到终点线
     * @param target 终点线
     * @param self AI节点
     */
    private CollisionEnd(self: cc.Node) {
        let callback = () => {
            EventCenter.BroadcastOne(EventType.Sound, SoundType.Roadblock);
            this.IsMove = false;
            // this.unscheduleAllCallbacks();
        }
        this.scheduleOnce(callback, 0.5);

        let collider = this.node.getComponent(cc.BoxCollider);
        collider.enabled = false;

        let name = self.getChildByName("name").getComponent(cc.Label);
        GameManage.Instance.Ranking.push(name.string);
        EventCenter.Broadcast(EventType.Game_GameOver);
    }

    /**
     * 获取保护罩
     * @returns 保护罩是否打开
     */
    public GetPretection(target: cc.Node): boolean {
        if (this.IsOpen_Pretection) {
            if (target.name === "Handrail" || target.name === "Roadblock") {
                let act_rotate = cc.rotateBy(15, 10000);
                let act_move = cc.moveBy(15, 10000, 10000);
                let act_spa = cc.spawn(act_rotate, act_move);
                let act_callback = () => {
                    target.destroy();
                }
                let act_seq = cc.sequence(act_spa, cc.callFunc(act_callback));
                target.runAction(act_seq);
            } else {
                target.destroy();
            }
            let arr = this.node.children;
            let prop: cc.Node = null;
            for (let i = 0; i < arr.length; i++) {
                prop = arr[i];
                if (prop.name === "6") {
                    break;
                }
            }
            prop.destroy();
            this.IsOpen_Pretection = false;
            return true;
        }
        return false;
    }

    /**
     * 越界保护
     * @param self 玩家节点
     */
    private CrossingTheLineProtection(self: cc.Node) {
        this.Horizontal = 0;
        let role_arr = this.node.getChildByName("Role").children;
        for (let i = 0; i < role_arr.length; i++) {
            let role = role_arr[i];
            if (role.active) {
                let dra_role = role.getComponent(dragonBones.ArmatureDisplay);
                dra_role.playAnimation("a1", 0);
                break;
            }
        }

        let car_arr = this.node.getChildByName("Car").children;
        for (let i = 0; i < car_arr.length; i++) {
            let car = car_arr[i];
            if (car.active) {
                let dra_car = car.getComponent(dragonBones.ArmatureDisplay);
                dra_car.playAnimation("a1", 0);
                break;
            }
        }

        let collision = this.node.getComponent(cc.BoxCollider);
        collision.enabled = false;

        GameManage.Instance.IsListenterDis = false;
        this.IsSpeedUp = false;
        this.Speed = 0;

        self.setPosition(300, self.position.y);
        let act_fadOut = cc.fadeOut(0.5);
        let act_fadIn = cc.fadeIn(0.5);
        let act_seq_1 = cc.sequence(act_fadOut, act_fadIn);
        let act_rep = cc.repeat(act_seq_1, 3);
        let callback = () => {
            GameManage.Instance.IsListenterDis = true;
            collision.enabled = true;
            this.IsSpeedUp = true;
            this.Speed = 0;
        }
        let act_seq_2 = cc.sequence(act_rep, cc.callFunc(callback));
        self.runAction(act_seq_2);
    }

    /**
    * 设置特殊车辆
    */
    public SetSpecialCar(prop: cc.Node) {
        prop.getComponent(cc.BoxCollider).enabled = false;

        let dragon_prop = prop.getComponent(dragonBones.ArmatureDisplay);
        dragon_prop.playAnimation("a2", 1);
        let callback = () => {
            EventCenter.BroadcastOne(EventType.Sound, SoundType.SpecialCar);
            prop.destroy();
            let commont_car = this.node.getChildByName("Car");
            commont_car.active = false;

            let arr_Special: cc.Node[] = this.node.getChildByName("SpecialCar").children;
            let ran = Math.floor(Math.random() * arr_Special.length);
            GameManage.Instance.Current_SpecialCar = arr_Special[ran];
            let car = GameManage.Instance.Current_SpecialCar;
            car.active = true;
            let dragon = car.getComponent(dragonBones.ArmatureDisplay);
            dragon.playAnimation("a1", 0);
            this.Pickup.Effect(this);
        }

        this.scheduleOnce(callback, 0.3);
    }
}
