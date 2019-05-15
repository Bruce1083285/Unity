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
import { Prop_Passive } from "../commont/Enum";
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
export default class AI extends cc.Component {

    /**
     * @property 道具精灵帧
     */
    @property([cc.SpriteFrame])
    private Fra_InitiativeProp: cc.SpriteFrame[] = [];
    /**
     * @property 定时炸弹
     */
    private TimeBomb: cc.Node = null;
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
     * @property 加速最大值
     */
    private Speed_Max: number = 1000;
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

    start() {

    }

    update(dt) {
        if (!GameManage.Instance.IsGameStart) {
            return;
        }
        //垂直移动
        let y = this.node.position.y + this.Speed * dt;
        //水平移动
        let x = this.node.position.x + this.Speed_Horizontal * 100 * dt * this.Horizontal;
        this.node.setPosition(x, y);
        this.UpdateSpeed();
        this.ListenterDistance();
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
    }

    /**
     * 更新速度值
     */
    private UpdateSpeed() {
        if (!this.IsSpeedUp || !GameManage.Instance.IsGameStart) {
            return;
        }
        this.Speed += 2;
        if (this.Speed >= this.Speed_Max) {
            this.Speed = this.Speed_Max;
        }
    }

    /**
     * 监听距离
     */
    private ListenterDistance() {
        let arr = this.Game.Area_Prop.children;
        for (let i = 0; i < arr.length; i++) {
            let prop = arr[i];
            //计算亮点距离
            let dis = prop.position.sub(this.node.position).mag();
            if (dis <= 50) {
                let ran = Math.random() * 100;
                if (ran <= 50) {
                    let ran_hor = Math.random() * 100;
                    let act_move: cc.ActionInterval = null;
                    if (ran_hor <= 50) {
                        act_move = cc.moveBy(0.3, 100, 0);
                    } else {
                        act_move = cc.moveBy(0.3, -100, 0);
                    }
                    this.node.runAction(act_move);
                }
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
                this.CollisionTransportation(target, self_node);
                break;
            case "begin":
                // GameManage.Instance.IsUpdateProgress = true;
                break;
            case "end":
                this.CollisionEnd(target, self_node);
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
        let istrue = this.GetPretection();
        if (istrue) {
            return
        }
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
                istrue = this.GetPretection();
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
                istrue = this.GetPretection();
                if (istrue) {
                    return
                }
                this.EffectPaint.Effect(self, target);
                break;
            case Prop_Passive.Handrail:
                //栏杆
                istrue = this.GetPretection();
                if (istrue) {
                    return
                }
                this.EffectHandrail.Effect(self, target);
                break;
            case Prop_Passive.Roadblock:
                //路障
                istrue = this.GetPretection();
                if (istrue) {
                    return
                }
                this.EffectRoadblock.Effect(self, target);
                break;
            case Prop_Passive.Boulder:
                //大石头
                istrue = this.GetPretection();
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
                istrue = this.GetPretection();
                if (istrue) {
                    return
                }
                this.EffectWater.Effect(self, target);
                break;
            case Prop_Passive.TimeBomb:
                //定时炸弹
                istrue = this.GetPretection();
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
     * @param target  炸弹节点
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
     * @param self AI节点
     */
    private CollisionTransportation(target: cc.Node, self: cc.Node) {
        let spr_target = target.getComponent(cc.Sprite);
        let name = spr_target.spriteFrame.name;
        let cha = name.charAt(0);
        //加速
        if (cha === "7") {
            this.TranSpeedUp.SetTransportation(self);
        }
        // //金币
        // if (cha === "2") {
        //     this.TranCoin.SetTransportation();
        // }
        target.destroy();
    }

    /**
     * 碰撞到终点线
     * @param target 终点线
     * @param self AI节点
     */
    private CollisionEnd(target: cc.Node, self: cc.Node) {
        let name = self.getChildByName("name").getComponent(cc.Label);
        GameManage.Instance.Ranking.push(name.string);
    }

    /**
     * 获取保护罩
     * @returns 保护罩是否打开
     */
    private GetPretection(): boolean {
        if (this.IsOpen_Pretection) {
            let prop = this.node.getChildByName("Prop");
            prop.destroy();
            this.IsOpen_Pretection = false;
            return true;
        }
        return false;
    }
}
