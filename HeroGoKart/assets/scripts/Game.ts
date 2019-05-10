import { EventCenter } from "./commont/EventCenter";
import { EventType } from "./commont/Enum";

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
     * @property 当前赛道皮肤
     */
    private Current_PathSkin: cc.SpriteFrame = null;
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

    onLoad() {
        this.Init();
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

        this.BG = this.node.getChildByName("BG");
        this.Area_Path = this.node.getChildByName("Area_Path");

        this.SetPathStart(this.Pool_PathStart, this.BG);
        this.SetPlayer(this.Area_Path, this.Pre_Player);
        this.SetAI(this.Pool_AI, this.Area_Path);
        this.SetRolePos(this.Area_Path);

        this.Test();
    }

    /**
     * 测试
     */
    private Test() {
        let a = this.Player.getChildByName("Car").getChildByName("car").getComponent(dragonBones.ArmatureDisplay);
        a.dragonAsset
        this.SetCurrentPath("3");
        this.SetPath(this.Pool_Path, this.BG, this.Pre_Path, this.Current_PathSkin);
        this.SetPath(this.Pool_PathEnd, this.BG, this.Pre_PathEnd, this.Current_PathSkin);
        this.UpdatePathStart(this.Current_PathSkin, this.Path_Start);
        let arr = this.BG.children;
        for (let i = 0; i < arr.length; i++) {
            arr[i].runAction(cc.moveBy(10, 0, -5000));
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
            this.UpdatePathStart(this.Current_PathSkin, this.Path_Start);
            this.SetPath(this.Pool_Path, this.BG, this.Pre_Path, this.Current_PathSkin);
        }, "Game");

        //关闭
        EventCenter.AddListenter(EventType.Page_GameClose, () => {
            this.Close(this.node);
        }, "Game");

        //设置当前跑道
        EventCenter.AddListenter(EventType.Game_SetCurrentPath, (path_ID) => {
            this.SetCurrentPath(path_ID);
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
    private SetPath(pool: cc.NodePool, parent: cc.Node, pre_Path: cc.Prefab, current_pathSkin: cc.SpriteFrame) {
        for (let i = 0; i < 2; i++) {
            let path = pool.get();
            if (!path) {
                this.SetPool(pool, this.Pool_InitCount, pre_Path);
                path = pool.get();
            }

            let arr = parent.children;
            let maxY_Node: cc.Node = arr[0];
            for (let i = 0; i < arr.length; i++) {
                let max_y = maxY_Node.position.y;
                let arr_y = arr[i].position.y;
                if (max_y < arr_y) {
                    maxY_Node = arr[i];
                }
            }
            let size_y = maxY_Node.getContentSize().height;
            let x = maxY_Node.position.x;
            let y = maxY_Node.position.y + size_y / 2;

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
        parent.addChild(player);
    }

    /**
    * 设置AI
    * @param pool 对象池
    * @param parent 父节点
    */
    private SetAI(pool: cc.NodePool, parent: cc.Node) {
        for (let i = 0; i < 3; i++) {
            let AI = pool.get();
            if (!AI) {
                this.SetPool(this.Pool_AI, this.Pool_InitCount, this.Pre_AI);
                AI = pool.get();
            }

            parent.addChild(AI);
        }
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
    private SetCurrentPath(path_ID: String) {
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
}
