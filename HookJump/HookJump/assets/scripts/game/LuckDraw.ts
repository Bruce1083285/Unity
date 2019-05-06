import CoinAnim from "./CoinAnim";
import Role from "../common/Role";
import Game from "../Game";
import Cache from "../common/Cache";
import { CacheType, SoundType, Prop } from "../common/Enum";
import WX from "../common/WX";
import GameAudio from "./GameAudio";
import Http from "../common/Http";

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
export default class LuckDraw extends cc.Component {

    /**
     * @property 灯光持续时间
     */
    @property
    private Lighting_DT: number = 0;
    /**
     * @property 抽奖旋转初始持续时间
     */
    @property
    private LuckDraw_Init_DT: number = 0;
    /**
     * @property 旋转持续时间增减初始值值
     */
    @property
    private LuckDraw_Init_Value: number = 0;
    /**
     * @property [Array]背景皮肤
     */
    @property([cc.SpriteFrame])
    private Award_Role_Skin: cc.SpriteFrame[] = [];
    /**
     * @property [Array]背景皮肤
     */
    @property([cc.SpriteFrame])
    private Award_BG_Skin: cc.SpriteFrame[] = [];
    /**
     * @property 金币礼包
     */
    @property(cc.SpriteFrame)
    private Award_Coin_Gift: cc.SpriteFrame = null;
    /**
     * @property 金币提醒
     */
    @property(cc.SpriteFrame)
    private Hint_Gift: cc.SpriteFrame = null;
    /**
     * @property 背景皮肤提醒
     */
    @property(cc.SpriteFrame)
    private Hint_BG: cc.SpriteFrame = null;
    /**
     * @property 角色皮肤提醒
     */
    @property(cc.SpriteFrame)
    private Hint_Role: cc.SpriteFrame = null;
    /**
    * @property 抽奖旋转持续时间
    */
    private LuckDraw_DT: number = 0;
    /**
     * @property 旋转持续时间增减值
     */
    private LuckDraw_Value: number = 0;
    /**
     * @property 抽奖旋转索引值
     */
    private LuckDraw_Ind: number = 0;
    /**
     * @property 灯光
     */
    private Lightings: cc.Node = null;
    /**
     * @property 光标盒子
     */
    private Cursor_Box: cc.Node = null;
    /**
     * @property 角色节点
     */
    private Rloe: cc.Node = null;
    /**
     * @property 游戏节点
     */
    private Game: cc.Node = null;
    /**
     * @property 提醒
     */
    private Hint: cc.Node = null;
    /**
     * @property 金币动画
     */
    private Coin_Anim: cc.Node = null;
    /**
     * @property 抽奖按钮
     */
    private Click_Switch: boolean = null;
    /**
     * @property 当前奖励
     */
    private Current_Award_Name: string = null;
    /**
     * @property 金币礼包随机数
     */
    private Gift_Coin_Ran: number = null;
    /**
     * @property 领取点击开关
     */
    private Receive_Click_Switch = true;
    /**
     * @property [Array]金币奖励值
     */
    private Gift_Value: string[] = ["20", "18", "16", "14", "12", "10"];
    /**
     * @property [Array]奖品
     */
    private Prizes: cc.Node[] = [];


    onLoad() {
        this.Init();
    }

    start() {

    }

    update(dt) {
    }


    /**
     * 初始化
     */
    Init() {
        this.Lightings = this.node.getChildByName("LuckDraw").getChildByName("Lighting");
        this.Cursor_Box = this.node.getChildByName("LuckDraw").getChildByName("cursor_box");
        this.Prizes = this.node.getChildByName("LuckDraw").getChildByName("Prize").children;
        this.Hint = this.node.getChildByName("LuckDraw").getChildByName("Hint");
        this.Rloe = cc.find("Canvas/Role");
        this.Game = cc.find("Canvas");
        this.Coin_Anim = cc.find("Canvas/Coin_Anim");

        this.LuckDraw_DT = this.LuckDraw_Init_DT;
        this.LuckDraw_Value = this.LuckDraw_Init_Value;
        //开启点击开关
        this.Click_Switch = true;

        this.LightingTwinkle(this.Lightings, this.Lighting_DT);

        // this.LuckDraw(this.Prizes, this.Cursor_Box);
        // this.Play();
    }

    /**
     * 开始抽奖
     */
    Play() {
        this.Cursor_Box.active = false;
        this.Click_Switch = true;
        //随机奖品索引下标
        this.LuckDraw_Ind = Math.floor(Math.random() * this.Prizes.length);
        // this.SetPrize(this.Prizes, this.Award_BG_Skin, this.Award_Role_Skin, this.Award_Coin_Gift, this.Rloe, this.Game);
        this.SetLuckPrizer();
    }

    /**
     * 设置奖品
     */
    private SetLuckPrizer() {
        let ran = Math.floor(Math.random() * 100);
        if (ran < 30 && ran >= 0) {
            this.Current_Award_Name = "f5";
        } else if (ran >= 30 && ran < 60) {
            this.Current_Award_Name = "c66";
        } else if (ran >= 60 && ran < 80) {
            this.Current_Award_Name = "f20";
        } else if (ran >= 80 && ran < 90) {
            this.Current_Award_Name = "c520"
        } else if (ran >= 90 && ran < 95) {
            this.Current_Award_Name = "c888";
        } else if (ran >= 95 && ran < 100) {
            this.Current_Award_Name = "f50";
        }
    }

    /**
     * 抽奖
     * @param prizes [Array]奖品
     * @param cursor_box 光标盒子
     */
    private LuckDraw(prizes: cc.Node[], cursor_box: cc.Node) {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Luck_Audio);
        let pri_world_pos = prizes[this.LuckDraw_Ind].parent.convertToWorldSpaceAR(prizes[this.LuckDraw_Ind].position);
        let pri_node_pos = cursor_box.parent.convertToNodeSpaceAR(pri_world_pos);
        cursor_box.setPosition(pri_node_pos);
        this.scheduleOnce(() => {
            if (this.LuckDraw_DT > 0.1) {
                this.LuckDraw_DT = this.LuckDraw_DT + this.LuckDraw_Value;
                if (this.LuckDraw_DT < 0.2 && this.LuckDraw_DT > 0.1) {
                    this.LuckDraw_DT = 0;
                }
            }
            if (this.LuckDraw_DT <= 0) {
                this.LuckDraw_DT = 0.05;
                this.scheduleOnce(() => {
                    this.LuckDraw_Value = 0.1;
                    this.LuckDraw_DT = 0.11;
                }, 2);
            }
            luckover:
            if (this.LuckDraw_DT >= 0.7) {
                let isget = this.GetLuckAward();
                if (isget) {
                    cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Award_Audio);

                    if (this.Hint.active) {
                        this.Hint.stopAllActions()
                    }
                    let Label = this.Hint.getChildByName("hint_label").getComponent(cc.Label);
                    let prize_type = this.Current_Award_Name.charAt(0);
                    let prize_num = this.Current_Award_Name.slice(1);
                    switch (prize_type) {
                        case "c":
                            Label.string = "恭喜获得" + prize_num + "金币";
                            break;
                        case "f":
                            Label.string = "恭喜获得" + prize_num + "碎片";
                            break;
                        default:
                            break;
                    }
                    this.Hint.active = true;
                    this.Hint.opacity = 255;
                    let pos = this.Hint.position;
                    this.Hint.scale = 0.1;
                    let show = cc.scaleTo(1.5, 1, 1);
                    let move_up = cc.moveBy(1.5, 0, 100);
                    let hide = cc.fadeOut(1.5);
                    let close = cc.callFunc(() => {
                        this.Hint.active = false;
                        this.Hint.setPosition(pos);
                        this.node.active = false;
                        let ribbon = this.node.getChildByName("Ribbon");
                        ribbon.active = false;
                        this.Game.getComponent(Game).GameOver();
                        this.Game.getComponent(Game).UpdateCoin();
                    });
                    this.Hint.runAction(cc.sequence(show, cc.spawn(move_up, hide), close));
                    return;
                }

                // // this.Click_Switch = true;
                // let prize_id = this.GetPrize(cursor_box, prizes);
                // if (prize_id === "gift") {
                //     this.Gift_Coin_Ran = Math.floor(Math.random() * this.Gift_Value.length);
                //     let level_num = parseInt(this.Game.getComponent(Game).Level_Num.string);
                //     // level_num = 1;
                //     // if (level_num < 2) {
                //     let coin_ran_num = parseInt(this.Gift_Value[this.Gift_Coin_Ran]);
                //     let current_prop = this.Game.getComponent(Game).Current_Prop;
                //     if (current_prop === Prop.DoubleCoin) {
                //         coin_ran_num *= 2;
                //     }
                //     this.SetCurrentCoin(coin_ran_num + "");
                //     cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Coin_Audio);
                //     this.Coin_Anim.getComponent(CoinAnim).Play(coin_ran_num + "");
                //     let coin_num = Cache.GetCache(CacheType.Coin);
                //     let sum = parseInt(coin_num) + coin_ran_num;
                //     Cache.SetCache(CacheType.Coin, sum + "");
                //     this.node.active = false;
                //     // this.Game.getComponent(Game).SetDowSwitch(true);
                //     this.node.getChildByName("LuckDraw").active = false;
                //     this.Game.getComponent(Game).GameOver();
                //     //     return
                //     // }
                //     // this.GetAward();
                //     // this.Hint.active = true;
                //     // let hint_lang = this.Hint.getChildByName("title").getComponent(cc.Sprite);
                //     let bg_id = prize_id.charAt(0);
                //     if (prize_id === "gift") {
                //         cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Prize_Audio);
                //         // let coin_label = this.Hint.getChildByName("coin_label").getComponent(cc.Label);
                //         // coin_label.string = this.Gift_Value[this.Gift_Coin_Ran];
                //         // hint_lang.spriteFrame = this.Hint_Gift;
                //     } else if (bg_id === "b") {
                //         cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Prize_Audio);
                //         // hint_lang.spriteFrame = this.Hint_BG;
                //     } else {
                //         cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Prize_Audio);
                //         // hint_lang.spriteFrame = this.Hint_Role;
                //     }
                //     return;
                // }
            }
            this.LuckDraw_Ind++;
            if (this.LuckDraw_Ind >= prizes.length) {
                this.LuckDraw_Ind = 0;
            }
            this.LuckDraw(prizes, cursor_box);
        }, this.LuckDraw_DT);
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Click);
        if (this.Click_Switch && click === "luck") {
            this.Cursor_Box.active = true;
            this.Click_Switch = false;
            //重置旋转持续时间
            this.LuckDraw_DT = this.LuckDraw_Init_DT;
            //重置持续时间增减值
            this.LuckDraw_Value = this.LuckDraw_Init_Value;
            this.Cursor_Box.active = true;
            this.LuckDraw(this.Prizes, this.Cursor_Box);
        }

        if (click === "yes") {
            if (this.Receive_Click_Switch) {
                this.Receive_Click_Switch = false;
                let prize_id = this.GetPrize(this.Cursor_Box, this.Prizes);
                // prize_id = "b_2";
                if (prize_id != "gift") {

                    //背景皮肤
                    let bg_id = this.GetSkin(prize_id, this.Award_BG_Skin);
                    // console.log("抽奖奖励ID：" + bg_id);
                    if (bg_id) {
                        //更新背景皮肤
                        // cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
                        // cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM(bg_id);
                        // this.Game.getComponent(Game).UpdateBG(bg_id);
                        this.Game.getComponent(Game).SetNowBG(bg_id);
                        this.Hint.active = false;
                        this.node.active = false;
                        this.Game.getComponent(Game).SetDowSwitch(true);
                        return;
                    }

                    //角色皮肤
                    let role_id = this.GetSkin(prize_id, this.Award_Role_Skin);
                    if (role_id) {
                        //更新角色皮肤
                        this.Game.getComponent(Game).SetNowRoleID(prize_id);
                        // this.Rloe.getComponent(Role).UpdateSkin(prize_id);
                        this.Hint.active = false;
                        this.node.active = false;
                        this.Game.getComponent(Game).SetDowSwitch(true);
                        return;
                    }
                } else if (prize_id === "gift") {
                    let coin_ran_num = parseInt(this.Gift_Value[this.Gift_Coin_Ran]);
                    let current_prop = this.Game.getComponent(Game).Current_Prop;
                    if (current_prop === Prop.DoubleCoin) {
                        coin_ran_num *= 2;
                    }
                    this.SetCurrentCoin(coin_ran_num + "");
                    cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Coin_Audio);
                    this.Coin_Anim.getComponent(CoinAnim).Play(coin_ran_num + "");
                    let coin_num = Cache.GetCache(CacheType.Coin);
                    let sum = parseInt(coin_num) + coin_ran_num;
                    Cache.SetCache(CacheType.Coin, sum + "");
                } else {
                    // console.log("奖品未找到");
                }
                this.Hint.active = false;
                this.node.getChildByName("LuckDraw").active = false;
                this.node.active = false;
                this.Game.getComponent(Game).SetDowSwitch(true);
                // cc.audioEngine.resumeAll();
                this.Receive_Click_Switch = true;
                this.Game.getComponent(Game).GameOver();
                return
                if (WX.IsPlay) {
                    cc.audioEngine.pauseAll();
                    let istrue = true;
                    let callFunc_yes = () => {
                        if (istrue) {
                            //背景皮肤
                            let prize_id = this.GetPrize(this.Cursor_Box, this.Prizes);
                            // prize_id = "b_2";
                            if (prize_id != "gift") {

                                //背景皮肤
                                let bg_id = this.GetSkin(prize_id, this.Award_BG_Skin);
                                // console.log("抽奖奖励ID：" + bg_id);
                                if (bg_id) {
                                    //更新背景皮肤
                                    // cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
                                    // cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM(bg_id);
                                    // this.Game.getComponent(Game).UpdateBG(bg_id);
                                    this.Game.getComponent(Game).SetNowBG(bg_id);
                                    this.Hint.active = false;
                                    this.node.active = false;
                                    this.Game.getComponent(Game).SetDowSwitch(true);
                                    return;
                                }

                                //角色皮肤
                                let role_id = this.GetSkin(prize_id, this.Award_Role_Skin);
                                if (role_id) {
                                    //更新角色皮肤
                                    this.Game.getComponent(Game).SetNowRoleID(prize_id);
                                    // this.Rloe.getComponent(Role).UpdateSkin(prize_id);
                                    this.Hint.active = false;
                                    this.node.active = false;
                                    this.Game.getComponent(Game).SetDowSwitch(true);
                                    return;
                                }
                            } else if (prize_id === "gift") {
                                let coin_ran_num = parseInt(this.Gift_Value[this.Gift_Coin_Ran]);
                                let current_prop = this.Game.getComponent(Game).Current_Prop;
                                if (current_prop === Prop.DoubleCoin) {
                                    coin_ran_num *= 2;
                                }
                                this.SetCurrentCoin(coin_ran_num + "");
                                cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Coin_Audio);
                                this.Coin_Anim.getComponent(CoinAnim).Play(coin_ran_num + "");
                                let coin_num = Cache.GetCache(CacheType.Coin);
                                let sum = parseInt(coin_num) + coin_ran_num;
                                Cache.SetCache(CacheType.Coin, sum + "");
                            } else {
                                // console.log("奖品未找到");
                            }
                            this.Hint.active = false;
                            this.node.getChildByName("LuckDraw").active = false;
                            this.node.active = false;
                            this.Game.getComponent(Game).SetDowSwitch(true);
                            cc.audioEngine.resumeAll();
                            this.Receive_Click_Switch = true;

                            istrue = false;
                        }
                    }
                    let callFunc_no = () => {
                        cc.audioEngine.resumeAll();
                        this.Receive_Click_Switch = true;
                    }
                    WX.RewardedVideoClose(callFunc_yes, callFunc_no);
                } else {

                    let istrue = true;
                    let callFunc_yes = () => {
                        // if (istrue) {
                        //背景皮肤
                        let prize_id = this.GetPrize(this.Cursor_Box, this.Prizes);
                        // prize_id = "b_2";
                        if (prize_id != "gift") {

                            //背景皮肤
                            let bg_id = this.GetSkin(prize_id, this.Award_BG_Skin);
                            // console.log("抽奖奖励ID：" + bg_id);
                            if (bg_id) {
                                //更新背景皮肤
                                // cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
                                // cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM(bg_id);
                                // this.Game.getComponent(Game).UpdateBG(bg_id);
                                this.Game.getComponent(Game).SetNowBG(bg_id);
                                this.Hint.active = false;
                                this.node.active = false;
                                this.Game.getComponent(Game).SetDowSwitch(true);
                                return;
                            }

                            //角色皮肤
                            let role_id = this.GetSkin(prize_id, this.Award_Role_Skin);
                            if (role_id) {
                                //更新角色皮肤
                                this.Game.getComponent(Game).SetNowRoleID(prize_id);
                                // this.Rloe.getComponent(Role).UpdateSkin(prize_id);
                                this.Hint.active = false;
                                this.node.active = false;
                                this.Game.getComponent(Game).SetDowSwitch(true);
                                return;
                            }
                        } else if (prize_id === "gift") {
                            let coin_ran_num = parseInt(this.Gift_Value[this.Gift_Coin_Ran]);
                            let current_prop = this.Game.getComponent(Game).Current_Prop;
                            if (current_prop === Prop.DoubleCoin) {
                                coin_ran_num *= 2;
                            }
                            this.SetCurrentCoin(coin_ran_num + "");
                            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Coin_Audio);
                            this.Coin_Anim.getComponent(CoinAnim).Play(coin_ran_num + "");
                            let coin_num = Cache.GetCache(CacheType.Coin);
                            let sum = parseInt(coin_num) + coin_ran_num;
                            Cache.SetCache(CacheType.Coin, sum + "");
                        } else {
                            // console.log("奖品未找到");
                        }
                        this.Hint.active = false;
                        this.node.getChildByName("LuckDraw").active = false;
                        this.node.active = false;
                        this.Game.getComponent(Game).SetDowSwitch(true);
                        // cc.audioEngine.resumeAll();
                        this.Receive_Click_Switch = true;

                        // istrue = false;
                        // }
                    }
                    let callFunc_no = () => {
                        // cc.audioEngine.resumeAll();
                        this.Receive_Click_Switch = true;
                    }
                    // WX.RewardedVideoCreator(callFunc_yes, callFunc_no);
                    WX.Share(callFunc_yes, callFunc_no);
                    // WX.OnShow(callFunc_yes);
                }
            }
        }
        if (click === "no") {
            // this.Hint.active = false;
            this.node.getChildByName("LuckDraw").active = false;
            this.node.active = false;
            this.Game.getComponent(Game).GameOver();
        }

        if (click === "role_close") {
            let ribbon = this.node.getChildByName("Ribbon");
            ribbon.active = false;
            this.node.active = false;
            this.node.getChildByName("AdopRole").active = false;
            this.Game.getComponent(Game).GameOver();
        }

        if (click === "hook_close") {
            let ribbon = this.node.getChildByName("Ribbon");
            ribbon.active = false;
            this.node.getChildByName("AdopHook").active = false;
            this.node.active = false;
            this.Game.getComponent(Game).GameOver();
        }
    }

    /**
     * 获取抽奖奖励
     * @returns 是否获取到奖励
     */
    private GetLuckAward(): boolean {
        let cursor_world_pos = this.Cursor_Box.parent.convertToWorldSpaceAR(this.Cursor_Box.position);
        for (let i = 0; i < this.Prizes.length; i++) {
            let cursor_node_pos = this.Prizes[i].parent.convertToNodeSpaceAR(cursor_world_pos);
            //距离
            let dis = this.Prizes[i].position.sub(cursor_node_pos).mag();
            if (Math.abs(dis) <= 1) {
                let prize_id = this.Prizes[i].name;
                if (this.Current_Award_Name === prize_id) {
                    let prize_type = prize_id.charAt(0);
                    let prize_num = prize_id.slice(1);
                    let ran = 0;
                    let ribbon = null;
                    switch (prize_type) {
                        //金币
                        case "c":
                            ribbon = this.node.getChildByName("Ribbon");
                            ribbon.active = true;
                            ribbon.getComponent(cc.ParticleSystem).resetSystem();
                            let coin = Cache.GetCache(CacheType.Coin);
                            if (coin === "NaN" || coin === null || coin === "" || coin === undefined || coin === "undefine" || coin === "null") {
                                coin = "0";
                            }
                            let sum = parseInt(coin) + parseInt(prize_num);
                            Cache.SetCache(CacheType.Coin, sum + "");
                            this.SetCurrentCoin(prize_num);
                            Http.sendRequest("https://xy.zcwx.com/userapi/hall/getcoin", (data) => {
                                console.log("金币数据");
                                console.log(data);
                            }, { uid: WX.Uid, coin: prize_num });
                            break;
                        //碎片
                        case "f":
                            ribbon = this.node.getChildByName("Ribbon");
                            ribbon.active = true;
                            ribbon.getComponent(cc.ParticleSystem).resetSystem();
                            let farg = Cache.GetCache(CacheType.FragmentNum);
                            let farg_sum = parseInt(farg) + parseInt(prize_num);
                            Cache.SetCache(CacheType.FragmentNum, farg_sum + "");
                            this.Game.getComponent(Game).UpdateFragment();
                            break;
                        default:
                            break;
                    }
                    return true;
                }
                return false;
            }
        }
    }

    /**
     * 获取抽奖奖励
     */
    private GetAward() {
        let prize_id = this.GetPrize(this.Cursor_Box, this.Prizes);
        // prize_id = "b_2";
        if (prize_id != "gift") {

            //背景皮肤
            let bg_id = this.GetSkin(prize_id, this.Award_BG_Skin);
            // console.log("抽奖奖励ID：" + bg_id);
            if (bg_id) {
                //更新背景皮肤
                // cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
                // cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM(bg_id);
                // this.Game.getComponent(Game).UpdateBG(bg_id);
                this.Game.getComponent(Game).SetNowBG(bg_id);
                this.Hint.active = false;
                this.node.active = false;
                this.Game.getComponent(Game).SetDowSwitch(true);
                return;
            }

            //角色皮肤
            let role_id = this.GetSkin(prize_id, this.Award_Role_Skin);
            if (role_id) {
                //更新角色皮肤
                this.Game.getComponent(Game).SetNowRoleID(prize_id);
                // this.Rloe.getComponent(Role).UpdateSkin(prize_id);
                this.Hint.active = false;
                this.node.active = false;
                this.Game.getComponent(Game).SetDowSwitch(true);
                return;
            }
        } else if (prize_id === "gift") {
            let coin_ran_num = parseInt(this.Gift_Value[this.Gift_Coin_Ran]);
            let current_prop = this.Game.getComponent(Game).Current_Prop;
            if (current_prop === Prop.DoubleCoin) {
                coin_ran_num *= 2;
            }
            this.SetCurrentCoin(coin_ran_num + "");
            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Coin_Audio);
            this.Coin_Anim.getComponent(CoinAnim).Play(coin_ran_num + "");
            let coin_num = Cache.GetCache(CacheType.Coin);
            let sum = parseInt(coin_num) + coin_ran_num;
            Cache.SetCache(CacheType.Coin, sum + "");
        } else {
            // console.log("奖品未找到");
        }
        this.Hint.active = false;
        this.node.getChildByName("LuckDraw").active = false;
        this.Game.getComponent(Game).GameOver();
        this.node.active = false;
        this.Game.getComponent(Game).SetDowSwitch(true);
        // cc.audioEngine.resumeAll();
        this.Receive_Click_Switch = true;
    }


    /**
     * 设置当前金币
     * @param coin_num 当前增加金币数
     */
    private SetCurrentCoin(coin_num: string) {
        let current_coin = Cache.GetCache(CacheType.Current_Coin);
        if (current_coin) {
            let sum = parseInt(current_coin) + parseInt(coin_num);
            Cache.SetCache(CacheType.Current_Coin, sum + "");
        } else {
            Cache.SetCache(CacheType.Current_Coin, coin_num + "");
        }
    }

    /**
     * 灯光闪烁
     * @param lightings 灯光
     * @param dt 持续时间
     */
    private LightingTwinkle(lightings: cc.Node, dt: number) {
        let lighting_1 = lightings.getChildByName("lighting_1");
        let lighting_2 = lightings.getChildByName("lighting_2");
        this.schedule(() => {
            if (lighting_1.active) {
                lighting_2.active = true;
                lighting_1.active = false;
                return;
            }
            if (lighting_2.active) {
                lighting_2.active = false;
                lighting_1.active = true;
                return;
            }
        }, dt);
    }

    /**
     * 设置奖品
     * @param prizes [Array]奖品
     * @param bg_skin [Array]背景皮肤
     * @param role_skin [Array]角色皮肤
     * @param coin_gift 金币礼包
     * @param role 角色节点
     * @param game 游戏节点
     */
    private SetPrize(prizes: cc.Node[], bg_skin: cc.SpriteFrame[], role_skin: cc.SpriteFrame[], coin_gift: cc.SpriteFrame, role: cc.Node, game: cc.Node) {
        let bg_switch: boolean = true;
        let role_num: number = 0;
        let coin_num: number = 0;
        let index_arr: number[] = [];
        let ran_pri_ind: number = 0;

        //获取当前背景皮肤
        let bgs = game.getChildByName("BG").children;
        let bg_now_id: string = "";
        for (let i = 0; i < bgs.length; i++) {
            if (bgs[i].active) {
                bg_now_id = bgs[i].getComponent(cc.Sprite).spriteFrame.name;
                break;
            }
        }

        //获取当前角色皮肤
        let role_now_id = role.getChildByName("role").getComponent(cc.Sprite).spriteFrame.name;

        //设置奖品
        for (let i = 0; i < prizes.length; i++) {

            ran_pri_ind = this.SetRanindex(index_arr, prizes.length);
            index_arr.push(ran_pri_ind);

            //设置背景皮肤
            if (bg_switch) {
                this.SetSkin(prizes[ran_pri_ind], bg_skin, bg_now_id);
                bg_switch = false;
                continue;
            }

            //设置角色皮肤
            if (role_num < 1) {
                // console.log("角色皮肤奖品执行次数");
                role_num++;
                this.SetSkin(prizes[ran_pri_ind], role_skin, role_now_id);
                continue;
            }

            //设置金币礼包
            if (coin_num < 6) {
                // console.log("金币礼包执行次数");
                coin_num++;
                prizes[ran_pri_ind].getComponent(cc.Sprite).spriteFrame = coin_gift;
                continue;
            }
        }
    }

    /**
     * 设置奖品随机索引
     * @param index_arr [Array]索引
     * @param ran_length 随机长度
     * @returns 随机索引值
     */
    private SetRanindex(index_arr: number[], ran_length: number): number {
        while (true) {
            let ran = Math.floor(Math.random() * ran_length);
            let ind = index_arr.indexOf(ran);
            if (ind === -1) {
                return ran;
            }
        }
    }

    /**
     * 设置背景皮肤
     * @param prize 奖品
     * @param skins [Array]背景皮肤
     * @param now_skin_id 当前背景皮肤ID
     */
    private SetSkin(prize: cc.Node, skins: cc.SpriteFrame[], now_skin_id: string) {
        while (true) {
            let ran = Math.floor(Math.random() * skins.length);
            if (now_skin_id != skins[ran].name) {
                prize.getComponent(cc.Sprite).spriteFrame = skins[ran];
                return;
            }
        }
    }

    /**
     * 获取奖品
     * @param cursor_box 光标盒子
     * @param prizes [Array]奖品
     */
    private GetPrize(cursor_box: cc.Node, prizes: cc.Node[]): string {
        let cursor_world_pos = cursor_box.parent.convertToWorldSpaceAR(cursor_box.position);
        for (let i = 0; i < prizes.length; i++) {
            let cursor_node_pos = prizes[i].parent.convertToNodeSpaceAR(cursor_world_pos);
            //距离
            let dis = prizes[i].position.sub(cursor_node_pos).mag();
            if (Math.abs(dis) <= 1) {
                let prize_id = prizes[i].getComponent(cc.Sprite).spriteFrame.name;
                return prize_id;
            }
        }
    }

    /**
     * 获取背景皮肤
     * @param prize_id 奖品ID
     * @param skins [Array]皮肤
     */
    GetSkin(prize_id: string, skins: cc.SpriteFrame[]): string {
        for (let i = 0; i < skins.length; i++) {
            if (skins[i].name === prize_id) {
                return prize_id;
            }
        }
        return;
    }
}
