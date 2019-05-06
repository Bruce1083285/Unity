import Role from "./common/Role";
import Stage from "./game/Stage";
import Cache from "./common/Cache";
import { CacheType, EventType, SoundType, Prop } from "./common/Enum";
import EventListenter from "./common/EventListenter";
import CoinAnim from "./game/CoinAnim";
import LuckDraw from "./game/LuckDraw";
import Level from "./game/Level";
import WX from "./common/WX";
import GameAudio from "./game/GameAudio";
import BeginTime from "./game/BeginTime";
import OverTime from "./game/OverTime";
import GameRed from "./game/GameRed";
import Http from "./common/Http";
import GameShare from "./game/GameShare";
import PropExtract from "./game/PropExtract";
const sdk = require("./common/sdk")

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
export default class Game extends cc.Component {

    /**
     * @property 台阶
     */
    @property(cc.Prefab)
    private Stage: cc.Prefab = null;
    /**
     * @property [Array]背景皮肤奖励
     */
    @property([cc.SpriteFrame])
    private Awards_BG_Skin: cc.SpriteFrame[] = [];
    /**
     * @property [Array]角色皮肤奖励
     */
    @property([cc.SpriteFrame])
    private Awards_Role_Skin: cc.SpriteFrame[] = [];
    /**
     * @property 大礼包提示语
     */
    @property(cc.SpriteFrame)
    private Hint_Gift: cc.SpriteFrame = null;
    /**
     * @property 背景提示语
     */
    @property(cc.SpriteFrame)
    private Hint_BG: cc.SpriteFrame = null;
    /**
     * @property 角色皮肤提示语
     */
    @property(cc.SpriteFrame)
    private Hint_Role: cc.SpriteFrame = null;
    /**
     * @property 抽奖提示语
     */
    @property(cc.SpriteFrame)
    private Hint_Luck: cc.SpriteFrame = null;
    /**
    * @property 红包提示语
    */
    @property(cc.SpriteFrame)
    private Hint_Red: cc.SpriteFrame = null;
    /**
     * @property 礼包奖励
     */
    @property(cc.SpriteFrame)
    private Awards_Gift: cc.SpriteFrame = null;
    /**
     * @property 抽奖奖励
     */
    @property(cc.SpriteFrame)
    private Awards_LuckDraw: cc.SpriteFrame = null;
    /**
     * @property 金币奖励
     */
    @property(cc.SpriteFrame)
    private Awards_Coin: cc.SpriteFrame = null;
    /**
     * @property 红包奖励
     */
    @property(cc.SpriteFrame)
    private Awards_Red: cc.SpriteFrame = null;
    /**
     * @property 道具宝箱
     */
    @property(cc.SpriteFrame)
    private Awards_Prop_Box: cc.SpriteFrame = null;
    /**
     * @property 台阶皮肤
     */
    @property([cc.SpriteFrame])
    private Stage_Skins: cc.SpriteFrame[] = [];
    /**
     * @property 底部移动值
     */
    private Down_Move_Value: number = 0.7;
    /**
     * @property 角色
     */
    private Role: Role = null;
    /**
     * @property 关卡页
     */
    private Page_Level: cc.Node = null;
    /**
     * @property 抽奖页
     */
    public Page_LuckDraw: cc.Node = null;
    /**
     * @property 游戏结束页
     */
    public Page_GameOver: cc.Node = null;
    /**
     * @property 红包页
     */
    public Page_Red: cc.Node = null;
    /**
     * @property 分享页
     */
    private Page_Share: cc.Node = null;
    /**
     * @property 道具抽取类
     */
    private Prop_Extract: PropExtract = null;
    /**
     * @property 底部
     */
    public Down: cc.Node = null;
    /**
     * @property [Array]底部
     */
    public Downs: cc.Node[] = [];
    /**
     * @property [Array]背景
     */
    private BGs: cc.Node[] = [];
    /**
     * @property 底部移动开关
     */
    private Down_Switch: boolean = false;
    /**
     * @property 大台子
     */
    private Platform: cc.Node = null;
    /**
     * @property 按钮
     */
    private Buts: cc.Node = null;
    /**
     * @property 台阶区域
     */
    public Stage_Area: cc.Node = null;
    /**
     * @property 金币动画
     */
    private Coin_Anim: cc.Node = null;
    /**
     * @property 触摸开关
     */
    private Touch_Switch: boolean = false;
    /**
     * @property 台阶对象池
     */
    private Pool_Stage: cc.NodePool = null;
    /**
     * @property 进度条
     */
    private Progress_Bar: cc.ProgressBar = null;
    /**
     * @property 新手指引
     */
    private NoviceGuide: cc.Node = null;
    /**
     * @property 新手指引台阶
     */
    private NoviceStage: cc.Node[] = [];
    /**
     * @property 新手指引手部
     */
    public Ripple: cc.Node = null;
    /**
     * @property 关卡数
     */
    public Level_Num: cc.Label = null;
    /**
     * @property 提醒
     */
    private Hint: cc.Node = null;
    /**
     * @property 金币
     */
    private Coin_Num: cc.Label = null;
    /**
     * @property 当前关卡数
     */
    private Now_Level_Num: number = 0;
    /**
     * @property 层数
     */
    private Tier_Num: number = 0;
    /**
     * @property 最大层数
     */
    private Max_Tier: number = 15;
    /**
     * @property 土渣粒子效果
     */
    @property(cc.ParticleSystem)
    public SoilResidue: cc.ParticleSystem = null;
    /**
     * @property 当前奖励ID
     */
    private Current_Award_ID: string = "";
    /**
     * @property [Array]奖励层数
     */
    private Award_Tiers: number[] = [];
    /**
     * @property 返回按钮开关
     */
    public Back_Click_Switch: boolean = true;
    /**
     * @property 领取奖励按钮
     */
    public Receive_Click_Switch: boolean = true;
    /**
     * @property 返回按钮
     */
    public But_Back: cc.Node = null;
    /**
     * @property 红包开关
     */
    private Red_Swtich: number = 0;
    /**
     * @property 激励视频广告次数
     */
    private RewardedVideo_Count: number = 10;
    /**
     * @property 礼包金币数
     */
    private Gift_Coin_Num: number = 0;
    /**
     * @property 分享提醒
     */
    private Share_Hint: cc.Node = null;
    /**
     * @property 当前背景
     */
    public Now_BG_ID: string = "";
    /**
     * @property 当前角色皮肤
     */
    public Now_Role_ID: string = "";
    /**
     * @property 当前道具
     */
    public Current_Prop: Prop = null;
    /**
     * @property 通关奖励
     */
    private Adopt_Award: cc.Node = null;
    /**
     * @property Boss关卡数
     */
    private Boss_Level_Num: number = 0;
    /**
     * @property 是否是Boss关
     */
    private IsBoss: boolean = false;
    /**
     * @property Boss图标
     */
    private Boss_Icon: cc.Node = null
    /**
     * @property 冰
     */
    public ICE: cc.Node = null;
    /**
     * @property 台阶是否移动
     */
    private Stage_IsMove: boolean = true;
    /**
     * @property 触摸点击次数
     */
    public Touch_Click_Count: number = 0;
    /**
     * @property 警报
     */
    private Alert: cc.Node = null;
    /**
     * @property 复活次数
     */
    public Resurrection_Count: number = 1;
    /**
     * @property 双倍节点
     */
    public Double_Node: cc.Node = null;
    /**
     * @property 警报开关
     */
    private Alert_Switch: boolean = true;
    /**
     * @property [Array]关卡皮肤
     */
    private Level_Skin: string[] = ["b_1", "b_2", "b_3", "b_4"];
    /**
     * @property 道具—底部移动是否关闭
     */
    public Prop_IsDownOpen: boolean = false;
    /**
     * @property 提醒位置
     */
    private Hint_Pos: cc.Vec2 = null;
    /**
     * @property 关卡阶段属性
     */
    private Level_Property: Object = {
        1: {
            stage: {
                min_width: 300,
                max_width: 400,
            },
            role: {
                rotate_value: 3,
            },
        },
        2: {
            stage: {
                min_width: 250,
                max_width: 350,
            },
            role: {
                rotate_value: 4,
            },
        },
        3: {
            stage: {
                min_width: 200,
                max_width: 300,
            },
            role: {
                rotate_value: 5,
            },
        },
        4: {
            stage: {
                min_width: 150,
                max_width: 250,
            },
            role: {
                rotate_value: 5,
            },
        },
        5: {
            stage: {
                min_width: 100,
                max_width: 250,
            },
            role: {
                rotate_value: 7,
            },
        },
    }

    onLoad() {
        // cc.loader.downloader.loadSubpackage('audio', function (err) {
        //     if (err) {
        // console.log("分包加载失败");
        //         return console.error(err);
        //     }
        // console.log("分包加载成功");
        // console.log('load subpackage successfully.');
        // });

        // this.Init();
        // WX.BannerHide();
    }

    start() {
        // Http.sendRequest("https://xy.zcwx.com/userapi/hall/opendown", (data) => {
        //     if (data && data.status === 1) {
        //         this.Red_Swtich = parseInt(data.data);
        //     }
        // }, { id: 1 });
        this.Red_Swtich = 0;
        this.Init();
    }

    update(dt) {

        // if (this.Stage_IsMove && this.Current_Prop === Prop.StageMove) {
        //     this.Stage_IsMove = false;
        //     this.SetStageMove();
        // }

        // if (!this.Double_Node.active && this.Current_Prop === Prop.DoubleCoin) {
        //     this.Double_Node.active = true;
        // }

        if (!this.Prop_IsDownOpen && this.Current_Prop === Prop.DownStop) {
            this.Touch_Click_Count = 0;
            this.Prop_IsDownOpen = true;
            this.DownMoveDown(1.5, -1000);
            let arr = this.Down.children;
            this.ICE.active = true;
            icefor:
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].active) {
                    arr[i].getChildByName("anim").getComponent(cc.Animation).pause();
                    break icefor;
                }
            }
            // this.SetCurrentProp();
        }

        let dis_y = Math.abs(this.Role.node.position.y - this.Down.position.y);
        if (this.Alert_Switch && dis_y <= 100) {
            this.AlertPlay();
        }
        if (!this.Alert_Switch && dis_y > 100) {
            this.AlertStop();
        }

        if (this.Down_Switch) {
            this.Down.setPosition(this.Down.position.x, this.Down.position.y += this.Down_Move_Value);
        }
    }

    /**
     * 初始化
     */
    Init() {
        // Cache.RemoveCache(CacheType.IsFirst);
        // WX.RewardedVideoCreator();
        // this.Current_Prop = Prop.DownStop;
        // if (this.Current_Prop === Prop.DownStop) {
        //     this.Prop_IsDownOpen = true;
        // }
        // let callfunc=()=>{
        //     this.SetCurrentProp();
        // }
        // setTimeout(callfunc,20000);

        WX.OnAudioInterruptionEnd();
        this.BackGroundSwitch();
        this.Double_Node = this.node.getChildByName("DoubleCoin");
        this.Role = this.node.getChildByName("Role").getComponent(Role);
        this.Down = this.node.getChildByName("Down");
        this.Downs = this.node.getChildByName("Down").children;
        this.BGs = this.node.getChildByName("BG").children;
        this.Platform = this.node.getChildByName("Platform");
        this.Stage_Area = this.node.getChildByName("Stage_Area");
        this.Progress_Bar = this.node.getChildByName("ProgressBar").getComponent(cc.ProgressBar);
        this.Coin_Num = this.node.getChildByName("Coin").getChildByName("coin_label").getComponent(cc.Label);
        this.Page_Level = this.node.getChildByName("Page_Level");
        this.Page_LuckDraw = this.node.getChildByName("Page_LuckDraw");
        this.Page_GameOver = this.node.getChildByName("Page_GameOver");
        this.Page_Red = this.node.getChildByName("Page_Red");
        this.Page_Share = this.node.getChildByName("Page_Share");
        this.Level_Num = this.node.getChildByName("Level").getChildByName("level_label").getComponent(cc.Label);
        this.Hint = this.node.getChildByName("Hint");
        this.Share_Hint = this.node.getChildByName("ShareHint");
        this.Coin_Anim = this.node.getChildByName("Coin_Anim");
        this.Buts = this.Page_GameOver.getChildByName("Buts");
        this.NoviceGuide = this.node.getChildByName("NoviceGuide");
        this.NoviceStage = this.node.getChildByName("Stage_Area").children;
        this.Ripple = this.node.getChildByName("Ripple");
        this.But_Back = this.node.getChildByName("but_Back");
        this.ICE = this.node.getChildByName("ICE");
        this.Alert = this.node.getChildByName("Alert");
        this.Prop_Extract = this.node.getChildByName("Prop_Box").getComponent(PropExtract);
        this.Adopt_Award = this.node.getChildByName("AdoptAward");
        this.Boss_Icon = this.node.getChildByName("Level").getChildByName("boss_icon");
        // this.SoilResidue = this.node.getChildByName("SoilResidue").getComponent(cc.ParticleSystem);
        // console.log(this.SoilResidue);

        //赋值初始值
        this.Pool_Stage = new cc.NodePool();

        let isfirst = Cache.GetCache(CacheType.IsFirst);
        if (!isfirst) {
            sdk.playGame(-1);
            this.Page_Level.active = false;
            // this.NoviceGuide.active = true;
            let click = "1";
            let level_num = parseInt(click);
            // this.node.active = false;
            // this.node.getChildByName("Page_Level").active = false;
            Cache.SetCache(CacheType.Level_Num, click);
            let bgm = Cache.GetCache(CacheType.BGM);
            if (!bgm || bgm === "true") {
                cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
                cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM("b_1");
            }
            if (bgm === "false") {
                cc.find("Canvas/Audio").getComponent(GameAudio).SetAudioSwitch(false);
                cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
            }
            cc.find("Canvas/BeginTime").getComponent(BeginTime).Play();
            this.GameInit(level_num);
        } else {
            // let mode = Cache.GetCache(CacheType.GameMode);
            // if (mode === "match") {
            //     this.GameInit(1);
            //     this.Page_Level.active = false;
            // }
        }


        //开启碰撞
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // this.Now_Level_Num = 1;
        this.Progress_Bar.progress = 0;

        this.AddEventListenter(this.node);
        this.SetPool(this.Pool_Stage, 5, this.Stage);
        let setpool = () => {
            this.SetPool(this.Pool_Stage, 5, this.Stage);
        }
        // this.SetStage();
        this.GetCache(this.Coin_Num);

        //更新在线时长
        // this.schedule(this.UpdateTime, 2);
        // cc.game.on("hide");
        let level = Cache.GetCache(CacheType.Level_Num);
        let level_num = parseInt(level);
        this.GameInit(level_num);
        // this.GameInit(2);
        // this.Role.HookShow();
    }

    /**
     * 设置台阶移动
     */
    private SetStageMove() {
        let arr = this.Stage_Area.children;
        let patch_arr = [];
        let world_pos = this.Role.node.parent.convertToWorldSpaceAR(this.Role.node.position);
        let node_pos = this.Stage_Area.convertToNodeSpaceAR(world_pos);
        for (let i = 0; i < arr.length; i++) {
            if (node_pos.y + 50 < arr[i].position.y) {
                patch_arr.push(arr[i]);
            }
        }
        // console.log("台阶移动》》》》》》》》》》》》》》》》》》》》1");
        // console.log(arr);
        // console.log("台阶移动》》》》》》》》》》》》》》》》》》》》2");
        // console.log(patch_arr);

        for (let i = 0; i < patch_arr.length; i++) {
            patch_arr[i].getComponent(Stage).SetMove();
        }
    }

    /**
     * 播放警报
     */
    private AlertPlay() {
        this.Alert_Switch = false;
        this.Alert.active = true;

        let show = cc.fadeIn(0.5);
        let hide = cc.fadeOut(0.5);
        let seq = cc.sequence(show, hide);
        let repfor = cc.repeatForever(seq);
        this.Alert.runAction(repfor);
    }

    /**
     * 停止播放警报
     */
    private AlertStop() {
        this.Alert_Switch = true;
        this.Alert.active = false;

        this.Alert.stopAllActions();;
    }

    /**
   * 更新在线时长
   */
    UpdateTime() {
        // console.log("是否更新");
        Http.sendRequest("https://xy.zcwx.com/userapi/weixin/heart", (data) => {
            // console.log("更新在线时长——2");
            // console.log(data);

        }, { uid: WX.Uid });
    }

    BackGroundSwitch() {
        // cc.game.on(cc.game.EVENT_HIDE, function () {
        // console.log("游戏暂停");
        //     cc.audioEngine.pauseAll();
        // });
        // cc.game.on(cc.game.EVENT_SHOW, function () {
        //     cc.audioEngine.resumeAll();
        // });
        WX.OnHide(() => {
            this.PauseGame();
        });
        // let istrue = true;
        // let callbacks = () => {
        //     if (istrue) {
        // console.log("回到游戏");
        //         istrue = true;
        //     }
        // }
        WX.OnShow(() => {
            this.PlayGame();
        });
    }

    //暂停游戏
    PauseGame() {
        // console.log("游戏暂停");
        cc.audioEngine.pauseAll();
        // this.SetDowSwitch(false);
        // this.SetTouchSwitch(false);
        // this.SetDowSwitch(false);
        // cc.game.pause();
    }

    //开始游戏
    PlayGame() {
        // console.log("游戏恢复");
        cc.audioEngine.resumeAll();
        // this.SetDowSwitch(false);
        // console.log(this.Role);
        if (this.Role) {
            // console.log("钩子收回");
            this.Role.HookShrink(0.2);
        }
        // if (this.Now_BG_ID) {
        // console.log("背景ID_1:" + this.Now_BG_ID);
        //     this.scheduleOnce(() => {
        // console.log("背景ID_2:" + this.Now_BG_ID);
        //         this.UpdateBG(this.Now_BG_ID);
        //         cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
        //         cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM(this.Now_BG_ID);
        //         // this.Now_BG_ID = null;
        //     }, 0.1);
        // }
        // if (this.Now_Role_ID) {
        // console.log(this.Now_Role_ID + "当前角色皮肤——1");
        //     this.scheduleOnce(() => {
        //         this.Role.UpdateSkin(this.Now_Role_ID);
        // console.log(this.Now_Role_ID + "当前角色皮肤——2");
        //         // this.Now_Role_ID = null;
        //     }, 0.3);
        // }
        // cc.game.resume();
        // cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
    }
    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    ButtonClick(lv: any, click: string) {
        cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Click);
        switch (click) {
            case "back":
                // if (this.Back_Click_Switch) {
                //     this.BackGame();
                // }
                this.SetDowSwitch(false);
                this.Page_GameOver.active = false;
                this.Page_Share.getComponent(GameShare).Init();
                break;
            case "yes":
                if (this.Receive_Click_Switch) {
                    this.Receive_Click_Switch = false;
                    if (this.Current_Award_ID === "gift") {
                        if (WX.IsPlay) {
                            WX.IsPlay = false;
                            // WX.Share();
                            // WX.RewardedVideoShow();
                            cc.audioEngine.pauseAll();
                            // WX.RewardedVideoIsEnded();
                            let istrue = true;
                            let callfunc_yes = () => {
                                if (istrue) {
                                    this.GetAward(this.Current_Award_ID);
                                    this.Hint.active = false;
                                    if (!this.Page_LuckDraw.active && !this.Page_Red.active) {
                                        // console.log("yes是否进入");
                                        this.SetDowSwitch(true);
                                    }
                                    cc.audioEngine.resumeAll();
                                    this.Receive_Click_Switch = true;
                                    istrue = false;
                                }
                            }
                            let callFunc_no = () => {
                                if (istrue) {
                                    cc.audioEngine.resumeAll();
                                    this.Receive_Click_Switch = true;
                                    istrue = false;
                                }
                            }
                            // WX.RewardedVideoCreator(callfunc_yes, callFunc_no);
                            WX.RewardedVideoClose(callfunc_yes, callFunc_no);
                            // WX.OnShow(callfunc);
                        } else {
                            let istrue = true;
                            let callback_yes = () => {
                                // console.log(istrue);
                                // if (istrue) {
                                this.GetAward(this.Current_Award_ID);
                                this.Share_Hint.active = false;
                                // console.log("分享提醒");
                                // console.log(this.Share_Hint);
                                if (!this.Page_LuckDraw.active && !this.Page_Red.active) {
                                    // console.log("yes是否进入");
                                    this.SetDowSwitch(true);
                                }
                                cc.audioEngine.resumeAll();
                                this.Receive_Click_Switch = true;
                                // istrue = false;
                                // }
                            }
                            let callback_no = () => {
                                this.Receive_Click_Switch = true;
                            }
                            // WX.OnShow(callfunc);
                            WX.Share(callback_yes, callback_no);
                        }
                    } else {
                        // this.GetAward(this.Current_Award_ID);
                        // // this.Share_Hint.active = false;
                        // this.Hint.active = false;
                        // if (!this.Page_LuckDraw.active && !this.Page_Red.active) {
                        //     // console.log("yes是否进入");
                        //     this.SetDowSwitch(true);
                        // }
                        // this.Receive_Click_Switch = true;
                    }
                }
                break;
            case "no":
            case "hint_close":
                this.Share_Hint.active = false;
                this.Hint.active = false;
                this.SetDowSwitch(true);
                break;
            case "resurrection":
                if (this.Resurrection_Count > 0) {
                    if (this.Receive_Click_Switch) {
                        this.Receive_Click_Switch = false;
                        if (WX.IsPlay) {
                            cc.audioEngine.pauseAll();
                            // WX.Share();
                            let istrue = true;
                            let callfunc_yes = () => {
                                if (istrue) {
                                    this.Resurrection_Count--;
                                    this.Resurrection();
                                    // console.log("复活执行次数");
                                    istrue = false;
                                    cc.audioEngine.resumeAll();
                                    this.Receive_Click_Switch = true;
                                }
                            }
                            let callFunc_no = () => {
                                if (istrue) {
                                    cc.audioEngine.resumeAll();
                                    this.Receive_Click_Switch = true;
                                    istrue = false;
                                }
                            }
                            // WX.OnShow(callfunc);
                            // WX.RewardedVideoCreator(callfunc_yes, callFunc_no);
                            WX.RewardedVideoClose(callfunc_yes, callFunc_no);
                        } else {
                            let istrue = true;
                            let callback_yes = () => {
                                // if (istrue) {
                                this.Resurrection();
                                // console.log("复活执行次数");
                                // istrue = false;
                                cc.audioEngine.resumeAll();
                                this.Receive_Click_Switch = true;
                                // }
                            }
                            let callback_no = () => {
                                this.Receive_Click_Switch = true;
                            }
                            WX.Share(callback_yes, callback_no);
                            // WX.OnShow(callfunc);
                        }
                    }
                } else {
                    let hint_coin = this.Page_GameOver.getChildByName("Hint_Coin");
                    this.CoinHintShow(hint_coin);
                }
                break;
            case "x2":
                // WX.Share();
                if (!WX.WX_Swtich) {
                    this.DoubleCoin(this.Coin_Anim);
                    this.SetDowSwitch(false);
                    // console.log("返回小游戏次数");
                    this.Receive_Click_Switch = true;
                    this.scheduleOnce(() => {
                        this.NextLevel();
                        WX.BannerCreator("game");
                    }, 1);
                    return
                }
                if (this.Receive_Click_Switch) {
                    this.Receive_Click_Switch = false;
                    if (WX.IsPlay) {
                        cc.audioEngine.pauseAll();
                        let istrue_1 = true;
                        let callfunc_yes = () => {
                            if (istrue_1) {
                                this.DoubleCoin(this.Coin_Anim);
                                this.SetDowSwitch(false);
                                // console.log("返回小游戏次数");
                                this.Receive_Click_Switch = true;
                                this.scheduleOnce(() => {
                                    this.Page_GameOver.getChildByName("Coin").active = false;
                                    this.NextLevel();
                                    WX.BannerCreator("game");
                                }, 0.9);
                                istrue_1 = false;
                            }
                        }
                        let callFunc_no = () => {
                            if (istrue_1) {
                                // this.DoubleCoin(this.Coin_Anim);
                                this.SetDowSwitch(false);
                                // console.log("返回小游戏次数");
                                cc.audioEngine.resumeAll();
                                this.Receive_Click_Switch = true;
                                istrue_1 = false;
                            }
                        }
                        // WX.RewardedVideoCreator(callfunc_yes, callFunc_no);
                        WX.RewardedVideoClose(callfunc_yes, callFunc_no);
                        // WX.OnShow(callfunc_1);
                        // this.DoubleCoin(this.Coin_Anim);
                    } else {
                        let istrue_1 = true;
                        let callfunc_yes = () => {
                            // if (istrue_1) {
                            this.DoubleCoin(this.Coin_Anim);
                            this.SetDowSwitch(false);
                            // console.log("返回小游戏次数");
                            this.Receive_Click_Switch = true;
                            this.scheduleOnce(() => {
                                this.Page_GameOver.getChildByName("Coin").active = false;
                                this.NextLevel();
                                WX.BannerCreator("game");
                            }, 1);
                            // istrue_1 = false;
                            // }
                        }
                        let callback_no = () => {
                            this.Receive_Click_Switch = true;
                        }
                        WX.Share(callfunc_yes, callback_no);
                        // WX.OnShow(callfunc_1);
                    }
                }
                break;
            case "next":
                this.NextLevel();
                break;
            case "restart":
                // WX.Share();
                this.Restart();
                break;
            case "share":
                WX.Share();
                break;
            default:
                break;
        }
    }

    /**
     * 设置当前道具
     * @param current_prop 当前道具
     */
    SetCurrentProp(current_prop?: Prop) {
        this.Current_Prop = current_prop;
    }


    /**
    * 金币提醒显示
    * @param hint 金币提醒
    */
    private CoinHintShow(hint: cc.Node) {
        if (hint.active) {
            hint.stopAllActions()
            hint.setPosition(this.Hint_Pos);
        }
        hint.active = true;
        hint.opacity = 255;
        this.Hint_Pos = hint.position;
        hint.scale = 0.1;
        let show = cc.scaleTo(1, 1, 1);
        let move_up = cc.moveBy(1, 0, 100);
        let hide = cc.fadeOut(1);
        let close = cc.callFunc(() => {
            hint.active = false;
            hint.setPosition(this.Hint_Pos);
            this.Hint_Pos = null;
        });
        hint.runAction(cc.sequence(show, cc.spawn(move_up, hide), close));
    }

    /**
     * 游戏初始化
     */
    GameInit(level: number) {
        WX.BannerCreator("game");
        cc.find("Canvas/BeginTime").getComponent(BeginTime).Play();
        this.Resurrection_Count = 1;
        this.SetDowSwitch(false);
        this.node.getChildByName("OverTime").getComponent(OverTime).Resurrection_Count = 1;
        this.Now_Level_Num = level;
        this.Hint.active = false;
        this.Page_LuckDraw.active = false;
        // this.Progress_Bar.node.active = true;

        let label = this.Adopt_Award.getChildByName("label").getComponent(cc.Label);
        if (level === 1) {
            this.Adopt_Award.getChildByName("Role").active = true;
            this.Adopt_Award.getChildByName("Hook").active = false;
            this.Adopt_Award.getChildByName("LuckDraw").active = false;
            label.string = "通关获得永久角色皮肤一个";
        } else if (level === 2) {
            this.Adopt_Award.getChildByName("Role").active = false;
            this.Adopt_Award.getChildByName("Hook").active = true;
            this.Adopt_Award.getChildByName("LuckDraw").active = false;
            label.string = "通关获得永久武器一个";
        } else if (level >= 3) {
            this.Adopt_Award.getChildByName("Role").active = false;
            this.Adopt_Award.getChildByName("Hook").active = false;
            this.Adopt_Award.getChildByName("LuckDraw").active = true;
            label.string = "通关可在转盘中获得丰厚奖励";
        }

        //底部移动速度
        let level_num = level % 5;
        if (level_num === 0 && level > 1) {
            this.Boss_Icon.active = true;
            this.IsBoss = true;
            this.Boss_Level_Num = level / 5;
        } else {
            this.IsBoss = false;
            this.Boss_Icon.active = false;
        }
        if ((level - 1) % 5 === 0 && level > 1) {
            this.Down_Move_Value = 0.7;
        }
        this.Down_Move_Value = this.Down_Move_Value + (level_num - 1) * 0.1;

        let ind = (level - 1) % 4;
        //更新皮肤
        this.UpdateBG(this.Level_Skin[ind]);
        this.SetNowBG(this.Level_Skin[ind]);
        // console.log("背景ID:" + this.Level_Skin[ind]);
        this.scheduleOnce(() => {
            //播放背景音乐
            let bgm = Cache.GetCache(CacheType.BGM);
            if (!bgm || bgm === "true") {
                cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
                cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM(this.Level_Skin[ind]);
            }
            if (bgm === "false") {
                cc.find("Canvas/Audio").getComponent(GameAudio).SetAudioSwitch(false);
                cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
            }
        }, 2.3);

        //角色初始化
        let rotate_value = 0;
        if (level > 0 && level <= 5) {
            rotate_value = this.Level_Property[1].role.rotate_value;
        }
        if (level > 5 && level <= 10) {
            rotate_value = this.Level_Property[2].role.rotate_value;
        }
        if (level > 10 && level <= 15) {
            rotate_value = this.Level_Property[3].role.rotate_value;
        }
        if (level > 15 && level <= 20) {
            rotate_value = this.Level_Property[4].role.rotate_value;
        }
        if (level > 20) {
            rotate_value = this.Level_Property[5].role.rotate_value;
        }
        this.Role.Init(rotate_value);
        this.Max_Tier = this.Max_Tier + level;
        // console.log(this.Max_Tier + "最高层数");
        let isfirst = Cache.GetCache(CacheType.IsFirst);
        if (isfirst) {
            this.SetStage();
        } else {
            this.But_Back.getComponent(cc.Button).interactable = false;
            for (let i = 0; i < this.NoviceStage.length; i++) {
                this.NoviceStage[i].active = true;
            }
            this.Ripple.active = true;
            this.Role.Rotate_Switch = false;
            this.Role.node.getChildByName("Hand").rotation = -12;
        }
        this.SetTouchSwitch(true);
        this.Award_Tiers = this.GetRanTier(10, 7);

        this.Level_Num.string = level + "";
        // console.log("钩子是否显示");
        // for (let i = 0; i < this.Role.Ropes.length; i++) {
        //     console.log(this.Role.Ropes[i].parent.active);
        // }
    }

    /**
     * 提醒显示
     * @param current_award_id 当前奖励ID
     */
    HintShow(current_award_id: string) {
        // cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Popout_Audio);
        this.Current_Award_ID = current_award_id;

        if (current_award_id === "gift") {
            this.Gift_Coin_Num = Math.floor(Math.random() * 20 + 20);
            let level_num = parseInt(this.Level_Num.string);
            // level_num=1;
            if (level_num < 2) {
                this.GetAward(this.Current_Award_ID);
                this.Hint.active = false;
                if (!this.Page_LuckDraw.active && !this.Page_Red.active) {
                    // console.log("yes是否进入");
                    this.SetDowSwitch(true);
                }
                this.Receive_Click_Switch = true;
                return
            }
            this.Hint.active = true;
            let title = this.Hint.getChildByName("title").getComponent(cc.Sprite);
            let coin_label = this.Hint.getChildByName("coin_label").getComponent(cc.Label);
            coin_label.string = this.Gift_Coin_Num + "";
            if (WX.IsPlay) {
                title.spriteFrame = this.Hint_Gift;
            } else {
                this.Share_Hint.active = true;
                this.Hint.active = false;
            }
        } else {
            this.GetAward(this.Current_Award_ID);
            // this.Share_Hint.active = false;
            // this.Hint.active = false;
            if (!this.Page_LuckDraw.active && !this.Page_Red.active) {
                // console.log("yes是否进入");
                this.SetDowSwitch(true);
            }
            this.Receive_Click_Switch = true;
        }
        // this.Hint.active = true;
        // let title = this.Hint.getChildByName("title").getComponent(cc.Sprite);
        // if (current_award_id === "luck") {
        //     title.spriteFrame = this.Hint_Luck;
        // } else if (current_award_id.charAt(0) === "b") {
        //     title.spriteFrame = this.Hint_BG;
        // } else if (current_award_id === "gift") {
        //     if (WX.IsPlay) {
        //         title.spriteFrame = this.Hint_Gift;
        //     } else {
        //         this.Share_Hint.active = true;
        //         this.Hint.active = false;
        //     }
        // } else if (current_award_id === "red") {
        //     title.spriteFrame = this.Hint_Red;
        // } else {
        //     title.spriteFrame = this.Hint_Role;
        // }
    }

    /**
     * 更新金币
     * @param coin_num 金币数
     */
    UpdateCoin() {
        let coin_num = Cache.GetCache(CacheType.Coin);
        this.Coin_Num.string = coin_num;
    }

    /**
     * 更新碎片数
     */
    UpdateFragment() {
        let frag_num = Cache.GetCache(CacheType.FragmentNum);
    }

    /**
     * 更新背景
     * @param skin_id 皮肤ID
     */
    UpdateBG(skin_id: string) {
        //更新背景
        for (let i = 0; i < this.BGs.length; i++) {
            if (this.BGs[i].name === skin_id) {
                this.BGs[i].active = true;
            } else {
                this.BGs[i].active = false;
            }
        }

        //更新底部
        for (let i = 0; i < this.Downs.length; i++) {
            if (this.Downs[i].name === skin_id) {
                this.Downs[i].active = true;
                if (this.Current_Prop === Prop.DownStop) {
                    this.Downs[i].getChildByName("anim").getComponent(cc.Animation).pause();
                } else {
                    this.Downs[i].getChildByName("anim").getComponent(cc.Animation).play();
                }
            } else {
                this.Downs[i].active = false;
            }
        }
    }

    /**
     * 存储当前背景ID
     * @param bg_id 背景ID
     */
    SetNowBG(bg_id: string) {
        this.Now_BG_ID = bg_id;
    }

    /**
     * 设置触摸开关
     * @param isOpen 是否打开
     */
    SetTouchSwitch(isOpen: boolean) {
        console.log("触摸开关" + isOpen);
        this.Touch_Switch = isOpen;
    }

    /**
     * 设置大台子显示
     * @param isShow 是否显示
     */
    SetPlatformShow(isShow: boolean) {
        this.Platform.active = isShow;
    }

    /**
     * 设置底部开关
     * @param isOpen 
     */
    SetDowSwitch(isOpen: boolean) {
        if (!this.Prop_IsDownOpen) {
            this.Down_Switch = isOpen;
        } else {
            this.Down_Switch = false;
        }
    }

    /**
     * 设置层数
     */
    SetTier() {
        this.Tier_Num++;
        let pro_num = this.Tier_Num / this.Max_Tier;
        // console.log(this.Tier_Num + "当前层数");
        this.Progress_Bar.progress = pro_num;
        pro_num = Math.round(pro_num * 100);
        this.Progress_Bar.node.getChildByName("bfb").getComponent(cc.Label).string = pro_num + "%";
        if (pro_num === 100) {
            this.scheduleOnce(() => {
                let level = parseInt(this.Level_Num.string);
                this.Page_LuckDraw.active = true;
                if (level === 1) {
                    cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Award_Audio);
                    this.Page_LuckDraw.getChildByName("AdopRole").active = true;
                    let ribbon = this.Page_LuckDraw.getChildByName("Ribbon");
                    ribbon.active = true;
                    ribbon.getComponent(cc.ParticleSystem).resetSystem();
                    this.GetAdoptRoleSkin();
                } else if (level === 2) {
                    cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Award_Audio);
                    this.Page_LuckDraw.getChildByName("AdopHook").active = true;
                    let ribbon = this.Page_LuckDraw.getChildByName("Ribbon");
                    ribbon.active = true;
                    ribbon.getComponent(cc.ParticleSystem).resetSystem();
                    this.GetAdoptHookSkin();
                } else if (level >= 3) {
                    this.Page_LuckDraw.getChildByName("LuckDraw").active = true;
                    this.Page_LuckDraw.getComponent(LuckDraw).Play();
                }

                this.Page_GameOver.getChildByName("Coin").active = true;
                this.Page_GameOver.getChildByName("but_Resurrection").active = false;

                let level_num = level + 1;
                let level_cache = Cache.GetCache(CacheType.Level_Num);
                let cache_level_num = parseInt(level_cache);
                if (level_num > cache_level_num) {
                    WX.SetWxUpdateCache(level_num + "");
                    Cache.SetCache(CacheType.Level_Num, level_num + "");
                }
                if (WX.WX_Swtich) {
                    sdk.playGame(this.Level_Num.string)
                }
                this.SetDowSwitch(false);
                // this.GameOver();
                this.Page_GameOver.getChildByName("Title").getChildByName("title_1").active = true;
                this.Page_GameOver.getChildByName("Buts").getChildByName("Buts_Right").getChildByName("but_Next").active = true;
            }, 0.7);
        }
    }

    /**
     * 获取通关角色皮肤
     */
    private GetAdoptRoleSkin() {
        //获取已购买缓存
        let pur_commodity_ids: string[] = [];
        let pur_commodity_id = Cache.GetCache(CacheType.Pur_Role);
        if (pur_commodity_id) {
            for (let i = 0; i < pur_commodity_id.length; i++) {
                let pur_char = pur_commodity_id.charAt(i);
                if (pur_char != ",") {
                    pur_commodity_ids.push(pur_char);
                }
            }
        }
        let ind = pur_commodity_ids.indexOf("3");
        if (ind === -1) {
            pur_commodity_ids.push("3");
        }

        let pur_commodity = pur_commodity_ids.toString();
        Cache.SetCache(CacheType.Pur_Role, pur_commodity);
    }

    /**
     * 获取通关钩子皮肤
     */
    private GetAdoptHookSkin() {
        //获取已购买缓存
        let pur_commodity_ids: string[] = [];
        let pur_commodity_id = Cache.GetCache(CacheType.Pur_Hook);
        if (pur_commodity_id) {
            for (let i = 0; i < pur_commodity_id.length; i++) {
                let pur_char = pur_commodity_id.charAt(i);
                if (pur_char != ",") {
                    pur_commodity_ids.push(pur_char);
                }
            }
        }
        let ind = pur_commodity_ids.indexOf("2");
        if (ind === -1) {
            pur_commodity_ids.push("2");
        }

        let pur_commodity = pur_commodity_ids.toString();
        Cache.SetCache(CacheType.Pur_Hook, pur_commodity);
    }

    /**
     * 设置台阶
     */
    SetStage() {
        if (this.Tier_Num >= this.Max_Tier) {
            return;
        }
        for (let i = 0; i < 1; i++) {
            let stage = this.Pool_Stage.get();
            if (!stage) {
                this.SetPool(this.Pool_Stage, 1, this.Stage);
                stage = this.Pool_Stage.get();
            }
            let level_stage_num = 0;
            if (this.Now_Level_Num > 0 && this.Now_Level_Num <= 5) {
                level_stage_num = 1;
            }
            if (this.Now_Level_Num > 5 && this.Now_Level_Num <= 10) {
                level_stage_num = 2;
            }
            if (this.Now_Level_Num > 10 && this.Now_Level_Num <= 15) {
                level_stage_num = 3;
            }
            if (this.Now_Level_Num > 15 && this.Now_Level_Num <= 20) {
                level_stage_num = 4;
            }
            if (this.Now_Level_Num > 20) {
                level_stage_num = 5;
            }
            let icon: cc.SpriteFrame = null;
            if (this.Tier_Num === this.Award_Tiers[0]) {
                if (this.Now_Level_Num < 5) {
                    icon = this.Awards_Coin;
                } else {
                    icon = this.GetBGIcon(this.Awards_BG_Skin, this.BGs);
                }
            } else if (this.Tier_Num === this.Award_Tiers[1]) {
                icon = this.Awards_Role_Skin[0];
                // icon = this.GetRoleIcon(this.Awards_Role_Skin, this.Role.node);
                // icon = this.Awards_Coin;
            } else if (this.Tier_Num === this.Award_Tiers[2]) {
                // icon = this.Awards_LuckDraw;
                icon = this.Awards_Coin;
            } else if (this.Tier_Num === this.Award_Tiers[3]) {
                icon = this.Awards_Gift;
            } else if (this.Tier_Num === this.Award_Tiers[4]) {
                let bfb = 50;
                let ran_bfb = Math.floor(Math.random() * 100);
                if (ran_bfb <= bfb) {
                    icon = this.Awards_Gift;
                } else {
                    icon = this.Awards_Coin;
                }
            } else if (this.Tier_Num === this.Award_Tiers[5]) {
                if (this.Red_Swtich === 1) {
                    icon = this.GetRed();
                } else {
                    icon = this.Awards_Coin;
                }
            } else if (this.Tier_Num === this.Award_Tiers[6]) {
                icon = this.Awards_Prop_Box
            } else {
                icon = this.Awards_Coin;
            }
            stage.getChildByName("award").getComponent(cc.Sprite).spriteFrame = icon;
            let min_width = this.Level_Property[level_stage_num].stage.min_width;
            let max_width = this.Level_Property[level_stage_num].stage.max_width;
            if (this.Max_Tier - this.Tier_Num <= 3) {
                min_width = min_width * 0.45;
                max_width = max_width * 0.45;
            }

            let ran_stage_skin = Math.floor(Math.random() * this.Stage_Skins.length);
            this.Stage_Area.addChild(stage);
            let ran_x = Math.floor(Math.random() * (560 - 360) + 250);
            stage.setPosition(ran_x, 1200);
            stage.active = true;
            stage.getComponent(Stage).Init(min_width, max_width, this.Stage_Skins[ran_stage_skin]);

            if (this.IsBoss && this.Max_Tier - this.Tier_Num <= 3 + (this.Boss_Level_Num - 1)) {
                stage.getComponent(Stage).SetMove();
            }
        }
    }

    /**
     * 获取红包
     */
    private GetRed(): cc.SpriteFrame {
        let red = Cache.GetCache(CacheType.Red_Num);
        let red_num = 0;
        let bfb = 0;
        if (red) {
            red_num = parseInt(red);
        }
        if (red_num >= 0 && red_num < 12) {
            bfb = 80;
        } else if (red_num >= 12 && red_num < 17) {
            bfb = 40;
        }
        let ran_bfb = Math.floor(Math.random() * 100);
        if (ran_bfb < bfb) {
            return this.Awards_Red;
        } else {
            return this.Awards_Coin;
        }
    }

    /**
     * 回收台阶
     */
    RecoveryStage() {
        let patch_arr = this.Stage_Area.children;
        for (let i = 0; i < patch_arr.length; i++) {
            let y_1 = patch_arr[i].position.y;
            if (y_1 < 0) {
                patch_arr[i].stopAllActions();
                // patch_arr[i].removeComponent(cc.BoxCollider);
                // patch_arr[i].getChildByName("award").removeComponent(cc.BoxCollider);
                // patch_arr[i].removeFromParent();
                this.Pool_Stage.put(patch_arr[i]);
            }
        }
    }

    /**
     * 底部向下移动
     * @param dt 持续时间
     * @param dis_y Y轴距离
     */
    DownMoveDown(dt: number, dis_y: number) {
        this.SetDowSwitch(false);
        // let move_down = cc.moveBy(dt, 0, dis_y);
        let move_down = cc.moveTo(dt, -5, -612);
        let callfunc = cc.callFunc(() => {
            let isfirst = Cache.GetCache(CacheType.IsFirst);
            if (!this.Hint.active && !this.Page_GameOver.active && !this.Page_LuckDraw.active && !this.Share_Hint.active && isfirst && !this.Page_Share.active) {
                this.SetDowSwitch(true);
                // console.log("底部移动");
            }
        });
        this.Down.runAction(cc.sequence(move_down, callfunc));
    }

    /**
     * 设置当前金币
     * @param coin_num 当前增加金币数
     */
    SetCurrentCoin(coin_num: string) {
        let current_coin = Cache.GetCache(CacheType.Current_Coin);
        if (current_coin) {
            let sum = parseInt(current_coin) + parseInt(coin_num);
            Cache.SetCache(CacheType.Current_Coin, sum + "");
        } else {
            Cache.SetCache(CacheType.Current_Coin, coin_num + "");
        }
    }

    /**
     * 双倍金币
     * @param coin_anim 金币动画
     */
    private DoubleCoin(coin_anim: cc.Node) {
        this.Page_GameOver.getChildByName("Coin").getChildByName("but_X2").getComponent(cc.Button).interactable = false;
        let curr_coin = Cache.GetCache(CacheType.Current_Coin);
        let curr_coin_num = parseInt(curr_coin);
        if (curr_coin) {
            let coin_total = curr_coin_num * 3;
            coin_anim.getComponent(CoinAnim).Play(coin_total + "");
            let coin_sum = Cache.GetCache(CacheType.Coin);
            let sum = parseInt(coin_sum) + coin_total;
            Cache.SetCache(CacheType.Coin, sum + "");
        } else {
            coin_anim.getComponent(CoinAnim).Play(0 + "");
        }
    }

    /**
     * 获取奖励
     * @param award_id 奖励ID
     */
    private GetAward(award_id) {
        // console.log("奖励ID：" + award_id);
        if (award_id === "gift") {
            //礼包奖励
            if (this.Current_Prop === Prop.DoubleCoin) {
                this.Gift_Coin_Num *= 2;
            }
            this.SetCurrentCoin(this.Gift_Coin_Num + "");
            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Coin_Audio);
            this.Coin_Anim.getComponent(CoinAnim).Play(this.Gift_Coin_Num + "");
            let coin_num = Cache.GetCache(CacheType.Coin);
            if (coin_num === "NaN" || coin_num === null || coin_num === "" || coin_num === undefined || coin_num === "undefine" || coin_num === "null") {
                coin_num = "0";
            }
            let sum = parseInt(coin_num) + this.Gift_Coin_Num;
            Cache.SetCache(CacheType.Coin, sum + "");
        } else if (award_id.charAt(0) === "b") {
            this.UpdateBG(award_id);
            // this.SetNowBG(award_id);
            cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
            cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM(award_id);
            //背景皮肤
        } else if (award_id === "luck") {
            // //抽奖
            // this.Page_LuckDraw.active = true;
            // this.SetDowSwitch(false);
            // this.Page_LuckDraw.getComponent(LuckDraw).Play();
        } else if (award_id === "red") {
            this.Page_Red.getComponent(GameRed).Init();
        } else {
            //角色皮肤
            // this.SetNowRoleID(award_id);
            this.Role.UpdateSkin(award_id);
        }
    }

    /**
     * 获取背景Icon
     * @param skins [Array]背景皮肤
     * @param bgs [Array]皮肤ID节点
     * @returns 获取的背景icon
     */
    private GetBGIcon(skins: cc.SpriteFrame[], bgs: cc.Node[]): cc.SpriteFrame {
        let bg_id = null;
        for (let i = 0; i < bgs.length; i++) {
            if (bgs[i].active) {
                bg_id = bgs[i].name
                break;
            }
        }

        //循环获取未重复精灵帧
        while (true) {
            let ran_id = Math.floor(Math.random() * skins.length);
            if (bg_id != skins[ran_id].name) {
                return skins[ran_id];
            }
        }
    }

    /**
     * 获取角色Icon
     * @param skins [Array]角色皮肤
     * @param role 角色节点
     * @returns 获取的角色icon
     */
    private GetRoleIcon(skins: cc.SpriteFrame[], role: cc.Node): cc.SpriteFrame {
        let role_id = role.getChildByName("role").getComponent(cc.Sprite).spriteFrame.name;

        while (true) {
            let ran_id = Math.floor(Math.random() * skins.length);
            if (role_id != skins[ran_id].name) {
                return skins[ran_id];
            }
        }
    }

    /**
     * 获取随机层数
     * @param max_tier 最大层数
     * @param award_num 奖励数
     */
    private GetRanTier(max_tier: number, award_num: number): number[] {
        let patch_arr = [];
        for (let i = 0; i < award_num; i++) {
            let ran_tier = Math.floor(Math.random() * (max_tier - 1) + 1);
            let ind = patch_arr.indexOf(ran_tier);
            if (ind === -1) {
                patch_arr.push(ran_tier);
            } else {
                i--;
            }
        }
        return patch_arr;
    }

    /**
     * 获取缓存
     * @param coin_label 金币
     */
    private GetCache(coin_label: cc.Label) {
        let coin_num = Cache.GetCache(CacheType.Coin);
        if (coin_num === "NaN" || coin_num === null || coin_num === "" || coin_num === undefined || coin_num === "undefine" || coin_num === "null") {
            coin_num = "0";
        }
        coin_label.string = coin_num;

        cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
        let bgm = Cache.GetCache(CacheType.BGM);
        if (!bgm || bgm === "true") {
            cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM("bg");
        }
        if (bgm === "false") {
            cc.find("Canvas/Audio").getComponent(GameAudio).SetAudioSwitch(false);
            // cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
        }
    }

    /**
     * 添加监听
     * @param target 监听对象
     */
    private AddEventListenter(target: cc.Node) {
        target.on(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
    }

    /**
     * 触摸开始
     * @param event 触摸信息
     */
    private TouchStart(event) {
        if (this.Touch_Switch) {
            // if (this.Current_Prop === Prop.DownStop || this.Current_Prop === Prop.HookThree) {
            //     this.Touch_Click_Count++;
            // }
            cc.find("Canvas/Audio").getComponent(GameAudio).PlaySound(SoundType.Rope_Audio);
            //暂停角色浮动
            this.Role.node.getComponent(cc.Animation).pause();

            let isfirst = Cache.GetCache(CacheType.IsFirst);
            if (isfirst) {
                this.SetDowSwitch(true);
            }
            this.SetTouchSwitch(false);
            // console.log("触摸是否成功");
            this.Role.HookElongation(1);
        }
    }

    /**
     * 设置对象池
     * @param stage_pool 台阶对象池
     * @param stage_num 台阶数
     * @param stage_pre 台阶预制体
     */
    private SetPool(stage_pool: cc.NodePool, stage_num: number, stage_pre: cc.Prefab) {
        for (let i = 0; i < stage_num; i++) {
            let stage = cc.instantiate(stage_pre);
            stage_pool.put(stage);
        }
    }

    /**
     * 存储角色皮肤ID
     */
    SetNowRoleID(role_id: string) {
        this.Now_Role_ID = role_id;
    }

    /**
     * 返回关卡页
     */
    public BackGame() {
        cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
        cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM("bg");
        let isfirst = Cache.GetCache(CacheType.IsFirst);
        if (!isfirst) {
            this.Ripple.active = false;
            // this.NoviceGuide.active=true;
        }
        this.Max_Tier = 15;
        // this.Page_Level.active = true;
        this.Page_GameOver.active = false;
        this.SetDowSwitch(false);
        this.SetTouchSwitch(false);
        this.DataReset();
        // this.Page_Level.getComponent(Level).Init();
        WX.OffShow();
        WX.OffHide();
        WX.BannerHide();
        // this.unschedule(this.UpdateTime);
        WX.OffAudioInterruptionEnd();
        cc.director.loadScene("Start");
        this.Pool_Stage.clear();
    }

    /**
     * 游戏结束
     */
    GameOver() {
        WX.BannerHide();
        this.SetTouchSwitch(false);
        // this.SetDowSwitch(false);
        this.Back_Click_Switch = true;
        this.Page_GameOver.getChildByName("Coin").getChildByName("but_X2").getComponent(cc.Button).interactable = true;
        this.Page_GameOver.active = true;
        let coin_num = Cache.GetCache(CacheType.Current_Coin);
        if (!coin_num) {
            coin_num = "0";
        }
        this.Page_GameOver.getChildByName("Coin").getChildByName("coin_label").getComponent(cc.Label).string = "+" + coin_num;
    }

    /**
     * 下一关
     */
    private NextLevel() {
        cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
        cc.find("Canvas/BeginTime").getComponent(BeginTime).Play();
        // cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM("b_1");
        let level_num = parseInt(this.Level_Num.string) + 1;
        this.Level_Num.string = level_num + "";
        this.Page_GameOver.active = false;
        this.DataReset();
        this.Max_Tier = 15;
        this.GameInit(level_num);

    }

    /**
     * 重新开始
     */
    private Restart() {
        cc.find("Canvas/Audio").getComponent(GameAudio).StopBGM();
        cc.find("Canvas/BeginTime").getComponent(BeginTime).Play();
        // cc.find("Canvas/Audio").getComponent(GameAudio).PlayBGM("b_1");
        this.DataReset();
        let curr_level = parseInt(this.Level_Num.string);
        this.GameInit(curr_level);
        this.Page_GameOver.active = false;
    }

    /**
     * 复活
     */
    Resurrection() {
        this.SetCurrentProp();
        this.Prop_Extract.ResetPropBox();
        // this.Role.ProtectClose();
        this.Prop_IsDownOpen = false;
        this.ICE.active = false;
        this.Double_Node.active = false;
        this.Double_Node.getComponent(cc.Animation).stop();
        this.Touch_Click_Count = 0;
        this.Role.SetRotateDir(1);
        this.Role.HookClose();
        this.Stage_IsMove = true;
        this.IsBoss = false;
        let stagge_arr = this.Stage_Area.children;
        for (let i = 0; i < stagge_arr.length; i++) {
            //停止平台左右移动
            let stage_act = stagge_arr[i].getComponent(Stage).Stage_Action;
            if (stage_act) {
                stagge_arr[i].stopAction(stage_act);
            }
        }
        // //播放底部动画
        // for (let i = 0; i < this.Downs.length; i++) {
        //     if (this.Downs[i].active && this.Current_Prop === Prop.DownStop) {
        //         this.Downs[i].getChildByName("anim").getComponent(cc.Animation).play();
        //         return;
        //     }
        // }

        this.Page_GameOver.active = false;
        this.Page_GameOver.getChildByName("but_Resurrection").active = false;
        //重置钩子位置
        this.Role.HookShrink(0.2);
        //重置下一关按钮状态
        this.Page_GameOver.getChildByName("Buts").getChildByName("Buts_Right").getChildByName("but_Next").active = false;
        //重置重新开始按钮状态
        this.Page_GameOver.getChildByName("Buts").getChildByName("Buts_Right").getChildByName("but_Restart").active = false;
        //重置游戏结束标题显示
        this.Page_GameOver.getChildByName("Title").getChildByName("title_1").active = false;
        this.Page_GameOver.getChildByName("Title").getChildByName("title_2").active = false;
        this.Role.Resurrection();
        //重置底部位置
        // this.Down.setPosition(-5, -961);
        this.SetTouchSwitch(true);
        this.SetDowSwitch(false);
        let move = cc.moveTo(0.5, cc.v2(-5, -612));
        let callFunc = cc.callFunc(() => {
            // this.SetDowSwitch(true);
        });
        this.Down.runAction(cc.sequence(move, callFunc));
    }

    /**
     * 数据重置
     */
    private DataReset() {
        this.SetCurrentProp();
        this.Prop_Extract.ResetPropBox();
        this.ICE.active = false;
        this.Role.ProtectClose();
        this.Prop_IsDownOpen = false;
        this.Double_Node.active = false;
        this.Double_Node.getComponent(cc.Animation).stop();
        this.Touch_Click_Count = 0;
        this.Role.SetRotateDir(1);
        this.Role.HookClose();
        this.Stage_IsMove = true;
        this.IsBoss = false;
        // //播放底部动画
        // for (let i = 0; i < this.Downs.length; i++) {
        //     if (this.Downs[i].active && this.Current_Prop === Prop.DownStop) {
        //         this.Downs[i].getChildByName("anim").getComponent(cc.Animation).play();
        //     }
        // }

        if (this.Hint_Pos) {
            let hint = this.Page_GameOver.getChildByName("Hint_Coin");
            hint.stopAllActions()
            hint.setPosition(this.Hint_Pos);
            this.Hint_Pos = null;
            hint.active = false;
        }
        //重置钩子位置
        this.Role.HookShrink(0.2);
        this.Page_GameOver.getChildByName("Title").getChildByName("title_1").active = false;
        this.Page_GameOver.getChildByName("Title").getChildByName("title_2").active = false;
        //重置下一关按钮状态
        this.Page_GameOver.getChildByName("Buts").getChildByName("Buts_Right").getChildByName("but_Next").active = false;
        //重置重新开始按钮状态
        this.Page_GameOver.getChildByName("Buts").getChildByName("Buts_Right").getChildByName("but_Restart").active = false;
        //重置角色
        this.Role.Reset();
        //重置底部位置
        this.Down.setPosition(-5, -612);
        //重置当前金币数
        Cache.RemoveCache(CacheType.Current_Coin);

        //重置数值
        this.Platform.active = true;
        let patch_arr = this.Stage_Area.children;
        this.Tier_Num = 0;
        this.Progress_Bar.node.getChildByName("bfb").getComponent(cc.Label).string = 0 + "%";
        this.Progress_Bar.progress = 0;
        //清空随机层数
        this.Award_Tiers = [];

        //回收对象池
        for (let i = 0; i < patch_arr.length; i++) {
            patch_arr[i].stopAllActions();
            // patch_arr[i].removeComponent(cc.BoxCollider);
            // patch_arr[i].getChildByName("award").removeComponent(cc.BoxCollider);
            this.Pool_Stage.put(patch_arr[i]);
            i--;
        }

        //重置背景
        this.UpdateBG("b_1");

        let role_skin = Cache.GetCache(CacheType.Role_SkinId);
        this.SetNowRoleID(role_skin);
        this.Role.UpdateSkin(role_skin);
    }
}
