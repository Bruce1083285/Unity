import Role from "../common/Role";
import Game from "../Game";
import Stage from "./Stage";
import EventListenter from "../common/EventListenter";
import { EventType, CacheType, SoundType } from "../common/Enum";
import Cache from "../common/Cache";
import CoinAnim from "./CoinAnim";
import GameAudio from "./GameAudio";
import SmallCoinAnim from "./SmallCoinAnim";
const sdk = require("../common/sdk")

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
export default class Hook extends cc.Component {

    /**
     * @property 金币动画
     */
    private Coin_Anim: cc.Node = null;
    /**
     * @property 角色
     */
    private Role: Role = null;
    /**
     * @property 游戏
     */
    private Game: Game = null;
    /**
     * @property 碰撞开关
     */
    private Collision_Switch: boolean = true;
    /**
     * @property 新手指引台阶数
     */
    private Novice_Stage_Num: number = 0;

    onLoad() {
        this.Init();
    }

    start() {

    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.Role = cc.find("Canvas/Role").getComponent(Role);
        this.Game = cc.find("Canvas").getComponent(Game);
        this.Coin_Anim = cc.find("Canvas/Coin_Anim");
    }

    onCollisionEnter(other, self) {

        if (other.node.group === "Wall") {
            this.CollisionWall(this.Role, this.Game);
            return;
        }

        // console.log("碰撞开关");
        // console.log(this.Collision_Switch);
        // if (this.Collision_Switch) {
        // this.Collision_Switch = false;
        if (other.node.group === "Stage") {
            // this.OpenRoleParticle(self.node);
            let stage: cc.Node = other.node;
            let boxcollider = stage.getComponent(cc.BoxCollider);
            if (!boxcollider.enabled) {
                return;
            }
            boxcollider.enabled = false;
            // stage.removeComponent(cc.BoxCollider);
            //停止平台左右移动
            let stage_act = stage.getComponent(Stage).Stage_Action;
            if (stage_act) {
                stage.stopAction(stage_act);
            }

            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Hooking_Audio);
            stage.getComponent(Stage).Play();
            this.Game.Back_Click_Switch = false;
            let isfirst = Cache.GetCache(CacheType.IsFirst);
            if (!isfirst) {
                this.Novice_Stage_Num++;
                this.Game.Ripple.active = false;
                if (this.Novice_Stage_Num >= 2) {
                    this.Game.But_Back.getComponent(cc.Button).interactable = true;
                    Cache.SetCache(CacheType.IsFirst, "true");
                    sdk.playGame(0);
                }
            }
            this.CollisionStage(this.Role, this.Game, other.node, self.node);
            // }
        }
    }

    /**
     * 开启角色粒子效果
     */
    private OpenRoleParticle() {
        // let world_pos = self.parent.convertToWorldSpaceAR(self.position);
        // let node_pos = this.Role.Hand.convertToNodeSpaceAR(world_pos);
        // let hand = this.Role.Hand.getChildByName("shou");
        // let dir_x = node_pos.x - hand.position.x;
        // let dir_y = node_pos.y - hand.position.x;
        // let dir = cc.v2(dir_x, dir_y);

        // let angle = dir.signAngle(cc.v2(1, 0));
        // let degree = angle / Math.PI * 180;
        // let win = this.Role.node.getChildByName("win");
        // win.rotation = degree;
        let win = this.Role.node.getChildByName("win");
        win.active = true;
        win.getComponent(cc.ParticleSystem).resetSystem();
        let rotate = this.Role.Hand.rotation;
        win.rotation = rotate;
    }

    /**
     * 关闭角色粒子效果
     */
    private CloseRoleParticle() {
        let win = this.Role.node.getChildByName("win");
        win.active = false;
    }

    /**
     * 墙体碰撞
     * @param role 角色类
     * @param game 游戏类
     */
    private CollisionWall(role: Role, game: Game) {
        role.HookShrink(0.2);
        setTimeout(() => {
            game.SetTouchSwitch(true);
        }, 700);
    }

    /**
     * 台阶碰撞
     * @param role 角色类
     * @param game 游戏类
     * @param target 目标节点
     * @param self 自身节点
     */
    private CollisionStage(role: Role, game: Game, target: cc.Node, self: cc.Node) {

        let hook_world_pos = self.parent.convertToWorldSpaceAR(self.position);
        let hook_node_pos = this.Game.SoilResidue.node.parent.convertToNodeSpaceAR(hook_world_pos);
        // this.Game.SoilResidue.node.active = true;
        this.Game.SoilResidue.node.setPosition(hook_node_pos);
        this.Game.SoilResidue.resetSystem();
        // console.log(this.Game.SoilResidue);

        this.OpenRoleParticle();
        role.HookShrink(0.2);
        role.Move(0.36, self, target);

        // target.getChildByName("award").removeComponent(cc.BoxCollider);
        setTimeout(() => {
            // this.Game.SoilResidue.node.active = false;
            this.CloseRoleParticle();
            role.MoveDown(1, -800);
            let stage_arr = game.Stage_Area.children;
            for (let i = 0; i < stage_arr.length; i++) {
                stage_arr[i].getComponent(Stage).MoveDown(1, -800);
            }
            game.DownMoveDown(1.5, -100);
            game.SetPlatformShow(false);
            let isfirst = Cache.GetCache(CacheType.IsFirst);
            if (!isfirst) {
                //向下移动结束
                this.scheduleOnce(() => {
                    game.SetTouchSwitch(true);
                    this.Game.Ripple.active = true;
                    this.Role.node.getChildByName("Hand").rotation = 5;
                }, 1);
                return;
            }
            //向下移动结束
            setTimeout(() => {
                console.log("向下移动结束");
                this.Collision_Switch = true;
                game.SetTier();
                game.SetTouchSwitch(true);
                this.Game.Back_Click_Switch = true;
                game.RecoveryStage();
                game.SetStage();
            }, 1000);
        }, 500);
    }



}
