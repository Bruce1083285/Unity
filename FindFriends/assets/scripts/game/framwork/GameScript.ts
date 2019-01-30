import Manager from "../../common/ManageScript";
import { Grid, SceneD, AudioD } from "../../common/EnumScript";
import Card from "./CardScript";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    /**
     * @property 结算页
     */
    @property(cc.Node)
    public Page_Settlement: cc.Node = null;
    /**
     * @property 规则页
     */
    @property(cc.Node)
    private Page_Rule: cc.Node = null;
    /**
     * @property 剧情页
     */
    @property(cc.Node)
    private Page_Drama: cc.Node = null;
    /**
     * @property 游戏区域
     */
    @property(cc.Node)
    public Area_Game: cc.Node = null;
    /**
     * @property 卡牌区域
     */
    @property(cc.Node)
    public Area_Card: cc.Node = null;
    /**
     * @property BGM
     */
    @property(cc.Node)
    private BGM: cc.Node = null;
    /**
     * @property 关卡数
     */
    @property(cc.Label)
    private Level_Count: cc.Label = null;
    /**
     * @property 分数
     */
    @property(cc.Label)
    public Score_Count: cc.Label = null;
    /**
     * @property 刷新次数
     */
    @property(cc.Label)
    private Refresh_Count: cc.Label = null;
    /**
     * @property [Prefab]卡牌
     */
    @property(cc.Prefab)
    private Card: cc.Prefab = null;
    /**
     * @property [Prefab]格子牌
     */
    @property(cc.Prefab)
    private Grid_Card: cc.Prefab = null;
    /**
     * @property [Prefab]障碍牌
     */
    @property(cc.Prefab)
    private Obstacle_Card: cc.Prefab = null;
    /**
     * @property 行
     */
    @property
    private Row: number = 0;
    /**
     * @property 列
     */
    @property
    private Line: number = 0;
    /**
     * @property 关卡初始数
     */
    @property
    private Level_Init_Num: number = 0;
    /**
     * @property 初始刷新次数
     */
    @property
    private Refresh_Init_Count: number = 0;
    /**
     * @property 脚本管理
     */
    private Manage_SC: Manager = null;
    /**
     * @property [Pool]卡牌
     */
    public Pool_Card: cc.NodePool = new cc.NodePool();
    /**
     * @property [Pool]格子牌
     */
    public Pool_Grid: cc.NodePool = new cc.NodePool();
    /**
     * @property [Pool]障碍牌
     */
    private Pool_Obstacle: cc.NodePool = new cc.NodePool();
    /**
     * @property 触摸点位置
     */
    public Touch_Poi_Pos: cc.Vec2 = null;
    /**
     * @property 触摸点Y轴
     */
    public Touch_Poi_Y: number = 0;
    /**
     * @property 刷新次数
     */
    private Refresh_Num: number = 0;
    /**
     * @property 点击次数
     */
    private Click_Count: number = 1;
    /**
     * @property BGM开关
     */
    private BGM_Switch: boolean = false;
    /**
     * @property [Object]关卡模型
     */
    private Level_Model: Object = {
        1: [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0]
        ],
        2: [
            [0, 1, 0, 0, 1, 0],
            [0, 1, 0, 0, 1, 0],
            [0, 1, 0, 0, 1, 0]
        ],
        3: [
            [1, 0, 0, 0, 0, 1],
            [0, 0, 1, 1, 0, 0],
            [1, 0, 0, 0, 0, 1]
        ],
        4: [
            [0, 0, 1, 1, 0, 0],
            [0, 1, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 1]
        ],
        5: [
            [0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 1, 1],
            [0, 0, 0, 0, 0, 0]
        ],
        6: [
            [0, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 0]
        ],
        7: [
            [0, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0]
        ],
        8: [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0]
        ],
    };
    /**
     * @property [Array]格子二维数组
     */
    public Array_Grid: cc.Node[][] = [];
    /**
     * @property [Array]卡牌数组
     */
    public Array_Card: cc.Node[] = [];
    /**
     * @property [Array] 通过暂存
     */
    public Array_Pass_Hold: cc.Node[] = [];

    onLoad() {
        this.Manage_SC = Manager.GetManage(SceneD.game);
        this.Init();
    }

    start() {
    }

    // update (dt) {}

    /**
     * 初始化
     */
    Init() {
        this.getCache();
        this.Refresh_Num = this.Refresh_Init_Count;
        //刷新次数啊
        this.Refresh_Count.string = this.Refresh_Num + "";
        this.getGridPool();
        this.getObstacleCardPool();
        this.getCardPool();
        this.Array_Grid = this.Manage_SC.Manage_Desktop.setGameArea(this.Pool_Grid, this.Pool_Obstacle, this.Row, this.Line, this.Area_Game, this.Level_Model, this.Level_Init_Num);
        this.Manage_SC.Manage_Desktop.setCardArea(this.Area_Card, this.Pool_Card, this.Array_Card);
        // cc.log(this.Array_Card);
    }

    /**
     * 获取缓存
     */
    private getCache() {
        let bgm = cc.sys.localStorage.getItem("BGM");
        if (!bgm || bgm === "true") {
            this.BGM.getChildByName("yinyue").active = true;
            this.BGM.getChildByName("yinyue1").active = false;
        }
        if (bgm === "false") {
            this.BGM.getChildByName("yinyue").active = false;
            this.BGM.getChildByName("yinyue1").active = true;
            this.BGM_Switch = true;
        }
    }

    /**
     * 获取格子对象池
     */
    getGridPool() {
        for (let i = 0; i < 5; i++) {
            let card = cc.instantiate(this.Grid_Card);
            card.tag = Grid.grid_card;
            this.Pool_Grid.put(card);
        }
    }

    /**
     * 获取障碍牌对象池
     */
    getObstacleCardPool() {
        for (let i = 0; i < 5; i++) {
            let obstacle_card = cc.instantiate(this.Obstacle_Card);
            obstacle_card.tag = Grid.obstacle_card;
            this.Pool_Obstacle.put(obstacle_card);
        }
    }

    /**
     * 获取卡牌对象池
     */
    getCardPool() {
        for (let i = 0; i < 5; i++) {
            let card = cc.instantiate(this.Card);
            card.tag = Grid.card;
            card.getComponent(Card).Init();
            this.Pool_Card.put(card);
        }
    }
    /**
     * 点击事件
     * @param lv 任意值
     * @param click_param 点击值
     */
    eventClick(lv: any, click_param: string) {
        switch (click_param) {
            case "refresh":
                this.Manage_SC.Manage_Audio.PlayAudio(AudioD.click_refresh);
                if (this.Refresh_Num > 0) {
                    this.Refresh_Num--;
                    this.Refresh_Count.string = this.Refresh_Num + "";
                    this.RefreshNextLevel();
                }
                return;
            case "back":
                cc.director.loadScene("LoadingScene");
                break;
            case "nextlevel":
                if (this.Level_Init_Num <= 8) {
                    //清空通过暂存
                    this.Array_Pass_Hold = [];
                    this.Level_Init_Num++;
                    this.Level_Count.string = this.Level_Init_Num + "";
                    this.Refresh_Num = this.Refresh_Init_Count;
                    this.Refresh_Count.string = this.Refresh_Num + "";
                    this.Page_Settlement.active = false;
                    this.Page_Settlement.getChildByName("Content").getChildByName("Victory").active = false;
                    this.NextLevel();
                } else {
                    cc.director.loadScene("LoadingScene");
                }
                break;
            case "restart":
                cc.director.loadScene("GameScene");
                break;
            case "ruleclose":
                this.Page_Rule.active = false;
                break;
            case "rule":
                this.Page_Rule.active = true;
                break;
            case "bgm":
                this.BGM_Switch = this.Manage_SC.Manage_Moudel.setMusic(this.BGM, this.Manage_SC, this.BGM_Switch);
                break;
            case "nextpage":
                this.PlayDrama();
                break;
            case "skip":
                this.Page_Drama.active = false;
                break;
            default:
                break;
        }
        this.Manage_SC.Manage_Audio.PlayAudio(AudioD.click_but);
    }

    /**
     * 获取Y轴
     * @param target 目标节点
     * @param grid_array [Array]格子
     * @returns Y值
     */
    getArrayY(target: cc.Node, grid_array: cc.Node[][]): number {
        for (let y = 0; y < grid_array.length; y++) {
            let dis = Math.abs(target.position.y - grid_array[y][0].position.y);
            if (dis <= 1) {
                return y;
            }
        }
    }

    /**
     * 下一关
     */
    private NextLevel() {
        for (let y = 0; y < this.Line; y++) {
            for (let x = 0; x < this.Row; x++) {
                if (this.Array_Grid[y][x].tag === Grid.grid_card) {
                    this.Pool_Grid.put(this.Array_Grid[y][x]);
                }
                if (this.Array_Grid[y][x].tag === Grid.obstacle_card) {
                    this.Pool_Obstacle.put(this.Array_Grid[y][x]);
                }
                if (this.Array_Grid[y][x].tag === Grid.card) {
                    this.Pool_Card.put(this.Array_Grid[y][x]);
                }
            }
        }
        this.Array_Grid = [];
        this.Array_Grid = this.Manage_SC.Manage_Desktop.setGameArea(this.Pool_Grid, this.Pool_Obstacle, this.Row, this.Line, this.Area_Game, this.Level_Model, this.Level_Init_Num);
        this.RefreshNextLevel();
        cc.log(this.Pool_Grid);
        cc.log(this.Pool_Obstacle);
        cc.log(this.Pool_Card);
        cc.log(this.Array_Grid);
        cc.log(this.Array_Card);
    }

    /**
     * 卡牌刷新
     */
    private RefreshNextLevel() {
        for (let i = 0; i < this.Array_Card.length; i++) {
            this.Pool_Card.put(this.Array_Card[i]);
        }
        this.Array_Card = [];
        this.Pool_Card.clear();
        this.Manage_SC.Manage_Desktop.setCardArea(this.Area_Card, this.Pool_Card, this.Array_Card);
        cc.log(this.Array_Card);
    }

    /**
     * 播放剧情
     */
    private PlayDrama() {
        this.Click_Count++;
        let page_array = this.Page_Drama.getChildByName("Page").children;
        this.Page_Drama.getChildByName("Button").active = false;
        for (let i = 0; i < page_array.length; i++) {
            page_array[i].runAction(cc.sequence(cc.moveBy(0.5, -1136, 0), cc.callFunc(() => {
                this.Page_Drama.getChildByName("Button").active = true;
                if (this.Click_Count >= 3) {
                    this.Page_Drama.getChildByName("Button").getChildByName("But_NextPage").active = false;
                    this.Page_Drama.getChildByName("Button").getChildByName("But_Start").active = true;
                }
            })));
        }
    }
}
