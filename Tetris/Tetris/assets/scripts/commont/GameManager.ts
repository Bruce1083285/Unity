import { Click_FunManage } from "./Enum";

/**
 * @class 游戏管理类
 */
export class GameManager {

    /**
     * @property 单例
     */
    public static Instance: GameManager = new GameManager();
    /**
     * @property 当前方块节点
     */
    public Current_Cube: cc.Node = null;
    /**
     * @property 游戏是否结束
     */
    public IsGameOver: boolean = false;
    /**
     * @property 是否可以存储
     */
    public IsSave: boolean = true;
    /**
     * @property 备用区域第一个方块ID
     */
    public Standby_FirstID: string = null;
    // /**
    //  * @property 暂存区域方块ID
    //  */
    // public Save_CubeID: string = null;
    /**
     * @property 点击--->功能管理
     */
    public Click_FunManage: Click_FunManage = null;
    /**
     * @property 点击--->功能管理
     */
    public Click_AIFunManage: Click_FunManage = null;
    /**
     * @property 时间间隔
     */
    public Time_Interval: number = 1;
    /**
     * @property AI时间间隔
     */
    public Time_AIInterval: number = 1;
    /**
     * @property 间隔值
     */
    public Interval_Value: number = 39;
    /**
     * @property AI间隔值
     */
    public Interval_AIValue: number = 22.5;
    /**
     * @property 连消数
     */
    public Continuous_Count: number = 0;
    /**
     * @property 格子宽度
     */
    public Grid_Width: number = 10;
    /**
     * @property 格子高度
     */
    public Grid_Height: number = 20;
    /**
     * @property 游戏区域格子
     */
    public Game_Grid: cc.Node[][] = [];
    /**
     * @property AI游戏区域格子
     */
    public AIGame_Grid: cc.Node[][] = [];

    /**
     * 私有化构造函数
     */
    private constructor() {
        this.Init();
    }

    /**
     * 初始化
     */
    Init() {
        this.SetGameGrid();
        this.SetAIGameGrid();
    }

    /**
     * 设置时间间隔
     * @param time 间隔的时间
     */
    public SetTimeInterval(time: number) {
        this.Time_Interval = time;
    }

    /**
     * 设置游戏区域格子二维数组
     */
    private SetGameGrid() {
        let arr: cc.Node[] = [];
        for (let y = 0; y < this.Grid_Height; y++) {
            for (let x = 0; x < this.Grid_Width; x++) {
                arr.push(null);
            }
            this.Game_Grid.push(arr);
            arr = [];
        }
    }

    /**
     * 设置AI游戏区域格子二维数组
     */
    private SetAIGameGrid() {
        let arr: cc.Node[] = [];
        for (let y = 0; y < this.Grid_Height; y++) {
            for (let x = 0; x < this.Grid_Width; x++) {
                arr.push(null);
            }
            this.AIGame_Grid.push(arr);
            arr = [];
        }
    }
}
