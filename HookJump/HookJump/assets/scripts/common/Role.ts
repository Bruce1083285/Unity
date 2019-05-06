import Cache from "./Cache";
import { CacheType, SoundType, Prop } from "./Enum";
import Game from "../Game";
import GameAudio from "../game/GameAudio";
import SmallCoinAnim from "../game/SmallCoinAnim";
import LuckDraw from "../game/LuckDraw";
import BeginTime from "../game/BeginTime";
import OverTime from "../game/OverTime";
import PropExtract from "../game/PropExtract";

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
export default class Role extends cc.Component {

    /**
     * @property 旋转速度
     */
    @property
    private Rotate_Speed: number = 0;
    /**
     * @property 旋转初始值
     */
    @property
    private Rotate_Init_Value: number = 0;
    /**
     * @property [Array]角色皮肤ID
     */
    @property([cc.SpriteFrame])
    private Skin_IDs: cc.SpriteFrame[] = [];
    /**
     * @property [Array]钩子皮肤ID
     */
    @property([cc.SpriteFrame])
    private Hook_Skin_IDs: cc.SpriteFrame[] = [];
    /**
     * @property [Array]绳子皮肤ID
     */
    @property([cc.SpriteFrame])
    private Rope_Skin_IDs: cc.SpriteFrame[] = [];
    /**
     * @property 钩子1
     */
    @property(cc.Node)
    private Hook_1: cc.Node = null;
    /**
    * @property 钩子2
    */
    @property(cc.Node)
    private Hook_2: cc.Node = null;
    /**
    * @property 钩子3
    */
    @property(cc.Node)
    private Hook_3: cc.Node = null;
    /**
     * @property 旋转开关
     */
    public Rotate_Switch: boolean = false;
    /**
     * @property 旋转值
     */
    private Rotate_Value: number = 0;
    /**
     * @property 手部
     */
    public Hand: cc.Node = null;
    /**
     * @property 绳子
     */
    // public Ropes: cc.Node[] = [];

    /**
     * @property 绳子1初始位置
     */
    private Rope_Init_Pos_1: cc.Vec2 = null;
    /**
     * @property 绳子2初始位置
     */
    private Rope_Init_Pos_2: cc.Vec2 = null;
    /**
     * @property 绳子3初始位置
     */
    private Rope_Init_Pos_3: cc.Vec2 = null;
    /**
     * @property 皮肤
     */
    private Skin: cc.Sprite = null;
    /**
     * @property 道具抽取类
     */
    private Prop_Extract: PropExtract = null;
    /**
     * @property 钩子是否显示
     */
    private ThreeHook_isShow: boolean = false;
    /**
     * @property 游戏类
     */
    private Game: Game = null;
    /**
     * @property 旋转方向
     */
    private Rotate_Dir: number = 1;


    onLoad() {
        // this.Init(1);
    }

    start() {

    }

    update(dt) {
        if (!this.Hook_1.active) {
            this.Hook_1.active = true;
        }
        if (this.Game && this.Game.Current_Prop === Prop.Reversal) {
            this.SetRotateDir(-1);
            this.Game.SetCurrentProp();
        }

        if (this.Game && !this.ThreeHook_isShow && this.Game.Current_Prop === Prop.HookThree) {
            this.HookShow();
            this.Game.Touch_Click_Count = 0;

            // this.Game.SetCurrentProp();
        }

        // if (this.Game.Touch_Click_Count >= 10 && this.Game.Current_Prop === Prop.HookThree) {
        //     this.HookClose();
        //     this.Game.SetCurrentProp();
        // }

        if (this.Game && !this.node.getChildByName("t_hz").active && this.Game.Current_Prop === Prop.Invincible) {
            this.ProtectShow();
            setTimeout(() => {
                let pr_show = cc.fadeIn(1);
                let pr_hide = cc.fadeOut(1);
                let seq = cc.sequence(pr_show, pr_hide);
                let repeat = cc.repeat(seq, 5);
                let callbacks = () => {
                    this.ProtectClose();
                    this.Game.SetCurrentProp();
                }
                let pr = this.node.getChildByName("t_hz");
                pr.runAction(cc.sequence(repeat, cc.callFunc(callbacks)));
            }, 25000);
        }

        if (this.Rotate_Switch) {
            this.Hand.rotation = this.Hand.rotation + this.Rotate_Value * this.Rotate_Dir;
        }
    }

    /**
     * 初始化
     * @param rotate_value 旋转值
     */
    Init(rotate_value: number) {
        //暂停角色浮动
        this.node.getComponent(cc.Animation).resume();
        this.Hand = this.node.getChildByName("Hand");
        this.Skin = this.node.getChildByName("role").getComponent(cc.Sprite);
        let arr_node = this.Hand.children;
        // for (let i = 0; i < arr_node.length; i++) {
        //     if (arr_node[i].name === "Mask") {
        //         // let rope = arr_node[i].getChildByName("shengzi");
        //         this.Ropes.push(arr_node[i]);
        //     }
        // }
        this.Game = this.node.parent.getComponent(Game);
        if (this.Game) {
            this.Prop_Extract = this.node.parent.getChildByName("Prop_Box").getComponent(PropExtract);
        }

        //赋值初始值
        // this.Rotate_Value = this.Rotate_Init_Value * this.Rotate_Speed * (level_num - 1) + this.Rotate_Init_Value;
        this.Rotate_Value = rotate_value;
        this.Rotate_Switch = true;
        // for (let i = 0; i < this.Ropes.length; i++) {
        //     let pos = this.Ropes[i].getChildByName("shengzi").position;
        //     this.Rope_Init_Pos_Arr.push(pos);
        // }
        this.Rope_Init_Pos_1 = this.Hook_1.position;
        if (this.Hook_2) {
            this.Rope_Init_Pos_2 = this.Hook_2.position;
            this.Rope_Init_Pos_3 = this.Hook_3.position;
        }

        //获取皮肤ID缓存
        let skin_id = Cache.GetCache(CacheType.Role_SkinId);
        // this.Game.SetNowRoleID(skin_id);
        this.UpdateSkin(skin_id);

        let hook_skin_id = Cache.GetCache(CacheType.Hook_SkinId);
        this.UpdateHookSkin(hook_skin_id);
    }

    /**
     * 设置旋转方向
     * @param dir 方向
     */
    SetRotateDir(dir: number) {
        this.Rotate_Dir = dir;
    }

    /**
     * 钩子显示
     */
    HookShow() {
        this.ThreeHook_isShow = true;
        // for (let i = 0; i < this.Ropes.length; i++) {
        //     this.Ropes[i].active = true;
        // }
        // this.Hook_1.active = true;
        this.Hook_2.parent.active = true;
        this.Hook_3.parent.active = true;
    }

    /**
     * 钩子关闭
     */
    HookClose() {
        this.ThreeHook_isShow = false;
        // for (let i = 0; i < this.Ropes.length; i++) {
        //     if (i != 0) {
        //         this.Ropes[i].active = false;
        //     } else {
        //         this.Ropes[i].active = true;
        //     }
        // }
        this.Hook_2.parent.active = false;
        this.Hook_3.parent.active = false;
    }

    onCollisionEnter(other, self) {
        if (other.node.group === "Down") {
            this.Death();
        }
        if (other.node.group === "Award") {
            this.CollisionAward(other.node, this.Game);
        }
    }

    /**
     * 启用保护罩
     */
    ProtectShow() {
        this.node.getChildByName("t_hz").active = true;
    }

    /**
     * 关闭保护罩
     */
    ProtectClose() {
        this.node.getChildByName("t_hz").active = false;
    }

    /**
     * 启用冲击波
     */
    ShockWave() {
        this.node.getChildByName("t_ccg").active = true;
    }

    /**
     * 奖励碰撞
     * @param award 奖励节点
     * @param game 游戏类
     */
    private CollisionAward(award: cc.Node, game: Game) {

        // award.removeComponent(cc.BoxCollider);
        award.active = false;
        let award_id = award.getComponent(cc.Sprite).spriteFrame.name;
        if (award_id === "jinbi") {
            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Coin_Audio);
            cc.find("Canvas/SmallCoin_Anim").getComponent(SmallCoinAnim).Play(award);
            // let coin_sum = Cache.GetCache(CacheType.Coin);
            // let sum = parseInt(coin_sum) + 5;
            // this.Game.SetCurrentCoin(5 + "");
            // Cache.SetCache(CacheType.Coin, sum + "");
            // game.UpdateCoin();
        } else if (award_id === "luck") {
            this.Game.Page_LuckDraw.active = true;
            this.Game.SetDowSwitch(false);
            this.Game.Page_LuckDraw.getComponent(LuckDraw).Play();
            // this.scheduleOnce(() => {
            //     //抽奖
            //     // console.log("角色抽奖");
            // }, 1.5);
        } else if (award_id === "propbox") {
            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Prize_Audio);
            this.Prop_Extract.Play();
        } else if (award_id === "fragment") {
            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Prize_Audio);
            let fra = Cache.GetCache(CacheType.FragmentNum);
            let sum = 0;
            if (!fra) {
                fra = "0";
            }
            sum = parseInt(fra) + 5;
            Cache.SetCache(CacheType.FragmentNum, sum + "");
        } else {
            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Prize_Audio);
            // this.scheduleOnce(() => {
            //     this.Game.HintShow(award_id);
            // }, 1.2);
            setTimeout(() => {
                this.Game.HintShow(award_id);
            }, 1200);
        }
        // console.log(award_id);
    }

    /**
     * 更新皮肤
     * @param skin_id 皮肤ID
     */
    UpdateSkin(skin_id: string) {
        for (let i = 0; i < this.Skin_IDs.length; i++) {
            if (this.Skin_IDs[i].name === skin_id) {
                this.Skin.spriteFrame = this.Skin_IDs[i];
                return;
            }
        }
    }

    /**
     * 更新钩子皮肤
     * @param skin_id 皮肤ID
     */
    UpdateHookSkin(skin_id: string) {
        for (let i = 0; i < this.Hook_Skin_IDs.length; i++) {
            if (this.Hook_Skin_IDs[i].name === skin_id) {
                //绳子
                this.Hook_1.getComponent(cc.Sprite).spriteFrame = this.Rope_Skin_IDs[i];
                //钩子
                this.Hook_1.getChildByName("gouzi").getComponent(cc.Sprite).spriteFrame = this.Hook_Skin_IDs[i];

                if (this.Hook_2) {
                    this.Hook_2.getComponent(cc.Sprite).spriteFrame = this.Rope_Skin_IDs[i];
                    this.Hook_3.getComponent(cc.Sprite).spriteFrame = this.Rope_Skin_IDs[i];

                    this.Hook_2.getChildByName("gouzi").getComponent(cc.Sprite).spriteFrame = this.Hook_Skin_IDs[i];
                    this.Hook_3.getChildByName("gouzi").getComponent(cc.Sprite).spriteFrame = this.Hook_Skin_IDs[i];
                }
                return;
            }
        }
    }

    /**
     * 钩子伸长
     * @param dt 持续时间
     */
    HookElongation(dt: number) {
        this.Prop_Extract.Hook_IsShrink = false;

        // let sprite_frame = this.Prop_Extract.Prop_Box.getComponent(cc.Sprite).spriteFrame;
        // if (sprite_frame) {
        //     this.Prop_Extract.Extract_Switch = false;
        // }
        this.Rotate_Switch = false;
        // for (let i = 0; i < this.Ropes.length; i++) {
        //     // if (this.Ropes[i].active) {
        //     let rope = this.Ropes[i].getChildByName("shengzi");
        //     let elong = cc.moveBy(dt, 0, 2000);
        //     rope.runAction(elong);
        //     // }
        // }
        let elong_1 = cc.moveBy(dt, 0, 2000);
        let elong_2 = cc.moveBy(dt, 0, 2000);
        let elong_3 = cc.moveBy(dt, 0, 2000);
        this.Hook_1.runAction(elong_1);
        if (this.Hook_2 && this.Hook_2.parent.active) {
            this.Hook_2.runAction(elong_2);
            this.Hook_3.runAction(elong_3);
        }
    }

    /**
     * 钩子收回
     * @param dt 持续时间
     */
    HookShrink(dt: number) {
        this.Prop_Extract.Hook_IsShrink = true;

        // let sprite_frame = this.Prop_Extract.Prop_Box.getComponent(cc.Sprite).spriteFrame;
        // if (sprite_frame) {
        //     this.Prop_Extract.Extract_Switch = true;
        // }
        let callfunc = cc.callFunc(() => {
            let isfirst = Cache.GetCache(CacheType.IsFirst);
            if (isfirst) {
                this.Rotate_Switch = true;
            }
            if (this.Game.Current_Prop === Prop.DownStop || this.Game.Current_Prop === Prop.HookThree) {
                this.Game.Touch_Click_Count++;
            }
            if (this.Game.Touch_Click_Count >= 10) {
                //底部停止
                if (this.Game.Current_Prop === Prop.DownStop) {
                    let callback = () => {
                        let arr = this.Game.Down.children;
                        icefor:
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].active) {
                                arr[i].getChildByName("anim").getComponent(cc.Animation).play();
                                break icefor;
                            }
                        }

                        this.Game.ICE.active = false;
                        this.Game.Prop_IsDownOpen = false;
                        this.Game.SetDowSwitch(true);
                        this.Game.SetCurrentProp();
                    }
                    let show = cc.fadeIn(0.5);
                    let hide = cc.fadeOut(0.5);
                    let seq = cc.sequence(show, hide);
                    let rep = cc.repeat(seq, 3);
                    this.Game.ICE.runAction(cc.sequence(rep, cc.callFunc(callback)));
                }

                //三个钩子
                if (this.Game.Current_Prop === Prop.HookThree) {
                    this.HookClose();
                    this.Game.SetCurrentProp();
                }
                this.Game.Touch_Click_Count = 0;
            }
        });
        // for (let i = 0; i < this.Ropes.length; i++) {
        //     // if (this.Ropes[i].active) {
        //     let rope = this.Ropes[i].getChildByName("shengzi");
        //     rope.stopAllActions();
        //     let shrink = cc.moveTo(dt, this.Rope_Init_Pos_Arr[i]);
        //     // rope.runAction(cc.sequence(shrink));
        //     rope.runAction(shrink);
        //     // }
        // }
        this.Hook_1.stopAllActions();
        if (this.Hook_2 && this.Hook_2.parent.active) {
            this.Hook_2.stopAllActions();
            this.Hook_3.stopAllActions();
        }

        let shrink_1 = cc.moveTo(dt, this.Rope_Init_Pos_1);
        let shrink_2 = cc.moveTo(dt, this.Rope_Init_Pos_2);
        let shrink_3 = cc.moveTo(dt, this.Rope_Init_Pos_3);
        this.Hook_1.runAction(cc.sequence(shrink_1, callfunc));
        if (this.Hook_2 && this.Hook_2.parent.active) {
            this.Hook_2.runAction(shrink_2);
            this.Hook_3.runAction(shrink_3);
        }
    }

    /**
     * 角色移动
     * @param hook 自身节点
     * @param dt 持续时间
     * @param hook 自身节点
     * @param target 目标节点
     */
    Move(dt: number, hook: cc.Node, target: cc.Node) {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Jump_Audio);
        //钩子位置
        let hook_world_pos = hook.parent.convertToWorldSpaceAR(hook.position);
        let hook_node_pos = this.node.parent.convertToNodeSpaceAR(hook_world_pos);

        let target_world_pos = target.parent.convertToWorldSpaceAR(target.position);
        let target_node_pos = this.node.parent.convertToNodeSpaceAR(target_world_pos);
        let move = cc.moveTo(dt, hook_node_pos);
        let callFunc = cc.callFunc(() => {
            this.node.setPosition(hook_node_pos.x, target_node_pos.y);
        });
        this.node.runAction(cc.sequence(move, callFunc));
    }

    /**
     * 向下移动
     * @param dt 持续时间
     * @param dis_y Y轴距离
     */
    MoveDown(dt: number, dis_y: number) {
        console.log("角色向下移动是否进入");
        // this.node.stopAllActions();
        let move_down = cc.moveBy(dt, 0, dis_y);
        let callFunc = cc.callFunc(() => {
            this.scheduleOnce(() => {
                //恢复角色浮动
                this.node.getComponent(cc.Animation).resume();
            }, 1);
        });
        this.node.runAction(cc.sequence(move_down, callFunc));
    }

    /**
     * 死亡
     */
    private Death() {
        if (this.Game.Current_Prop === Prop.Invincible) {
            this.Game.DownMoveDown(1.5, -1000);
            return
        }
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Death_Audio);
        this.SetRotateDir(1);
        this.node.stopAllActions();
        this.Rotate_Switch = false;
        let death_rotate = cc.rotateBy(0.5, -60);
        this.Game.SetTouchSwitch(false);
        let callFunc = cc.callFunc(() => {
            this.Game.Page_GameOver.getChildByName("but_Resurrection").active = true;
            this.Game.Page_GameOver.getChildByName("Coin").active = false;

            this.Game.Page_GameOver.getChildByName("Buts").getChildByName("Buts_Right").getChildByName("but_Restart").active = true;
            this.Game.Page_GameOver.getChildByName("Title").getChildByName("title_2").active = true;
            //暂停角色浮动
            this.node.getComponent(cc.Animation).pause();
            // this.Game.GameOver();
            this.Game.SetDowSwitch(false);
            // this.node.parent.getChildByName("OverTime").getComponent(OverTime).Play();
            this.Game.GameOver();
        });
        this.node.runAction(cc.sequence(death_rotate, callFunc));
    }

    /**
     * 重置
     */
    Reset() {
        this.SetRotateDir(1);
        this.node.setPosition(-6, -262);
        this.node.stopAllActions();
        this.Rotate_Switch = true;
        this.node.rotation = 0;
        let skin_id = Cache.GetCache(CacheType.Role_SkinId);
        this.UpdateSkin(skin_id);
    }

    /**
     * 复活
     */
    Resurrection() {
        this.SetRotateDir(1);
        this.node.rotation = 0;
        this.Rotate_Switch = true;
        this.node.getComponent(cc.Animation).play();
    }

}
