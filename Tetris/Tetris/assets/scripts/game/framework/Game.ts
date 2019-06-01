import { Click_Directions, Click_Function, Click_Set, EventType, Click_FunManage } from "../../commont/Enum";
import { ViewManager_Game } from "./ViewManager_Game";
import { EventCenter } from "../../commont/EventCenter";
import { GameManager } from "../../commont/GameManager";
import { AI } from "./AI";

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
     * @property [Array]待机区方块精灵帧
     */
    @property([cc.SpriteFrame])
    private SprF_StandbyCubes: cc.SpriteFrame[] = [];
    /**
     * @property [Array]方块预制体
     */
    @property([cc.Prefab])
    private Pre_Cubes: cc.Prefab[] = [];
    /**
     * @property [Array]AI方块预制体
     */
    @property([cc.Prefab])
    private Pre_AICubes: cc.Prefab[] = [];
    /**
     * @property 待机区域
     */
    private Area_Standby: cc.Node = null;
    /**
     * @property 游戏区域
     */
    private Area_Game: cc.Node = null;
    /**
     * @property 暂存区域
     */
    private Area_Save: cc.Node = null;
    /**
     * @property 大恶魔区域
     */
    private Area_BigDevil: cc.Node = null;
    /**
     * @property 管理--->AI游戏区域
     */
    private Area_AIGame: cc.Node = null;
    /**
     * @property 游戏开始点
     */
    private Point_Begin: cc.Node = null;
    /**
     * @property 按钮--->设置开关
     */
    private But_Switchs: cc.Node = null;
    /**
     * @property 按钮--->盒子
     */
    private But_Box: cc.Node = null;
    /**
     * @property 按钮--->开
     */
    private But_Open: cc.Node = null;
    /**
     * @property 按钮--->开
     */
    private But_Close: cc.Node = null;
    /**
     * @property 对象池存储数
     */
    private Pool_SaveNum: number = 6;
    /**
     * @property 方块对象池
     */
    public Pool_Cubes: cc.NodePool = null;


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
        //对象池
        this.Pool_Cubes = new cc.NodePool();
        this.SetPoolCube();

        this.Area_Standby = this.node.getChildByName("Area_Game").getChildByName("Area_Standby");
        this.Area_Game = this.node.getChildByName("Area_Game").getChildByName("Area_Game");
        this.Area_Save = this.node.getChildByName("Area_Game").getChildByName("Area_Save");
        this.Area_BigDevil = this.node.getChildByName("Area_BigDevil");
        this.Area_AIGame = this.node.getChildByName("Area_OtherGame").getChildByName("Area_Game");
        this.Point_Begin = this.node.getChildByName("Area_Game").getChildByName("BeginPoint");
        this.But_Switchs = this.node.getChildByName("But_Set").getChildByName("But_Switchs");
        this.But_Box = this.node.getChildByName("But_Set").getChildByName("Box");
        this.But_Open = this.But_Switchs.getChildByName("but_Open");
        this.But_Close = this.But_Switchs.getChildByName("but_Close");

        ViewManager_Game.Instance.Init(this.Area_Standby, this.Area_Game, this.Area_Save, this.Area_BigDevil);
        ViewManager_Game.Instance.UpdateStandby(this.SprF_StandbyCubes);

        AI.Instance.Init(this.Area_AIGame);
        AI.Instance.UpdateStandbyCube();

        this.AddListenter();

        this.Test();
    }

    /**
     * 测试
     */
    Test() {
        ViewManager_Game.Instance.UpdatePointBegin(this.Point_Begin, this.Pre_Cubes, GameManager.Instance.Standby_FirstID);
        ViewManager_Game.Instance.UpdateStandby(this.SprF_StandbyCubes);

        AI.Instance.UpdatePointBegin_AI(this.Pre_AICubes);
        AI.Instance.UpdateStandbyCube();
        // // 加载 Prefab
        // cc.loader.loadRes("bigdevil/mowang", sp.SkeletonData, (err, asset) => {
        //     console.log(asset);
        //     let ske = this.test.getComponent(sp.Skeleton);
        //     ske.skeletonData = asset;
        //     ske.premultipliedAlpha = false;
        //     ske.animation="daiji";
        //     // var newNode = cc.instantiate(prefab);
        //     // cc.director.getScene().addChild(newNode);
        // });
    }

    /**
     * 按钮点击
     * @param lv 
     * @param click 点击参数
     */
    private ButtonClick(lv: any, click: string) {
        switch (click) {
            //方向键
            case Click_Directions.Up:
                GameManager.Instance.Click_AIFunManage = Click_FunManage.Up;
                break;
            case Click_Directions.Down:
                GameManager.Instance.Click_AIFunManage = Click_FunManage.Down;
                break;
            case Click_Directions.Left:
                GameManager.Instance.Click_AIFunManage = Click_FunManage.Left;
                break;
            case Click_Directions.Right:
                GameManager.Instance.Click_AIFunManage = Click_FunManage.Right;
                break;
            //功能键
            case Click_Function.Clockwise:
                GameManager.Instance.Click_AIFunManage = Click_FunManage.Clockwise;
                break;
            case Click_Function.Anticlockwise:
                GameManager.Instance.Click_AIFunManage = Click_FunManage.Anticlockwise;
                break;
            case Click_Function.Save:
                ViewManager_Game.Instance.UpdateSave(GameManager.Instance.Current_Cube);
                break;
            //设置键
            case Click_Set.Open:
                ViewManager_Game.Instance.ButSetShow(this.But_Switchs, this.But_Open, this.But_Close, this.But_Box);
                break;
            case Click_Set.Close:
                ViewManager_Game.Instance.ButSetHide(this.But_Switchs, this.But_Open, this.But_Close, this.But_Box);
                break;
            case Click_Set.CastAs:
                break;
            case Click_Set.Set:
                break;
            default:
                break;
        }
    }

    /**
     * 添加监听
     */
    private AddListenter() {
        //事件监听--->方块对象池
        EventCenter.AddListenter(EventType.SetPoolCube, () => {
            this.SetPoolCube();
        }, "Game");

        //事件监听--->更新备用待机区
        EventCenter.AddListenter(EventType.UpdateStandby, () => {
            ViewManager_Game.Instance.UpdateStandby(this.SprF_StandbyCubes);
        }, "Game");

        //事件监听--->更新游戏开始点
        EventCenter.AddListenter(EventType.UpdatePointBegin, (cube_ID: string) => {
            ViewManager_Game.Instance.UpdatePointBegin(this.Point_Begin, this.Pre_Cubes, cube_ID);
        }, "Game");

        //事件监听--->更新游戏开始点
        EventCenter.AddListenter(EventType.UpdateAIPointBegin, () => {
            AI.Instance.UpdatePointBegin_AI(this.Pre_AICubes);
        }, "Game");

        //事件监听--->更新游戏开始点
        EventCenter.AddListenter(EventType.UpdateAIStandbyCube, () => {
            AI.Instance.UpdateStandbyCube();
        }, "Game");
    }

    /**
     * 移除监听
     */
    private RemoveListenter() {
        //移除事件监听--->方块对象池
        EventCenter.RemoveListenter(EventType.SetPoolCube, "Game");

        //移除事件监听--->更新开始点和备用待机区
        EventCenter.RemoveListenter(EventType.UpdateStandby, "Game");

        //移除事件监听--->更新游戏开始点
        EventCenter.RemoveListenter(EventType.UpdatePointBegin, "Game");

        //移除事件监听--->更新游戏开始点
        EventCenter.RemoveListenter(EventType.UpdateAIPointBegin, "Game");
    }

    /**
     * 设置方块对象池
     */
    private SetPoolCube() {
        for (let i = 0; i < this.Pool_SaveNum; i++) {
            let ran = Math.floor(Math.random() * this.Pre_Cubes.length);
            let cube = cc.instantiate(this.Pre_Cubes[ran]);
            this.Pool_Cubes.put(cube);
        }
    }
}
