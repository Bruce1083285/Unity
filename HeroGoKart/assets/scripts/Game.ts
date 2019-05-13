import { EventCenter } from "./commont/EventCenter";
import { EventType, CacheType, DragonBonesAnimation_Role, DragonBonesAnimation_PlayTimes, DragonBonesAnimation_Car } from "./commont/Enum";
import { Cache } from "./commont/Cache";
import PropBox from "./game/PropBox";
import Player from "./game/Player";

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
     * @property 问好预制体
     */
    @property(cc.Prefab)
    private Pre_Question: cc.Prefab = null;
    /**
     * @property 对象池初始化次数
     */
    @property
    private Pool_InitCount: number = 5;
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
     * @property 玩家
     */
    private Player: cc.Node = null;
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
    private Pool_Question: cc.NodePool = null;
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
    private Questions: cc.Node[] = [];
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
        if (this.Player) {
            //进度条
            this.UpdateProgresBar();
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

        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        this.BG = this.node.getChildByName("BG");
        this.Area_Path = this.node.getChildByName("Area_Path");
        this.But_Left = this.node.getChildByName("But_Directions").getChildByName("but_Left");
        this.But_Right = this.node.getChildByName("But_Directions").getChildByName("but_Right");
        this.Bar_Speeds = this.node.getChildByName("SpeedBar").getChildByName("Progress").children;
        this.Bar_Progres = this.node.getChildByName("ProgressBar");

        this.Prop_Box = this.node.getChildByName("Box_Prop").getComponent(PropBox);
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
        let arr = this.BG.children;
        for (let i = 0; i < arr.length; i++) {
            arr[i].runAction(cc.moveBy(20, 0, -10000));
        }
        for (let i = 0; i < 5; i++) {
            this.GetQuestion(this.Pool_Question, this.Area_Path);
        }
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            case "":
                break;
            case "":
                break;
            case "":
                break;
            case "":
                break;
            default:
                break;
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

            //测试
            this.Player = this.Area_Path.getChildByName("Player");

            this.SetCurrentPathSkin(path_ID);
            this.SetPathStart(this.Pool_PathStart, this.BG);
            this.UpdatePathStart(this.Current_PathSkin, this.Path_Start);

            let ran = Math.floor(Math.random() * 3 + 2);
            this.SetPath(this.Pool_Path, this.BG, this.Pre_Path, this.Current_PathSkin, ran);

            this.SetPath(this.Pool_PathEnd, this.BG, this.Pre_PathEnd, this.Current_PathSkin, 1);
            this.SetPath(this.Pool_Path, this.BG, this.Pre_Path, this.Current_PathSkin, 1);
            // this.UpdateSpeed();
            this.RunPathMove(this.BG);
        }, "Game");

        //设置当前玩家
        EventCenter.AddListenter(EventType.Game_SetCurrentPlayerSkin, () => {
            this.SetCurrentPlayerSkin();
            this.SetPlayer(this.Area_Path, this.Pre_Player);
            this.SetAI(this.Pool_AI, this.Area_Path);
            this.SetRolePos(this.Area_Path);
        }, "Game");

        //设置速度等级
        EventCenter.AddListenter(EventType.Game_SetSpeedBar, (speed_level) => {
            this.SetSpeedBar(speed_level);
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
        this.Horizontal = -1;
    }

    /**
     * 触摸结束
     * @param event 触摸信息
     */
    private TouchEnd(event) {
        this, this.Horizontal = 0;
    }

    /**
     * 右键触摸开始
     * @param event 触摸信息
     */
    private RightStart(event) {
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

        player.getComponent(Player).Init();
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

        display.dragonAsset.dragonBonesJson = asset.dragonBonesJson;
        display.dragonAtlasAsset.atlasJson = atlasAsset.atlasJson;
        let name = obj_Armature[atlasAsset.name]
        display.armatureName = name;
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
   * 设置进度条
   */
    private UpdateProgresBar() {
        let path = this.Bar_Progres.getChildByName("Path");
        let ball = path.getChildByName("ball");

        let size_Hight = path.getContentSize().height;
        let progres_y = this.Player.position.y / this.Journey;
        ball.setPosition(ball.position.x, ball.position.y + progres_y);
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
            let act_Move = cc.moveBy(50, 0, - this.Journey);
            let act_callback = () => {
                //对象池回收
            }
            let act_Seq = cc.sequence(act_Move, cc.callFunc(act_callback));
            path.runAction(act_Seq);
        }

    }

    /**
     * 获取问号
     * @param pool 对象池
     * @param parent 父节点
     */
    private GetQuestion(pool: cc.NodePool, parent: cc.Node): cc.Node[] {
        let arr = [];
        let ques_x: number = 150;
        let size_Hight = parent.getContentSize().height;
        this.Question_Space += 50;

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

        return arr;
    }
}
