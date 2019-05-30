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
     * @property 时间间隔
     */
    public Time_Interval: number = 1;
    /**
     * @property 间隔值
     */
    public Interval_Value: number = 39;
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
}
