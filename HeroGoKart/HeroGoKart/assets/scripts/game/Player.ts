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
import Animation_TimeBomb from "../animation/Animation_TimeBomb";

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
     * @property 摄像机
     */
    @property(cc.Node)
    public Camera: cc.Node = null;
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
    private Speed_Max: number = 1000;
    /**
     * @property 灵敏度
     */
    public Horizontal_Sensitivity: number = 100;
    /**
     * @property 当前速度值
     */
    public Current_SpeedValue: number = 0;
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
     * @property 是否存在定时炸弹
     */
    public TimeBomb: cc.Node = null;
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
        this.UpdateSpeed();
        if (!GameManage.Instance.IsCameraFollow) {
            let size_hight = cc.winSize.height;
            if (this.node.position.y >= size_hight / 2 - 200) {
                GameManage.Instance.IsCameraFollow = true;
            }
        }


        // let dis_y = Math.abs(this.Camera.position.y - node_pos.y);
        // if (dis_y <= 50) {
        //     this.Camera.stopAllActions();
        //     this.IsCameraFollow = true;
        // } else {
        //     if (this.IsCameraFollow) {
        //         this.IsCameraFollow = false;
        //         let act_move = cc.moveTo(0.5, this.Camera.position.x, node_pos.y);
        //         this.Camera.runAction(act_move);
        //     }
        // }

        if (GameManage.Instance.IsCameraFollow && !GameManage.Instance.IsGameEnd) {
            // let camrea_y = this.Camera.position.y + this.Speed * dt;
            // this.Camera.setPosition(this.Camera.position.x, camrea_y);
            let world_pos = this.node.parent.convertToWorldSpaceAR(this.node.position);
            let node_pos = this.Camera.parent.convertToNodeSpaceAR(world_pos);
            this.Camera.setPosition(this.Camera.position.x, node_pos.y + 200);
        }
    }

    /**
     * 初始化
     */
    Init() {
        this.Game = this.node.parent.parent.getComponent(Game);

        //---------->主动道具效果
        this.BananaSkin = new EffectBananaSkin();
        this.Bomb = new EffectBomb();
        this.ClownGift = new EffectClownGift();
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
        this.TranSpeedUp = new TranSpeedUp();
        this.TranCoin = new TranCoin();


        // this.UpdateSpeed();
    }

    /**
     * 重置自身
     */
    public ResetSelf() {
        this.unscheduleAllCallbacks();
    }

    /**
     * 更新速度值
     */
    private UpdateSpeed() {
        // let callback = () => {
        if (!this.IsSpeedUp || !GameManage.Instance.IsGameStart) {
            return;
        }
        this.Speed += 2;
        if (this.Speed >= this.Speed_Max) {
            this.Speed = this.Speed_Max;
        }
        if (this.Speed % 100 === 0) {
            let num = this.Speed / 100;
            EventCenter.BroadcastOne<number>(EventType.Game_SetSpeedBar, num);
        }
        // }
        // this.schedule(callback, 1);
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
                this.CollisionWall(this.Game, self_node);
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
                this.CollisionTransportation(target, self_node);
                break;
            case "begin":
                // GameManage.Instance.IsUpdateProgress = true;
                break;
            case "end":
                this.CollisionEnd(self_node);
                break;
            default:
                break;
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
        EventCenter.Broadcast(EventType.Game_ExtractProp);
    }

    /**
     * 碰撞到道具
     * @param target 道具节点
     * @param self 玩家节点
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
        let istrue: boolean = null;
        let name = target.name;
        switch (name) {
            case "Coin":
                //金币
                this.EffectCoin.Effect(self, target);
                break;
            case Prop_Passive.Tornado:
                //龙卷风
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
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
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                this.EffectPaint.Effect(self, target);
                break;
            case Prop_Passive.Handrail:
                //栏杆
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                this.EffectHandrail.Effect(self, target);
                break;
            case Prop_Passive.Roadblock:
                //路障
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                this.EffectRoadblock.Effect(self, target);
                break;
            case Prop_Passive.Boulder:
                //大石头
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                this.EffectBoulder.Effect(self, target);
                break;
            case Prop_Passive.Piers:
                //石墩
                this.EffectPiers.Effect(self, target);
                break;
            case Prop_Passive.Water:
                //水滩
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
                this.EffectWater.Effect(self, target);
                break;
            case Prop_Passive.TimeBomb:
                //定时炸弹
                istrue = this.GetPretection(target);
                if (istrue) {
                    return
                }
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
        target.zIndex = 1;
        let collider = target.getComponent(cc.BoxCollider);
        collider.enabled = false;
        // console.log(this.node.children);
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
            // this.TimeBomb = null;
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

    /**
     * 碰撞到终点线
     */
    private CollisionEnd(self: cc.Node) {
        this.unscheduleAllCallbacks();
        let name = self.getChildByName("name").getComponent(cc.Label);
        GameManage.Instance.Ranking.push(name.string);

        GameManage.Instance.IsUpdateProgress = false;
        GameManage.Instance.IsGameEnd = true;

        EventCenter.Broadcast(EventType.Game_GameOver);
    }

    /**
     * 获取保护罩
     * @returns 保护罩是否打开
     */
    private GetPretection(target: cc.Node): boolean {
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
            let prop = this.node.getChildByName("6");
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
        this.Game.Horizontal = 0;
        let dra_role = this.Game.Current_Player_DraRoleNode.getComponent(dragonBones.ArmatureDisplay);
        dra_role.playAnimation("a1", 0);

        let dra_car = this.Game.Current_Player_DraCarNode.getComponent(dragonBones.ArmatureDisplay);
        dra_car.playAnimation("a1", 0);

        let collision = this.node.getComponent(cc.BoxCollider);
        collision.enabled = false;
        GameManage.Instance.IsTouchClick = false;
        this.IsSpeedUp = false;
        this.Speed = 0;

        self.setPosition(300, self.position.y);
        let act_fadOut = cc.fadeOut(0.5);
        let act_fadIn = cc.fadeIn(0.5);
        let act_seq_1 = cc.sequence(act_fadOut, act_fadIn);
        let act_rep = cc.repeat(act_seq_1, 3);
        let callback = () => {
            collision.enabled = true;
            GameManage.Instance.IsTouchClick = true;
            this.IsSpeedUp = true;
            this.Speed = 0;
        }
        let act_seq_2 = cc.sequence(act_rep, cc.callFunc(callback));
        self.runAction(act_seq_2);
    }

    /**
     * 设置
     */
    public SetCameraPos() {

    }


}
