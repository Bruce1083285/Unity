import { EventCenter } from "./commont/EventCenter";
import { EventType, CacheType, DragonBonesAnimation_Role, DragonBonesAnimation_PlayTimes, DragonBonesAnimation_Car, Prop_Passive } from "./commont/Enum";
import { Cache } from "./commont/Cache";
import PropBox from "./game/PropBox";
import Player from "./game/Player";
import { GameManage } from "./commont/GameManager";
import AI from "./game/AI";
import { PopupBox } from "./commont/PopupBox";

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
     * @property 游戏起点跑道
     */
    @property(cc.Prefab)
    private Pre_PathStart: cc.Prefab = null;
    /**
     * @property 游戏跑道
     */
    @property(cc.Prefab)
    private Pre_Path: cc.Prefab = null;
    /**
     * @property 游戏终点跑道
     */
    @property(cc.Prefab)
    private Pre_PathEnd: cc.Prefab = null;
    /**
     * @property 玩家预制体
     */
    @property(cc.Prefab)
    private Pre_Player: cc.Prefab = null;
    /**
     * @property AI预制体
     */
    @property(cc.Prefab)
    private Pre_AI: cc.Prefab = null;
    /**
     * @property 问号预制体
     */
    @property(cc.Prefab)
    private Pre_Question: cc.Prefab = null;
    /**
     * @property 道具预制体
     */
    @property(cc.Prefab)
    private Pre_Prop: cc.Prefab = null;
    /**
     * @property 空投--->卡片预制体
     */
    @property(cc.Prefab)
    private Pre_TransportationCard: cc.Prefab = null;
    /**
     * @property 空投--->奖励精灵帧
     */
    @property([cc.SpriteFrame])
    private Spr_TransportationAward: cc.SpriteFrame[] = [];
    /**
     * @property 空投--->礼包预制体
     */
    @property([cc.Prefab])
    private Pre_TransportationGift: cc.Prefab[] = [];
    /**
     * @property 空投--->飞机预制体
     */
    @property([cc.Prefab])
    private Pre_TransportationAircraft: cc.Prefab[] = [];
    /**
     * @property 对象池初始化次数
     */
    @property
    private Pool_InitCount: number = 5;
    /**
     * @property [Array]被动道具预制体
     */
    @property([cc.Prefab])
    private Pre_PassiveProps: cc.Prefab[] = [];
    /**
     * @property [Array]赛道皮肤
     */
    @property([cc.SpriteFrame])
    private Skin_Paths: cc.SpriteFrame[] = [];
    /**
     * @property [Array]角色龙骨资源
     */
    @property([dragonBones.DragonBonesAsset])
    private BonesAsset_Role: dragonBones.DragonBonesAsset[] = [];
    /**
     * @property [Array]角色龙骨图集
     */
    @property([dragonBones.DragonBonesAtlasAsset])
    private BonesAtlasAsset_Role: dragonBones.DragonBonesAtlasAsset[] = [];
    /**
    * @property [Array]汽车龙骨资源
    */
    @property([dragonBones.DragonBonesAsset])
    private BonesAsset_Car: dragonBones.DragonBonesAsset[] = [];
    /**
     * @property [Array]汽车龙骨图集
     */
    @property([dragonBones.DragonBonesAtlasAsset])
    private BonesAtlasAsset_Car: dragonBones.DragonBonesAtlasAsset[] = [];
    /**
     * @property 道具盒子类
     */
    private Prop_Box: PropBox = null
    /**
     * @property 背景
     */
    private BG: cc.Node = null;
    /**
     * @property 起点赛道节点
     */
    private Path_Start: cc.Node = null;
    /**
     * @property 赛道区域
     */
    private Area_Path: cc.Node = null;
    /**
     * @property 道具区域
     */
    public Area_Prop: cc.Node = null;
    /**
     * @property 玩家
     */
    public Player: cc.Node = null;
    /**
     * @property 左键
     */
    private But_Left: cc.Node = null;
    /**
    * @property 右键
    */
    private But_Right: cc.Node = null;
    /**
     * @property 进度条
     */
    private Bar_Progres: cc.Node = null;
    /**
     * @property 游戏开始倒计时
     */
    public Page_StartTime: cc.Node = null;
    /**
     * @property 游戏结束倒计时
     */
    private Page_EndTime: cc.Node = null;
    /**
     * @property 游戏结束倒计时回调
     */
    private Page_EndTimeCallBack: Function = null;
    /**
     * @property 游戏结束页
     */
    private Page_Over: cc.Node = null;
    /**
     * @property 暂停页
     */
    private Page_Pause: cc.Node = null;
    /**
     * @property 空投--->飞机
     */
    private Trans_Aircraft: cc.Node = null;
    /**
     * @property 空投--->礼包
     */
    private Trans_Gift: cc.Node = null;
    /**
     * @property 空投--->卡
     */
    private Trans_Card: cc.Node = null;
    /**
     * @property 排名label
     */
    private Label_Ranking: cc.Label = null;
    /**
     * @property 空投--->回调--->1
     */
    private Trans_CallBack_1: Function = null;
    /**
    * @property 空投--->回调--->2
    */
    private Trans_CallBack_2: Function = null;
    /**
     * @property 当前赛道皮肤
     */
    private Current_PathSkin: cc.SpriteFrame = null;
    /**
     * @property 当前玩家--->角色龙骨资源
     */
    private Current_Player_RoleAsset: dragonBones.DragonBonesAsset = null;
    /**
     * @property 当前玩家--->角色图集
     */
    private Current_Player_RoleAtlasAsset: dragonBones.DragonBonesAtlasAsset = null;
    /**
     * @property 当前玩家--->汽车龙骨资源
     */
    private Current_Player_CarAsset: dragonBones.DragonBonesAsset = null;
    /**
     * @property 当前玩家--->汽车图集
     */
    private Current_Player_CarAtlasAsset: dragonBones.DragonBonesAtlasAsset = null;
    /**
     * @property 跑道起点对象池
     */
    private Pool_PathStart: cc.NodePool = null;
    /**
    * @property 跑道对象池
    */
    private Pool_Path: cc.NodePool = null;
    /**
    * @property 跑道终点对象池
    */
    private Pool_PathEnd: cc.NodePool = null;
    /**
    * @property AI对象池
    */
    private Pool_AI: cc.NodePool = null;
    /**
    * @property 问号对象池
    */
    public Pool_Question: cc.NodePool = null;
    /**
     * @property 道具对象池
     */
    public Pool_Prop: cc.NodePool = null;
    /**
     * @property 被动道具对象池
     */
    public Pool_PassiveProps: cc.NodePool = null;
    /**
     * @property 水平移动值   -1：左  0：不变  1：右
     */
    public Horizontal: number = 0;
    /**
     * @property 问号间距
     */
    private Question_Space: number = 0;
    /**
     * @property 行程
     */
    private Journey: number = 0;
    /**
     * @property 移动速度值
     */
    private Speed: number = 0;
    /**
     * @property 最大速度值
     */
    private Speed_Max: number = 120;
    /**
     * @property [Array]问号
     */
    private Questions: cc.Node[][] = [];
    /**
     * @property 速度条
     */
    private Bar_Speeds: cc.Node[] = [];
    /**
     * 龙骨骨架--->汽车
     */
    private Armature_Car = {
        "1": "kadingcheguanjunche",
        "2": "kadingchefeidieche",
        "3": "kadingcheF1hong",
        "4": "kadingchehanbaoche",
        "5": "kadingcheziseche",
        "6": "kadingcheboluoche",
        "7": "kadingcheF1lan",
        "8": "kadingcheboheche",
    }

    /**
    * 龙骨骨架--->角色
    */
    private Armature_Role = {
        "1": "kadingchexiyangyang",
        "2": "kadingchexiongda",
        "3": "kadingcheguangtouqiang",
        "4": "kadingchebakeduizhang",
        "5": "kadingchewukong",
    }

    update(dt) {
        if (this.Player && GameManage.Instance.IsUpdateProgress) {
            //进度条
            this.UpdateProgresBar();
            this.UpdateRanking();
        }
    }

    /**
     * 初始化
     */
    Init() {
        this.Pool_PathStart = new cc.NodePool();
        this.SetPool(this.Pool_PathStart, this.Pool_InitCount, this.Pre_PathStart);
        this.Pool_Path = new cc.NodePool();
        this.SetPool(this.Pool_Path, this.Pool_InitCount, this.Pre_Path);
        this.Pool_PathEnd = new cc.NodePool();
        this.SetPool(this.Pool_PathEnd, this.Pool_InitCount, this.Pre_PathEnd);
        this.Pool_AI = new cc.NodePool();
        this.SetPool(this.Pool_AI, this.Pool_InitCount, this.Pre_AI);
        this.Pool_Question = new cc.NodePool();
        this.SetPool(this.Pool_Question, this.Pool_InitCount, this.Pre_Question);
        this.Pool_Prop = new cc.NodePool();
        this.SetPool(this.Pool_Prop, this.Pool_InitCount, this.Pre_Prop);
        this.Pool_PassiveProps = new cc.NodePool();
        this.SetPoolPassive(this.Pre_PassiveProps, this.Pool_PassiveProps);

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        this.BG = this.node.getChildByName("BG");
        this.Area_Path = this.node.getChildByName("Area_Path");
        this.Area_Prop = this.node.getChildByName("Area_Prop");
        this.But_Left = this.node.parent.getChildByName("Main Camera").getChildByName("But_Directions").getChildByName("but_Left");
        this.But_Right = this.node.parent.getChildByName("Main Camera").getChildByName("But_Directions").getChildByName("but_Right");
        this.Bar_Speeds = this.node.parent.getChildByName("Main Camera").getChildByName("SpeedBar").getChildByName("Progress").children;
        this.Bar_Progres = this.node.parent.getChildByName("Main Camera").getChildByName("ProgressBar");
        this.Page_StartTime = this.node.parent.getChildByName("Main Camera").getChildByName("Page_StartTime");
        this.Page_Over = this.node.parent.getChildByName("Main Camera").getChildByName("Page_Over");
        this.Page_EndTime = this.node.parent.getChildByName("Main Camera").getChildByName("Page_EndTime");
        this.Page_Pause = this.node.parent.getChildByName("Main Camera").getChildByName("Page_Pause");
        this.Label_Ranking = this.node.parent.getChildByName("Main Camera").getChildByName("label_Ranking").getComponent(cc.Label);
        GameManage.Instance.Roles = this.Area_Path.children;

        this.Prop_Box = this.node.parent.getChildByName("Main Camera").getChildByName("Box_Prop").getComponent(PropBox);
        this.Prop_Box.Init();

        this.AddListenter();
        this.TouchOn();

        // this.Test();
    }

    /**
     * 测试
     */
    private Test() {

        console.log(this.BonesAtlasAsset_Role[3].name);
        Cache.SetCache(CacheType.Current_Role_ID, "3");
        Cache.SetCache(CacheType.Current_Car_ID, "6");

        // this.SetCurrentPlayerSkin();
        // this.SetPlayer(this.Area_Path, this.Pre_Player);
        // this.SetAI(this.Pool_AI, this.Area_Path);
        // this.SetRolePos(this.Area_Path);
        // this.Questions = this.GetQuestion(this.Pool_Question, this.Area_Path);
        console.log(this.Questions);

        this.SetCurrentPathSkin("3");
        this.SetPath(this.Pool_Path, this.BG, this.Pre_Path, this.Current_PathSkin, 3);
        this.SetPath(this.Pool_PathEnd, this.BG, this.Pre_PathEnd, this.Current_PathSkin, 1);
        this.SetPath(this.Pool_Path, this.BG, this.Pre_Path, this.Current_PathSkin, 1);
        this.UpdatePathStart(this.Current_PathSkin, this.Path_Start);
        // let arr = this.BG.children;
        // for (let i = 0; i < arr.length; i++) {
        //     arr[i].runAction(cc.moveBy(20, 0, -10000));
        // }
        // this.BG.runAction(cc.moveBy(20, 0, -10000));
        for (let i = 0; i < 1; i++) {
            this.SetQuestion(this.Pool_Question, this.Area_Path);
        }
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "back":
                this.Back();
                break;
            case "pause":
                this.Paues();
                break;
            case "restart":
                this.Restart();
                break;
            case "goon":
                this.GoOn();
                break;
            default:
                break;
        }
    }

    /**
     * 返回
     */
    private Back() {
        let callback = () => {
            EventCenter.Broadcast(EventType.Page_LevelShow);
            this.Close(this.node);
            this.Page_EndTime.active = false;
            this.GameReset();

        }
        if (this.Page_Over.active) {
            PopupBox.CommontBack(this.Page_Over, callback);
        }
        if (this.Page_Pause.active) {
            PopupBox.CommontBack(this.Page_Pause, callback);
        }


    }

    /**
     * 暂停
     */
    private Paues() {
        if (GameManage.Instance.IsGameStart && GameManage.Instance.IsGameClick) {
            let callback = () => {
                let role_arr = GameManage.Instance.Roles;
                for (let i = 0; i < role_arr.length; i++) {
                    let role = role_arr[i];
                    let role_type = null;
                    if (role.name === "AI") {
                        role_type = role.getComponent(AI);
                    }
                    if (role.name === "Player") {
                        role_type = role.getComponent(Player);
                    }
                    role_type.IsSpeedUp = false;
                    role_type.Speed = 0;
                }
            }
            PopupBox.CommontPopup(this.Page_Pause, callback);
        }
    }

    /**
     * 重新开始
     */
    private Restart() {
        let callback = () => {
            this.unscheduleAllCallbacks();
            this.GameReset();
            EventCenter.BroadcastOne<string>(EventType.Game_SetCurrentPath, this.Current_PathSkin.name);
            //设置玩家
            EventCenter.Broadcast(EventType.Game_SetCurrentPlayerSkin);
        }

        if (this.Page_Pause.active) {
            PopupBox.CommontBack(this.Page_Pause, callback);
        }

        if (this.Page_Over.active) {
            PopupBox.CommontBack(this.Page_Over, callback);
        }
    }

    /**
     * 继续游戏
     */
    private GoOn() {
        let callback = () => {
            let role_arr = GameManage.Instance.Roles;
            for (let i = 0; i < role_arr.length; i++) {
                let role = role_arr[i];
                let role_type = null;
                if (role.name === "AI") {
                    role_type = role.getComponent(AI);
                }
                if (role.name === "Player") {
                    role_type = role.getComponent(Player);
                }
                role_type.IsSpeedUp = true;
            }
        }
        PopupBox.CommontBack(this.Page_Pause, callback);
    }

    /**
     * 游戏重置
     */
    private GameReset() {
        this.unscheduleAllCallbacks();
        this.SetSpeedBar(0);
        // this.Trans_Aircraft.destroy();
        // this.Trans_Aircraft = null;
        // this.Trans_Card.destroy();
        // this.Trans_Card = null;
        // this.Trans_Gift.destroy();
        // this.Trans_Gift = null;
        // this.unschedule(this.Trans_CallBack_1);
        // this.Trans_CallBack_1 = null;
        // this.unschedule(this.Trans_CallBack_2);
        // this.Trans_CallBack_2 = null;
        EventCenter.Broadcast(EventType.Game_ClearPropBox);

        GameManage.Instance.IsUpdateProgress = true;
        GameManage.Instance.IsGameClick = true;
        GameManage.Instance.IsGameEnd = false;
        GameManage.Instance.IsGameStart = false;
        GameManage.Instance.IsTouchClick = false;
        GameManage.Instance.IsCameraFollow = false;

        let prop_arr = this.Area_Prop.children;
        for (let i = 0; i < prop_arr.length; i++) {
            prop_arr[i].destroy();
        }

        let path_arr = this.BG.children;
        for (let i = 0; i < path_arr.length; i++) {
            let path = path_arr[i];
            if (path.name === "Path") {
                this.Pool_Path.put(path);
            }
            if (path.name === "Path_End") {
                this.Pool_PathEnd.put(path);
            }
            if (path.name === "Path_Start") {
                this.Pool_PathStart.put(path);
            }
            i--;
        }

        let role_arr = GameManage.Instance.Roles;
        for (let i = 0; i < role_arr.length; i++) {
            let role = role_arr[i];
            let role_Type = null;
            if (role.name === "AI") {
                role_Type = role.getComponent(AI);
            }
            if (role.name === "Player") {
                role_Type = role.getComponent(Player);
                role_Type.Camera.setPosition(0, 0);
            }
            let arr = role.children;
            for (let i = 0; i < arr.length; i++) {
                let arr_node = arr[i];
                if (arr_node.name === "Car" || arr_node.name === "Role" || arr_node.name === "name") {
                    continue;
                }
                arr_node.destroy();
            }
            role_Type.Speed = 0;
        }
    }

    /**
     * 添加监听
     */
    private AddListenter() {
        //显示
        EventCenter.AddListenter(EventType.Page_GameShow, () => {
            this.Show(this.node);
        }, "Game");

        //关闭
        EventCenter.AddListenter(EventType.Page_GameClose, () => {
            this.Close(this.node);
        }, "Game");

        //设置当前跑道
        EventCenter.AddListenter(EventType.Game_SetCurrentPath, (path_ID) => {
            this.Page_StartTime.active = true;
            let dragon = this.Page_StartTime.getChildByName("time").getComponent(dragonBones.ArmatureDisplay);
            dragon.playAnimation("a1", 1);
            this.SetCurrentPathSkin(path_ID);
            this.SetPathStart(this.Pool_PathStart, this.BG);
            this.UpdatePathStart(this.Current_PathSkin, this.Path_Start);

            let ran = Math.floor(Math.random() * 3 + 2);
            this.SetPath(this.Pool_Path, this.BG, this.Pre_Path, this.Current_PathSkin, 8);
            this.SetPath(this.Pool_PathEnd, this.BG, this.Pre_PathEnd, this.Current_PathSkin, 1);
            this.SetPath(this.Pool_Path, this.BG, this.Pre_Path, this.Current_PathSkin, 1);
            this.SetTransportationAward(this.Pre_TransportationGift, this.Pre_TransportationAircraft, this.Pre_TransportationCard, this.Spr_TransportationAward, this.Area_Prop);

            let callback = () => {
                this.Page_StartTime.active = false;
                GameManage.Instance.IsGameStart = true;
                GameManage.Instance.IsTouchClick = true;
                //测试
                this.Player = this.Area_Path.getChildByName("Player");

                // this.SetQuestion(this.Pool_Question, this.Area_Prop);

                // this.UpdateSpeed();
                // this.RunPathMove(this.BG);

                this.SetPassivePos(this.Pool_PassiveProps, this.Area_Prop);
            }
            this.scheduleOnce(callback, 4);
        }, "Game");

        //设置当前玩家
        EventCenter.AddListenter(EventType.Game_SetCurrentPlayerSkin, () => {
            // this.SetCurrentPlayerSkin();
            // this.SetPlayer(this.Area_Path, this.Pre_Player);
            // this.SetAI(this.Pool_AI, this.Area_Path);
            this.SetRolePos(this.Area_Path);
        }, "Game");

        //设置速度等级
        EventCenter.AddListenter(EventType.Game_SetSpeedBar, (speed_level) => {
            this.SetSpeedBar(speed_level);
        }, "Game");

        //设置道具对象池
        EventCenter.AddListenter(EventType.Game_SetPoolProp, () => {
            this.SetPool(this.Pool_Prop, this.Pool_InitCount, this.Pre_Prop);
        }, "Game");

        //游戏结束
        EventCenter.AddListenter(EventType.Game_GameOver, () => {
            this.GameOver();
        }, "Game");
    }

    /**
     * 移除监听
     */
    private RemoveListenter() {
        //显示
        EventCenter.RemoveListenter(EventType.Page_GameShow, "Game");

        //关闭
        EventCenter.RemoveListenter(EventType.Page_GameClose, "Game");

        //设置当前跑道
        EventCenter.RemoveListenter(EventType.Game_SetCurrentPath, "Game");

        //游戏结束
        EventCenter.RemoveListenter(EventType.Game_GameOver, "Game");
    }

    /**
     * 显示节点
     * @param show_node 显示的节点
     */
    private Show(show_node: cc.Node) {
        show_node.active = true;
    }


    /**
     * 关闭节点
     * @param close_node 关闭的节点
     */
    private Close(close_node: cc.Node) {
        close_node.active = false;
    }

    /**
     * 设置速度条
     * @param speed_level 速度等级
     */
    private SetSpeedBar(speed_level: number) {
        for (let i = 0; i < this.Bar_Speeds.length; i++) {
            let speed = this.Bar_Speeds[i];
            let speed_value = parseInt(speed.name);
            if (speed_value <= speed_level) {
                speed.active = true;
            } else {
                speed.active = false;
            }
        }
    }

    /**
     * 事件注册
     */
    private TouchOn() {
        this.But_Left.on(cc.Node.EventType.TOUCH_START, this.LeftStart, this);
        this.But_Left.on(cc.Node.EventType.TOUCH_END, this.TouchEnd, this);

        this.But_Right.on(cc.Node.EventType.TOUCH_START, this.RightStart, this);
        this.But_Right.on(cc.Node.EventType.TOUCH_END, this.TouchEnd, this);
    }

    /**
     * 左键触摸开始
     * @param event 触摸信息
     */
    private LeftStart(event) {
        if (!GameManage.Instance.IsTouchClick && !GameManage.Instance.IsGameStart) {
            return;
        }
        console.log(this.Player);
        this.Horizontal = -1;
        let dra_role = this.Player.getChildByName("Role").getChildByName("role").getComponent(dragonBones.ArmatureDisplay);
        dra_role.playAnimation("a3", 0);

        let dra_car = this.Player.getChildByName("Car").getChildByName("car").getComponent(dragonBones.ArmatureDisplay);
        dra_car.playAnimation("a3", 0);
    }

    /**
     * 触摸结束
     * @param event 触摸信息
     */
    private TouchEnd(event) {
        if (!GameManage.Instance.IsTouchClick && !GameManage.Instance.IsGameStart) {
            return;
        }
        let dra_role = this.Player.getChildByName("Role").getChildByName("role").getComponent(dragonBones.ArmatureDisplay);
        dra_role.playAnimation("a1", 0);

        let dra_car = this.Player.getChildByName("Car").getChildByName("car").getComponent(dragonBones.ArmatureDisplay);
        dra_car.playAnimation("a1", 0);
        this.Horizontal = 0;
    }

    /**
     * 右键触摸开始
     * @param event 触摸信息
     */
    private RightStart(event) {
        if (!GameManage.Instance.IsTouchClick && !GameManage.Instance.IsGameStart) {
            return;
        }
        let dra_role = this.Player.getChildByName("Role").getChildByName("role").getComponent(dragonBones.ArmatureDisplay);
        dra_role.playAnimation("a6", 0);

        let dra_car = this.Player.getChildByName("Car").getChildByName("car").getComponent(dragonBones.ArmatureDisplay);
        dra_car.playAnimation("a6", 0);
        this.Horizontal = 1;
    }

    /**
     * 设置对象池
     * @param pool 对象池
     * @param count 循环次数
     * @param pre 预制体
     */
    private SetPool(pool: cc.NodePool, count: number, pre: cc.Prefab) {
        for (let i = 0; i < count; i++) {
            let pre_node = cc.instantiate(pre);
            pool.put(pre_node);
        }
    }

    /**
     * 设置被动道具对象池
     * @param pre_PassiveProps 
     * @param pool 
     */
    private SetPoolPassive(pre_PassiveProps: cc.Prefab[], pool: cc.NodePool) {
        let arr: string[] = [];
        for (let i = 0; i < pre_PassiveProps.length; i++) {
            let ran = Math.floor(Math.random() * pre_PassiveProps.length);
            let pre_Prop = this.Pre_PassiveProps[ran];
            let ind = arr.indexOf(pre_Prop.name);
            if (ind === -1) {
                arr.push(pre_Prop.name);
                let prop = cc.instantiate(pre_Prop);
                pool.put(prop);
                continue;
            }
            i--;
        }
    }

    /**
     * 设置被动道具位置
     * @param pool 对象池
     * @param parent 父节点
     */
    private SetPassivePos(pool: cc.NodePool, parent: cc.Node) {
        let ran = Math.random() * 5 + 10
        for (let i = 0; i < ran; i++) {
            let prop = pool.get();
            if (!prop) {
                this.SetPoolPassive(this.Pre_PassiveProps, this.Pool_PassiveProps);
                prop = pool.get();
            }

            let name = prop.name;
            // let cha=name.charAt(name.length-1);
            // let num=parseInt(cha);
            if (name === "Container") {
                i--;
                continue;
            }

            // let world_Pos = this.Area_Path.convertToWorldSpaceAR(this.Area_Path.position);
            // let node_Pos = this.ar.convertToNodeSpaceAR(world_Pos);
            parent.addChild(prop);

            let ran_x = Math.random() * 400 + 100;
            let value = 1500;
            prop.setPosition(ran_x, i * value + value / 2);
            // prop.runAction(cc.moveBy(20, 0, -10000));
        }
    }

    /**
     * 设置移动型被动道具
     * @param prop 
     * @param parent 
     * @param ind 
     * @param value 
     */
    private SetMovePassiveProp(prop: cc.Node, parent: cc.Node, node_Pos: cc.Vec2, ind: number, value: number) {

        prop.setPosition(node_Pos.x, ind * value + value / 2);
    }

    /**
     * 设置静止类型的被动道具
     * @param prop 道具
     * @param parent 父节点
     * @param ind 下标索引
     * @param value 值
     */
    private SetStaticPassiveProp(prop: cc.Node, parent: cc.Node, node_Pos: cc.Vec2, ind: number, value: number) {

        let ran_x = Math.random() * 600 + node_Pos.x;
        prop.setPosition(ran_x, ind * value + value / 2);
    }

    /**
     * 设置赛道起点
     * @param pool 对象池
     * @param parent 父节点
     */
    private SetPathStart(pool: cc.NodePool, parent: cc.Node) {
        let path_start = pool.get();
        if (!path_start) {
            this.SetPool(this.Pool_PathStart, this.Pool_InitCount, this.Pre_PathStart);
            path_start = pool.get();
        }

        parent.addChild(path_start);
        path_start.setPosition(0, 0);
        this.Path_Start = path_start;
    }

    /**
     * 设置赛道
     * @param pool 对象池
     * @param parent 父节点
     * @param pre_Path 赛道预制体
     * @param current_pathSkin 当前赛道皮肤
     */
    private SetPath(pool: cc.NodePool, parent: cc.Node, pre_Path: cc.Prefab, current_pathSkin: cc.SpriteFrame, path_num: number) {
        for (let i = 0; i < path_num; i++) {
            let path = pool.get();
            if (!path) {
                this.SetPool(pool, this.Pool_InitCount, pre_Path);
                path = pool.get();
            }

            let arr = parent.children;
            let maxY_Node: cc.Node = arr[0];
            for (let j = 0; j < arr.length; j++) {
                let max_y = maxY_Node.position.y;
                let arr_y = arr[j].position.y;
                if (max_y < arr_y) {
                    maxY_Node = arr[j];
                }
            }
            let size_y = maxY_Node.getContentSize().height;
            let x = maxY_Node.position.x;
            let y = maxY_Node.position.y + size_y;

            parent.addChild(path);
            path.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = current_pathSkin;
            path.setPosition(x, y);
        }
    }

    /**
     * 设置玩家
     * @param parent 父节点
     * @param pre_player 玩家预制体
     */
    private SetPlayer(parent: cc.Node, pre_player: cc.Prefab) {
        let player = cc.instantiate(pre_player);

        //角色
        let display_role = player.getChildByName("Role").getChildByName("role").getComponent(dragonBones.ArmatureDisplay);
        this.SetPlayerDragonBones(display_role, this.Current_Player_RoleAsset, this.Current_Player_RoleAtlasAsset, DragonBonesAnimation_Car.a1, DragonBonesAnimation_PlayTimes.Loop, this.Armature_Role);

        //汽车
        let display_car = player.getChildByName("Car").getChildByName("car").getComponent(dragonBones.ArmatureDisplay);
        this.SetPlayerDragonBones(display_car, this.Current_Player_CarAsset, this.Current_Player_CarAtlasAsset, DragonBonesAnimation_Car.a1, DragonBonesAnimation_PlayTimes.Loop, this.Armature_Car);

        // player.getComponent(Player).Init();
        parent.addChild(player);
    }

    /**
     * 设置玩家龙骨属性
     * @param display 龙骨组件
     * @param asset 龙骨资源
     * @param atlasAsset 龙骨图集
     * @param animation_vlaue 龙骨动画名称
     * @param animation_PlayTimes_value 龙骨动画播放次数
     */
    private SetPlayerDragonBones(display: dragonBones.ArmatureDisplay, asset: dragonBones.DragonBonesAsset, atlasAsset: dragonBones.DragonBonesAtlasAsset, animation_vlaue: any, animation_PlayTimes_value: DragonBonesAnimation_PlayTimes, obj_Armature: {}) {
        console.log("组件龙骨资源");
        console.log(display.dragonAsset);
        console.log("参数龙骨资源");
        console.log(asset);
        let a = display.armature();
        console.log(a);

        display.dragonAsset = asset;
        display.dragonAtlasAsset = atlasAsset;
        display.animationName = animation_vlaue;
        display.playTimes = animation_PlayTimes_value;
    }

    /**
     * 设置玩家当前皮肤
     */
    private SetCurrentPlayerSkin() {
        //当前角色皮肤
        let skinid_Role = Cache.GetCache(CacheType.Current_Role_ID);
        //角色龙骨
        for (let i = 0; i < this.BonesAsset_Role.length; i++) {
            let asset = this.BonesAsset_Role[i];
            let atlasAsset = this.BonesAtlasAsset_Role[i];
            let cha = asset.name.charAt(0);
            if (cha === skinid_Role) {
                this.Current_Player_RoleAsset = asset;
                this.Current_Player_RoleAtlasAsset = atlasAsset;
                break;
            }
        }

        //当前汽车皮肤
        let skinid_Car = Cache.GetCache(CacheType.Current_Car_ID);
        //汽车龙骨
        for (let i = 0; i < this.BonesAsset_Car.length; i++) {
            let asset = this.BonesAsset_Car[i];
            let atlasAsset = this.BonesAtlasAsset_Car[i];
            let cha = asset.name.charAt(0);
            if (cha === skinid_Car) {
                this.Current_Player_CarAsset = asset;
                this.Current_Player_CarAtlasAsset = atlasAsset;
                break;
            }
        }

    }

    /**
    * 设置AI
    * @param pool 对象池
    * @param parent 父节点
    */
    private SetAI(pool: cc.NodePool, parent: cc.Node) {
        let arr_Role: number[] = [];
        let arr_Car: number[] = [];

        for (let i = 0; i < 3; i++) {
            let AI = pool.get();
            if (!AI) {
                this.SetPool(this.Pool_AI, this.Pool_InitCount, this.Pre_AI);
                AI = pool.get();
            }

            //角色
            for (let j = 0; j < this.BonesAsset_Role.length; j++) {
                let display_role = AI.getChildByName("Role").getChildByName("role").getComponent(dragonBones.ArmatureDisplay);
                let istrue = this.SetAIDragonBones(display_role, this.BonesAsset_Role, this.BonesAtlasAsset_Role, DragonBonesAnimation_Role.a1, DragonBonesAnimation_PlayTimes.Loop, arr_Role);
                if (istrue) {
                    break;
                }
                j--;
            }

            //汽车
            for (let j = 0; j < this.BonesAsset_Car.length; j++) {
                let display_car = AI.getChildByName("Car").getChildByName("car").getComponent(dragonBones.ArmatureDisplay);
                let istrue = this.SetAIDragonBones(display_car, this.BonesAsset_Car, this.BonesAtlasAsset_Car, DragonBonesAnimation_Car.a1, DragonBonesAnimation_PlayTimes.Loop, arr_Car);
                if (istrue) {
                    break;
                }
                j--;
            }

            parent.addChild(AI);
        }
    }

    /**
     * 设置AI龙骨属性
     * @param display 龙骨组件
     * @param bonesAssets [Array]龙骨资源
     * @param bonesAtlasAssets [Array]龙骨图集
     * @param animation_value 龙骨动画名称
     * @param animation_PlayTimes_value 龙骨动画播放次数
     * @param arr [Array]记录是否重复
     * @returns 是否设置成功
     */
    private SetAIDragonBones(display: dragonBones.ArmatureDisplay, bonesAssets: dragonBones.DragonBonesAsset[], bonesAtlasAssets: dragonBones.DragonBonesAtlasAsset[], animation_value: any, animation_PlayTimes_value: DragonBonesAnimation_PlayTimes, arr: number[]): boolean {
        let ran = Math.floor(Math.random() * bonesAssets.length)
        let ind = arr.indexOf(ran);
        if (ind === -1) {
            let asset = bonesAssets[ran];
            let atlasAsset = bonesAtlasAssets[ran];
            display.dragonAsset.dragonBonesJson = asset.dragonBonesJson;
            display.dragonAtlasAsset.atlasJson = atlasAsset.atlasJson;
            display.animationName = animation_value;
            display.playTimes = animation_PlayTimes_value;

            arr.push(ran);
            return true;
        }
        return false;
    }

    /**
     * 设置角色位置
     * @param parent 角色父节点
     */
    private SetRolePos(parent: cc.Node) {
        let arr = parent.children;
        let have_arr: number[] = [];
        for (let i = 0; i < arr.length; i++) {
            let ran = Math.floor(Math.random() * arr.length);
            let ind = have_arr.indexOf(ran);
            if (ind !== -1) {
                i--;
                continue;
            }
            have_arr.push(ran);

            let role = arr[ran];
            let role_Type = null;
            if (role.name === "AI") {
                role_Type = role.getComponent(AI);
            }
            if (role.name === "Player") {
                role_Type = role.getComponent(Player);
                role_Type.Camera.setPosition(0, 0);
            }
            role_Type.unscheduleAllCallbacks();
            role_Type.IsSpeedUp = true;
            let size_x = role.getContentSize().width;
            role.setPosition(i * 150 + 150 / 2, 300);
        }
    }

    /**
     * 设置当前赛道
     * @param PathId 赛道ID
     */
    private SetCurrentPathSkin(path_ID: String) {
        for (let i = 0; i < this.Skin_Paths.length; i++) {
            let skin_id = this.Skin_Paths[i];
            if (path_ID === skin_id.name) {
                this.Current_PathSkin = skin_id;
            }
        }
    }

    /**
     * 更新赛道皮肤
     * @param current_pathSkin 当前赛道皮肤
     * @param path 赛道
     */
    private UpdatePathStart(current_pathSkin: cc.SpriteFrame, path: cc.Node) {
        let sprite_path = path.getChildByName("bg").getComponent(cc.Sprite);
        sprite_path.spriteFrame = current_pathSkin;
    }

    /**
     * 更新速度值
     */
    private UpdateSpeed() {
        let callback = () => {
            this.Speed += 20;
            if (this.Speed >= this.Speed_Max) {
                this.Speed = this.Speed_Max;
            }
        }
        this.schedule(callback, 1);
    }

    /**
     * 更新排名
     */
    private UpdateRanking() {
        let role_arr: cc.Node[] = [];
        for (let i = 0; i < GameManage.Instance.Roles.length; i++) {
            role_arr.push(GameManage.Instance.Roles[i]);
        }

        for (let i = 0; i < role_arr.length; i++) {
            let y_i = role_arr[i].position.y;
            for (let j = i + 1; j < role_arr.length; j++) {
                let y_j = role_arr[j].position.y;
                if (y_i < y_j) {
                    let temp = role_arr[i];
                    role_arr[i] = role_arr[j];
                    role_arr[j] = temp
                }
            }
        }

        let str: string = null;
        for (let i = 0; i < role_arr.length; i++) {
            let role = role_arr[i];
            if (role.name === "Player") {
                if (i + 1 === 1) {
                    str = "st"
                }
                if (i + 1 === 2) {
                    str = "nd"
                }
                if (i + 1 === 3) {
                    str = "rd"
                }
                if (i + 1 === 4) {
                    str = "th"
                }
                this.Label_Ranking.string = (i + 1) + str;
            }
        }
    }

    /**
   * 设置进度条
   */
    private UpdateProgresBar() {
        let path = this.Bar_Progres.getChildByName("Path");
        let ball = path.getChildByName("ball");

        let arr = this.BG.children;
        let maxY_Node = arr[0];
        for (let i = 0; i < arr.length; i++) {
            let max_y = maxY_Node.position.y;
            let arr_y = arr[i].position.y;
            if (max_y < arr_y) {
                maxY_Node = arr[i];
            }
        }
        let world_Pos = this.BG.convertToWorldSpaceAR(maxY_Node.position);
        let hight = world_Pos.y - 1200;
        let wrold_Player_pos = this.Player.parent.convertToWorldSpaceAR(this.Player.position);
        let progres_y = (wrold_Player_pos.y - 300) / (hight - 1200);
        let path_hight = path.getContentSize().height;
        let ball_y = path_hight * progres_y;
        ball.setPosition(ball.position.x, ball_y);
    }

    /**
     * 执行跑道移动
     * @param parent 跑道所在父节点
     */
    private RunPathMove(parent: cc.Node) {
        let arr = parent.children;
        let max_Y_node = arr[0];
        for (let i = 0; i < arr.length; i++) {
            let path = arr[i];
            let max_y = max_Y_node.position.y;
            let path_y = path.position.y;
            if (max_y < path_y) {
                max_Y_node = path;
            }
        }

        let size_Hight = max_Y_node.getContentSize().height;
        this.Journey = max_Y_node.position.y + size_Hight / 2;
        for (let i = 0; i < arr.length; i++) {
            let path = arr[i];
            let act_Move = cc.moveBy(20, 0, -this.Journey);
            let act_callback = () => {
                //对象池回收
            }
            let act_Seq = cc.sequence(act_Move, cc.callFunc(act_callback));
            path.runAction(act_Seq);
        }

    }

    /**
     * 设置问号
     * @param pool 对象池
     * @param parent 父节点
     */
    private SetQuestion(pool: cc.NodePool, parent: cc.Node) {
        let arr: cc.Node[] = [];
        let ques_x: number = 150;

        let ran_max = Math.random() * 10;
        for (let j = 0; j < ran_max; j++) {
            this.Question_Space += 1000;
            for (let i = 0; i < 4; i++) {
                let question = pool.get();
                if (!question) {
                    this.SetPool(this.Pool_Question, this.Pool_InitCount, this.Pre_Question);
                    question = pool.get();
                }

                parent.addChild(question);
                question.setPosition(i * ques_x + ques_x / 2, 500 + this.Question_Space);

                arr.push(question);
            }
            this.Questions.push(arr);
        }
    }

    /**
     * 设置空投奖励
     * @param pre_Gift [Array]空投--->礼包预制体
     * @param pre_Aircraft [Array]空投--->飞机预制体
     * @param pre_Card 空投--->卡片
     * @param spr_Award [Array]空投--->奖励精灵帧
     * @param parent 父节点
     */
    private SetTransportationAward(pre_Gift: cc.Prefab[], pre_Aircraft: cc.Prefab[], pre_Card: cc.Prefab, spr_Award: cc.SpriteFrame[], parent: cc.Node) {
        let ran_ind = Math.floor(Math.random() * pre_Gift.length);
        this.Trans_Gift = cc.instantiate(pre_Gift[ran_ind]);
        parent.addChild(this.Trans_Gift);
        this.Trans_Gift.active = false;

        this.Trans_Aircraft = cc.instantiate(pre_Aircraft[ran_ind]);
        parent.addChild(this.Trans_Aircraft);
        let size_Hight = parent.getContentSize().height;
        let y = Math.random() * (size_Hight - 800) + 800;
        this.Trans_Aircraft.setPosition(-500, y);

        this.Trans_Card = cc.instantiate(pre_Card);
        parent.addChild(this.Trans_Card);
        this.Trans_Card.active = false;
        let spr_card = this.Trans_Card.getComponent(cc.Sprite);
        spr_card.spriteFrame = spr_Award[ran_ind]

        let speed_value = 5;
        let ran_x = Math.random() * 500 + 100;
        this.Trans_CallBack_1 = () => {
            let x = this.Trans_Aircraft.position.x + speed_value;
            this.Trans_Aircraft.setPosition(x, this.Trans_Aircraft.position.y);

            let dis = Math.abs(this.Trans_Aircraft.position.x - ran_x);
            if (dis <= 10) {
                this.Trans_Gift.active = true;
                this.Trans_Gift.setPosition(ran_x, this.Trans_Aircraft.position.y);
                let act_scale = cc.scaleTo(1, 0.4);
                let act_move = cc.moveBy(1, 0, -100);
                let act_callback = () => {
                    this.Trans_Gift.destroy();
                    this.Trans_Card.active = true;
                    this.Trans_Card.setPosition(this.Trans_Gift.position.x, this.Trans_Gift.position.y);
                }
                let act_spawn = cc.spawn(act_scale, act_move);
                let act_seq = cc.sequence(act_spawn, cc.callFunc(act_callback));
                this.Trans_Gift.runAction(act_seq);
                // this.Trans_CallBack_2 = () => {
                //     this.Trans_Aircraft.destroy();
                //     this.unschedule(this.Trans_CallBack_1);
                // }
                // this.scheduleOnce(this.Trans_CallBack_2, 5);
            }
            let width = parent.getContentSize().width;
            width = width + 200;
            if (this.Trans_Aircraft.position.x > width) {
                this.Trans_Aircraft.destroy();
                this.unschedule(this.Trans_CallBack_1);
            }
        }
        this.schedule(this.Trans_CallBack_1, 0);
    }

    /**
     * 游戏结束
     */
    private GameOver() {
        if (this.Page_EndTime.active) {
            return;
        }

        GameManage.Instance.IsGameClick = false;

        this.Page_EndTime.active = true;
        // console.log(this.Page_EndTime);
        let label = this.Page_EndTime.getChildByName("label").getComponent(cc.Label);
        let num = 10;
        label.string = num + "";
        this.Page_EndTimeCallBack = () => {
            num--;
            label.string = num + "";
            if (num <= 0) {
                GameManage.Instance.IsUpdateProgress = false;
                GameManage.Instance.IsGameEnd = true;

                this.Page_EndTime.active = false;

                this.SetRanking();

                // GameManage.Instance.IsGameStart = false;
                PopupBox.CommontPopup(this.Page_Over);
                // console.log(this.Page_Over);
                this.unschedule(this.Page_EndTimeCallBack);
            }
        }
        this.schedule(this.Page_EndTimeCallBack, 1);
    }

    /**
     * 设置排行榜
     * @param rank 排名盒子
     * @param name 排名昵称
     * @param isComplete 是否完成
     */
    private SetRanking() {
        let role_arr: cc.Node[] = [];
        for (let i = 0; i < GameManage.Instance.Roles.length; i++) {
            role_arr.push(GameManage.Instance.Roles[i]);
        }

        for (let i = 0; i < role_arr.length; i++) {
            let y_i = role_arr[i].position.y;
            for (let j = i + 1; j < role_arr.length; j++) {
                let y_j = role_arr[j].position.y;
                if (y_i < y_j) {
                    let temp = role_arr[i];
                    role_arr[i] = role_arr[j];
                    role_arr[j] = temp
                }
            }
        }

        let list: cc.Node[] = this.Page_Over.getChildByName("Box").getChildByName("List").children;
        for (let i = 0; i < list.length; i++) {
            let rank = list[i];
            let label_ranking = rank.getChildByName("label_Ranking").getComponent(cc.Label);
            let label_name = rank.getChildByName("label_Name").getComponent(cc.Label);
            let istrue: boolean = null;
            let role: cc.Node = null;
            let value = 0;
            if (label_ranking.string === "第一名") {
                role = role_arr[0];
                if (role.name === "Player") {
                    value = 100;
                    let coin = Cache.GetCache(CacheType.Coin_Amount);
                    let num = parseInt(coin);
                    let sum = num + value;
                    Cache.SetCache(CacheType.Coin_Amount, sum + "");
                }
            }
            if (label_ranking.string === "第二名") {
                role = role_arr[1];
                if (role.name === "Player") {
                    value = 50;
                    let coin = Cache.GetCache(CacheType.Coin_Amount);
                    let num = parseInt(coin);
                    let sum = num + value;
                    Cache.SetCache(CacheType.Coin_Amount, sum + "");
                }
            }
            if (label_ranking.string === "第三名") {
                role = role_arr[2];
            }
            if (label_ranking.string === "第四名") {
                role = role_arr[3];
            }

            let name = role.getChildByName("name").getComponent(cc.Label).string;
            label_name.string = name;
            let ind = GameManage.Instance.Ranking.indexOf(name);
            if (ind !== -1) {
                istrue = true;
            } else {
                istrue = false;
            }
            let yes = rank.getChildByName("isComplete").getChildByName("yes");
            yes.active = istrue;
            let no = rank.getChildByName("isComplete").getChildByName("no");
            no.active = !istrue;
        }
        GameManage.Instance.Ranking = [];
    }
}
